export declare class AdminService {
    getStaffRequests(filters: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../types").IStaffRequest> & import("../types").IStaffRequest & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getStaffRequest(id: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IStaffRequest> & import("../types").IStaffRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    approveStaffRequest(id: string, reviewedBy: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("../types").IUser> & import("../types").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    rejectStaffRequest(id: string, reviewedBy: string, rejectionReason: string): Promise<{
        message: string;
    }>;
    getUsers(filters: {
        role?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../types").IUser> & import("../types").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    toggleUserActive(userId: string): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../types").IUser> & import("../types").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        message: string;
    }>;
}
export declare const adminService: AdminService;
//# sourceMappingURL=admin.service.d.ts.map