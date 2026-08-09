import api from '../api/client';
import type { DoctorProfile, ServiceItem, AvailabilityStatus } from '../types/doctor';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface DoctorFilters extends QueryParams {
  search?: string;
  department?: string;
  specialty?: string;
  status?: AvailabilityStatus | 'all';
}

export const doctorService = {
  async getDoctors(filters: DoctorFilters = {}): Promise<PaginatedResponse<DoctorProfile>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.department) params.set('department', filters.department);
    if (filters.specialty) params.set('specialty', filters.specialty);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<DoctorProfile>>>(`/doctors?${params.toString()}`);
    return res.data.data;
  },

  async getProfile(): Promise<DoctorProfile | null> {
    try {
      const res = await api.get<ApiResponse<DoctorProfile>>('/doctor/profile');
      return res.data.data;
    } catch (error) {
      if (error instanceof Error && error.message?.includes('404')) return null;
      throw error;
    }
  },

  async getDoctor(id: string): Promise<DoctorProfile> {
    const res = await api.get<ApiResponse<DoctorProfile>>(`/doctors/${id}`);
    return res.data.data;
  },

  async updateProfile(data: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const res = await api.put<ApiResponse<DoctorProfile>>('/doctor/profile', data);
    return res.data.data;
  },

  async updateDoctor(id: string, data: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const res = await api.put<ApiResponse<DoctorProfile>>(`/doctors/${id}`, data);
    return res.data.data;
  },

  async updateAvailability(status: AvailabilityStatus): Promise<DoctorProfile> {
    const res = await api.patch<ApiResponse<DoctorProfile>>('/doctor/profile/availability', {
      availabilityStatus: status,
    });
    return res.data.data;
  },

  async getSchedule(doctorId: string, startDate: string, endDate: string): Promise<any[]> {
    const res = await api.get<ApiResponse<any[]>>(`/doctors/${doctorId}/schedule?startDate=${startDate}&endDate=${endDate}`);
    return res.data.data;
  },

  async updateSchedule(doctorId: string, schedule: any[]): Promise<any[]> {
    const res = await api.put<ApiResponse<any[]>>(`/doctors/${doctorId}/schedule`, schedule);
    return res.data.data;
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await api.get<ApiResponse<ServiceItem[]>>('/doctor/services');
    return res.data.data;
  },

  async addService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await api.post<ApiResponse<ServiceItem>>('/doctor/services', service);
    return res.data.data;
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await api.put<ApiResponse<ServiceItem>>(`/doctor/services/${id}`, service);
    return res.data.data;
  },

  async deleteService(id: string): Promise<void> {
    await api.delete(`/doctor/services/${id}`);
  },
};
