import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await doctorAPI.getAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await doctorAPI.updateAppointment(id, { status });
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filter === s ? 'bg-secondary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt._id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-secondary-600 font-semibold">{apt.patient?.name?.charAt(0) || 'P'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{apt.patient?.name}</p>
                    <p className="text-sm text-gray-500">{apt.patient?.email}</p>
                    {apt.patient?.bloodGroup && (
                      <p className="text-xs text-red-600">Blood: {apt.patient.bloodGroup}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{apt.time}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium capitalize ${
                    apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    apt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{apt.status}</span>
                </div>
              </div>
              {apt.reason && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  <span className="font-medium">Reason:</span> {apt.reason}
                </div>
              )}
              {apt.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(apt._id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(apt._id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
              {apt.status === 'approved' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(apt._id, 'completed')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No appointments</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
