export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
  code?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  // Common filter properties
  status?: string;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  patientId?: string;
  doctorId?: string;
  departmentId?: string;
  branchId?: string;
  staffId?: string;
  account?: string;
  unreadOnly?: boolean;
  lowStock?: boolean;
}
