"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorService = exports.DoctorService = void 0;
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
const User_1 = __importDefault(require("../models/User"));
class DoctorService {
    async getProfile(userId) {
        const profile = await DoctorProfile_1.default.findOne({ user: userId });
        return profile;
    }
    async updateProfile(userId, data) {
        const profile = await DoctorProfile_1.default.findOneAndUpdate({ user: userId }, { ...data, user: userId }, { new: true, upsert: true });
        await User_1.default.findByIdAndUpdate(userId, { isProfileComplete: true });
        return profile;
    }
    async updateAvailability(userId, status) {
        const profile = await DoctorProfile_1.default.findOneAndUpdate({ user: userId }, { availabilityStatus: status }, { new: true });
        if (!profile) {
            throw new Error('Doctor profile not found. Please complete your profile first.');
        }
        return profile;
    }
    async getDoctors(filters) {
        const { specialty, department, search, page = 1, limit = 10 } = filters;
        const query = {};
        if (specialty)
            query.specialty = { $regex: specialty, $options: 'i' };
        if (department)
            query.department = { $regex: department, $options: 'i' };
        const total = await DoctorProfile_1.default.countDocuments(query);
        const doctors = await DoctorProfile_1.default.find(query)
            .populate('user', 'firstName lastName email phone avatar')
            .sort({ rating: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return {
            data: doctors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getDoctorById(doctorId) {
        const profile = await DoctorProfile_1.default.findById(doctorId)
            .populate('user', 'firstName lastName email phone avatar');
        if (!profile) {
            throw new Error('Doctor not found');
        }
        return profile;
    }
}
exports.DoctorService = DoctorService;
exports.doctorService = new DoctorService();
//# sourceMappingURL=doctor.service.js.map