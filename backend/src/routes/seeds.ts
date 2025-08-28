import { Router } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// Precomputed bcrypt hash for password "password" with salt rounds=10
const HASH_PASSWORD = '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66';

router.post('/all', async (_req, res) => {
  // 1) Users
  const users = [
    { username: 'STU001', email: 'student1@example.edu', fullName: 'Student One', accessType: 'student' as const },
    { username: 'STU002', email: 'student2@example.edu', fullName: 'Student Two', accessType: 'student' as const },
    { username: 'STU003', email: 'student3@example.edu', fullName: 'Student Three', accessType: 'student' as const },
    { username: 'STU004', email: 'sarah.johnson@example.edu', fullName: 'Sarah Johnson', accessType: 'student' as const },
    { username: 'STU005', email: 'michael.chen@example.edu', fullName: 'Michael Chen', accessType: 'student' as const },
    { username: 'STU006', email: 'emily.rodriguez@example.edu', fullName: 'Emily Rodriguez', accessType: 'student' as const },
    { username: 'STU007', email: 'david.kim@example.edu', fullName: 'David Kim', accessType: 'student' as const },
    { username: 'STU008', email: 'lisa.thompson@example.edu', fullName: 'Lisa Thompson', accessType: 'student' as const },
    { username: 'STU009', email: 'james.wilson@example.edu', fullName: 'James Wilson', accessType: 'student' as const },
    { username: 'STU010', email: 'anna.garcia@example.edu', fullName: 'Anna Garcia', accessType: 'student' as const },
    { username: 'REC001', email: 'recruiter1@example.edu', fullName: 'Recruiter One', accessType: 'recruiter' as const },
    { username: 'UNI001', email: 'admin1@university.edu', fullName: 'Admin One', accessType: 'university' as const },
  ];

  const createdUsers = [] as Array<{ id: string; username: string; accessType: string; email: string; fullName: string }>; 
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      create: { username: u.username, email: u.email, fullName: u.fullName, passwordHash: HASH_PASSWORD, accessType: u.accessType as any },
      update: {},
    });
    createdUsers.push(user as any);
  }

  // 2) Students linked to student users
  const studentUsers = createdUsers.filter(u => u.accessType === 'student');
  const studentMap: Record<string, string> = {}; // username -> student.id
  for (const su of studentUsers) {
    const existing = await prisma.student.findUnique({ where: { userId: su.id } });
    const student = existing || await prisma.student.create({
      data: {
        userId: su.id,
        name: su.fullName,
        email: su.email,
        status: 'active',
        did: 'did:example:' + su.username.toLowerCase(),
        walletJwk: { kty: 'OKP', crv: 'Ed25519', d: 'mock', x: 'mock' },
      },
    });
    studentMap[su.username] = student.id;
  }

  // 3) Credentials for all students - Enhanced with more data for STU001
  const now = new Date();
  const credentials = [
    // STU001 - Computer Science Student (Enhanced with more credentials)
    { id: 'bachelor_cs_' + studentMap['STU001'], title: 'Bachelor of Computer Science', type: 'bachelor', institution: 'Tech University', dateIssued: new Date(now.getTime() - 1000*60*60*24*365), status: 'verified', username: 'STU001' },
    { id: 'certificate_data_' + studentMap['STU001'], title: 'Data Analysis Certificate', type: 'certificate', institution: 'Data Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*120), status: 'verified', username: 'STU001' },
    { id: 'diploma_ml_' + studentMap['STU001'], title: 'Machine Learning Diploma', type: 'diploma', institution: 'AI Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*30), status: 'pending', username: 'STU001' },
    { id: 'certificate_web_' + studentMap['STU001'], title: 'Web Development Certificate', type: 'certificate', institution: 'Code Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*90), status: 'verified', username: 'STU001' },
    { id: 'certificate_cloud_' + studentMap['STU001'], title: 'Cloud Computing Certificate', type: 'certificate', institution: 'Cloud Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*60), status: 'verified', username: 'STU001' },
    { id: 'certificate_cyber_' + studentMap['STU001'], title: 'Cybersecurity Certificate', type: 'certificate', institution: 'Security Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*45), status: 'verified', username: 'STU001' },
    { id: 'master_cs_' + studentMap['STU001'], title: 'Master of Computer Science', type: 'master', institution: 'Tech University', dateIssued: new Date(now.getTime() - 1000*60*60*24*180), status: 'verified', username: 'STU001' },
    
    // STU002 - Data Science Student
    { id: 'master_' + studentMap['STU002'], title: 'Master of Data Science', type: 'master', institution: 'Tech University', dateIssued: new Date(now.getTime() - 1000*60*60*24*200), status: 'verified', username: 'STU002' },
    { id: 'certificate_' + studentMap['STU002'], title: 'Python Programming Certificate', type: 'certificate', institution: 'Code Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*90), status: 'verified', username: 'STU002' },
    
    // STU003 - Business Student
    { id: 'bachelor_' + studentMap['STU003'], title: 'Bachelor of Business Administration', type: 'bachelor', institution: 'Business University', dateIssued: new Date(now.getTime() - 1000*60*60*24*400), status: 'verified', username: 'STU003' },
    { id: 'certificate_' + studentMap['STU003'], title: 'Digital Marketing Certificate', type: 'certificate', institution: 'Marketing Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*60), status: 'verified', username: 'STU003' },
    
    // STU004 - Engineering Student
    { id: 'bachelor_' + studentMap['STU004'], title: 'Bachelor of Mechanical Engineering', type: 'bachelor', institution: 'Engineering University', dateIssued: new Date(now.getTime() - 1000*60*60*24*300), status: 'verified', username: 'STU004' },
    { id: 'master_' + studentMap['STU004'], title: 'Master of Engineering Management', type: 'master', institution: 'Engineering University', dateIssued: new Date(now.getTime() - 1000*60*60*24*100), status: 'verified', username: 'STU004' },
    { id: 'certificate_' + studentMap['STU004'], title: 'CAD Design Certificate', type: 'certificate', institution: 'Design Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*45), status: 'pending', username: 'STU004' },
    
    // STU005 - Medical Student
    { id: 'bachelor_' + studentMap['STU005'], title: 'Bachelor of Biology', type: 'bachelor', institution: 'Medical University', dateIssued: new Date(now.getTime() - 1000*60*60*24*500), status: 'verified', username: 'STU005' },
    { id: 'master_' + studentMap['STU005'], title: 'Master of Public Health', type: 'master', institution: 'Medical University', dateIssued: new Date(now.getTime() - 1000*60*60*24*150), status: 'verified', username: 'STU005' },
    { id: 'certificate_' + studentMap['STU005'], title: 'Clinical Research Certificate', type: 'certificate', institution: 'Research Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*75), status: 'verified', username: 'STU005' },
    
    // STU006 - Arts Student
    { id: 'bachelor_' + studentMap['STU006'], title: 'Bachelor of Fine Arts', type: 'bachelor', institution: 'Arts University', dateIssued: new Date(now.getTime() - 1000*60*60*24*250), status: 'verified', username: 'STU006' },
    { id: 'diploma_' + studentMap['STU006'], title: 'Digital Art Diploma', type: 'diploma', institution: 'Digital Arts Academy', dateIssued: new Date(now.getTime() - 1000*60*60*24*80), status: 'verified', username: 'STU006' },
    { id: 'certificate_' + studentMap['STU006'], title: 'Graphic Design Certificate', type: 'certificate', institution: 'Design School', dateIssued: new Date(now.getTime() - 1000*60*60*24*40), status: 'pending', username: 'STU006' },
    
    // STU007 - Finance Student
    { id: 'bachelor_' + studentMap['STU007'], title: 'Bachelor of Finance', type: 'bachelor', institution: 'Finance University', dateIssued: new Date(now.getTime() - 1000*60*60*24*350), status: 'verified', username: 'STU007' },
    { id: 'master_' + studentMap['STU007'], title: 'Master of Financial Engineering', type: 'master', institution: 'Finance University', dateIssued: new Date(now.getTime() - 1000*60*60*24*120), status: 'verified', username: 'STU007' },
    { id: 'certificate_' + studentMap['STU007'], title: 'CFA Level 1 Certificate', type: 'certificate', institution: 'CFA Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*30), status: 'verified', username: 'STU007' },
    
    // STU008 - Law Student
    { id: 'bachelor_' + studentMap['STU008'], title: 'Bachelor of Political Science', type: 'bachelor', institution: 'Law University', dateIssued: new Date(now.getTime() - 1000*60*60*24*450), status: 'verified', username: 'STU008' },
    { id: 'master_' + studentMap['STU008'], title: 'Juris Doctor', type: 'master', institution: 'Law University', dateIssued: new Date(now.getTime() - 1000*60*60*24*180), status: 'verified', username: 'STU008' },
    { id: 'certificate_' + studentMap['STU008'], title: 'Legal Research Certificate', type: 'certificate', institution: 'Legal Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*60), status: 'pending', username: 'STU008' },
    
    // STU009 - Education Student
    { id: 'bachelor_' + studentMap['STU009'], title: 'Bachelor of Education', type: 'bachelor', institution: 'Education University', dateIssued: new Date(now.getTime() - 1000*60*60*24*320), status: 'verified', username: 'STU009' },
    { id: 'master_' + studentMap['STU009'], title: 'Master of Educational Technology', type: 'master', institution: 'Education University', dateIssued: new Date(now.getTime() - 1000*60*60*24*90), status: 'verified', username: 'STU009' },
    { id: 'certificate_' + studentMap['STU009'], title: 'Online Teaching Certificate', type: 'certificate', institution: 'Teaching Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*20), status: 'pending', username: 'STU009' },
    
    // STU010 - Psychology Student
    { id: 'bachelor_' + studentMap['STU010'], title: 'Bachelor of Psychology', type: 'bachelor', institution: 'Psychology University', dateIssued: new Date(now.getTime() - 1000*60*60*24*280), status: 'verified', username: 'STU010' },
    { id: 'master_' + studentMap['STU010'], title: 'Master of Clinical Psychology', type: 'master', institution: 'Psychology University', dateIssued: new Date(now.getTime() - 1000*60*60*24*110), status: 'verified', username: 'STU010' },
    { id: 'certificate_' + studentMap['STU010'], title: 'Cognitive Behavioral Therapy Certificate', type: 'certificate', institution: 'Therapy Institute', dateIssued: new Date(now.getTime() - 1000*60*60*24*50), status: 'verified', username: 'STU010' },
  ];

  for (const c of credentials) {
    const sid = studentMap[c.username];
    if (!sid) continue;
    await prisma.credential.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        title: c.title,
        type: c.type as any,
        institution: c.institution,
        dateIssued: c.dateIssued,
        status: c.status as any,
        studentId: sid,
      },
      update: {},
    });
  }

  res.json({ ok: true, users: createdUsers.length, students: Object.keys(studentMap).length, credentials: credentials.length });
});

// Add a specific route to seed STU001 credentials
router.post('/stu001-credentials', async (_req, res) => {
  try {
    // Find STU001 user
    const user = await prisma.user.findUnique({ where: { username: 'STU001' } });
    if (!user) {
      return res.status(404).json({ error: 'STU001 user not found' });
    }

    // Find or create student record
    let student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) {
      student = await prisma.student.create({
        data: {
          userId: user.id,
          name: user.fullName,
          email: user.email,
          status: 'active',
          did: 'did:example:stu001',
          walletJwk: { kty: 'OKP', crv: 'Ed25519', d: 'mock', x: 'mock' },
        },
      });
    }

    // Add comprehensive credentials for STU001
    const now = new Date();
    const stu001Credentials = [
      {
        id: 'bachelor_cs_stu001',
        title: 'Bachelor of Computer Science',
        type: 'bachelor',
        institution: 'Tech University',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*365),
        status: 'verified',
        studentId: student.id,
      },
      {
        id: 'certificate_data_stu001',
        title: 'Data Analysis Certificate',
        type: 'certificate',
        institution: 'Data Institute',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*120),
        status: 'verified',
        studentId: student.id,
      },
      {
        id: 'diploma_ml_stu001',
        title: 'Machine Learning Diploma',
        type: 'diploma',
        institution: 'AI Academy',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*30),
        status: 'pending',
        studentId: student.id,
      },
      {
        id: 'certificate_web_stu001',
        title: 'Web Development Certificate',
        type: 'certificate',
        institution: 'Code Academy',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*90),
        status: 'verified',
        studentId: student.id,
      },
      {
        id: 'certificate_cloud_stu001',
        title: 'Cloud Computing Certificate',
        type: 'certificate',
        institution: 'Cloud Institute',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*60),
        status: 'verified',
        studentId: student.id,
      },
      {
        id: 'certificate_cyber_stu001',
        title: 'Cybersecurity Certificate',
        type: 'certificate',
        institution: 'Security Academy',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*45),
        status: 'verified',
        studentId: student.id,
      },
      {
        id: 'master_cs_stu001',
        title: 'Master of Computer Science',
        type: 'master',
        institution: 'Tech University',
        dateIssued: new Date(now.getTime() - 1000*60*60*24*180),
        status: 'verified',
        studentId: student.id,
      },
    ];

    for (const cred of stu001Credentials) {
      await prisma.credential.upsert({
        where: { id: cred.id },
        create: cred,
        update: {},
      });
    }

    res.json({ 
      ok: true, 
      message: 'STU001 credentials seeded successfully',
      studentId: student.id,
      credentialsCount: stu001Credentials.length 
    });
  } catch (error) {
    console.error('Error seeding STU001 credentials:', error);
    res.status(500).json({ error: 'Failed to seed STU001 credentials' });
  }
});

export default router;

