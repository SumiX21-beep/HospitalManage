import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await adminAPI.getPatients();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this patient? This cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id, 'patient');
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
      <h2 className="text-2xl font-bold text-gray-800">All Patients ({patients.length})</h2>

      {patients.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Blood</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Gender</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-sm font-semibold">{p.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.phone || '-'}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">{p.bloodGroup || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.gender || '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(p._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No patients yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminPatients;
