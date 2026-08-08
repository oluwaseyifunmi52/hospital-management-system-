import api from '../api/client';
import type { DoctorProfile } from '../types/doctor';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const doctorService = {
  async getProfile(): Promise<DoctorProfile | null> {
    try {
      const res = await api.get<ApiResponse<DoctorProfile>>('/doctor/profile');
      return res.data.data;
    } catch (error: any) {
      if (error.message?.includes('404')) return null;
      throw error;
    }
  },

  async updateProfile(data: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const res = await api.put<ApiResponse<DoctorProfile>>('/doctor/profile', data);
    return res.data.data;
  },

  async updateAvailability(
    status: 'available' | 'busy' | 'off_duty'
  ): Promise<DoctorProfile> {
    const res = await api.patch<ApiResponse<DoctorProfile>>('/doctor/profile/availability', {
      availabilityStatus: status,
    });
    return res.data.data;
  },
};
