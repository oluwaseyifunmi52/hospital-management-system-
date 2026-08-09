import { useAuth } from '../../hooks/useAuth';
import { Calendar, FileText, Pill } from 'lucide-react';

const stats = [
  { label: 'Upcoming Appointments', value: '3', icon: Calendar },
  { label: 'Medical Records', value: '12', icon: FileText },
  { label: 'Prescriptions', value: '2', icon: Pill },
];

export function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Patient Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.firstName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
