import { useAuth } from '../../hooks/useAuth';
import { Users, UserCheck, Calendar, Activity, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Users', value: '1,234', href: '/dashboard/admin/users', icon: Users },
  { label: 'Staff Requests', value: '12', href: '/dashboard/admin/staff-requests', icon: UserCheck },
  { label: 'Appointments Today', value: '45', href: '/dashboard/admin/appointments', icon: Calendar },
  { label: 'Active Now', value: '89', href: '#', icon: Activity },
];

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.firstName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="card p-6 hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/admin/staff-requests" className="btn-primary">
            Review Staff Requests
          </Link>
          <Link to="/dashboard/admin/appointments" className="btn-outline">
            Manage Appointments
          </Link>
          <Link to="/dashboard/settings" className="btn-outline">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
