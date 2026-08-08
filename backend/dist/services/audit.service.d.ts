export declare class AuditService {
    log(data: {
        user: string;
        role: string;
        action: string;
        resource: string;
        resourceId: string;
        details?: any;
        ipAddress?: string;
        userAgent?: string;
        result?: 'success' | 'failure';
    }): Promise<void>;
    getLogs(filters: {
        user?: string;
        resource?: string;
        action?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("../types").IAuditLog> & import("../types").IAuditLog & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>, never>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
export declare const auditService: AuditService;
//# sourceMappingURL=audit.service.d.ts.map