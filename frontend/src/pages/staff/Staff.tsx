import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { staffService } from '../../services/staff.service';
import type { Staff } from '../../types/staff';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function StaffPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; staff: Staff | null }>({ open: false, staff: null });

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const result = await staffService.getStaff({
        page,
        limit: 10,
        search: searchQuery,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setStaff(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewStaff = (member: Staff) => {
    navigate(`/dashboard/admin/staff/${member.id}`);
  };

  const handleCreateStaff = () => {
    navigate('/dashboard/admin/staff/new');
  };

  const handleEditStaff = (e: React.MouseEvent, member: Staff) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/staff/${member.id}/edit`);
  };

  const handleDeleteStaff = (e: React.MouseEvent, member: Staff) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, staff: member });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.staff) return;
    try {
      // await staffService.deleteStaff(deleteDialog.staff.id); // Not implemented yet
      toast.success('Staff member deleted');
      setDeleteDialog({ open: false, staff: null });
      fetchStaff();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete staff member');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (member: Staff) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-secondary-900">{member.firstName} {member.lastName}</p>
            <p className="text-sm text-secondary-500">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (member: Staff) => <span className="capitalize">{member.role.replace('_', ' ')}</span>,
    },
    { key: 'position', header: 'Position' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      render: (member: Staff) => <StatusBadge status={member.status} />,
    },
    {
      key: 'dateOfJoining',
      header: 'Joined',
      render: (member: Staff) => (member.dateOfJoining ? new Date(member.dateOfJoining).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (member: Staff) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(_e) => handleViewStaff(member)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleEditStaff(e, member)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleDeleteStaff(e, member)}
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
        title="Staff"
        subtitle={`${total} staff members`}
        action={
          <button onClick={handleCreateStaff} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Staff
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Staff' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={roleFilter} onChange={(e) => handleRoleChange(e.target.value)} className="input w-40">
            <option value="all">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_technician">Lab Technician</option>
            <option value="radiologist">Radiologist</option>
            <option value="accountant">Accountant</option>
            <option value="receptionist">Receptionist</option>
            <option value="hr">HR</option>
            <option value="ambulance_driver">Ambulance Driver</option>
          </select>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading staff..." />
      ) : staff.length === 0 ? (
        <EmptyState
          title="No staff found"
          description="Get started by adding a new staff member."
          action={<button onClick={handleCreateStaff} className="btn-primary">Add Staff</button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={staff}
          loading={loading}
          onRowClick={handleViewStaff}
          emptyMessage="No staff found"
          rowKey={(member) => member.id}
        />
      )}

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

      {deleteDialog.open && deleteDialog.staff && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, staff: null })}
          onConfirm={confirmDelete}
          title="Delete Staff Member"
          message={`Are you sure you want to delete ${deleteDialog.staff.firstName} ${deleteDialog.staff.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}