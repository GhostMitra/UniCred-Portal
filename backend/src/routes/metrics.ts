import { Router } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const [totalStudents, totalCredentials, verifiedCount, pendingCount, recentCredentials, recentEvents] = await Promise.all([
    prisma.student.count(),
    prisma.credential.count(),
    prisma.credential.count({ where: { status: 'verified' } as any }),
    prisma.credential.count({ where: { status: 'pending' } as any }),
    prisma.credential.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.ledgerEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);
  res.json({ totalStudents, totalCredentials, verifiedCount, pendingCount, recentCredentials, recentEvents });
});

router.get('/student/:id', async (req, res) => {
  const studentId = req.params.id;
  const [student, credentials] = await Promise.all([
    prisma.student.findUnique({ where: { id: studentId } }),
    prisma.credential.findMany({ where: { studentId }, orderBy: { createdAt: 'desc' } }),
  ]);
  if (!student) return res.status(404).json({ error: 'Not found' });
  const total = credentials.length;
  const verified = credentials.filter(c => c.status === 'verified').length;
  const pending = credentials.filter(c => c.status === 'pending').length;
  res.json({
    student: { id: student.id, name: student.name, email: student.email, status: student.status },
    stats: { totalCredentials: total, verified, pending },
    recentCredentials: credentials.slice(0, 5),
  });
});

export default router;

