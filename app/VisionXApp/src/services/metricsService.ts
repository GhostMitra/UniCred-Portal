import { apiService } from './api';

// Metrics service types
export interface DashboardMetrics {
  totalStudents: number;
  totalCredentials: number;
  verifiedCredentials: number;
  pendingCredentials: number;
  revokedCredentials: number;
  recentActivity: any[];
}

export interface CredentialMetrics {
  byType: { [key: string]: number };
  byStatus: { [key: string]: number };
  byInstitution: { [key: string]: number };
  monthlyIssued: { [key: string]: number };
}

export interface StudentMetrics {
  byStatus: { [key: string]: number };
  byProgram: { [key: string]: number };
  newRegistrations: { [key: string]: number };
}

// Metrics service class
class MetricsService {
  // Get overall dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiService.get<DashboardMetrics>('/metrics/dashboard');

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || {
      totalStudents: 0,
      totalCredentials: 0,
      verifiedCredentials: 0,
      pendingCredentials: 0,
      revokedCredentials: 0,
      recentActivity: [],
    };
  }

  // Get credential-specific metrics
  async getCredentialMetrics(): Promise<CredentialMetrics> {
    const response = await apiService.get<CredentialMetrics>('/metrics/credentials');

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || {
      byType: {},
      byStatus: {},
      byInstitution: {},
      monthlyIssued: {},
    };
  }

  // Get student-specific metrics
  async getStudentMetrics(): Promise<StudentMetrics> {
    const response = await apiService.get<StudentMetrics>('/metrics/students');

    if (response.error) {
      throw new Error(response.error);
    }

    // If the endpoint doesn't exist, we can calculate basic metrics from student data
    // For now, return empty metrics
    return {
      byStatus: {},
      byProgram: {},
      newRegistrations: {},
    };
  }

  // Get verification statistics (for recruiters)
  async getVerificationStats(): Promise<{
    totalVerifications: number;
    successfulVerifications: number;
    failedVerifications: number;
    averageConfidence: number;
  }> {
    // This would typically come from a dedicated endpoint
    // For now, return mock data
    return {
      totalVerifications: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      averageConfidence: 0,
    };
  }

  // Get university-specific metrics
  async getUniversityMetrics(): Promise<{
    totalStudents: number;
    totalPrograms: number;
    credentialsIssued: number;
    activeStudents: number;
  }> {
    // This would typically come from a dedicated endpoint
    // For now, return mock data
    return {
      totalStudents: 0,
      totalPrograms: 0,
      credentialsIssued: 0,
      activeStudents: 0,
    };
  }

  // Get recent activity feed
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    const response = await apiService.get<any[]>(`/metrics/activity?limit=${limit}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || [];
  }
}

// Export singleton instance
export const metricsService = new MetricsService();
