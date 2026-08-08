import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  isProfileComplete: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  otp?: string;
  otpExpires?: Date;
  refreshTokens: IRefreshToken[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IRefreshToken {
  token: string;
  expiresAt: Date;
}

export type UserRole = 
  | 'patient' 
  | 'doctor' 
  | 'nurse' 
  | 'receptionist' 
  | 'pharmacist' 
  | 'laboratory' 
  | 'radiologist' 
  | 'accountant' 
  | 'ambulance_driver' 
  | 'admin';

export interface IDoctorProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  yearsExperience: number;
  qualifications: string[];
  certifications: string[];
  expertise: string[];
  languages: string[];
  bio?: string;
  profilePhoto?: string;
  services: IService[];
  consultationFee: number;
  inPersonConsultation: boolean;
  videoConsultation: boolean;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  availabilityStatus: 'available' | 'busy' | 'off_duty';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  name: string;
  description: string;
  fee: number;
  duration: number;
}

export interface IStaffRequest extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  patientId: string;
  bloodGroup?: string;
  genotype?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointment extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  type: 'in_person' | 'video';
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface IMedicalRecord extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  attachments: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttachment {
  name: string;
  url: string;
}

export interface IPrescription extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  medicalRecord?: mongoose.Types.ObjectId;
  medications: IMedication[];
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'lab_result' | 'prescription' | 'payment' | 'emergency' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: UserRole;
  action: string;
  resource: string;
  resourceId: mongoose.Types.ObjectId;
  details?: any;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  createdAt: Date;
}

export interface IDepartment extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  head?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVitalSign extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  recordedBy: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  temperature?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INursingNote extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  nurse: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  content: string;
  category: 'general' | 'medication' | 'assessment' | 'instruction' | 'handover';
  createdAt: Date;
  updatedAt: Date;
}

export interface ILabTest extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  testName: string;
  testType: 'blood' | 'urine' | 'stool' | 'imaging' | 'pathology' | 'other';
  status: 'pending' | 'sample_collected' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  notes?: string;
  requestedAt: Date;
  sampleCollectedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILabResult extends Document {
  _id: mongoose.Types.ObjectId;
  labTest: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  results: Array<{
    parameter: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    isAbnormal: boolean;
  }>;
  conclusion?: string;
  reportUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDrug extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  genericName?: string;
  category: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  sellingPrice: number;
  expiryDate: Date;
  supplier?: string;
  reorderLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPharmacySale extends Document {
  _id: mongoose.Types.ObjectId;
  prescription?: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  pharmacist: mongoose.Types.ObjectId;
  items: Array<{
    drug: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  patient: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  admission?: mongoose.Types.ObjectId;
  items: Array<{
    description: string;
    category: 'consultation' | 'laboratory' | 'pharmacy' | 'admission' | 'procedure' | 'other';
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  dueDate?: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  paymentNumber: string;
  invoice: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'insurance' | 'hmo' | 'online';
  reference?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  processedBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWard extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: 'general' | 'private' | 'icu' | 'maternity' | 'pediatric' | 'emergency' | 'surgical';
  department?: mongoose.Types.ObjectId;
  totalBeds: number;
  occupiedBeds: number;
  nurseInCharge?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBed extends Document {
  _id: mongoose.Types.ObjectId;
  bedNumber: string;
  ward: mongoose.Types.ObjectId;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patient?: mongoose.Types.ObjectId;
  admittedAt?: Date;
  dischargedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmission extends Document {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  ward: mongoose.Types.ObjectId;
  bed: mongoose.Types.ObjectId;
  admissionDate: Date;
  dischargeDate?: Date;
  diagnosis: string;
  reason: string;
  status: 'active' | 'discharged' | 'transferred' | 'cancelled';
  notes?: string;
  dischargeSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}
