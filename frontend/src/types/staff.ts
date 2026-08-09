import type { User, UserRole, StaffStatus } from './common';

export interface Staff extends User {
  role: Exclude<UserRole, 'super_admin' | 'patient'>;
  status: StaffStatus;
  departmentId?: string;
  branchId?: string;
  position?: string;
  dateOfJoining?: string;
  emergencyContact?: string;
  address?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  paidAt?: string;
  createdAt: string;
}

export interface EmployeeDocument {
  id: string;
  staffId: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
}
