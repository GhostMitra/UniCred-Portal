import { apiService } from './api';
import { Student } from '../types';

// Student service types
export interface CreateStudentData {
  username: string;
  email: string;
  fullName: string;
}

export interface StudentWithCredentials extends Student {
  credentials: any[]; // Using any for now, can be refined later
}

// Student service class
class StudentService {
  // Get all students with their credentials
  async getAllStudents(): Promise<StudentWithCredentials[]> {
    const response = await apiService.get<StudentWithCredentials[]>('/students');

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || [];
  }

  // Get a specific student by ID
  async getStudent(studentId: string): Promise<Student> {
    const response = await apiService.get<Student>(`/students/${studentId}`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Student not found');
  }

  // Create a new student
  async createStudent(studentData: CreateStudentData): Promise<StudentWithCredentials> {
    const response = await apiService.post<StudentWithCredentials>('/students', studentData);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to create student');
  }

  // Get student's wallet information
  async getStudentWallet(studentId: string): Promise<{ did: string; walletJwk: any }> {
    const response = await apiService.get<{ did: string; walletJwk: any }>(`/students/${studentId}/wallet`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to get student wallet');
  }

  // Get student's credentials
  async getStudentCredentials(studentId: string): Promise<any[]> {
    const response = await apiService.get<any[]>(`/students/${studentId}/credentials`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || [];
  }

  // Search students by name or email
  async searchStudents(query: string): Promise<StudentWithCredentials[]> {
    const allStudents = await this.getAllStudents();
    
    if (!query.trim()) {
      return allStudents;
    }

    const searchTerm = query.toLowerCase();
    return allStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );
  }

  // Get students by status
  async getStudentsByStatus(status: string): Promise<StudentWithCredentials[]> {
    const allStudents = await this.getAllStudents();
    return allStudents.filter(student => student.status === status);
  }
}

// Export singleton instance
export const studentService = new StudentService();
