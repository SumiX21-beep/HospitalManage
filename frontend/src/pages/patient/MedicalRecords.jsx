import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await patientAPI.getMedicalRecords();
      setRecords(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>

      {records.length > 0 ? (
        <div className="grid gap-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-xl shadow-sm border p-5 cursor-pointer card-hover"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{record.diagnosis || 'General Checkup'}</h3>
                  <p className="text-sm text-gray-500 mt-1">Dr. {record.doctor?.name}</p>
                  <p className="text-xs text-gray-400">{record.doctor?.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                    record.visitType === 'Emergency' ? 'bg-red-100 text-red-800' :
                    record.visitType === 'Follow-up' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {record.visitType}
                  </span>
                </div>
              </div>

              {record.symptoms?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {record.symptoms.map((symptom, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {symptom}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No medical records found</p>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Medical Record Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">Dr. {selectedRecord.doctor?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium">{selectedRecord.doctor?.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit Type</p>
                  <p className="font-medium">{selectedRecord.visitType}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
                <p className="font-medium">{selectedRecord.diagnosis || 'N/A'}</p>
              </div>

              {selectedRecord.symptoms?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.vitalSigns && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Vital Signs</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedRecord.vitalSigns.bloodPressure && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-semibold">{selectedRecord.vitalSigns.bloodPressure.systolic}/{selectedRecord.vitalSigns.bloodPressure.diastolic}</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.bloodSugar && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Blood Sugar</p>
                        <p className="font-semibold">{selectedRecord.vitalSigns.bloodSugar} mg/dL</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.heartRate && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="font-semibold">{selectedRecord.vitalSigns.heartRate} bpm</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.temperature && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-semibold">{selectedRecord.vitalSigns.temperature}°F</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.cholesterol && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Cholesterol</p>
                        <p className="font-semibold">{selectedRecord.vitalSigns.cholesterol} mg/dL</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRecord.prescriptions?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Prescriptions</p>
                  <div className="space-y-2">
                    {selectedRecord.prescriptions.map((pres, idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{pres.medicine}</p>
                          <span className="text-sm text-gray-600">{pres.dosage}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {pres.frequency?.morning && <span className="text-xs bg-yellow-100 px-2 py-1 rounded">Morning</span>}
                          {pres.frequency?.afternoon && <span className="text-xs bg-orange-100 px-2 py-1 rounded">Afternoon</span>}
                          {pres.frequency?.night && <span className="text-xs bg-blue-100 px-2 py-1 rounded">Night</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;

