import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await adminAPI.getAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">All Appointments ({appointments.length})</h2>

      {appointments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Patient</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Doctor</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Reason</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{a.patient?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">Dr. {a.doctor?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{a.reason || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      a.status === 'approved' ? 'bg-green-100 text-green-800' :
                      a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      a.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      a.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No appointments yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
