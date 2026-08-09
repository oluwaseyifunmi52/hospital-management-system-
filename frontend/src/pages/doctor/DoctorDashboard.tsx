import { useAuth } from '../../hooks/useAuth';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: "Today's Appointments", value: '8', href: '/dashboard/doctor/appointments', icon: Calendar },
  { label: 'My Patients', value: '124', href: '/dashboard/doctor/patients', icon: Users },
  { label: 'Medical Records', value: '56', href: '/dashboard/doctor/medical-records', icon: FileText },
  { label: 'Pending Reviews', value: '3', href: '#', icon: Clock },
];

export function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="page-subtitle">Welcome back, Dr. {user?.lastName}</p>
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
    </div>
  );
}
