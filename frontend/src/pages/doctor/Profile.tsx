import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../../services/doctor.service';
import type { DoctorProfile, AvailabilityStatus } from '../../types/doctor';
import {
  Star, Clock, MapPin, Languages, Award, Stethoscope,
  Video, Building2, BadgeCheck, Phone, MessageCircle,
  Calendar, Edit, CircleDot, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig: Record<AvailabilityStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'Available for consultation', color: 'text-green-700 bg-green-50 border-green-200', dot: 'bg-green-500' },
  busy: { label: 'Currently with a patient', color: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' },
  off_duty: { label: 'Off duty', color: 'text-secondary-700 bg-secondary-50 border-secondary-200', dot: 'bg-secondary-400' },
};

export function Profile() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const data = await doctorService.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleStatusChange = async (status: AvailabilityStatus) => {
    try {
      const updated = await doctorService.updateAvailability(status);
      setProfile(updated);
      toast.success('Status updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-secondary-500 mb-4">You haven&apos;t set up your profile yet.</p>
        <a href="/dashboard/doctor/profile/setup" className="btn-primary">Set Up Profile</a>
      </div>
    );
  }

  const status = statusConfig[profile.availabilityStatus];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">My Profile</h1>
        <a href="/dashboard/doctor/profile/setup" className="btn-outline">
          <Edit className="h-4 w-4" /> Edit Profile
        </a>
      </div>

      {/* Header Card */}
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 -mt-12">
            <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-primary-700 text-3xl font-bold">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    {profile.title} {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-secondary-500">{profile.specialty}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${status.color}`}>
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  {status.label}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-secondary-600">
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {profile.department}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> {profile.rating} ({profile.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {profile.yearsExperience} years experience</span>
                <span className="flex items-center gap-1"><BadgeCheck className="h-4 w-4" /> License: {profile.licenseNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">About</h3>
            <p className="text-secondary-600 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Expertise */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.expertise ?? []).map((item) => (
                <span key={item} className="badge-primary">{item}</span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Services</h3>
            <div className="space-y-3">
              {(profile.services ?? []).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      {service.name.includes('Video') ? (
                        <Video className="h-5 w-5 text-primary-600" />
                      ) : (
                        <Stethoscope className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{service.name}</p>
                      <p className="text-xs text-secondary-500">{service.duration} min</p>
                    </div>
                  </div>
                  <p className="font-semibold text-secondary-900">${service.fee}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Qualifications</h3>
            <div className="space-y-2">
              {(profile.qualifications ?? []).map((q) => (
                <div key={q} className="flex items-center gap-2 text-secondary-600">
                  <div className="h-2 w-2 rounded-full bg-primary-500" />
                  {q}
                </div>
              ))}
            </div>
            {(profile.certifications?.length ?? 0) > 0 && (
              <>
                <h4 className="text-sm font-semibold text-secondary-700 mt-4 mb-2">Certifications</h4>
                <div className="space-y-2">
                  {(profile.certifications ?? []).map((c) => (
                    <div key={c} className="flex items-center gap-2 text-secondary-600">
                      <Award className="h-4 w-4 text-primary-500" />
                      {c}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Availability */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Availability</h3>
            <div className="space-y-2 mb-4">
              {(['available', 'busy', 'off_duty'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    profile.availabilityStatus === s
                      ? `${statusConfig[s].color} border-current`
                      : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${statusConfig[s].dot}`} />
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <CircleDot className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-secondary-700">
                {(profile.workingDays ?? []).map(d => d.slice(0, 3)).join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-secondary-700">
                {profile.workingHours?.start} - {profile.workingHours?.end}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-secondary-700">{(profile.languages ?? []).join(', ')}</span>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <Phone className="h-4 w-4" /> {profile.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <MapPin className="h-4 w-4" /> {profile.department} Department
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                <Calendar className="h-4 w-4" /> Book Appointment
              </button>
              <button className="btn-outline w-full">
                <MessageCircle className="h-4 w-4" /> Chat
              </button>
              <button className="btn-outline w-full">
                <Video className="h-4 w-4" /> Video Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
