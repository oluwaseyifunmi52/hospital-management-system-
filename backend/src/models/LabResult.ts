import mongoose, { Schema, Model } from 'mongoose';
import { ILabResult } from '../types';

const labResultSchema = new Schema<ILabResult>(
  {
    labTest: { type: Schema.Types.ObjectId, ref: 'LabTest', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    results: [
      {
        parameter: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String },
        referenceRange: { type: String },
        isAbnormal: { type: Boolean, default: false },
      },
    ],
    conclusion: { type: String },
    reportUrl: { type: String },
  },
  { timestamps: true }
);

const LabResult: Model<ILabResult> = mongoose.model<ILabResult>('LabResult', labResultSchema);
export default LabResult;
