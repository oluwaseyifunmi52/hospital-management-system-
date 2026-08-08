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
export declare const getPaginationOptions: (options: PaginationOptions) => {
    page: number;
    limit: number;
    skip: number;
};
export declare const buildPaginationResult: (total: number, page: number, limit: number) => PaginationResult;
//# sourceMappingURL=pagination.d.ts.map