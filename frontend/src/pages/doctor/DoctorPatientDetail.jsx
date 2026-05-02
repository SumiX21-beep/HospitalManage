import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorAPI } from '../../services/api';

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        doctorAPI.getPatient(id),
        doctorAPI.getPatientMedicalRecords(id)
      ]);
      setPatient(pRes.data);
      setRecords(rRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  if (!patient) {
    return <p className="text-gray-500">Patient not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/doctor/patients" className="text-secondary-600 hover:underline text-sm">
          ← Back to Patients
        </Link>
        <Link
          to={`/doctor/add-record?patientId=${patient._id}`}
          className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
        >
          + Add Medical Record
        </Link>
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">{patient.name?.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-500">{patient.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium">{patient.phone || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Blood Group</p>
            <p className="font-medium text-red-600">{patient.bloodGroup || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Gender</p>
            <p className="font-medium">{patient.gender || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">DOB</p>
            <p className="font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        {(patient.allergies?.length > 0 || patient.chronicDiseases?.length > 0) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.allergies?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {patient.chronicDiseases?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Chronic Diseases</p>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicDiseases.map((d, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medical Records */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
        {records.length > 0 ? (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{r.diagnosis || 'General Checkup'}</p>
                    <p className="text-sm text-gray-500">Dr. {r.doctor?.name} ({r.doctor?.specialization})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</p>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs mt-1 inline-block">
                      {r.visitType}
                    </span>
                  </div>
                </div>
                {r.symptoms?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.symptoms.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-gray-600 border rounded text-xs">{s}</span>
                    ))}
                  </div>
                )}
                {r.prescriptions?.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Rx: </span>
                    {r.prescriptions.map((p) => p.medicine).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No medical records yet</p>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetail;
