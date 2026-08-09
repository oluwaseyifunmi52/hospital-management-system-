import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { StaffRegister } from './pages/auth/StaffRegister';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { ProfileSetup } from './pages/doctor/ProfileSetup';
import { Profile as DoctorProfile } from './pages/doctor/Profile';
import { StaffRequests } from './pages/admin/StaffRequests';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { Settings } from './pages/settings/Settings';
import { Patients } from './pages/patients/Patients';
import { PatientDetail } from './pages/patients/PatientDetail';
import { PatientFormPage } from './pages/patients/PatientFormPage';
import { Appointments } from './pages/appointments/Appointments';
import { Doctors } from './pages/doctors/Doctors';
import { StaffPage } from './pages/staff/Staff';
import { Pharmacy } from './pages/pharmacy/Pharmacy';
import { Laboratory } from './pages/laboratory/Laboratory';
import { Billing } from './pages/billing/Billing';
import { MedicalRecords } from './pages/medical-records/MedicalRecords';
import { MedicalRecordDetail } from './pages/medical-records/MedicalRecordDetail';
import { Admissions } from './pages/admissions/Admissions';
import { AdmissionDetail } from './pages/admissions/AdmissionDetail';
import { Wards } from './pages/wards/Wards';
import { WardDetail } from './pages/wards/WardDetail';

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/staff-register" element={<StaffRegister />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/admin" replace />} />

          {/* Admin */}
          <Route
            path="admin/*"
            element={
              <RoleRoute allowedRoles={['admin', 'super_admin']}>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="staff-requests" element={<StaffRequests />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="patients/:id" element={<PatientDetail />} />
                  <Route path="patients/new" element={<PatientFormPage />} />
                  <Route path="doctors" element={<Doctors />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="pharmacy" element={<Pharmacy />} />
                  <Route path="laboratory" element={<Laboratory />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="medical-records" element={<MedicalRecords />} />
                  <Route path="medical-records/:id" element={<MedicalRecordDetail />} />
                  <Route path="admissions" element={<Admissions />} />
                  <Route path="admissions/:id" element={<AdmissionDetail />} />
                  <Route path="wards" element={<Wards />} />
                  <Route path="wards/:id" element={<WardDetail />} />
                </Routes>
              </RoleRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="doctor/*"
            element={
              <RoleRoute allowedRoles={['doctor']}>
                <Routes>
                  <Route index element={<DoctorDashboard />} />
                  <Route path="profile" element={<DoctorProfile />} />
                  <Route path="profile/setup" element={<ProfileSetup />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="medical-records" element={<MedicalRecords />} />
                  <Route path="medical-records/:id" element={<MedicalRecordDetail />} />
                </Routes>
              </RoleRoute>
            }
          />

          {/* Patient */}
          <Route
            path="patient/*"
            element={
              <RoleRoute allowedRoles={['patient']}>
                <Routes>
                  <Route index element={<PatientDashboard />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="records" element={<PatientDetail />} />
                </Routes>
              </RoleRoute>
            }
          />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* Nurse */}
          <Route
            path="nurse/*"
            element={
              <RoleRoute allowedRoles={['nurse']}>
                <div className="p-4">Nurse Dashboard</div>
              </RoleRoute>
            }
          />

          {/* Pharmacy */}
          <Route
            path="pharmacy/*"
            element={
              <RoleRoute allowedRoles={['pharmacist']}>
                <Pharmacy />
              </RoleRoute>
            }
          />

          {/* Laboratory */}
          <Route
            path="laboratory/*"
            element={
              <RoleRoute allowedRoles={['lab_technician']}>
                <Laboratory />
              </RoleRoute>
            }
          />

          {/* Radiology */}
          <Route
            path="radiology/*"
            element={
              <RoleRoute allowedRoles={['radiologist']}>
                <div className="p-4">Radiologist Dashboard</div>
              </RoleRoute>
            }
          />

          {/* Accountant */}
          <Route
            path="accountant/*"
            element={
              <RoleRoute allowedRoles={['accountant']}>
                <Billing />
              </RoleRoute>
            }
          />

          {/* Ambulance */}
          <Route
            path="ambulance/*"
            element={
              <RoleRoute allowedRoles={['ambulance_driver']}>
                <div className="p-4">Ambulance Driver Dashboard</div>
              </RoleRoute>
            }
          />

          {/* Receptionist */}
          <Route
            path="receptionist/*"
            element={
              <RoleRoute allowedRoles={['receptionist']}>
                <Appointments />
              </RoleRoute>
            }
          />

          {/* HR */}
          <Route
            path="hr/*"
            element={
              <RoleRoute allowedRoles={['hr']}>
                <div className="p-4">HR Dashboard</div>
              </RoleRoute>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
