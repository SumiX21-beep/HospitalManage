import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [healthSummary, setHealthSummary] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, healthRes, appointmentsRes, medicinesRes] = await Promise.all([
        patientAPI.getProfile(),
        patientAPI.getHealthSummary(),
        patientAPI.getAppointments(),
        patientAPI.getMedicines()
      ]);
      setProfile(profileRes.data);
      setHealthSummary(healthRes.data);
      setAppointments(appointmentsRes.data.slice(0, 5));
      setMedicines(medicinesRes.data);
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {profile?.name}!</h2>
        <p className="opacity-90 mt-1">Here's your health overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Medicines</p>
              <p className="text-2xl font-bold text-gray-800">{medicines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="text-2xl font-bold text-gray-800">{profile?.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <p className="text-2xl font-bold text-gray-800">{profile?.allergies?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Health Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Health Analysis
        </h3>
        {healthSummary?.analysis?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthSummary.analysis.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                item.status === 'High' || item.status === 'Low' ? 'bg-red-50 border-red-200' :
                item.status === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{item.metric}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'High' || item.status === 'Low' ? 'bg-red-200 text-red-800' :
                    item.status === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No health data available. Visit a doctor to get analyzed.</p>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {new Date(apt.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dr. {apt.doctor?.name}</p>
                    <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{apt.time}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No appointments scheduled</p>
        )}
      </div>

      {/* Medicine Reminders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medicine Reminders</h3>
        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.slice(0, 4).map((med, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{med.medicine}</span>
                  <span className="text-sm text-gray-500">{med.dosage}</span>
                </div>
                <div className="flex gap-2">
                  {med.frequency?.morning && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Morning</span>
                  )}
                  {med.frequency?.afternoon && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Afternoon</span>
                  )}
                  {med.frequency?.night && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Night</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No prescriptions</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

