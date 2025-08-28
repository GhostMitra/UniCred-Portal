import { Router } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  fullName: z.string(),
});

router.post('/', async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const issuerDid = req.app.get('issuerDid');
    const issuerJwk = req.app.get('issuerJwk');
    // Reuse issuer keys to make a demo DID for the student
    const did = `did:example:${Buffer.from(data.email).toString('hex').slice(0, 32)}`;
    const walletJwk = issuerJwk;

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        passwordHash: 'not-applicable',
        accessType: 'student',
        student: {
          create: {
            name: data.fullName,
            email: data.email,
            status: 'active',
            did,
            walletJwk,
          },
        },
      },
      include: { student: true },
    });

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/wallet', async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json({ did: student.did, walletJwk: student.walletJwk });
});

router.get('/:id/credentials', async (req, res) => {
  const credentials = await prisma.credential.findMany({ where: { studentId: req.params.id } });
  res.json(credentials);
});

// New route to get credentials by username
router.get('/username/:username/credentials', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await prisma.user.findUnique({ 
      where: { username },
      include: { student: true }
    });
    
    if (!user || !user.student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Get credentials for this student
    const credentials = await prisma.credential.findMany({ 
      where: { studentId: user.student.id } 
    });
    
    res.json({
      student: user.student,
      credentials: credentials,
      count: credentials.length
    });
  } catch (error) {
    console.error('Error fetching credentials by username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug route to see all students and their credentials
router.get('/debug/all', async (_req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { 
        user: true,
        credentials: true 
      },
      orderBy: { name: 'asc' },
    });
    
    const debugData = students.map(student => ({
      studentId: student.id,
      userId: student.userId,
      username: student.user?.username,
      name: student.name,
      email: student.email,
      credentialsCount: student.credentials.length,
      credentials: student.credentials.map(cred => ({
        id: cred.id,
        title: cred.title,
        type: cred.type,
        status: cred.status,
        dateIssued: cred.dateIssued
      }))
    }));
    
    res.json(debugData);
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List students with their credentials (lightweight)
router.get('/', async (_req, res) => {
  const students = await prisma.student.findMany({
    include: { credentials: true },
    orderBy: { name: 'asc' },
  });
  res.json(students);
});

export default router;

