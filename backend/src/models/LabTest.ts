import mongoose, { Schema, Model } from 'mongoose';
import { ILabTest } from '../types';

const labTestSchema = new Schema<ILabTest>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    testName: { type: String, required: true, trim: true },
    testType: {
      type: String,
      enum: ['blood', 'urine', 'stool', 'imaging', 'pathology', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sample_collected', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine',
    },
    notes: { type: String },
    requestedAt: { type: Date, default: Date.now },
    sampleCollectedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const LabTest: Model<ILabTest> = mongoose.model<ILabTest>('LabTest', labTestSchema);
export default LabTest;
