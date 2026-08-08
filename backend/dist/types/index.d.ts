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
export type UserRole = 'patient' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'laboratory' | 'radiologist' | 'accountant' | 'ambulance_driver' | 'admin';
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
export type AppointmentStatus = 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
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
//# sourceMappingURL=index.d.ts.map