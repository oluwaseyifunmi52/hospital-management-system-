import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { appointmentService } from '../../services/appointment.service';
import type { Appointment, AppointmentStatus } from '../../types/appointment';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Appointments() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; appointment: Appointment | null }>({ open: false, appointment: null });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await appointmentService.getAppointments({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
        date: dateFilter === 'today' ? new Date().toISOString().split('T')[0] : dateFilter === 'all' ? undefined : dateFilter,
      });
      setAppointments(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as AppointmentStatus | 'all');
    setPage(1);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setPage(1);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    navigate(`/dashboard/admin/appointments/${appointment.id}`);
  };

  const handleCreateAppointment = () => {
    navigate('/dashboard/admin/appointments/new');
  };

  const handleEditAppointment = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/appointments/${appointment.id}/edit`);
  };

  const handleDeleteAppointment = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, appointment });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.appointment) return;
    try {
      // await appointmentService.deleteAppointment(deleteDialog.appointment.id); // Not implemented yet
      toast.success('Appointment deleted');
      setDeleteDialog({ open: false, appointment: null });
      fetchAppointments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete appointment');
    }
  };

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

  const stats = useMemo(
    () => ({
      total: total,
      scheduled: appointments.filter((a) => a.status === 'scheduled').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }),
    [appointments, total]
  );

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewAppointment(apt)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleEditAppointment(e, apt)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleDeleteAppointment(e, apt)}
            className="p-1 text-danger-600 hover:text-danger-900"
            title="Delete"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle={`${total} appointments found`}
        action={
          <button onClick={handleCreateAppointment} className="btn-primary">
            <Plus className="h-4 w-4" /> New Appointment
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Appointments' }]}
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
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as AppointmentStatus | 'all')}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select value={dateFilter} onChange={(e) => handleDateChange(e.target.value)} className="input w-40">
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
        loading ? (
          <LoadingState message="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="Get started by creating a new appointment."
            action={<button onClick={handleCreateAppointment} className="btn-primary">Create Appointment</button>}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={appointments}
              loading={loading}
              onRowClick={handleViewAppointment}
              emptyMessage="No appointments found"
              rowKey={(apt) => apt.id}
            />
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-500">
                  Page {page} of {totalPages} ({total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-outline btn-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-outline btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )
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
              const dayAppointments = appointments.filter((apt) => apt.date === day.toISOString().split('T')[0]);
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
                        onClick={() => handleViewAppointment(apt)}
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

      {deleteDialog.open && deleteDialog.appointment && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, appointment: null })}
          onConfirm={confirmDelete}
          title="Delete Appointment"
          message={`Are you sure you want to delete appointment ${deleteDialog.appointment.appointmentNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}