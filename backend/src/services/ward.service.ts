import Ward from '../models/Ward';
import Bed from '../models/Bed';
import Admission from '../models/Admission';
import Patient from '../models/Patient';
import Notification from '../models/Notification';

export class WardService {
  async createWard(data: {
    name: string;
    type: string;
    departmentId?: string;
    totalBeds: number;
    nurseInChargeId?: string;
  }) {
    const ward = await Ward.create({
      name: data.name,
      type: data.type,
      department: data.departmentId,
      totalBeds: data.totalBeds,
      nurseInCharge: data.nurseInChargeId,
    });

    const beds = [];
    for (let i = 1; i <= data.totalBeds; i++) {
      beds.push({
        bedNumber: `${data.name.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
        ward: ward._id,
        status: 'available',
      });
    }
    await Bed.insertMany(beds);

    return ward;
  }

  async getWards() {
    return Ward.find({ isActive: true })
      .populate('department', 'name')
      .populate('nurseInCharge', 'firstName lastName')
      .sort({ name: 1 });
  }

  async getWardById(id: string) {
    const ward = await Ward.findById(id)
      .populate('department', 'name')
      .populate('nurseInCharge', 'firstName lastName');
    if (!ward) throw new Error('Ward not found');

    const beds = await Bed.find({ ward: id })
      .populate('patient', 'firstName lastName patientId');

    return { ward, beds };
  }

  async getBeds(wardId?: string) {
    const query: any = {};
    if (wardId) query.ward = wardId;

    return Bed.find(query)
      .populate('ward', 'name type')
      .populate('patient', 'firstName lastName patientId');
  }

  async admitPatient(data: {
    patientId: string;
    doctorId: string;
    wardId: string;
    bedId: string;
    diagnosis: string;
    reason: string;
    notes?: string;
  }) {
    const bed = await Bed.findById(data.bedId);
    if (!bed) throw new Error('Bed not found');
    if (bed.status !== 'available') throw new Error('Bed is not available');

    const admission = await Admission.create({
      patient: data.patientId,
      doctor: data.doctorId,
      ward: data.wardId,
      bed: data.bedId,
      diagnosis: data.diagnosis,
      reason: data.reason,
      notes: data.notes,
    });

    bed.status = 'occupied';
    bed.patient = data.patientId as any;
    bed.admittedAt = new Date();
    await bed.save();

    const ward = await Ward.findById(data.wardId);
    if (ward) {
      ward.occupiedBeds += 1;
      await ward.save();
    }

    await Notification.create({
      user: data.doctorId,
      title: 'Patient Admitted',
      message: `Patient has been admitted.`,
      type: 'system',
    });

    return admission;
  }

  async dischargePatient(admissionId: string, dischargeSummary?: string) {
    const admission = await Admission.findById(admissionId);
    if (!admission) throw new Error('Admission not found');

    admission.status = 'discharged';
    admission.dischargeDate = new Date();
    admission.dischargeSummary = dischargeSummary;
    await admission.save();

    const bed = await Bed.findById(admission.bed);
    if (bed) {
      bed.status = 'available';
      bed.patient = undefined;
      bed.admittedAt = undefined;
      bed.dischargedAt = new Date();
      await bed.save();
    }

    const ward = await Ward.findById(admission.ward);
    if (ward) {
      ward.occupiedBeds = Math.max(0, ward.occupiedBeds - 1);
      await ward.save();
    }

    return admission;
  }

  async getActiveAdmissions(filters: { wardId?: string; page?: number; limit?: number }) {
    const { wardId, page = 1, limit = 10 } = filters;
    const query: any = { status: 'active' };
    if (wardId) query.ward = wardId;

    const total = await Admission.countDocuments(query);
    const admissions = await Admission.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName')
      .populate('ward', 'name type')
      .populate('bed', 'bedNumber')
      .sort({ admissionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: admissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getPatientAdmissions(patientId: string) {
    return Admission.find({ patient: patientId })
      .populate('doctor', 'firstName lastName')
      .populate('ward', 'name type')
      .populate('bed', 'bedNumber')
      .sort({ admissionDate: -1 });
  }

  async getStats() {
    const [totalWards, totalBeds, occupiedBeds, activeAdmissions] = await Promise.all([
      Ward.countDocuments({ isActive: true }),
      Bed.countDocuments(),
      Bed.countDocuments({ status: 'occupied' }),
      Admission.countDocuments({ status: 'active' }),
    ]);

    return {
      totalWards,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      activeAdmissions,
    };
  }
}
