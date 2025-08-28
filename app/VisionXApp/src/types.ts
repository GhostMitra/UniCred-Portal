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
  recruiterApproved?: boolean;
  blockchainHash?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  credentials: Credential[];
  status: 'active' | 'graduated' | 'inactive';
}

export interface VerificationResult {
  found: boolean;
  candidate?: {
    name: string;
    id: string;
    email: string;
  };
  credential?: {
    title?: string;
    type?: string;
    institution?: string;
    dateIssued?: string;
    status?: string;
    credentialId?: string;
  };
  verification: {
    status: string;
    verifiedAt?: string;
    blockchainHash?: string;
    confidence: number;
  };
}

export interface NewCredential {
  title: string;
  type: 'bachelor' | 'master' | 'certificate' | 'diploma';
  studentId: string;
  studentName: string;
  graduationDate: string;
}

export interface SignupData {
  userType: 'student' | 'recruiter' | 'university';
  name: string;
  email: string;
  password: string;
  validId: string;
}
