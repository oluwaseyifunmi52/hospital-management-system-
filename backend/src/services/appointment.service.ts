import Appointment from '../models/Appointment';
import Patient from '../models/Patient';
import DoctorProfile from '../models/DoctorProfile';
import Notification from '../models/Notification';

export class AppointmentService {
  async create(data: {
    patientId: string;
    doctorId: string;
    date: Date;
    time: string;
    type: 'in_person' | 'video';
    reason?: string;
  }) {
    const doctorProfile = await DoctorProfile.findOne({ user: data.doctorId });
    if (!doctorProfile) {
      throw new Error('Doctor profile not found');
    }

    const appointment = await Appointment.create({
      patient: data.patientId,
      doctor: data.doctorId,
      date: data.date,
      time: data.time,
      type: data.type,
      reason: data.reason,
      consultationFee: doctorProfile.consultationFee,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await Notification.create({
      user: data.doctorId,
      title: 'New Appointment',
      message: `A new appointment has been scheduled.`,
      type: 'appointment',
      link: `/dashboard/appointments/${appointment._id}`,
    });

    return appointment;
  }

  async getById(id: string) {
    const appointment = await Appointment.findById(id)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName email');
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  }

  async getByPatient(patientId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = filters;
    const query: any = { patient: patientId };
    if (status && status !== 'all') query.status = status;

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('doctor', 'firstName lastName email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: appointments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getByDoctor(doctorId: string, filters: { status?: string; date?: string; page?: number; limit?: number }) {
    const { status, date, page = 1, limit = 10 } = filters;
    const query: any = { doctor: doctorId };
    if (status && status !== 'all') query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: appointments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id: string, status: string, userId: string) {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = status as any;
    await appointment.save();

    const notifyUser = appointment.patient.toString() === userId
      ? appointment.doctor
      : appointment.patient;

    await Notification.create({
      user: notifyUser,
      title: 'Appointment Updated',
      message: `Appointment status updated to ${status}.`,
      type: 'appointment',
      link: `/dashboard/appointments/${appointment._id}`,
    });

    return appointment;
  }

  async cancel(id: string, userId: string) {
    return this.updateStatus(id, 'cancelled', userId);
  }

  async getStats(doctorId?: string) {
    const query: any = {};
    if (doctorId) query.doctor = doctorId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, todayCount, pending, completed, cancelled] = await Promise.all([
      Appointment.countDocuments(query),
      Appointment.countDocuments({ ...query, date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ ...query, status: 'pending' }),
      Appointment.countDocuments({ ...query, status: 'completed' }),
      Appointment.countDocuments({ ...query, status: 'cancelled' }),
    ]);

    return { total, today: todayCount, pending, completed, cancelled };
  }
}
