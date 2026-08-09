export type { AvailabilityStatus, ServiceItem } from './common';

export type { DoctorProfile } from './common';

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
