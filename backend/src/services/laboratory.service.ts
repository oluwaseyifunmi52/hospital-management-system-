import LabTest from '../models/LabTest';
import LabResult from '../models/LabResult';
import MedicalRecord from '../models/MedicalRecord';
import Notification from '../models/Notification';

export class LaboratoryService {
  async requestTest(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    testName: string;
    testType: string;
    priority?: string;
    notes?: string;
  }) {
    const labTest = await LabTest.create({
      patient: data.patientId,
      doctor: data.doctorId,
      appointment: data.appointmentId,
      testName: data.testName,
      testType: data.testType,
      priority: data.priority || 'routine',
      notes: data.notes,
      requestedAt: new Date(),
    });

    return labTest;
  }

  async getTestsByPatient(patientId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = filters;
    const query: any = { patient: patientId };
    if (status && status !== 'all') query.status = status;

    const total = await LabTest.countDocuments(query);
    const tests = await LabTest.find(query)
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: tests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getTestsForLab(filters: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 10 } = filters;
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await LabTest.countDocuments(query);
    const tests = await LabTest.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: tests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async updateTestStatus(id: string, status: string) {
    const test = await LabTest.findById(id);
    if (!test) throw new Error('Lab test not found');

    test.status = status as any;
    if (status === 'sample_collected') test.sampleCollectedAt = new Date();
    if (status === 'completed') test.completedAt = new Date();
    await test.save();

    return test;
  }

  async addResult(data: {
    labTestId: string;
    patientId: string;
    performedBy: string;
    results: Array<{
      parameter: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      isAbnormal: boolean;
    }>;
    conclusion?: string;
  }) {
    const labResult = await LabResult.create({
      labTest: data.labTestId,
      patient: data.patientId,
      performedBy: data.performedBy,
      results: data.results,
      conclusion: data.conclusion,
    });

    await LabTest.findByIdAndUpdate(data.labTestId, { status: 'completed', completedAt: new Date() });

    const test = await LabTest.findById(data.labTestId);
    if (test) {
      await Notification.create({
        user: test.doctor,
        title: 'Lab Result Ready',
        message: `Results for ${test.testName} are ready.`,
        type: 'lab_result',
        link: `/dashboard/laboratory/results/${labResult._id}`,
      });
    }

    return labResult;
  }

  async getResultsByTest(labTestId: string) {
    const result = await LabResult.findOne({ labTest: labTestId })
      .populate('performedBy', 'firstName lastName');
    if (!result) throw new Error('Results not found');
    return result;
  }

  async getResultsByPatient(patientId: string) {
    return LabResult.find({ patient: patientId })
      .populate('labTest', 'testName testType')
      .populate('performedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getStats() {
    const [total, pending, inProgress, completed] = await Promise.all([
      LabTest.countDocuments(),
      LabTest.countDocuments({ status: 'pending' }),
      LabTest.countDocuments({ status: { $in: ['sample_collected', 'in_progress'] } }),
      LabTest.countDocuments({ status: 'completed' }),
    ]);
    return { total, pending, inProgress, completed };
  }
}
