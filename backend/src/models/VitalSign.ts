import mongoose, { Schema, Model } from 'mongoose';
import { IVitalSign } from '../types';

const vitalSignSchema = new Schema<IVitalSign>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    temperature: { type: Number },
    heartRate: { type: Number },
    bloodPressureSystolic: { type: Number },
    bloodPressureDiastolic: { type: Number },
    respiratoryRate: { type: Number },
    oxygenSaturation: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

const VitalSign: Model<IVitalSign> = mongoose.model<IVitalSign>('VitalSign', vitalSignSchema);
export default VitalSign;
