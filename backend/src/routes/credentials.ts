import { Router } from 'express';
import { z } from 'zod';
import { issueCredential, revokeCredential, anchorCredential, verifyCredentialByHash } from '../services/credential.service';
import { prisma } from '../db/prisma';

const router = Router();

const issueSchema = z.object({
  title: z.string(),
  type: z.enum(['bachelor', 'master', 'certificate', 'diploma']),
  institution: z.string(),
  dateIssued: z.string(),
  studentId: z.string().optional(),
  studentName: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const parsed = issueSchema.parse(req.body);
    const issuerDid = req.app.get('issuerDid');
    const issuerJwk = req.app.get('issuerJwk');
    const credential = await issueCredential({ ...parsed, issuerDid, issuerJwk });
    res.json(credential);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/anchor', async (req, res) => {
  try {
    const updated = await anchorCredential(req.params.id, { network: 'demo-chain' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/revoke', async (req, res) => {
  try {
    const { reason } = req.body as { reason: string };
    const updated = await revokeCredential(req.params.id, reason || 'unspecified');
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/verify/:hash', async (req, res) => {
  try {
    const result = await verifyCredentialByHash(req.params.hash);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// List credentials with optional filters
router.get('/', async (req, res) => {
  const { type, status, studentId } = req.query as { type?: string; status?: string; studentId?: string };
  const where: any = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (studentId) where.studentId = studentId;
  const items = await prisma.credential.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(items);
});

// Seed mock credentials
router.post('/seed-mock', async (_req, res) => {
  // Ensure demo user and student exist
  let user = await prisma.user.findUnique({ where: { username: 'STU001' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'STU001',
        email: 'student1@example.edu',
        fullName: 'Student One',
        passwordHash: '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', // "password"
        accessType: 'student',
      },
    });
  }
  let student = await prisma.student.findUnique({ where: { userId: user.id } });
  if (!student) {
    student = await prisma.student.create({
      data: {
        userId: user.id,
        name: user.fullName || 'Student One',
        email: user.email || 'student1@example.edu',
        status: 'active',
        did: 'did:example:' + user.username.toLowerCase(),
        walletJwk: { kty: 'OKP', crv: 'Ed25519', d: 'mock', x: 'mock' },
      },
    });
  }

  const now = new Date();
  const creds = [
    { title: 'Bachelor of Computer Science', type: 'bachelor', institution: 'Tech University', dateIssued: new Date(now.getTime() - 1000*60*60*24*200), status: 'verified' },
    { title: 'Data Analysis Certificate', type: 'certificate', institution: 'Data Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*30), status: 'verified' },
    { title: 'Machine Learning Diploma', type: 'diploma', institution: 'AI Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*10), status: 'pending' },
  ];
  for (const c of creds) {
    const credId = `${c.type}_${student.id}`;
    await prisma.credential.upsert({
      where: { id: credId },
      create: {
        id: credId,
        title: c.title,
        type: c.type as any,
        institution: c.institution,
        dateIssued: c.dateIssued,
        status: c.status as any,
        studentId: student.id,
        recruiterApproved: false,
        studentAccepted: false,
      },
      update: {},
    });
  }
  res.json({ ok: true, studentId: student.id });
});

// Recruiter approves visibility
router.post('/:id/recruiter-approve', async (req, res) => {
  try {
    const updated = await prisma.credential.update({ where: { id: req.params.id }, data: { recruiterApproved: true } });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Student accepts adding to wallet/profile
router.post('/:id/student-accept', async (req, res) => {
  try {
    const updated = await prisma.credential.update({ where: { id: req.params.id }, data: { studentAccepted: true } });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;

