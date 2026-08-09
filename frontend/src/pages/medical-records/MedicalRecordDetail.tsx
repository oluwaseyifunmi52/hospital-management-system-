import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { PageHeader, Tabs } from '../../components/feedback/PageStates';
import type { Tab } from '../../components/feedback/PageStates';
import type { MedicalRecord } from '../../types/medical-record';
import { medicalRecordService } from '../../services/medical-record.service';
import { LoadingState, ErrorState } from '../../components/feedback/PageStates';

export function MedicalRecordDetail() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordService.getMedicalRecord(id);
        setRecord(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load medical record');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'vitals', label: 'Vital Signs' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'treatment', label: 'Treatment' },
    { id: 'medications', label: 'Medications' },
    { id: 'attachments', label: 'Attachments' },
  ];

  if (loading) return <LoadingState message="Loading medical record..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!record) return <ErrorState message="Medical record not found" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Medical Record: ${record.recordNumber}`}
        subtitle={`Patient: ${record.patientId} • Doctor: ${record.doctorId}`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/dashboard/admin/medical-records" className="btn-outline btn-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button className="btn-primary btn-sm">Edit Record</button>
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Medical Records', href: '/dashboard/admin/medical-records' }, { label: record.recordNumber }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Record Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-500">Record Number</span>
                <span className="font-medium text-secondary-900">{record.recordNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Date</span>
                <span className="font-medium text-secondary-900">{new Date(record.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Patient ID</span>
                <span className="font-medium text-secondary-900">{record.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Doctor ID</span>
                <span className="font-medium text-secondary-900">{record.doctorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Department</span>
                <span className="font-medium text-secondary-900">{record.departmentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Created</span>
                <span className="font-medium text-secondary-900">{new Date(record.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Updated</span>
                <span className="font-medium text-secondary-900">{new Date(record.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {record.chiefComplaint && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Chief Complaint</h3>
              <p className="text-secondary-600">{record.chiefComplaint}</p>
            </div>
          )}

          {record.symptoms && record.symptoms.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((symptom) => (
                  <span key={symptom} className="badge-primary">{symptom}</span>
                ))}
              </div>
            </div>
          )}

          {record.allergies && record.allergies.length > 0 && (
            <div className="card p-6 border-l-4 border-l-danger-500 bg-danger-50">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-danger-800">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {record.allergies.map((allergy) => (
                  <span key={allergy} className="badge-danger">{allergy}</span>
                ))}
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
                  {record.clinicalNotes && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Clinical Notes</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{record.clinicalNotes}</p>
                    </div>
                  )}
                  {record.treatment && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Treatment</h4>
                      <p className="text-secondary-600 whitespace-pre-wrap">{record.treatment}</p>
                    </div>
                  )}
                  {record.followUpDate && (
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 mb-4">Follow-up</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary-600" />
                          <span className="font-medium text-secondary-900">{new Date(record.followUpDate).toLocaleDateString()}</span>
                        </div>
                        {record.followUpNotes && (
                          <div className="flex-1">
                            <p className="text-sm text-secondary-500">Notes:</p>
                            <p className="text-secondary-600">{record.followUpNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'vitals' && record.vitalSigns && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Vital Signs</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {record.vitalSigns.temperature && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Temperature</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.temperature}</p></div>
                    )}
                    {record.vitalSigns.bloodPressure && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Blood Pressure</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.bloodPressure}</p></div>
                    )}
                    {record.vitalSigns.heartRate && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Heart Rate</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.heartRate}</p></div>
                    )}
                    {record.vitalSigns.respiratoryRate && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Resp. Rate</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.respiratoryRate}</p></div>
                    )}
                    {record.vitalSigns.oxygenSaturation && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">O2 Saturation</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.oxygenSaturation}</p></div>
                    )}
                    {record.vitalSigns.weight && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Weight</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.weight}</p></div>
                    )}
                    {record.vitalSigns.height && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">Height</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.height}</p></div>
                    )}
                    {record.vitalSigns.bmi && (
                      <div className="card p-4"><p className="text-sm text-secondary-500">BMI</p><p className="text-2xl font-bold text-secondary-900">{record.vitalSigns.bmi}</p></div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'diagnosis' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Diagnosis</h4>
                  {record.diagnosis && record.diagnosis.length > 0 ? (
                    <div className="space-y-2">
                      {record.diagnosis.map((diag, i) => (
                        <div key={i} className="card p-4">
                          <p className="text-secondary-900">{diag}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500">No diagnosis recorded.</p>
                  )}
                </div>
              )}

              {activeTab === 'treatment' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Treatment Plan</h4>
                  {record.treatment ? (
                    <p className="text-secondary-600 whitespace-pre-wrap">{record.treatment}</p>
                  ) : (
                    <p className="text-secondary-500">No treatment plan recorded.</p>
                  )}
                </div>
              )}

              {activeTab === 'medications' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Medications</h4>
                  {record.medications && record.medications.length > 0 ? (
                    <div className="space-y-3">
                      {record.medications.map((med, i) => (
                        <div key={i} className="card p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium text-secondary-900">{med.name}</p>
                              <p className="text-sm text-secondary-500">{med.dosage} • {med.frequency} • {med.duration}</p>
                            </div>
                            {med.instructions && (
                              <p className="text-sm text-secondary-600">{med.instructions}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500">No medications prescribed.</p>
                  )}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Attachments</h4>
                  {record.attachments && record.attachments.length > 0 ? (
                    <div className="space-y-3">
                      {record.attachments.map((att) => (
                        <div key={att.id} className="flex items-center justify-between p-3 rounded-lg border border-secondary-200">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-secondary-400" />
                            <div>
                              <p className="font-medium text-secondary-900">{att.name}</p>
                              <p className="text-sm text-secondary-500">{att.type} • {new Date(att.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">View</a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500">No attachments.</p>
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