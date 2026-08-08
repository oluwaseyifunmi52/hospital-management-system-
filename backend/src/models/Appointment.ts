import mongoose, { Schema, Model } from 'mongoose';
import { IAppointment } from '../types';

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    type: {
      type: String,
      enum: ['in_person', 'video'],
      default: 'in_person',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
    },
    reason: {
      type: String,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });

const Appointment: Model<IAppointment> = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);

export default Appointment;
