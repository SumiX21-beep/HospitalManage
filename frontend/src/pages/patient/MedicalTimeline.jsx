import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';

const MedicalTimeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await patientAPI.getTimeline();
      setTimeline(response.data);
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
      <h2 className="text-2xl font-bold text-gray-800">Medical History Timeline</h2>

      {timeline.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="relative">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="bg-gray-50 rounded-lg p-4 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                        item.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                        item.type === 'Follow-up' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.type}
                      </span>
                      <h3 className="font-semibold text-gray-800">{item.diagnosis || 'General Checkup'}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Doctor:</span> Dr. {item.doctor} ({item.doctorSpecialization})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">{item.year}</p>
                    </div>
                  </div>

                  {item.prescriptions?.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Prescriptions:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.prescriptions.map((pres, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            {pres.medicine} - {pres.dosage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.reports?.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Reports:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.reports.map((report, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {report.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No medical history yet</p>
        </div>
      )}
    </div>
  );
};

export default MedicalTimeline;

