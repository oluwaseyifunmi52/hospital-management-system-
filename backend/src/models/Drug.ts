import mongoose, { Schema, Model } from 'mongoose';
import { IDrug } from '../types';

const drugSchema = new Schema<IDrug>(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    batchNumber: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    supplier: { type: String, trim: true },
    reorderLevel: { type: Number, default: 10, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Drug: Model<IDrug> = mongoose.model<IDrug>('Drug', drugSchema);
export default Drug;
