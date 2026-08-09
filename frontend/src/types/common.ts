export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'pharmacist'
  | 'lab_technician'
  | 'radiologist'
  | 'accountant'
  | 'receptionist'
  | 'hr'
  | 'ambulance_driver'
  | 'patient';

export type Gender = 'male' | 'female' | 'other';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'print' | 'manage';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export type InvoiceStatus = 'draft' | 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'online' | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type ClaimStatus = 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected' | 'paid';

export type LabTestStatus = 'pending' | 'sample_collected' | 'processing' | 'completed' | 'reviewed';

export type RadiologyStatus = 'pending' | 'scheduled' | 'processing' | 'completed' | 'reviewed';

export type PrescriptionStatus = 'pending' | 'approved' | 'dispensed' | 'cancelled';

export type AdmissionStatus = 'admitted' | 'transferred' | 'discharged';

export type StaffStatus = 'active' | 'inactive' | 'on_leave';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type ProcurementStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export type InventoryType = 'medicine' | 'equipment' | 'consumable' | 'supply';

export type NotificationType =
  | 'appointment'
  | 'reminder'
  | 'cancellation'
  | 'patient'
  | 'admission'
  | 'discharge'
  | 'inventory'
  | 'lab_result'
  | 'prescription'
  | 'invoice'
  | 'payment'
  | 'insurance'
  | 'approval'
  | 'security'
  | 'system';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions?: PermissionAction[];
  branchId?: string;
  departmentId?: string;
  isVerified: boolean;
  isActive: boolean;
  isProfileComplete?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PatientRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
}

export interface StaffRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Exclude<UserRole, 'super_admin' | 'admin' | 'patient'>;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface TwoFactorData {
  token: string;
  code: string;
}

export type AvailabilityStatus = 'available' | 'busy' | 'off_duty';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  fee?: number;
  duration?: number;
  category?: string;
  isActive?: boolean;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  department: string;
  departmentId?: string;
  branchId?: string;
  bio?: string;
  gender?: Gender;
  avatar?: string;
  licenseNumber?: string;
  yearsExperience?: number;
  rating?: number;
  reviewCount?: number;
  expertise?: string[];
  services?: ServiceItem[];
  qualifications?: string[];
  certifications?: string[];
  education?: string[];
  languages?: string[];
  consultationFee?: number;
  inPersonConsultation?: boolean;
  videoConsultation?: boolean;
  availabilityStatus: AvailabilityStatus;
  workingDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
  isActive: boolean;
  isProfileComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}
