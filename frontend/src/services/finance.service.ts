import api from '../api/client';
import type { FinancialTransaction, AccountsReceivable, AccountsPayable, CashTransaction, GeneralLedgerEntry, FinancialReport } from '../types/finance';
import type { Budget, BudgetAlert, AnalyticsKPI, AnalyticsChart } from '../types/system';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const financeService = {
  // Financial Transactions
  async getTransactions(filters: QueryParams = {}): Promise<PaginatedResponse<FinancialTransaction>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.type) params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get<ApiResponse<PaginatedResponse<FinancialTransaction>>>(`/finance/transactions?${params.toString()}`);
    return res.data.data;
  },

  async getTransaction(id: string): Promise<FinancialTransaction> {
    const res = await api.get<ApiResponse<FinancialTransaction>>(`/finance/transactions/${id}`);
    return res.data.data;
  },

  async createTransaction(data: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    const res = await api.post<ApiResponse<FinancialTransaction>>('/finance/transactions', data);
    return res.data.data;
  },

  // Accounts Receivable
  async getAccountsReceivable(filters: QueryParams = {}): Promise<PaginatedResponse<AccountsReceivable>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);

    const res = await api.get<ApiResponse<PaginatedResponse<AccountsReceivable>>>(`/finance/accounts-receivable?${params.toString()}`);
    return res.data.data;
  },

  // Accounts Payable
  async getAccountsPayable(filters: QueryParams = {}): Promise<PaginatedResponse<AccountsPayable>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);

    const res = await api.get<ApiResponse<PaginatedResponse<AccountsPayable>>>(`/finance/accounts-payable?${params.toString()}`);
    return res.data.data;
  },

  // Cash Transactions
  async getCashTransactions(filters: QueryParams = {}): Promise<PaginatedResponse<CashTransaction>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.type) params.set('type', filters.type);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    const res = await api.get<ApiResponse<PaginatedResponse<CashTransaction>>>(`/finance/cash-transactions?${params.toString()}`);
    return res.data.data;
  },

  async createCashTransaction(data: Partial<CashTransaction>): Promise<CashTransaction> {
    const res = await api.post<ApiResponse<CashTransaction>>('/finance/cash-transactions', data);
    return res.data.data;
  },

  // General Ledger
  async getGeneralLedger(filters: QueryParams = {}): Promise<PaginatedResponse<GeneralLedgerEntry>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.account) params.set('account', filters.account);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    const res = await api.get<ApiResponse<PaginatedResponse<GeneralLedgerEntry>>>(`/finance/general-ledger?${params.toString()}`);
    return res.data.data;
  },

  // Financial Reports
  async getFinancialReports(filters: QueryParams = {}): Promise<PaginatedResponse<FinancialReport>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.type) params.set('type', filters.type);

    const res = await api.get<ApiResponse<PaginatedResponse<FinancialReport>>>(`/finance/reports?${params.toString()}`);
    return res.data.data;
  },

  async getFinancialReport(id: string): Promise<FinancialReport> {
    const res = await api.get<ApiResponse<FinancialReport>>(`/finance/reports/${id}`);
    return res.data.data;
  },

  async generateFinancialReport(type: string, startDate: string, endDate: string): Promise<FinancialReport> {
    const res = await api.post<ApiResponse<FinancialReport>>('/finance/reports/generate', { type, startDate, endDate });
    return res.data.data;
  },

  // Budgets
  async getBudgets(filters: QueryParams = {}): Promise<PaginatedResponse<Budget>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);

    const res = await api.get<ApiResponse<PaginatedResponse<Budget>>>(`/finance/budgets?${params.toString()}`);
    return res.data.data;
  },

  async getBudget(id: string): Promise<Budget> {
    const res = await api.get<ApiResponse<Budget>>(`/finance/budgets/${id}`);
    return res.data.data;
  },

  async createBudget(data: Partial<Budget>): Promise<Budget> {
    const res = await api.post<ApiResponse<Budget>>('/finance/budgets', data);
    return res.data.data;
  },

  async updateBudget(id: string, data: Partial<Budget>): Promise<Budget> {
    const res = await api.put<ApiResponse<Budget>>(`/finance/budgets/${id}`, data);
    return res.data.data;
  },

  async getBudgetAlerts(budgetId: string): Promise<BudgetAlert[]> {
    const res = await api.get<ApiResponse<BudgetAlert[]>>(`/finance/budgets/${budgetId}/alerts`);
    return res.data.data;
  },

  // Analytics
  async getKPIs(): Promise<AnalyticsKPI[]> {
    const res = await api.get<ApiResponse<AnalyticsKPI[]>>('/finance/analytics/kpis');
    return res.data.data;
  },

  async getCharts(filters: QueryParams = {}): Promise<AnalyticsChart[]> {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);

    const res = await api.get<ApiResponse<AnalyticsChart[]>>(`/finance/analytics/charts?${params.toString()}`);
    return res.data.data;
  },

  async getRevenueAnalytics(startDate: string, endDate: string, groupBy: 'day' | 'week' | 'month' = 'day'): Promise<Record<string, number>> {
    const res = await api.get<ApiResponse<Record<string, number>>>(`/finance/analytics/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`);
    return res.data.data;
  },

  async getExpenseAnalytics(startDate: string, endDate: string, groupBy: 'day' | 'week' | 'month' = 'day'): Promise<Record<string, number>> {
    const res = await api.get<ApiResponse<Record<string, number>>>(`/finance/analytics/expenses?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`);
    return res.data.data;
  },
};