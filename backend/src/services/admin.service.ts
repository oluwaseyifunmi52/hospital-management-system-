import User from '../models/User';
import StaffRequest from '../models/StaffRequest';
import { generateOTP } from '../utils/otp';
import { sendEmail, generateStaffApprovalEmail, generateStaffRejectionEmail } from '../utils/email';

export class AdminService {
  async getStaffRequests(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, search, page = 1, limit = 10 } = filters;

    const query: any = {};
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

    const total = await StaffRequest.countDocuments(query);
    const requests = await StaffRequest.find(query)
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

  async getStaffRequest(id: string) {
    const request = await StaffRequest.findById(id);
    if (!request) {
      throw new Error('Staff request not found');
    }
    return request;
  }

  async approveStaffRequest(id: string, reviewedBy: string) {
    const request = await StaffRequest.findById(id);
    if (!request) {
      throw new Error('Staff request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    const tempPassword = generateOTP(8) + 'Aa1!';
    const user = await User.create({
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
    request.reviewedBy = reviewedBy as any;
    request.reviewedAt = new Date();
    await request.save();

    try {
      await sendEmail({
        to: request.email,
        subject: 'SmartCare - Staff Registration Approved',
        html: generateStaffApprovalEmail(request.firstName, request.email, tempPassword),
      });
    } catch {
      console.error('Failed to send approval email');
    }

    return { message: 'Staff request approved', user };
  }

  async rejectStaffRequest(id: string, reviewedBy: string, rejectionReason: string) {
    const request = await StaffRequest.findById(id);
    if (!request) {
      throw new Error('Staff request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    request.status = 'rejected';
    request.reviewedBy = reviewedBy as any;
    request.reviewedAt = new Date();
    request.rejectionReason = rejectionReason;
    await request.save();

    try {
      await sendEmail({
        to: request.email,
        subject: 'SmartCare - Staff Registration Update',
        html: generateStaffRejectionEmail(request.firstName, rejectionReason),
      });
    } catch {
      console.error('Failed to send rejection email');
    }

    return { message: 'Staff request rejected' };
  }

  async getUsers(filters: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { role, search, page = 1, limit = 10 } = filters;

    const query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
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

  async toggleUserActive(userId: string) {
    const user = await User.findById(userId);
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

export const adminService = new AdminService();
