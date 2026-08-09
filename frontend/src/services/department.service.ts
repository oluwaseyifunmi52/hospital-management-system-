import api from '../api/client';
import type { Department, Branch, CostCenter } from '../types/department';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const departmentService = {
  // Departments
  async getDepartments(filters: QueryParams = {}): Promise<PaginatedResponse<Department>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.branchId) params.set('branchId', filters.branchId);

    const res = await api.get<ApiResponse<PaginatedResponse<Department>>>(`/departments?${params.toString()}`);
    return res.data.data;
  },

  async getDepartment(id: string): Promise<Department> {
    const res = await api.get<ApiResponse<Department>>(`/departments/${id}`);
    return res.data.data;
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const res = await api.post<ApiResponse<Department>>('/departments', data);
    return res.data.data;
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const res = await api.put<ApiResponse<Department>>(`/departments/${id}`, data);
    return res.data.data;
  },

  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  },

  async getDepartmentStaff(departmentId: string): Promise<any[]> {
    const res = await api.get<ApiResponse<any[]>>(`/departments/${departmentId}/staff`);
    return res.data.data;
  },

  // Branches
  async getBranches(filters: QueryParams = {}): Promise<PaginatedResponse<Branch>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);

    const res = await api.get<ApiResponse<PaginatedResponse<Branch>>>(`/branches?${params.toString()}`);
    return res.data.data;
  },

  async getBranch(id: string): Promise<Branch> {
    const res = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
    return res.data.data;
  },

  async createBranch(data: Partial<Branch>): Promise<Branch> {
    const res = await api.post<ApiResponse<Branch>>('/branches', data);
    return res.data.data;
  },

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    const res = await api.put<ApiResponse<Branch>>(`/branches/${id}`, data);
    return res.data.data;
  },

  async deleteBranch(id: string): Promise<void> {
    await api.delete(`/branches/${id}`);
  },

  // Cost Centers
  async getCostCenters(filters: QueryParams = {}): Promise<PaginatedResponse<CostCenter>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.departmentId) params.set('departmentId', filters.departmentId);
    if (filters.branchId) params.set('branchId', filters.branchId);

    const res = await api.get<ApiResponse<PaginatedResponse<CostCenter>>>(`/cost-centers?${params.toString()}`);
    return res.data.data;
  },

  async getCostCenter(id: string): Promise<CostCenter> {
    const res = await api.get<ApiResponse<CostCenter>>(`/cost-centers/${id}`);
    return res.data.data;
  },

  async createCostCenter(data: Partial<CostCenter>): Promise<CostCenter> {
    const res = await api.post<ApiResponse<CostCenter>>('/cost-centers', data);
    return res.data.data;
  },

  async updateCostCenter(id: string, data: Partial<CostCenter>): Promise<CostCenter> {
    const res = await api.put<ApiResponse<CostCenter>>(`/cost-centers/${id}`, data);
    return res.data.data;
  },

  async deleteCostCenter(id: string): Promise<void> {
    await api.delete(`/cost-centers/${id}`);
  },
};