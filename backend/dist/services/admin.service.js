"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const User_1 = __importDefault(require("../models/User"));
const StaffRequest_1 = __importDefault(require("../models/StaffRequest"));
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
class AdminService {
    async getStaffRequests(filters) {
        const { status, search, page = 1, limit = 10 } = filters;
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const total = await StaffRequest_1.default.countDocuments(query);
        const requests = await StaffRequest_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return {
            data: requests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getStaffRequest(id) {
        const request = await StaffRequest_1.default.findById(id);
        if (!request) {
            throw new Error('Staff request not found');
        }
        return request;
    }
    async approveStaffRequest(id, reviewedBy) {
        const request = await StaffRequest_1.default.findById(id);
        if (!request) {
            throw new Error('Staff request not found');
        }
        if (request.status !== 'pending') {
            throw new Error('This request has already been processed');
        }
        const existingUser = await User_1.default.findOne({ email: request.email });
        if (existingUser) {
            throw new Error('A user with this email already exists');
        }
        const tempPassword = (0, otp_1.generateOTP)(8) + 'Aa1!';
        const user = await User_1.default.create({
            email: request.email,
            password: tempPassword,
            firstName: request.firstName,
            lastName: request.lastName,
            phone: request.phone,
            role: request.role,
            isVerified: true,
            isActive: true,
        });
        request.status = 'approved';
        request.reviewedBy = reviewedBy;
        request.reviewedAt = new Date();
        await request.save();
        try {
            await (0, email_1.sendEmail)({
                to: request.email,
                subject: 'SmartCare - Staff Registration Approved',
                html: (0, email_1.generateStaffApprovalEmail)(request.firstName, request.email, tempPassword),
            });
        }
        catch {
            console.error('Failed to send approval email');
        }
        return { message: 'Staff request approved', user };
    }
    async rejectStaffRequest(id, reviewedBy, rejectionReason) {
        const request = await StaffRequest_1.default.findById(id);
        if (!request) {
            throw new Error('Staff request not found');
        }
        if (request.status !== 'pending') {
            throw new Error('This request has already been processed');
        }
        request.status = 'rejected';
        request.reviewedBy = reviewedBy;
        request.reviewedAt = new Date();
        request.rejectionReason = rejectionReason;
        await request.save();
        try {
            await (0, email_1.sendEmail)({
                to: request.email,
                subject: 'SmartCare - Staff Registration Update',
                html: (0, email_1.generateStaffRejectionEmail)(request.firstName, rejectionReason),
            });
        }
        catch {
            console.error('Failed to send rejection email');
        }
        return { message: 'Staff request rejected' };
    }
    async getUsers(filters) {
        const { role, search, page = 1, limit = 10 } = filters;
        const query = {};
        if (role)
            query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const total = await User_1.default.countDocuments(query);
        const users = await User_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async toggleUserActive(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.role === 'admin') {
            throw new Error('Cannot deactivate admin accounts');
        }
        user.isActive = !user.isActive;
        await user.save();
        return { user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` };
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=admin.service.js.map