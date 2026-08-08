import api from '../api/client';
import type { StaffRequest } from '../types/staff-request';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface StaffRequestFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  async getStaffRequests(
    filters: StaffRequestFilters = {}
  ): Promise<PaginatedResponse<StaffRequest>> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const res = await api.get<ApiResponse<PaginatedResponse<StaffRequest>>>(
      `/admin/staff-requests?${params.toString()}`
    );
    return res.data.data;
  },

  async getStaffRequest(id: string): Promise<StaffRequest> {
    const res = await api.get<ApiResponse<StaffRequest>>(`/admin/staff-requests/${id}`);
    return res.data.data;
  },

  async approveStaffRequest(id: string): Promise<{ message: string }> {
    const res = await api.patch<ApiResponse<{ message: string }>>(
      `/admin/staff-requests/${id}/approve`
    );
    return res.data.data;
  },

  async rejectStaffRequest(
    id: string,
    rejectionReason: string
  ): Promise<{ message: string }> {
    const res = await api.patch<ApiResponse<{ message: string }>>(
      `/admin/staff-requests/${id}/reject`,
      { rejectionReason }
    );
    return res.data.data;
  },
};
