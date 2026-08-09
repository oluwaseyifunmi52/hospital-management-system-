import api from '../api/client';
import type { Staff, AttendanceRecord, LeaveRequest, PayrollRecord, EmployeeDocument } from '../types/staff';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface StaffFilters extends QueryParams {
  search?: string;
  role?: string;
  status?: string;
  departmentId?: string;
}

export const staffService = {
  async getStaff(filters: StaffFilters = {}): Promise<PaginatedResponse<Staff>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.role && filters.role !== 'all') params.set('role', filters.role);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.departmentId) params.set('departmentId', filters.departmentId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Staff>>>(`/staff?${params.toString()}`);
    return res.data.data;
  },

  async getStaffMember(id: string): Promise<Staff> {
    const res = await api.get<ApiResponse<Staff>>(`/staff/${id}`);
    return res.data.data;
  },

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    const res = await api.post<ApiResponse<Staff>>('/staff', data);
    return res.data.data;
  },

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    const res = await api.put<ApiResponse<Staff>>(`/staff/${id}`, data);
    return res.data.data;
  },

  async deleteStaff(id: string): Promise<void> {
    await api.delete(`/staff/${id}`);
  },

  async activateStaff(id: string): Promise<Staff> {
    const res = await api.patch<ApiResponse<Staff>>(`/staff/${id}/activate`);
    return res.data.data;
  },

  async deactivateStaff(id: string): Promise<Staff> {
    const res = await api.patch<ApiResponse<Staff>>(`/staff/${id}/deactivate`);
    return res.data.data;
  },

  // Attendance
  async getAttendance(staffId: string, filters: QueryParams = {}): Promise<PaginatedResponse<AttendanceRecord>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    const res = await api.get<ApiResponse<PaginatedResponse<AttendanceRecord>>>(`/staff/${staffId}/attendance?${params.toString()}`);
    return res.data.data;
  },

  async checkIn(staffId: string): Promise<AttendanceRecord> {
    const res = await api.post<ApiResponse<AttendanceRecord>>(`/staff/${staffId}/attendance/check-in`);
    return res.data.data;
  },

  async checkOut(staffId: string): Promise<AttendanceRecord> {
    const res = await api.post<ApiResponse<AttendanceRecord>>(`/staff/${staffId}/attendance/check-out`);
    return res.data.data;
  },

  // Leave Requests
  async getLeaveRequests(filters: QueryParams = {}): Promise<PaginatedResponse<LeaveRequest>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', String(filters.status));
    if (filters.staffId) params.set('staffId', filters.staffId);

    const res = await api.get<ApiResponse<PaginatedResponse<LeaveRequest>>>(`/staff/leave-requests?${params.toString()}`);
    return res.data.data;
  },

  async getLeaveRequest(id: string): Promise<LeaveRequest> {
    const res = await api.get<ApiResponse<LeaveRequest>>(`/staff/leave-requests/${id}`);
    return res.data.data;
  },

  async createLeaveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const res = await api.post<ApiResponse<LeaveRequest>>('/staff/leave-requests', data);
    return res.data.data;
  },

  async approveLeaveRequest(id: string): Promise<LeaveRequest> {
    const res = await api.patch<ApiResponse<LeaveRequest>>(`/staff/leave-requests/${id}/approve`);
    return res.data.data;
  },

  async rejectLeaveRequest(id: string, reason: string): Promise<LeaveRequest> {
    const res = await api.patch<ApiResponse<LeaveRequest>>(`/staff/leave-requests/${id}/reject`, { reason });
    return res.data.data;
  },

  // Payroll
  async getPayroll(filters: QueryParams = {}): Promise<PaginatedResponse<PayrollRecord>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', String(filters.status));
    if (filters.staffId) params.set('staffId', filters.staffId);

    const res = await api.get<ApiResponse<PaginatedResponse<PayrollRecord>>>(`/staff/payroll?${params.toString()}`);
    return res.data.data;
  },

  async getPayrollRecord(id: string): Promise<PayrollRecord> {
    const res = await api.get<ApiResponse<PayrollRecord>>(`/staff/payroll/${id}`);
    return res.data.data;
  },

  async generatePayroll(period: string, departmentId?: string): Promise<PayrollRecord[]> {
    const res = await api.post<ApiResponse<PayrollRecord[]>>('/staff/payroll/generate', { period, departmentId });
    return res.data.data;
  },

  // Documents
  async getDocuments(staffId: string): Promise<EmployeeDocument[]> {
    const res = await api.get<ApiResponse<EmployeeDocument[]>>(`/staff/${staffId}/documents`);
    return res.data.data;
  },

  async uploadDocument(staffId: string, file: File, type: string): Promise<EmployeeDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await api.post<ApiResponse<EmployeeDocument>>(`/staff/${staffId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async deleteDocument(staffId: string, documentId: string): Promise<void> {
    await api.delete(`/staff/${staffId}/documents/${documentId}`);
  },
};