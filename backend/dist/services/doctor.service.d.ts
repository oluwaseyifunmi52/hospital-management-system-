export declare class DoctorService {
    getProfile(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../types").IDoctorProfile> & import("../types").IDoctorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    updateProfile(userId: string, data: any): Promise<import("mongoose").Document<unknown, {}, import("../types").IDoctorProfile> & import("../types").IDoctorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateAvailability(userId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IDoctorProfile> & import("../types").IDoctorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getDoctors(filters: {
        specialty?: string;
        department?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("../types").IDoctorProfile> & import("../types").IDoctorProfile & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>, never>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getDoctorById(doctorId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IDoctorProfile> & import("../types").IDoctorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
export declare const doctorService: DoctorService;
//# sourceMappingURL=doctor.service.d.ts.map