import api from '../api/client';
import type { LabTest, LabResult, RadiologyExam } from '../types/laboratory';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LabTestFilters extends QueryParams {
  search?: string;
  status?: string;
  category?: string;
  patientId?: string;
  doctorId?: string;
}

export const laboratoryService = {
  // Lab Tests
  async getLabTests(filters: LabTestFilters = {}): Promise<PaginatedResponse<LabTest>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.doctorId) params.set('doctorId', filters.doctorId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<LabTest>>>(`/laboratory/tests?${params.toString()}`);
    return res.data.data;
  },

  async getLabTest(id: string): Promise<LabTest> {
    const res = await api.get<ApiResponse<LabTest>>(`/laboratory/tests/${id}`);
    return res.data.data;
  },

  async createLabTest(data: Partial<LabTest>): Promise<LabTest> {
    const res = await api.post<ApiResponse<LabTest>>('/laboratory/tests', data);
    return res.data.data;
  },

  async updateLabTest(id: string, data: Partial<LabTest>): Promise<LabTest> {
    const res = await api.put<ApiResponse<LabTest>>(`/laboratory/tests/${id}`, data);
    return res.data.data;
  },

  async collectSample(id: string): Promise<LabTest> {
    const res = await api.patch<ApiResponse<LabTest>>(`/laboratory/tests/${id}/collect-sample`);
    return res.data.data;
  },

  async processTest(id: string): Promise<LabTest> {
    const res = await api.patch<ApiResponse<LabTest>>(`/laboratory/tests/${id}/process`);
    return res.data.data;
  },

  async completeTest(id: string, results: string, reportFile?: string): Promise<LabTest> {
    const res = await api.patch<ApiResponse<LabTest>>(`/laboratory/tests/${id}/complete`, { results, reportFile });
    return res.data.data;
  },

  async reviewTest(id: string): Promise<LabTest> {
    const res = await api.patch<ApiResponse<LabTest>>(`/laboratory/tests/${id}/review`);
    return res.data.data;
  },

  // Lab Results
  async getLabResults(testId: string): Promise<LabResult[]> {
    const res = await api.get<ApiResponse<LabResult[]>>(`/laboratory/tests/${testId}/results`);
    return res.data.data;
  },

  async createLabResult(testId: string, data: Partial<LabResult>): Promise<LabResult> {
    const res = await api.post<ApiResponse<LabResult>>(`/laboratory/tests/${testId}/results`, data);
    return res.data.data;
  },

  async updateLabResult(id: string, data: Partial<LabResult>): Promise<LabResult> {
    const res = await api.put<ApiResponse<LabResult>>(`/laboratory/results/${id}`, data);
    return res.data.data;
  },

  // Radiology
  async getRadiologyExams(filters: QueryParams = {}): Promise<PaginatedResponse<RadiologyExam>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<RadiologyExam>>>(`/laboratory/radiology?${params.toString()}`);
    return res.data.data;
  },

  async getRadiologyExam(id: string): Promise<RadiologyExam> {
    const res = await api.get<ApiResponse<RadiologyExam>>(`/laboratory/radiology/${id}`);
    return res.data.data;
  },

  async createRadiologyExam(data: Partial<RadiologyExam>): Promise<RadiologyExam> {
    const res = await api.post<ApiResponse<RadiologyExam>>('/laboratory/radiology', data);
    return res.data.data;
  },

  async updateRadiologyExam(id: string, data: Partial<RadiologyExam>): Promise<RadiologyExam> {
    const res = await api.put<ApiResponse<RadiologyExam>>(`/laboratory/radiology/${id}`, data);
    return res.data.data;
  },

  async scheduleRadiologyExam(id: string, scheduledAt: string): Promise<RadiologyExam> {
    const res = await api.patch<ApiResponse<RadiologyExam>>(`/laboratory/radiology/${id}/schedule`, { scheduledAt });
    return res.data.data;
  },

  async completeRadiologyExam(id: string, findings: string, reportFile?: string): Promise<RadiologyExam> {
    const res = await api.patch<ApiResponse<RadiologyExam>>(`/laboratory/radiology/${id}/complete`, { findings, reportFile });
    return res.data.data;
  },
};