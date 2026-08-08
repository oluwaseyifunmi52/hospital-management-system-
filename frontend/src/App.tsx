import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { StaffRegister } from './pages/auth/StaffRegister';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { ProfileSetup } from './pages/doctor/ProfileSetup';
import { Profile as DoctorProfile } from './pages/doctor/Profile';
import { StaffRequests } from './pages/admin/StaffRequests';

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
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/patient" replace />} />

          {/* Patient */}
          <Route
            path="patient/*"
            element={
              <RoleRoute allowedRoles={['patient']}>
                <div className="p-4">Patient Dashboard</div>
              </RoleRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="doctor/*"
            element={
              <RoleRoute allowedRoles={['doctor']}>
                <Routes>
                  <Route index element={<div className="p-4">Doctor Dashboard</div>} />
                  <Route path="profile" element={<DoctorProfile />} />
                  <Route path="profile/setup" element={<ProfileSetup />} />
                </Routes>
              </RoleRoute>
            }
          />

          {/* Admin */}
          <Route
            path="admin/*"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <Routes>
                  <Route index element={<div className="p-4">Admin Dashboard</div>} />
                  <Route path="staff-requests" element={<StaffRequests />} />
                </Routes>
              </RoleRoute>
            }
          />

          {/* Other role dashboards */}
          <Route
            path="nurse/*"
            element={
              <RoleRoute allowedRoles={['nurse']}>
                <div className="p-4">Nurse Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="pharmacy/*"
            element={
              <RoleRoute allowedRoles={['pharmacist']}>
                <div className="p-4">Pharmacist Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="laboratory/*"
            element={
              <RoleRoute allowedRoles={['laboratory']}>
                <div className="p-4">Laboratory Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="radiology/*"
            element={
              <RoleRoute allowedRoles={['radiologist']}>
                <div className="p-4">Radiologist Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="accountant/*"
            element={
              <RoleRoute allowedRoles={['accountant']}>
                <div className="p-4">Accountant Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="ambulance/*"
            element={
              <RoleRoute allowedRoles={['ambulance_driver']}>
                <div className="p-4">Ambulance Driver Dashboard</div>
              </RoleRoute>
            }
          />
          <Route
            path="receptionist/*"
            element={
              <RoleRoute allowedRoles={['receptionist']}>
                <div className="p-4">Receptionist Dashboard</div>
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
