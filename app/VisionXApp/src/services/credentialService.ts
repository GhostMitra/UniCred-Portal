import { apiService } from './api';
import { Credential, CreateCredentialData, NewCredential, VerificationResult } from '../types';

export interface CredentialFilters {
  type?: string;
  status?: string;
  studentId?: string;
}

// Credential service class
class CredentialService {
  // Get all credentials
  async getCredentials(): Promise<Credential[]> {
    const response = await apiService.get<Credential[]>('/credentials');

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || [];
  }

  // Get credentials for a specific student
  async getStudentCredentials(studentId: string): Promise<Credential[]> {
    const response = await apiService.get<Credential[]>(`/students/${studentId}/credentials`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || [];
  }

  // Get credentials by username (new method)
  async getCredentialsByUsername(username: string): Promise<Credential[]> {
    const response = await apiService.get<{ credentials: Credential[] }>(`/students/username/${username}/credentials`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data?.credentials || [];
  }

  // Create a new credential
  async createCredential(credentialData: CreateCredentialData): Promise<Credential> {
    const response = await apiService.post<Credential>('/credentials', credentialData);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to create credential');
  }

  // Issue a new credential (university only)
  async issueCredential(credentialData: NewCredential): Promise<Credential> {
    const data: CreateCredentialData = {
      title: credentialData.title,
      type: credentialData.type,
      institution: 'University', // This should come from the university user context
      dateIssued: credentialData.graduationDate,
      studentId: credentialData.studentId,
      studentName: credentialData.studentName,
    };

    return this.createCredential(data);
  }

  // Verify a credential by hash
  async verifyCredential(hash: string): Promise<VerificationResult> {
    const response = await apiService.get<VerificationResult>(`/credentials/verify/${hash}`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to verify credential');
  }

  // Anchor a credential to blockchain
  async anchorCredential(credentialId: string): Promise<Credential> {
    const response = await apiService.post<Credential>(`/credentials/${credentialId}/anchor`, {
      network: 'demo-chain',
    });

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to anchor credential');
  }

  // Revoke a credential
  async revokeCredential(credentialId: string, reason: string): Promise<Credential> {
    const response = await apiService.post<Credential>(`/credentials/${credentialId}/revoke`, {
      reason,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to revoke credential');
  }

  // Seed mock credentials (for development)
  async seedMockCredentials(): Promise<void> {
    const response = await apiService.post('/seeds/all', {});

    if (response.error) {
      throw new Error(response.error);
    }
  }

  // Seed STU001 credentials specifically
  async seedSTU001Credentials(): Promise<void> {
    const response = await apiService.post('/seeds/stu001-credentials', {});

    if (response.error) {
      throw new Error(response.error);
    }
  }
}

// Export singleton instance
export const credentialService = new CredentialService();
