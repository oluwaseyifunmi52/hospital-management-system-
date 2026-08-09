import type { PrescriptionStatus, InventoryType } from './common';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  brand?: string;
  category: string;
  dosageForm: string;
  strength: string;
  unit: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderLevel: number;
  expiryDate?: string;
  batchNumber?: string;
  supplier?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  branchId?: string;
  date: string;
  medications: PrescriptionItem[];
  notes?: string;
  status: PrescriptionStatus;
  dispensedAt?: string;
  dispensedBy?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryType;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
  supplier?: string;
  expiryDate?: string;
  batchNumber?: string;
  branchId?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason?: string;
  reference?: string;
  performedBy: string;
  createdAt: string;
}
