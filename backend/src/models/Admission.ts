import mongoose, { Schema, Model } from 'mongoose';
import { IAdmission } from '../types';

const admissionSchema = new Schema<IAdmission>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ward: { type: Schema.Types.ObjectId, ref: 'Ward', required: true },
    bed: { type: Schema.Types.ObjectId, ref: 'Bed', required: true },
    admissionDate: { type: Date, default: Date.now },
    dischargeDate: { type: Date },
    diagnosis: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'discharged', 'transferred', 'cancelled'],
      default: 'active',
    },
    notes: { type: String },
    dischargeSummary: { type: String },
  },
  { timestamps: true }
);

const Admission: Model<IAdmission> = mongoose.model<IAdmission>('Admission', admissionSchema);
export default Admission;
