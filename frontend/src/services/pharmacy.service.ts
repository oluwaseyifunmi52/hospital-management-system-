import api from '../api/client';
import type { Medicine, Prescription, InventoryItem, StockMovement } from '../types/pharmacy';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface MedicineFilters extends QueryParams {
  search?: string;
  category?: string;
  lowStock?: boolean;
}

export const pharmacyService = {
  // Medicines
  async getMedicines(filters: MedicineFilters = {}): Promise<PaginatedResponse<Medicine>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.lowStock) params.set('lowStock', 'true');
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Medicine>>>(`/pharmacy/medicines?${params.toString()}`);
    return res.data.data;
  },

  async getMedicine(id: string): Promise<Medicine> {
    const res = await api.get<ApiResponse<Medicine>>(`/pharmacy/medicines/${id}`);
    return res.data.data;
  },

  async createMedicine(data: Partial<Medicine>): Promise<Medicine> {
    const res = await api.post<ApiResponse<Medicine>>('/pharmacy/medicines', data);
    return res.data.data;
  },

  async updateMedicine(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const res = await api.put<ApiResponse<Medicine>>(`/pharmacy/medicines/${id}`, data);
    return res.data.data;
  },

  async deleteMedicine(id: string): Promise<void> {
    await api.delete(`/pharmacy/medicines/${id}`);
  },

  async getLowStockMedicines(): Promise<Medicine[]> {
    const res = await api.get<ApiResponse<Medicine[]>>('/pharmacy/medicines/low-stock');
    return res.data.data;
  },

  // Prescriptions
  async getPrescriptions(filters: QueryParams = {}): Promise<PaginatedResponse<Prescription>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Prescription>>>(`/pharmacy/prescriptions?${params.toString()}`);
    return res.data.data;
  },

  async getPrescription(id: string): Promise<Prescription> {
    const res = await api.get<ApiResponse<Prescription>>(`/pharmacy/prescriptions/${id}`);
    return res.data.data;
  },

  async createPrescription(data: Partial<Prescription>): Promise<Prescription> {
    const res = await api.post<ApiResponse<Prescription>>('/pharmacy/prescriptions', data);
    return res.data.data;
  },

  async updatePrescription(id: string, data: Partial<Prescription>): Promise<Prescription> {
    const res = await api.put<ApiResponse<Prescription>>(`/pharmacy/prescriptions/${id}`, data);
    return res.data.data;
  },

  async dispensePrescription(id: string): Promise<Prescription> {
    const res = await api.patch<ApiResponse<Prescription>>(`/pharmacy/prescriptions/${id}/dispense`);
    return res.data.data;
  },

  async approvePrescription(id: string): Promise<Prescription> {
    const res = await api.patch<ApiResponse<Prescription>>(`/pharmacy/prescriptions/${id}/approve`);
    return res.data.data;
  },

  async cancelPrescription(id: string): Promise<Prescription> {
    const res = await api.patch<ApiResponse<Prescription>>(`/pharmacy/prescriptions/${id}/cancel`);
    return res.data.data;
  },

  // Inventory
  async getInventory(filters: QueryParams = {}): Promise<PaginatedResponse<InventoryItem>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<InventoryItem>>>(`/pharmacy/inventory?${params.toString()}`);
    return res.data.data;
  },

  async getStockMovements(itemId: string, filters: QueryParams = {}): Promise<StockMovement[]> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const res = await api.get<ApiResponse<StockMovement[]>>(`/pharmacy/inventory/${itemId}/movements?${params.toString()}`);
    return res.data.data;
  },

  async createStockMovement(itemId: string, data: Partial<StockMovement>): Promise<StockMovement> {
    const res = await api.post<ApiResponse<StockMovement>>(`/pharmacy/inventory/${itemId}/movements`, data);
    return res.data.data;
  },
};