import api from '../api/client';
import type { Admission, Discharge, Ward, Room, Bed } from '../types/admission';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AdmissionFilters extends QueryParams {
  search?: string;
  status?: string;
  patientId?: string;
  doctorId?: string;
  wardId?: string;
}

export const admissionService = {
  // Admissions
  async getAdmissions(filters: AdmissionFilters = {}): Promise<PaginatedResponse<Admission>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.doctorId) params.set('doctorId', filters.doctorId);
    if (filters.wardId) params.set('wardId', filters.wardId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Admission>>>(`/admissions?${params.toString()}`);
    return res.data.data;
  },

  async getAdmission(id: string): Promise<Admission> {
    const res = await api.get<ApiResponse<Admission>>(`/admissions/${id}`);
    return res.data.data;
  },

  async createAdmission(data: Partial<Admission>): Promise<Admission> {
    const res = await api.post<ApiResponse<Admission>>('/admissions', data);
    return res.data.data;
  },

  async updateAdmission(id: string, data: Partial<Admission>): Promise<Admission> {
    const res = await api.put<ApiResponse<Admission>>(`/admissions/${id}`, data);
    return res.data.data;
  },

  async transferAdmission(id: string, wardId: string, roomId: string, bedId: string): Promise<Admission> {
    const res = await api.patch<ApiResponse<Admission>>(`/admissions/${id}/transfer`, { wardId, roomId, bedId });
    return res.data.data;
  },

  async dischargePatient(id: string, dischargeData: Partial<Discharge>): Promise<{ admission: Admission; discharge: Discharge }> {
    const res = await api.post<ApiResponse<{ admission: Admission; discharge: Discharge }>>(`/admissions/${id}/discharge`, dischargeData);
    return res.data.data;
  },

  // Discharges
  async getDischarges(filters: QueryParams = {}): Promise<PaginatedResponse<Discharge>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);

    const res = await api.get<ApiResponse<PaginatedResponse<Discharge>>>(`/discharges?${params.toString()}`);
    return res.data.data;
  },

  async getDischarge(id: string): Promise<Discharge> {
    const res = await api.get<ApiResponse<Discharge>>(`/discharges/${id}`);
    return res.data.data;
  },

  // Wards
  async getWards(filters: QueryParams = {}): Promise<PaginatedResponse<Ward>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);

    const res = await api.get<ApiResponse<PaginatedResponse<Ward>>>(`/wards?${params.toString()}`);
    return res.data.data;
  },

  async getWard(id: string): Promise<Ward> {
    const res = await api.get<ApiResponse<Ward>>(`/wards/${id}`);
    return res.data.data;
  },

  async createWard(data: Partial<Ward>): Promise<Ward> {
    const res = await api.post<ApiResponse<Ward>>('/wards', data);
    return res.data.data;
  },

  async updateWard(id: string, data: Partial<Ward>): Promise<Ward> {
    const res = await api.put<ApiResponse<Ward>>(`/wards/${id}`, data);
    return res.data.data;
  },

  async getWardAvailability(wardId: string): Promise<{ totalBeds: number; availableBeds: number; occupiedBeds: number }> {
    const res = await api.get<ApiResponse<{ totalBeds: number; availableBeds: number; occupiedBeds: number }>>(`/wards/${wardId}/availability`);
    return res.data.data;
  },

  // Rooms
  async getRooms(wardId: string, filters: QueryParams = {}): Promise<Room[]> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const res = await api.get<ApiResponse<Room[]>>(`/wards/${wardId}/rooms?${params.toString()}`);
    return res.data.data;
  },

  async getRoom(id: string): Promise<Room> {
    const res = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
    return res.data.data;
  },

  async createRoom(wardId: string, data: Partial<Room>): Promise<Room> {
    const res = await api.post<ApiResponse<Room>>(`/wards/${wardId}/rooms`, data);
    return res.data.data;
  },

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const res = await api.put<ApiResponse<Room>>(`/rooms/${id}`, data);
    return res.data.data;
  },

  // Beds
  async getBeds(roomId: string, filters: QueryParams = {}): Promise<Bed[]> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', String(filters.status));

    const res = await api.get<ApiResponse<Bed[]>>(`/rooms/${roomId}/beds?${params.toString()}`);
    return res.data.data;
  },

  async getBed(id: string): Promise<Bed> {
    const res = await api.get<ApiResponse<Bed>>(`/beds/${id}`);
    return res.data.data;
  },

  async createBed(roomId: string, data: Partial<Bed>): Promise<Bed> {
    const res = await api.post<ApiResponse<Bed>>(`/rooms/${roomId}/beds`, data);
    return res.data.data;
  },

  async updateBed(id: string, data: Partial<Bed>): Promise<Bed> {
    const res = await api.put<ApiResponse<Bed>>(`/beds/${id}`, data);
    return res.data.data;
  },

  async assignBed(bedId: string, patientId: string, admissionId: string): Promise<Bed> {
    const res = await api.patch<ApiResponse<Bed>>(`/beds/${bedId}/assign`, { patientId, admissionId });
    return res.data.data;
  },

  async releaseBed(bedId: string): Promise<Bed> {
    const res = await api.patch<ApiResponse<Bed>>(`/beds/${bedId}/release`);
    return res.data.data;
  },
};