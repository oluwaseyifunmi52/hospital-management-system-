import MedicalRecord from '../models/MedicalRecord';
import Prescription from '../models/Prescription';

export class MedicalRecordService {
  async create(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    diagnosis: string;
    symptoms: string[];
    notes: string;
    attachments?: Array<{ name: string; url: string }>;
  }) {
    return MedicalRecord.create({
      patient: data.patientId,
      doctor: data.doctorId,
      appointment: data.appointmentId,
      diagnosis: data.diagnosis,
      symptoms: data.symptoms,
      notes: data.notes,
      attachments: data.attachments || [],
    });
  }

  async getByPatient(patientId: string, page: number = 1, limit: number = 20) {
    const query = { patient: patientId };
    const total = await MedicalRecord.countDocuments(query);
    const records = await MedicalRecord.find(query)
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: records,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getById(id: string) {
    const record = await MedicalRecord.findById(id)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName');
    if (!record) throw new Error('Medical record not found');
    return record;
  }

  async update(id: string, data: Partial<typeof MedicalRecord.prototype>) {
    const record = await MedicalRecord.findByIdAndUpdate(id, data, { new: true });
    if (!record) throw new Error('Medical record not found');
    return record;
  }

  async createPrescription(data: {
    patientId: string;
    doctorId: string;
    medicalRecordId?: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    notes: string;
  }) {
    return Prescription.create({
      patient: data.patientId,
      doctor: data.doctorId,
      medicalRecord: data.medicalRecordId,
      medications: data.medications,
      notes: data.notes,
      status: 'active',
    });
  }

  async getPrescriptionsByPatient(patientId: string) {
    return Prescription.find({ patient: patientId })
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getPrescriptionById(id: string) {
    const prescription = await Prescription.findById(id)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName');
    if (!prescription) throw new Error('Prescription not found');
    return prescription;
  }

  async getStats(doctorId?: string) {
    const query: any = {};
    if (doctorId) query.doctor = doctorId;

    const [totalRecords, totalPrescriptions] = await Promise.all([
      MedicalRecord.countDocuments(query),
      Prescription.countDocuments(query),
    ]);

    return { totalRecords, totalPrescriptions };
  }
}
