import { Router } from 'express';
import { prisma } from '../db/prisma';
import { verifyPassword, hashPassword, signJwt } from '../utils/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { id, password, accessType } = req.body as { id: string; password: string; accessType: 'student' | 'recruiter' | 'university' };
  if (!id || !password || !accessType) return res.status(400).json({ error: 'Missing fields' });
  const user = await prisma.user.findUnique({ where: { username: id } });
  if (!user || user.accessType !== accessType) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ sub: user.id, role: user.accessType });
  const student = user.accessType === 'student' ? await prisma.student.findUnique({ where: { userId: user.id } }) : null;
  res.json({ token, user: { id: user.id, username: user.username, accessType: user.accessType, email: user.email, fullName: user.fullName, studentId: student?.id } });
});

router.post('/seed-demo', async (_req, res) => {
  // Create three demo users with known passwords if not exist
  const entries = [
    { username: 'STU001', accessType: 'student' as const, fullName: 'Student One', email: 'student1@example.edu' },
    { username: 'REC001', accessType: 'recruiter' as const, fullName: 'Recruiter One', email: 'recruiter1@example.edu' },
    { username: 'UNI001', accessType: 'university' as const, fullName: 'Admin One', email: 'admin1@university.edu' },
  ];
  for (const e of entries) {
    const existing = await prisma.user.findUnique({ where: { username: e.username } });
    if (!existing) {
      await prisma.user.create({
        data: {
          username: e.username,
          email: e.email,
          fullName: e.fullName,
          passwordHash: await hashPassword('password'),
          accessType: e.accessType,
        },
      });
    }
  }
  res.json({ ok: true });
});

export default router;

