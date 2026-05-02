import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const AdminPending = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await adminAPI.getPendingDoctors();
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await adminAPI.approveDoctor(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    if (!confirm('Reject and remove this doctor application?')) return;
    try {
      await adminAPI.rejectDoctor(id);
      fetch();
    } catch (err) {
      console.error(err);
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
      <h2 className="text-2xl font-bold text-gray-800">Pending Doctor Approvals ({doctors.length})</h2>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((d) => (
            <div key={d._id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">{d.name?.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Dr. {d.name}</h3>
                  <p className="text-sm text-gray-500">{d.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{d.specialization}</p>
                  {d.qualification && <p className="text-xs text-gray-400">{d.qualification}</p>}
                  {d.hospital && <p className="text-xs text-gray-400">{d.hospital}</p>}
                  {d.experience !== undefined && (
                    <p className="text-xs text-gray-400">{d.experience} years experience</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => approve(d._id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(d._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No pending approvals</p>
        </div>
      )}
    </div>
  );
};

export default AdminPending;
