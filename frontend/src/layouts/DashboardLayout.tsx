import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DASHBOARD_ROUTES, ROLE_LABELS } from '../constants/roles';
import { LayoutDashboard, Users, User, Calendar, FileText, Pill, FlaskConical, Scan, DollarSign, Truck, Settings, Menu, X, UserCheck } from 'lucide-react';
import { useState } from 'react';

const roleNavigation: Record<string, { name: string; href: string; icon: any }[]> = {
  admin: [
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Doctors', href: '/dashboard/admin/doctors', icon: User },
    { name: 'Patients', href: '/dashboard/admin/patients', icon: Users },
    { name: 'Staff Requests', href: '/dashboard/admin/staff-requests', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard/admin/appointments', icon: Calendar },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  doctor: [
    { name: 'My Profile', href: '/dashboard/doctor/profile', icon: User },
    { name: 'My Patients', href: '/dashboard/doctor/patients', icon: Users },
    { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/dashboard/doctor/medical-records', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Pill },
    { name: 'Messages', href: '/dashboard/doctor/messages', icon: Pill },
  ],
  patient: [
    { name: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/dashboard/patient/medical-records', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard/patient/prescriptions', icon: Pill },
    { name: 'Messages', href: '/dashboard/patient/messages', icon: Pill },
  ],
  nurse: [
    { name: 'Assigned Patients', href: '/dashboard/nurse/patients', icon: Users },
    { name: 'Vital Signs', href: '/dashboard/nurse/vitals', icon: Pill },
    { name: 'Medications', href: '/dashboard/nurse/medications', icon: Pill },
  ],
  pharmacist: [
    { name: 'Inventory', href: '/dashboard/pharmacy/inventory', icon: Pill },
    { name: 'Prescriptions', href: '/dashboard/pharmacy/prescriptions', icon: FileText },
    { name: 'Sales', href: '/dashboard/pharmacy/sales', icon: DollarSign },
  ],
  laboratory: [
    { name: 'Test Requests', href: '/dashboard/laboratory/requests', icon: FlaskConical },
    { name: 'Results', href: '/dashboard/laboratory/results', icon: FileText },
  ],
  radiologist: [
    { name: 'Requests', href: '/dashboard/radiology/requests', icon: Scan },
    { name: 'Reports', href: '/dashboard/radiology/reports', icon: FileText },
  ],
  accountant: [
    { name: 'Invoices', href: '/dashboard/accountant/invoices', icon: FileText },
    { name: 'Payments', href: '/dashboard/accountant/payments', icon: DollarSign },
    { name: 'Reports', href: '/dashboard/accountant/reports', icon: FileText },
  ],
  ambulance_driver: [
    { name: 'Emergencies', href: '/dashboard/ambulance/emergencies', icon: Truck },
    { name: 'Active Trips', href: '/dashboard/ambulance/trips', icon: Truck },
  ],
};

export function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleNav = user ? roleNavigation[user.role] || [] : [];
  const dashboardRoute = user ? ROLE_DASHBOARD_ROUTES[user.role] : '/dashboard';

  return (
    <div className="min-h-screen bg-secondary-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-200 lg:justify-center">
          <h1 className="text-xl font-bold text-primary-600">SmartCare</h1>
          <button
            className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink
            to={dashboardRoute}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          {roleNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary-500 capitalize">{ROLE_LABELS[user?.role || 'patient']}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-secondary-200 lg:hidden">
          <div className="flex h-full items-center justify-between px-4">
            <button
              className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-secondary-900">SmartCare</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}