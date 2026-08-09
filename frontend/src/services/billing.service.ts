import api from '../api/client';
import type { Invoice, Payment, Insurance, InsuranceClaim, Vendor, PurchaseRequest, PurchaseOrder, Expense } from '../types/billing';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface InvoiceFilters extends QueryParams {
  search?: string;
  status?: string;
  patientId?: string;
}

export const billingService = {
  // Invoices
  async getInvoices(filters: InvoiceFilters = {}): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Invoice>>>(`/billing/invoices?${params.toString()}`);
    return res.data.data;
  },

  async getInvoice(id: string): Promise<Invoice> {
    const res = await api.get<ApiResponse<Invoice>>(`/billing/invoices/${id}`);
    return res.data.data;
  },

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const res = await api.post<ApiResponse<Invoice>>('/billing/invoices', data);
    return res.data.data;
  },

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const res = await api.put<ApiResponse<Invoice>>(`/billing/invoices/${id}`, data);
    return res.data.data;
  },

  async deleteInvoice(id: string): Promise<void> {
    await api.delete(`/billing/invoices/${id}`);
  },

  async sendInvoice(id: string): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>(`/billing/invoices/${id}/send`);
    return res.data.data;
  },

  async getOverdueInvoices(): Promise<Invoice[]> {
    const res = await api.get<ApiResponse<Invoice[]>>('/billing/invoices/overdue');
    return res.data.data;
  },

  // Payments
  async getPayments(filters: QueryParams = {}): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Payment>>>(`/billing/payments?${params.toString()}`);
    return res.data.data;
  },

  async getPayment(id: string): Promise<Payment> {
    const res = await api.get<ApiResponse<Payment>>(`/billing/payments/${id}`);
    return res.data.data;
  },

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const res = await api.post<ApiResponse<Payment>>('/billing/payments', data);
    return res.data.data;
  },

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    const res = await api.put<ApiResponse<Payment>>(`/billing/payments/${id}`, data);
    return res.data.data;
  },

  async refundPayment(id: string, amount: number, reason: string): Promise<Payment> {
    const res = await api.post<ApiResponse<Payment>>(`/billing/payments/${id}/refund`, { amount, reason });
    return res.data.data;
  },

  // Insurance
  async getInsurancePolicies(filters: QueryParams = {}): Promise<PaginatedResponse<Insurance>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Insurance>>>(`/billing/insurance?${params.toString()}`);
    return res.data.data;
  },

  async getInsurancePolicy(id: string): Promise<Insurance> {
    const res = await api.get<ApiResponse<Insurance>>(`/billing/insurance/${id}`);
    return res.data.data;
  },

  async createInsurancePolicy(data: Partial<Insurance>): Promise<Insurance> {
    const res = await api.post<ApiResponse<Insurance>>('/billing/insurance', data);
    return res.data.data;
  },

  async updateInsurancePolicy(id: string, data: Partial<Insurance>): Promise<Insurance> {
    const res = await api.put<ApiResponse<Insurance>>(`/billing/insurance/${id}`, data);
    return res.data.data;
  },

  // Insurance Claims
  async getInsuranceClaims(filters: QueryParams = {}): Promise<PaginatedResponse<InsuranceClaim>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<InsuranceClaim>>>(`/billing/claims?${params.toString()}`);
    return res.data.data;
  },

  async getInsuranceClaim(id: string): Promise<InsuranceClaim> {
    const res = await api.get<ApiResponse<InsuranceClaim>>(`/billing/claims/${id}`);
    return res.data.data;
  },

  async createInsuranceClaim(data: Partial<InsuranceClaim>): Promise<InsuranceClaim> {
    const res = await api.post<ApiResponse<InsuranceClaim>>('/billing/claims', data);
    return res.data.data;
  },

  async submitInsuranceClaim(id: string): Promise<InsuranceClaim> {
    const res = await api.patch<ApiResponse<InsuranceClaim>>(`/billing/claims/${id}/submit`);
    return res.data.data;
  },

  // Vendors
  async getVendors(filters: QueryParams = {}): Promise<PaginatedResponse<Vendor>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Vendor>>>(`/billing/vendors?${params.toString()}`);
    return res.data.data;
  },

  async getVendor(id: string): Promise<Vendor> {
    const res = await api.get<ApiResponse<Vendor>>(`/billing/vendors/${id}`);
    return res.data.data;
  },

  async createVendor(data: Partial<Vendor>): Promise<Vendor> {
    const res = await api.post<ApiResponse<Vendor>>('/billing/vendors', data);
    return res.data.data;
  },

  async updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
    const res = await api.put<ApiResponse<Vendor>>(`/billing/vendors/${id}`, data);
    return res.data.data;
  },

  // Purchase Requests
  async getPurchaseRequests(filters: QueryParams = {}): Promise<PaginatedResponse<PurchaseRequest>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<PurchaseRequest>>>(`/billing/purchase-requests?${params.toString()}`);
    return res.data.data;
  },

  async getPurchaseRequest(id: string): Promise<PurchaseRequest> {
    const res = await api.get<ApiResponse<PurchaseRequest>>(`/billing/purchase-requests/${id}`);
    return res.data.data;
  },

  async createPurchaseRequest(data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    const res = await api.post<ApiResponse<PurchaseRequest>>('/billing/purchase-requests', data);
    return res.data.data;
  },

  async approvePurchaseRequest(id: string): Promise<PurchaseRequest> {
    const res = await api.patch<ApiResponse<PurchaseRequest>>(`/billing/purchase-requests/${id}/approve`);
    return res.data.data;
  },

  async rejectPurchaseRequest(id: string, reason: string): Promise<PurchaseRequest> {
    const res = await api.patch<ApiResponse<PurchaseRequest>>(`/billing/purchase-requests/${id}/reject`, { reason });
    return res.data.data;
  },

  // Purchase Orders
  async getPurchaseOrders(filters: QueryParams = {}): Promise<PaginatedResponse<PurchaseOrder>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<PurchaseOrder>>>(`/billing/purchase-orders?${params.toString()}`);
    return res.data.data;
  },

  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const res = await api.get<ApiResponse<PurchaseOrder>>(`/billing/purchase-orders/${id}`);
    return res.data.data;
  },

  async createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const res = await api.post<ApiResponse<PurchaseOrder>>('/billing/purchase-orders', data);
    return res.data.data;
  },

  // Expenses
  async getExpenses(filters: QueryParams = {}): Promise<PaginatedResponse<Expense>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', String(filters.status));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<Expense>>>(`/billing/expenses?${params.toString()}`);
    return res.data.data;
  },

  async getExpense(id: string): Promise<Expense> {
    const res = await api.get<ApiResponse<Expense>>(`/billing/expenses/${id}`);
    return res.data.data;
  },

  async createExpense(data: Partial<Expense>): Promise<Expense> {
    const res = await api.post<ApiResponse<Expense>>('/billing/expenses', data);
    return res.data.data;
  },

  async approveExpense(id: string): Promise<Expense> {
    const res = await api.patch<ApiResponse<Expense>>(`/billing/expenses/${id}/approve`);
    return res.data.data;
  },

  async rejectExpense(id: string, reason: string): Promise<Expense> {
    const res = await api.patch<ApiResponse<Expense>>(`/billing/expenses/${id}/reject`, { reason });
    return res.data.data;
  },
};