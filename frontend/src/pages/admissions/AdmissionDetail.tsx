import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, Tabs } from '../../components/feedback/PageStates';
import type { Tab } from '../../components/feedback/PageStates';
import type { Admission, Discharge } from '../../types/admission';
import { admissionService } from '../../services/admission.service';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { LoadingState, ErrorState } from '../../components/feedback/PageStates';

export function AdmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [discharge, setDischarge] = useState<Discharge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    const fetchAdmission = async () => {
      try {
        setLoading(true);
        const [admData, disData] = await Promise.all([
          admissionService.getAdmission(id),
          admissionService.getDischarge(id).catch(() => null),
        ]);
        setAdmission(admData);
        setDischarge(disData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admission');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmission();
  }, [id]);

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'discharge', label: 'Discharge' },
  ];

  if (loading) return <LoadingState message="Loading admission..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!admission) return <ErrorState message="Admission not found" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Admission: ${admission.admissionNumber}`}
        subtitle={`Patient: ${admission.patientId} • Doctor: ${admission.doctorId}`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/dashboard/admin/admissions" className="btn-outline btn-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button className="btn-primary btn-sm">Edit Admission</button>
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Admissions', href: '/dashboard/admin/admissions' }, { label: admission.admissionNumber }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient & Admission Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Admission Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-500">Admission Number</span>
                <span className="font-medium text-secondary-900">{admission.admissionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Patient ID</span>
                <span className="font-medium text-secondary-900">{admission.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Doctor ID</span>
                <span className="font-medium text-secondary-900">{admission.doctorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Admission Date</span>
                <span className="font-medium text-secondary-900">{new Date(admission.admissionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Status</span>
                <span className="font-medium text-secondary-900">
                  <StatusBadge status={admission.status} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Department</span>
                <span className="font-medium text-secondary-900">{admission.departmentId}</span>
              </div>
              {admission.wardId && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Ward</span>
                  <span className="font-medium text-secondary-900">{admission.wardId}</span>
                </div>
              )}
              {admission.roomId && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Room</span>
                  <span className="font-medium text-secondary-900">{admission.roomId}</span>
                </div>
              )}
              {admission.bedId && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Bed</span>
                  <span className="font-medium text-secondary-900">{admission.bedId}</span>
                </div>
              )}
              {admission.reason && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Reason</span>
                  <span className="font-medium text-secondary-900">{admission.reason}</span>
                </div>
              )}
              {admission.diagnosis && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Diagnosis</span>
                  <span className="font-medium text-secondary-900">{admission.diagnosis}</span>
                </div>
              )}
            </div>
          </div>

          {admission.dischargedAt && (
            <div className="card p-6 border-l-4 border-l-green-500 bg-green-50">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-green-800">Discharge Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Discharge Date</span>
                  <span className="font-medium text-secondary-900">{new Date(admission.dischargedAt).toLocaleDateString()}</span>
                </div>
                {discharge && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Discharge Diagnosis</span>
                      <span className="font-medium text-secondary-900">{discharge.diagnosis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Outstanding Amount</span>
                      <span className="font-medium text-secondary-900">₦{discharge.outstandingAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <div className="card">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {admission.notes && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Admission Notes</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{admission.notes}</p>
                    </div>
                  )}
                  {admission.diagnosis && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Initial Diagnosis</h4>
                      <p className="text-secondary-600">{admission.diagnosis}</p>
                    </div>
                  )}
                  {discharge && discharge.treatmentSummary && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Treatment Summary</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{discharge.treatmentSummary}</p>
                    </div>
                  )}
                  {discharge && discharge.followUpInstructions && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Follow-up Instructions</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{discharge.followUpInstructions}</p>
                    </div>
                  )}
                  {discharge && discharge.followUpDate && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Follow-up Date</h4>
                      <p className="text-secondary-600">{new Date(discharge.followUpDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'discharge' && discharge && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Discharge Summary</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Discharge Date</span>
                        <span className="font-medium text-secondary-900">{new Date(discharge.dischargeDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Final Diagnosis</span>
                        <span className="font-medium text-secondary-900">{discharge.diagnosis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Outstanding Amount</span>
                        <span className="font-medium text-secondary-900">₦{discharge.outstandingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {discharge.treatmentSummary && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Treatment Summary</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{discharge.treatmentSummary}</p>
                    </div>
                  )}

                  {discharge.medications && discharge.medications.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Discharge Medications</h4>
                      <div className="space-y-2">
                        {discharge.medications.map((med, i) => (
                          <div key={i} className="card p-4">
                            <p className="text-secondary-900">{med}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {discharge.followUpInstructions && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Follow-up Instructions</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{discharge.followUpInstructions}</p>
                    </div>
                  )}

                  {discharge.followUpDate && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Follow-up Date</h4>
                      <p className="text-secondary-600">{new Date(discharge.followUpDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}