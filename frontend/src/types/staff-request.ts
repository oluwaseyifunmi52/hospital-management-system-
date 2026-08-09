import type { UserRole } from './common';

export type StaffRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StaffRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Exclude<UserRole, 'super_admin' | 'admin' | 'patient'>;
  status: StaffRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}
