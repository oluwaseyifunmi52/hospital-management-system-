import api from '../api/client';
import type { MedicalRecord, VitalSigns, Medication, RecordAttachment } from '../types/medical-record';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface MedicalRecordFilters extends QueryParams {
  search?: string;
  patientId?: string;
  doctorId?: string;
}

export const medicalRecordService = {
  async getMedicalRecords(filters: MedicalRecordFilters = {}): Promise<PaginatedResponse<MedicalRecord>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.doctorId) params.set('doctorId', filters.doctorId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<MedicalRecord>>>(`/medical-records?${params.toString()}`);
    return res.data.data;
  },

  async getMedicalRecord(id: string): Promise<MedicalRecord> {
    const res = await api.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return res.data.data;
  },

  async createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const res = await api.post<ApiResponse<MedicalRecord>>('/medical-records', data);
    return res.data.data;
  },

  async updateMedicalRecord(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const res = await api.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data);
    return res.data.data;
  },

  async deleteMedicalRecord(id: string): Promise<void> {
    await api.delete(`/medical-records/${id}`);
  },

  async getPatientMedicalRecords(patientId: string, filters: QueryParams = {}): Promise<PaginatedResponse<MedicalRecord>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const res = await api.get<ApiResponse<PaginatedResponse<MedicalRecord>>>(`/patients/${patientId}/medical-records?${params.toString()}`);
    return res.data.data;
  },

  // Vital Signs
  async addVitalSigns(recordId: string, vitalSigns: VitalSigns): Promise<MedicalRecord> {
    const res = await api.post<ApiResponse<MedicalRecord>>(`/medical-records/${recordId}/vital-signs`, vitalSigns);
    return res.data.data;
  },

  // Medications
  async addMedication(recordId: string, medication: Medication): Promise<MedicalRecord> {
    const res = await api.post<ApiResponse<MedicalRecord>>(`/medical-records/${recordId}/medications`, medication);
    return res.data.data;
  },

  async updateMedication(recordId: string, medicationId: string, medication: Partial<Medication>): Promise<MedicalRecord> {
    const res = await api.put<ApiResponse<MedicalRecord>>(`/medical-records/${recordId}/medications/${medicationId}`, medication);
    return res.data.data;
  },

  async removeMedication(recordId: string, medicationId: string): Promise<MedicalRecord> {
    const res = await api.delete<ApiResponse<MedicalRecord>>(`/medical-records/${recordId}/medications/${medicationId}`);
    return res.data.data;
  },

  // Attachments
  async uploadAttachment(recordId: string, file: File): Promise<RecordAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<RecordAttachment>>(`/medical-records/${recordId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async deleteAttachment(recordId: string, attachmentId: string): Promise<void> {
    await api.delete(`/medical-records/${recordId}/attachments/${attachmentId}`);
  },
};