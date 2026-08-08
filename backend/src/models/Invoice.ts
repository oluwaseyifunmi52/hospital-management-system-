import mongoose, { Schema, Model } from 'mongoose';
import { IInvoice } from '../types';

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    admission: { type: Schema.Types.ObjectId, ref: 'Admission' },
    items: [
      {
        description: { type: String, required: true },
        category: {
          type: String,
          enum: ['consultation', 'laboratory', 'pharmacy', 'admission', 'procedure', 'other'],
          required: true,
        },
        amount: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    dueDate: { type: Date },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;
