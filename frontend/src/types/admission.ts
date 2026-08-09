import type { AdmissionStatus } from './common';

export interface Admission {
  id: string;
  admissionNumber: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  wardId?: string;
  roomId?: string;
  bedId?: string;
  branchId?: string;
  admissionDate: string;
  reason?: string;
  diagnosis?: string;
  notes?: string;
  status: AdmissionStatus;
  dischargedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Discharge {
  id: string;
  admissionId: string;
  patientId: string;
  doctorId: string;
  dischargeDate: string;
  diagnosis: string;
  treatmentSummary: string;
  medications?: string[];
  followUpInstructions?: string;
  followUpDate?: string;
  notes?: string;
  outstandingAmount: number;
  createdAt: string;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  branchId?: string;
  floor: string;
  totalRooms: number;
  totalBeds: number;
  availableBeds: number;
  isActive: boolean;
  createdAt: string;
}

export interface Room {
  id: string;
  wardId: string;
  roomNumber: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  isActive: boolean;
}

export interface Bed {
  id: string;
  wardId: string;
  roomId: string;
  bedNumber: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patientId?: string;
  admissionId?: string;
  notes?: string;
}
