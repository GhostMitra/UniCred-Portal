import { apiService } from './api';
import { User, SignupData } from '../types';

// Authentication service types
export interface LoginCredentials {
  id: string;
  password: string;
  accessType: 'student' | 'recruiter' | 'university';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    accessType: 'student' | 'recruiter' | 'university';
    email: string;
    fullName: string;
    studentId?: string;
  };
}

export interface SignupResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    accessType: 'student' | 'recruiter' | 'university';
  };
}

// Authentication service class
class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      // Save token for future requests
      await apiService.saveToken(response.data.token);
      return response.data;
    }

    throw new Error('Login failed');
  }

  // Signup user
  async signup(signupData: SignupData): Promise<SignupResponse> {
    const response = await apiService.post<SignupResponse>('/auth/signup', {
      username: signupData.email.split('@')[0], // Generate username from email
      email: signupData.email,
      password: signupData.password,
      accessType: signupData.userType,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('Signup failed');
  }

  // Logout user
  async logout(): Promise<void> {
    await apiService.clearToken();
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await apiService['token'];
      return !!token;
    } catch {
      return false;
    }
  }

  // Get current user info (if needed)
  async getCurrentUser(): Promise<User | null> {
    try {
      // This would typically call a /me endpoint
      // For now, we'll return null and let the app handle user state
      return null;
    } catch {
      return null;
    }
  }


}

// Export singleton instance
export const authService = new AuthService();
