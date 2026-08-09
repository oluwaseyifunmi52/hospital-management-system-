import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bed, Users, Building, Plus, Eye, Home } from 'lucide-react';
import { PageHeader, Tabs } from '../../components/feedback/PageStates';
import type { Tab } from '../../components/feedback/PageStates';
import type { Ward, Room, Bed as BedType } from '../../types/admission';
import { admissionService } from '../../services/admission.service';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { LoadingState, ErrorState } from '../../components/feedback/PageStates';
import { DataTable } from '../../components/data-table/DataTable';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import toast from 'react-hot-toast';

export function WardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ward, setWard] = useState<Ward | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<BedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [availability, setAvailability] = useState<{ totalBeds: number; availableBeds: number; occupiedBeds: number } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: Room | BedType | null; type: 'room' | 'bed' }>({ open: false, item: null, type: 'room' });

  useEffect(() => {
    if (!id) return;
    const fetchWard = async () => {
      try {
        setLoading(true);
        const [wardData, roomsData, bedsData, availData] = await Promise.all([
          admissionService.getWard(id),
          admissionService.getRooms(id),
          admissionService.getBeds(id),
          admissionService.getWardAvailability(id).catch(() => null),
        ]);
        setWard(wardData);
        setRooms(roomsData);
        setBeds(bedsData);
        setAvailability(availData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ward');
      } finally {
        setLoading(false);
      }
    };
    fetchWard();
  }, [id]);

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'beds', label: 'Beds' },
  ];

  if (loading) return <LoadingState message="Loading ward..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!ward) return <ErrorState message="Ward not found" />;

  const roomColumns = [
    { key: 'roomNumber', header: 'Room Number' },
    { key: 'roomType', header: 'Room Type' },
    { key: 'totalBeds', header: 'Total Beds' },
    { key: 'availableBeds', header: 'Available Beds' },
    { key: 'isActive', header: 'Status', render: (room: Room) => <StatusBadge status={room.isActive ? 'active' : 'inactive'} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (room: Room) => {
        const roomId = room.id;
        return (
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); if (roomId) navigate(`/dashboard/admin/rooms/${roomId}`); }} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
              <Eye className="h-4 w-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (roomId) setDeleteDialog({ open: true, item: room, type: 'room' }); }} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
            </button>
          </div>
        );
      },
    },
  ];

  const bedColumns = [
    { key: 'bedNumber', header: 'Bed Number' },
    { key: 'roomId', header: 'Room' },
    {
      key: 'status',
      header: 'Status',
      render: (bed: BedType) => <StatusBadge status={bed.status} />,
    },
    { key: 'patientId', header: 'Patient ID', render: (bed: BedType) => bed.patientId || '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: (bed: BedType) => {
        const bedId = bed.id;
        return (
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); if (bedId) setDeleteDialog({ open: true, item: bed, type: 'bed' }); }} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
            </button>
          </div>
        );
      },
    },
  ];

  const confirmDelete = async () => {
    if (!deleteDialog.item) return;
    try {
      if (deleteDialog.type === 'room') {
        // await admissionService.deleteRoom((deleteDialog.item as Room).id);
      } else {
        // await admissionService.deleteBed((deleteDialog.item as BedType).id);
      }
      toast.success(`${deleteDialog.type === 'room' ? 'Room' : 'Bed'} deleted`);
      setDeleteDialog({ open: false, item: null, type: 'room' });
      // Refresh data
      const wardId = id;
      if (!wardId) return;
      const [roomsData, bedsData, availData] = await Promise.all([
        admissionService.getRooms(wardId),
        admissionService.getBeds(wardId),
        admissionService.getWardAvailability(wardId).catch(() => null),
      ]);
      setRooms(roomsData);
      setBeds(bedsData);
      setAvailability(availData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={ward.name}
        subtitle={`Ward Code: ${ward.code} • Floor: ${ward.floor}`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/dashboard/admin/wards" className="btn-outline btn-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button className="btn-primary btn-sm">Edit Ward</button>
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Wards', href: '/dashboard/admin/wards' }, { label: ward.name }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Ward Info & Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Ward Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-500">Ward Name</span>
                <span className="font-medium text-secondary-900">{ward.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Code</span>
                <span className="font-medium text-secondary-900">{ward.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Floor</span>
                <span className="font-medium text-secondary-900">{ward.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Department</span>
                <span className="font-medium text-secondary-900">{ward.departmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Status</span>
                <span className="font-medium text-secondary-900">
                  <StatusBadge status={ward.isActive ? 'active' : 'inactive'} />
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Capacity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{availability?.totalBeds || ward.totalBeds}</p>
                <p className="text-sm text-secondary-500">Total Beds</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{availability?.availableBeds || ward.availableBeds}</p>
                <p className="text-sm text-secondary-500">Available</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{availability?.occupiedBeds || (ward.totalBeds - ward.availableBeds)}</p>
                <p className="text-sm text-secondary-500">Occupied</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{ward.totalRooms}</p>
                <p className="text-sm text-secondary-500">Total Rooms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <div className="card">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <button className="btn-primary">
                        <Plus className="h-4 w-4" /> Add Room
                      </button>
                      <button className="btn-outline">
                        <Bed className="h-4 w-4" /> Add Bed
                      </button>
                      <button className="btn-outline">
                        <Home className="h-4 w-4" /> View Availability
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-secondary-900">Rooms ({rooms.length})</h4>
                    <button className="btn-primary btn-sm">
                      <Plus className="h-4 w-4" /> Add Room
                    </button>
                  </div>
                  {rooms.length === 0 ? (
                    <div className="text-center py-8 text-secondary-500">No rooms found. Click "Add Room" to create one.</div>
                  ) : (
                    <DataTable
                      columns={roomColumns}
                      data={rooms}
                      loading={false}
                      onRowClick={(room) => { if (room.id) navigate(`/dashboard/admin/rooms/${room.id}`); }}
                      emptyMessage="No rooms found"
                      rowKey={(room) => room.id}
                    />
                  )}
                </div>
              )}

              {activeTab === 'beds' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-secondary-900">Beds ({beds.length})</h4>
                    <button className="btn-primary btn-sm">
                      <Plus className="h-4 w-4" /> Add Bed
                    </button>
                  </div>
                  {beds.length === 0 ? (
                    <div className="text-center py-8 text-secondary-500">No beds found. Click "Add Bed" to create one.</div>
                  ) : (
                    <DataTable
                      columns={bedColumns}
                      data={beds}
                      loading={false}
                      emptyMessage="No beds found"
                      rowKey={(bed) => bed.id}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {deleteDialog.open && deleteDialog.item && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, item: null, type: 'room' })}
          onConfirm={confirmDelete}
          title={`Delete ${deleteDialog.type === 'room' ? 'Room' : 'Bed'}`}
          message={`Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}