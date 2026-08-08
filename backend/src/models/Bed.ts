import mongoose, { Schema, Model } from 'mongoose';
import { IBed } from '../types';

const bedSchema = new Schema<IBed>(
  {
    bedNumber: { type: String, required: true, trim: true },
    ward: { type: Schema.Types.ObjectId, ref: 'Ward', required: true },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance'],
      default: 'available',
    },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    admittedAt: { type: Date },
    dischargedAt: { type: Date },
  },
  { timestamps: true }
);

bedSchema.index({ ward: 1, bedNumber: 1 }, { unique: true });

const Bed: Model<IBed> = mongoose.model<IBed>('Bed', bedSchema);
export default Bed;
