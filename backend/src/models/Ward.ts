import mongoose, { Schema, Model } from 'mongoose';
import { IWard } from '../types';

const wardSchema = new Schema<IWard>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ['general', 'private', 'icu', 'maternity', 'pediatric', 'emergency', 'surgical'],
      required: true,
    },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    totalBeds: { type: Number, required: true, min: 0 },
    occupiedBeds: { type: Number, default: 0, min: 0 },
    nurseInCharge: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Ward: Model<IWard> = mongoose.model<IWard>('Ward', wardSchema);
export default Ward;
