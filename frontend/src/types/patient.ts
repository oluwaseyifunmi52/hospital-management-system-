import type { Gender } from './common';

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  genotype?: string;
  allergies?: string[];
  medicalHistory?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface PatientTimelineEvent {
  id: string;
  patientId: string;
  type: 'appointment' | 'admission' | 'discharge' | 'prescription' | 'lab' | 'radiology' | 'payment' | 'medical_record';
  title: string;
  description?: string;
  date: string;
  createdBy?: string;
}
