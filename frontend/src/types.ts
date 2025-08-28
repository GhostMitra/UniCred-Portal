export interface User {
  id: string;
  username: string;
  accessType: 'student' | 'recruiter' | 'university';
  email?: string;
  fullName?: string;
  studentId?: string;
}

export interface Credential {
  id: string;
  title: string;
  type: 'bachelor' | 'master' | 'certificate' | 'diploma';
  institution: string;
  dateIssued: string;
  status: 'verified' | 'pending' | 'expired';
  studentId?: string;
  studentName?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  credentials: Credential[];
  status: 'active' | 'graduated' | 'inactive';
}