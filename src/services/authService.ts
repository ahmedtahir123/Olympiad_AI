import { apiClient, ApiResponse } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Mock authentication - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock user data based on email
      let mockUser: User;
      if (credentials.email === 'admin@olympics.com') {
        mockUser = {
          id: '1',
          email: credentials.email,
          role: 'super_admin',
          name: 'System Administrator',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        };
      } else {
        mockUser = {
          id: '2',
          email: credentials.email,
          role: 'school_admin',
          schoolId: 'school-1',
          schoolName: 'Springfield High School',
          name: 'John Smith',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        };
      }
      
      const mockResponse: ApiResponse<AuthResponse> = {
        data: {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        },
        success: true,
        message: 'Login successful'
      };
      
      if (mockResponse.success && mockResponse.data) {
        localStorage.setItem('authToken', mockResponse.data.token);
        localStorage.setItem('refreshToken', mockResponse.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      }
      
      return mockResponse;
    } catch (error) {
      throw error;
    }
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Mock signup - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const mockUser: User = {
        id: 'user-' + Date.now(),
        email: userData.email,
        role: 'school_admin',
        schoolId: 'school-' + Date.now(),
        schoolName: userData.schoolName,
        name: userData.name,
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      };
      
      const mockResponse: ApiResponse<AuthResponse> = {
        data: {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        },
        success: true,
        message: 'Account created successfully'
      };
      
      if (mockResponse.success && mockResponse.data) {
        localStorage.setItem('authToken', mockResponse.data.token);
        localStorage.setItem('refreshToken', mockResponse.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      }
      
      return mockResponse;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Clear local storage immediately for frontend-only demo
    // In production, you would want to call the API first
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Optional: Make API call to invalidate token on server
    // Only if backend is available
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Silently handle network errors for demo purposes
      // In production, you might want to log this or show a warning
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  }

  async resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password', { email });
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>('/auth/change-password', data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/verify-email', { token });
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();