import mongoose, { Schema, Model } from 'mongoose';
import { IPayment } from '../types';

const paymentSchema = new Schema<IPayment>(
  {
    paymentNumber: { type: String, required: true, unique: true, trim: true },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'insurance', 'hmo', 'online'],
      required: true,
    },
    reference: { type: String, trim: true },
    insuranceProvider: { type: String, trim: true },
    insurancePolicyNumber: { type: String, trim: true },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
