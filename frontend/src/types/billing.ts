import type { InvoiceStatus, PaymentMethod, PaymentStatus } from './common';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  branchId?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'consultation' | 'laboratory' | 'pharmacy' | 'admission' | 'bed' | 'procedure' | 'radiology' | 'other';
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  receivedBy: string;
  receivedAt: string;
  notes?: string;
  createdAt: string;
}

export interface Insurance {
  id: string;
  provider: string;
  policyNumber: string;
  patientId: string;
  startDate: string;
  expiryDate: string;
  coverageType: string;
  coveragePercentage: number;
  maxBenefit?: number;
  isActive: boolean;
  createdAt: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  insuranceId: string;
  patientId: string;
  invoiceId: string;
  amount: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAmount?: number;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  address?: string;
  category: string;
  taxId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestedBy: string;
  departmentId: string;
  branchId?: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PurchaseItem {
  itemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  purchaseRequestId?: string;
  vendorId: string;
  requestedBy: string;
  departmentId: string;
  branchId?: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: string;
  amount: number;
  description: string;
  departmentId?: string;
  branchId?: string;
  receipt?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}
