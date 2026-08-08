import VitalSign from '../models/VitalSign';
import NursingNote from '../models/NursingNote';

export class NursingService {
  async recordVitals(data: {
    patientId: string;
    recordedBy: string;
    appointmentId?: string;
    temperature?: number;
    heartRate?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    notes?: string;
  }) {
    return VitalSign.create(data);
  }

  async getVitalsByPatient(patientId: string, limit: number = 50) {
    return VitalSign.find({ patient: patientId })
      .populate('recordedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async addNursingNote(data: {
    patientId: string;
    nurseId: string;
    appointmentId?: string;
    content: string;
    category?: string;
  }) {
    return NursingNote.create({
      patient: data.patientId,
      nurse: data.nurseId,
      appointment: data.appointmentId,
      content: data.content,
      category: data.category || 'general',
    });
  }

  async getNursingNotesByPatient(patientId: string, limit: number = 50) {
    return NursingNote.find({ patient: patientId })
      .populate('nurse', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getAssignedPatients(nurseId: string) {
    const notes = await NursingNote.distinct('patient', { nurse: nurseId });
    return VitalSign.find({ patient: { $in: notes } })
      .populate('patient', 'firstName lastName patientId')
      .sort({ createdAt: -1 });
  }
}
