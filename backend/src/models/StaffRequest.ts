import mongoose, { Schema, Model } from 'mongoose';
import { IStaffRequest } from '../types';

const staffRequestSchema = new Schema<IStaffRequest>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: [
        'doctor',
        'nurse',
        'receptionist',
        'pharmacist',
        'laboratory',
        'radiologist',
        'accountant',
        'ambulance_driver',
      ],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

staffRequestSchema.index({ email: 1 });
staffRequestSchema.index({ status: 1 });
staffRequestSchema.index({ role: 1 });

const StaffRequest: Model<IStaffRequest> = mongoose.model<IStaffRequest>(
  'StaffRequest',
  staffRequestSchema
);

export default StaffRequest;
