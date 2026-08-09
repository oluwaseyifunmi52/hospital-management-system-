export interface MedicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  doctorId: string;
  departmentId?: string;
  branchId?: string;
  date: string;
  chiefComplaint?: string;
  symptoms?: string[];
  diagnosis?: string[];
  vitalSigns?: VitalSigns;
  treatment?: string;
  clinicalNotes?: string;
  allergies?: string[];
  medications?: Medication[];
  followUpDate?: string;
  followUpNotes?: string;
  attachments?: RecordAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  weight?: string;
  height?: string;
  bmi?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface RecordAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}
