import mongoose, { Schema, Model } from 'mongoose';
import { IPharmacySale } from '../types';

const pharmacySaleSchema = new Schema<IPharmacySale>(
  {
    prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    pharmacist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        drug: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const PharmacySale: Model<IPharmacySale> = mongoose.model<IPharmacySale>('PharmacySale', pharmacySaleSchema);
export default PharmacySale;
