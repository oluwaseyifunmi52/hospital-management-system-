import api from '../api/client';
import type { User, AuthTokens, PatientRegisterData, StaffRegisterData } from '../types/user';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

interface StaffRequestResponse {
  message: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export const authService = {
  async register(data: PatientRegisterData): Promise<RegisterResponse> {
    const res = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return res.data.data;
  },

  async staffRegister(data: StaffRegisterData): Promise<StaffRequestResponse> {
    const res = await api.post<ApiResponse<StaffRequestResponse>>('/auth/staff-register', data);
    return res.data.data;
  },

  async login(email: string, password: string, rememberMe?: boolean): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
      rememberMe,
    });
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put<ApiResponse<User>>('/auth/profile', data);
    return res.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return res.data.data;
  },

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return res.data.data;
  },

  async verifyEmail(email: string, otp: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      email,
      otp,
    });
    return res.data.data;
  },

  async resendOTP(email: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/resend-otp', { email });
    return res.data.data;
  },
};
