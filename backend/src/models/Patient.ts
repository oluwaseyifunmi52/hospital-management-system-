import mongoose, { Schema, Model } from 'mongoose';
import { IPatient } from '../types';

const patientSchema = new Schema<IPatient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    genotype: {
      type: String,
      enum: ['AA', 'AS', 'AC', 'SS', 'SC', 'CC'],
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    chronicConditions: [
      {
        type: String,
        trim: true,
      },
    ],
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      relationship: {
        type: String,
        required: true,
        trim: true,
      },
    },
    insurance: {
      provider: {
        type: String,
        trim: true,
      },
      policyNumber: {
        type: String,
        trim: true,
      },
      expiryDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ user: 1 });
patientSchema.index({ patientId: 1 });

const Patient: Model<IPatient> = mongoose.model<IPatient>('Patient', patientSchema);

export default Patient;
