export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  total: number;
  totalPages: number;
}

export const getPaginationOptions = (options: PaginationOptions): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(options.maxLimit || 100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const buildPaginationResult = (
  total: number,
  page: number,
  limit: number
): PaginationResult => {
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
