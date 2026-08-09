import api from '../api/client';
import type { Patient, PatientDocument, PatientTimelineEvent } from '../types/patient';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PatientFilters extends QueryParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

export const patientService = {
  async getPatients(filters: PatientFilters = {}): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Patient>>>(`/patients?${params.toString()}`);
    return res.data.data;
  },

  async getPatient(id: string): Promise<Patient> {
    const res = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return res.data.data;
  },

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const res = await api.post<ApiResponse<Patient>>('/patients', data);
    return res.data.data;
  },

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const res = await api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return res.data.data;
  },

  async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  },

  async getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
    const res = await api.get<ApiResponse<PatientDocument[]>>(`/patients/${patientId}/documents`);
    return res.data.data;
  },

  async uploadPatientDocument(patientId: string, file: File, type: string): Promise<PatientDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await api.post<ApiResponse<PatientDocument>>(`/patients/${patientId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async getPatientTimeline(patientId: string): Promise<PatientTimelineEvent[]> {
    const res = await api.get<ApiResponse<PatientTimelineEvent[]>>(`/patients/${patientId}/timeline`);
    return res.data.data;
  },
};