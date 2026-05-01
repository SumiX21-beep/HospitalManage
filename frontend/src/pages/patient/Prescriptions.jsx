import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';

const Prescriptions = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await patientAPI.getMedicines();
      setMedicines(response.data);
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
      <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>

      {medicines.length > 0 ? (
        <div className="grid gap-4">
          {medicines.map((med, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{med.medicine}</h3>
                  <p className="text-gray-500">{med.dosage}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Prescribed by</p>
                  <p className="font-medium">Dr. {med.doctor}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Schedule:</p>
                <div className="flex gap-3">
                  {med.frequency?.morning && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-600">🌅</span>
                      <span className="text-sm text-yellow-800">Morning</span>
                    </div>
                  )}
                  {med.frequency?.afternoon && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                      <span className="text-orange-600">☀️</span>
                      <span className="text-sm text-orange-800">Afternoon</span>
                    </div>
                  )}
                  {med.frequency?.night && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">🌙</span>
                      <span className="text-sm text-blue-800">Night</span>
                    </div>
                  )}
                </div>
              </div>

              {med.duration && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {med.duration}
                  </p>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-400">
                Prescribed on: {new Date(med.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p className="text-gray-500">No prescriptions yet</p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;

