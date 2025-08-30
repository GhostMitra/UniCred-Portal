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
  const cred = await prisma.credential.findUnique({ 
    where: { vcHash },
    include: {
      student: true
    }
  });
  if (!cred) return { exists: false, method: 'unknown' as const };
  
  // Include student name for display
  const credentialWithStudentName = {
    ...cred,
    studentName: cred.student?.name || 'Unknown Student'
  };
  
  return { exists: true, method: 'database' as const, credential: credentialWithStudentName };
}

export async function searchCredentials(query: string) {
  // Only allow exact matches for credential ID or hash - no partial matching
  const trimmedQuery = query.trim();
  
  // Validate query format - should be either credential ID or hash
  // Credential IDs typically start with "CRED_" and are long (e.g., CRED_BACHELOR_CS_STU001)
  // Hashes are typically longer alphanumeric strings (e.g., hash_bachelor_cs_001)
  if (trimmedQuery.length < 15) {
    return { exists: false, method: 'invalid_query' as const, error: 'Query too short - please provide full credential ID or hash (minimum 15 characters)' };
  }
  
  // Additional validation - check if it looks like a valid credential ID or hash
  const isValidCredentialId = /^CRED_[A-Z_]+_STU\d+$/.test(trimmedQuery);
  const isValidHash = /^hash_[a-z_]+_\d+$/.test(trimmedQuery);
  const isValidStudentId = /^STU\d+$/.test(trimmedQuery);
  
  if (!isValidCredentialId && !isValidHash && !isValidStudentId) {
    return { exists: false, method: 'invalid_format' as const, error: 'Invalid format - please provide a valid credential ID (CRED_*), hash (hash_*), or student ID (STU*)' };
  }
  
  // 1. Search by exact credential ID
  let cred = await prisma.credential.findUnique({ 
    where: { id: trimmedQuery },
    include: { student: true }
  });
  
  if (cred) {
    return { 
      exists: true, 
      method: 'credential_id' as const, 
      credential: { ...cred, studentName: cred.student?.name || 'Unknown Student' }
    };
  }
  
  // 2. Search by exact vcHash
  cred = await prisma.credential.findUnique({ 
    where: { vcHash: trimmedQuery },
    include: { student: true }
  });
  
  if (cred) {
    return { 
      exists: true, 
      method: 'hash' as const, 
      credential: { ...cred, studentName: cred.student?.name || 'Unknown Student' }
    };
  }
  
  // 3. Only search by exact student ID (no partial matching)
  cred = await prisma.credential.findFirst({
    where: { studentId: trimmedQuery },
    include: { student: true }
  });
  
  if (cred) {
    return { 
      exists: true, 
      method: 'student_id' as const, 
      credential: { ...cred, studentName: cred.student?.name || 'Unknown Student' }
    };
  }
  
  return { exists: false, method: 'not_found' as const, error: 'No credential found with the provided ID or hash' };
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

