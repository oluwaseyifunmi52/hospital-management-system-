import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import type { StaffRequest, StaffRequestStatus } from '../../types/staff-request';
import { ROLE_LABELS } from '../../constants/roles';
import { CheckCircle, XCircle, Clock, Eye, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const statusStyles: Record<StaffRequestStatus, { badge: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  pending: { badge: 'badge-warning', icon: Clock, label: 'Pending' },
  approved: { badge: 'badge-success', icon: CheckCircle, label: 'Approved' },
  rejected: { badge: 'badge-danger', icon: XCircle, label: 'Rejected' },
};

export function StaffRequests() {
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StaffRequestStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<StaffRequest | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminService.getStaffRequests({
        status: filter,
        search: searchQuery,
        page,
        limit: 10,
      });
      setRequests(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery, page]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.approveStaffRequest(id);
      toast.success('Staff request approved');
      setSelectedRequest(null);
      loadRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.rejectStaffRequest(id, 'Does not meet requirements');
      toast.success('Staff request rejected');
      setSelectedRequest(null);
      loadRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Requests</h1>
          <p className="page-subtitle">{total} total requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filter === key
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const statusInfo = statusStyles[request.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={request.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-medium">
                          {request.firstName[0]}{request.lastName[0]}
                        </div>
                        <span className="font-medium text-secondary-900">{request.firstName} {request.lastName}</span>
                      </div>
                    </td>
                    <td className="text-secondary-600">{request.email}</td>
                    <td>
                      <span className="badge-secondary">{ROLE_LABELS[request.role]}</span>
                    </td>
                    <td>
                      <span className={`${statusInfo.badge} gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="text-secondary-500">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="btn-ghost btn-sm"
                      >
                        <Eye className="h-4 w-4" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-secondary-500">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline btn-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Staff Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-secondary-400 hover:text-secondary-600">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-medium">
                  {selectedRequest.firstName[0]}{selectedRequest.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-secondary-900">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                  <p className="text-sm text-secondary-500">{ROLE_LABELS[selectedRequest.role]}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-500">Email</p>
                  <p className="text-secondary-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-secondary-500">Phone</p>
                  <p className="text-secondary-900">{selectedRequest.phone}</p>
                </div>
                <div>
                  <p className="text-secondary-500">Submitted</p>
                  <p className="text-secondary-900">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary-500">Status</p>
                  <span className={`${statusStyles[selectedRequest.status].badge} gap-1`}>
                    {statusStyles[selectedRequest.status].label}
                  </span>
                </div>
              </div>
              {selectedRequest.rejectionReason && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                  <p className="text-sm font-medium text-danger-700">Rejection Reason</p>
                  <p className="text-sm text-danger-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-secondary-200">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="btn-primary flex-1"
                    disabled={actionLoading === selectedRequest.id}
                  >
                    {actionLoading === selectedRequest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><CheckCircle className="h-4 w-4" /> Approve</>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="btn-danger flex-1"
                    disabled={actionLoading === selectedRequest.id}
                  >
                    {actionLoading === selectedRequest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><XCircle className="h-4 w-4" /> Reject</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
