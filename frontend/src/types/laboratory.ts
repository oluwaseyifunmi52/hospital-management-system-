import type { LabTestStatus } from './common';

export interface LabTest {
  id: string;
  testNumber: string;
  patientId: string;
  doctorId: string;
  testType: string;
  category: string;
  branchId?: string;
  requestedAt: string;
  sampleCollectedAt?: string;
  status: LabTestStatus;
  results?: string;
  reportFile?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LabResult {
  id: string;
  testId: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  notes?: string;
}

export interface RadiologyExam {
  id: string;
  examNumber: string;
  patientId: string;
  doctorId: string;
  radiologistId?: string;
  examType: string;
  bodyPart: string;
  branchId?: string;
  requestedAt: string;
  scheduledAt?: string;
  performedAt?: string;
  status: 'pending' | 'scheduled' | 'processing' | 'completed' | 'reviewed';
  findings?: string;
  reportFile?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
