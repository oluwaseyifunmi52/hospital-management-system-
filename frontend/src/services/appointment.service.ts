import api from '../api/client';
import type { Appointment, AppointmentFilter } from '../types/appointment';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const appointmentService = {
  async getAppointments(filters: AppointmentFilter & QueryParams = {}): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.date) params.set('date', filters.date);
    if (filters.doctorId) params.set('doctorId', filters.doctorId);
    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.departmentId) params.set('departmentId', filters.departmentId);
    if (filters.type) params.set('type', filters.type);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Appointment>>>(`/appointments?${params.toString()}`);
    return res.data.data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const res = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return res.data.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return res.data.data;
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const res = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return res.data.data;
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    const res = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
    return res.data.data;
  },

  async completeAppointment(id: string): Promise<Appointment> {
    const res = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/complete`);
    return res.data.data;
  },

  async getTodayAppointments(): Promise<Appointment[]> {
    const res = await api.get<ApiResponse<Appointment[]>>('/appointments/today');
    return res.data.data;
  },

  async getUpcomingAppointments(doctorId?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (doctorId) params.set('doctorId', doctorId);
    const res = await api.get<ApiResponse<Appointment[]>>(`/appointments/upcoming?${params.toString()}`);
    return res.data.data;
  },

  async sendReminder(id: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>(`/appointments/${id}/remind`);
    return res.data.data;
  },
};