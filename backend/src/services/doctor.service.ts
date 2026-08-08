import DoctorProfile from '../models/DoctorProfile';
import User from '../models/User';

export class DoctorService {
  async getProfile(userId: string) {
    const profile = await DoctorProfile.findOne({ user: userId });
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: userId },
      { ...data, user: userId },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, { isProfileComplete: true });

    return profile;
  }

  async updateAvailability(userId: string, status: string) {
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: userId },
      { availabilityStatus: status },
      { new: true }
    );

    if (!profile) {
      throw new Error('Doctor profile not found. Please complete your profile first.');
    }

    return profile;
  }

  async getDoctors(filters: {
    specialty?: string;
    department?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { specialty, department, search, page = 1, limit = 10 } = filters;

    const query: any = {};
    if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };

    const total = await DoctorProfile.countDocuments(query);
    const doctors = await DoctorProfile.find(query)
      .populate('user', 'firstName lastName email phone avatar')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getDoctorById(doctorId: string) {
    const profile = await DoctorProfile.findById(doctorId)
      .populate('user', 'firstName lastName email phone avatar');
    if (!profile) {
      throw new Error('Doctor not found');
    }
    return profile;
  }
}

export const doctorService = new DoctorService();
