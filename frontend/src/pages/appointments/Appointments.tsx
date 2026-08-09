import { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { Appointment, AppointmentStatus } from '../../types/appointment';

interface AppointmentsProps {
  onCreateAppointment: () => void;
  onViewAppointment: (appointment: Appointment) => void;
}

export function Appointments({ onCreateAppointment, onViewAppointment }: AppointmentsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [loading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const mockAppointments = useMemo<Appointment[]>(
    () => [
      { id: '1', appointmentNumber: 'APT-001', patientId: '1', doctorId: '1', date: '2024-06-15', startTime: '09:00', endTime: '09:30', type: 'consultation', status: 'scheduled', reason: 'Routine checkup', reminderSent: false, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
      { id: '2', appointmentNumber: 'APT-002', patientId: '2', doctorId: '1', date: '2024-06-15', startTime: '10:00', endTime: '10:30', type: 'follow_up', status: 'confirmed', reason: 'Follow-up visit', reminderSent: true, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
      { id: '3', appointmentNumber: 'APT-003', patientId: '3', doctorId: '2', date: '2024-06-15', startTime: '11:00', endTime: '11:30', type: 'consultation', status: 'completed', reason: 'New patient consultation', reminderSent: true, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
      { id: '4', appointmentNumber: 'APT-004', patientId: '4', doctorId: '2', date: '2024-06-15', startTime: '14:00', endTime: '14:30', type: 'emergency', status: 'cancelled', reason: 'Emergency visit', reminderSent: false, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
      { id: '5', appointmentNumber: 'APT-005', patientId: '5', doctorId: '3', date: '2024-06-16', startTime: '09:30', endTime: '10:00', type: 'checkup', status: 'scheduled', reason: 'Annual checkup', reminderSent: false, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
    ],
    []
  );

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = dateFilter === 'all' || apt.date === new Date().toISOString().split('T')[0];
    const matchesSearch =
      !searchQuery ||
      apt.appointmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientId.includes(searchQuery) ||
      apt.doctorId.includes(searchQuery);
    return matchesStatus && matchesDate && matchesSearch;
  });

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeek]);

  const columns = [
    {
      key: 'appointmentNumber',
      header: 'Appointment ID',
      sortable: true,
      render: (apt: Appointment) => <span className="font-medium text-primary-600">{apt.appointmentNumber}</span>,
    },
    { key: 'patientId', header: 'Patient ID' },
    { key: 'doctorId', header: 'Doctor' },
    { key: 'date', header: 'Date', render: (apt: Appointment) => new Date(apt.date).toLocaleDateString() },
    { key: 'startTime', header: 'Time', render: (apt: Appointment) => `${apt.startTime} - ${apt.endTime}` },
    {
      key: 'status',
      header: 'Status',
      render: (apt: Appointment) => <StatusBadge status={apt.status} />,
    },
    { key: 'type', header: 'Type' },
    {
      key: 'actions',
      header: 'Actions',
      render: (apt: Appointment) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewAppointment(apt);
          }}
          className="text-secondary-600 hover:text-secondary-900 text-sm font-medium"
        >
          View
        </button>
      ),
    },
  ];

  const stats = useMemo(
    () => ({
      total: mockAppointments.length,
      scheduled: mockAppointments.filter((a) => a.status === 'scheduled').length,
      confirmed: mockAppointments.filter((a) => a.status === 'confirmed').length,
      completed: mockAppointments.filter((a) => a.status === 'completed').length,
      cancelled: mockAppointments.filter((a) => a.status === 'cancelled').length,
    }),
    [mockAppointments]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle={`${filteredAppointments.length} appointments found`}
        action={
          <button onClick={onCreateAppointment} className="btn-primary">
            <Plus className="h-4 w-4" /> New Appointment
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Appointments' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-secondary-50 text-secondary-700' },
          { label: 'Scheduled', value: stats.scheduled, color: 'bg-blue-50 text-blue-700' },
          { label: 'Confirmed', value: stats.confirmed, color: 'bg-primary-50 text-primary-700' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700' },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 text-red-700' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block mt-1 ${stat.color}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input w-40">
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="all">All</option>
          </select>
          <div className="flex rounded-lg border border-secondary-300 overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-2 text-sm ${view === 'calendar' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          loading={loading}
          onRowClick={onViewAppointment}
          emptyMessage="No appointments found"
          rowKey={(apt) => apt.id}
        />
      ) : (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} -{' '}
              {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))} className="btn-outline btn-sm">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setCurrentWeek(new Date())} className="btn-outline btn-sm">
                Today
              </button>
              <button onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))} className="btn-outline btn-sm">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayAppointments = filteredAppointments.filter((apt) => apt.date === day.toISOString().split('T')[0]);
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={day.toISOString()} className={`min-h-[200px] p-2 rounded-lg border ${isToday ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                  <div className="text-center mb-2">
                    <p className="text-xs text-secondary-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className={`text-lg font-semibold ${isToday ? 'text-primary-600' : 'text-secondary-900'}`}>{day.getDate()}</p>
                  </div>
                  <div className="space-y-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => onViewAppointment(apt)}
                        className="p-2 rounded-lg bg-white border border-secondary-200 cursor-pointer hover:shadow-sm transition-shadow"
                      >
                        <p className="text-xs font-medium text-secondary-900">{apt.startTime}</p>
                        <p className="text-xs text-secondary-600 truncate">{apt.appointmentNumber}</p>
                        <StatusBadge status={apt.status} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
