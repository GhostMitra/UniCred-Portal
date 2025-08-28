import { prisma } from '../db/prisma';
import { sha256Hex } from '../utils/crypto';
import { signVc } from '../utils/did';
import { addBlock, verifyPayload } from '../utils/simpleChain';

export async function issueCredential(input: {
  title: string;
  type: 'bachelor' | 'master' | 'certificate' | 'diploma';
  institution: string;
  dateIssued: string;
  studentId?: string;
  studentName?: string;
  issuerDid: string;
  issuerJwk: any;
}) {
  // Resolve provided studentId to an internal Student.id if possible
  let resolvedStudentId: string | undefined = undefined;
  if (input.studentId) {
    const direct = await prisma.student.findUnique({ where: { id: input.studentId } });
    if (direct) {
      resolvedStudentId = direct.id;
    } else {
      // Try resolving by User.username (e.g., "STU001") then map to Student via userId
      const user = await prisma.user.findUnique({ where: { username: input.studentId } });
      if (user) {
        const student = await prisma.student.findUnique({ where: { userId: user.id } });
        if (student) resolvedStudentId = student.id;
      }
    }
  }

  const vcPayload = {
    iss: input.issuerDid,
    sub: resolvedStudentId ?? input.studentId ?? input.studentName ?? 'anonymous-student',
    nbf: Math.floor(new Date(input.dateIssued).getTime() / 1000),
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', input.type],
      credentialSubject: {
        id: resolvedStudentId ?? input.studentId,
        name: input.studentName,
        title: input.title,
        institution: input.institution,
        dateIssued: input.dateIssued,
      },
    },
  };

  const vcJwt = await signVc(vcPayload, input.issuerJwk);
  const vcHash = sha256Hex(vcJwt);

  const credential = await prisma.credential.create({
    data: {
      title: input.title,
      type: input.type as any,
      institution: input.institution,
      dateIssued: new Date(input.dateIssued),
      status: 'verified',
      recruiterApproved: false,
      studentAccepted: false,
      studentId: resolvedStudentId,
      vcJwt,
      vcHash,
    },
  });

  return credential;
}

export async function revokeCredential(credentialId: string, reason: string) {
  const updated = await prisma.credential.update({
    where: { id: credentialId },
    data: { status: 'revoked' },
  });
  await prisma.ledgerEvent.create({
    data: {
      eventType: 'CREDENTIAL_REVOKED',
      credentialId,
      details: { reason },
    },
  });
  return updated;
}

export async function verifyCredentialByHash(vcHash: string) {
  const cred = await prisma.credential.findUnique({ where: { vcHash } });
  if (!cred) return { exists: false, method: 'unknown' as const };
  return { exists: true, method: 'database' as const, credential: cred };
}

export async function anchorCredential(credentialId: string, _chainInfo: { network: string }) {
  const cred = await prisma.credential.findUnique({ where: { id: credentialId } });
  if (!cred || !cred.vcHash) throw new Error('Credential not found');
  // Simple chain anchoring: add a block with payloadHash = vcHash
  const block = await addBlock(cred.vcHash);
  const updated = await prisma.credential.update({
    where: { id: credentialId },
    data: { status: 'verified' },
  });
  await prisma.ledgerEvent.create({
    data: {
      eventType: 'CREDENTIAL_ANCHORED_SIMPLE_CHAIN',
      credentialId: credentialId,
      details: { height: block.height, hash: block.hash },
    },
  });
  return updated;
}

