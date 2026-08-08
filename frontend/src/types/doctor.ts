export type AvailabilityStatus = 'available' | 'busy' | 'off_duty';

export interface DoctorProfile {
  userId: string;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  title: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  yearsExperience: number;
  qualifications: string[];
  certifications: string[];
  expertise: string[];
  languages: string[];
  bio: string;
  services: ServiceItem[];
  consultationFee: number;
  inPersonConsultation: boolean;
  videoConsultation: boolean;
  workingDays: string[];
  workingHours: { start: string; end: string };
  availabilityStatus: AvailabilityStatus;
  rating: number;
  reviewCount: number;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  fee: number;
  duration?: number;
}

export const DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'ENT',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
] as const;

export const MEDICAL_TITLES = [
  'Dr.',
  'Prof.',
  'Assoc. Prof.',
  'Sr. Dr.',
  'Fr. Dr.',
] as const;

export const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'Arabic',
  'Hindi',
  'Mandarin',
  'Portuguese',
  'Bengali',
  'Russian',
  'Japanese',
  'German',
  'Yoruba',
  'Igbo',
  'Hausa',
] as const;

export const WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
