import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';

const EmergencyQR = () => {
  const [qrCode, setQrCode] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [qrRes, profileRes] = await Promise.all([
        patientAPI.getEmergencyQR(),
        patientAPI.getProfile()
      ]);
      setQrCode(qrRes.data.qrCode);
      setProfile(profileRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `emergency-qr-${profile?.name}.png`;
    link.click();
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
      <h2 className="text-2xl font-bold text-gray-800">Emergency Health QR Code</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Emergency QR</h3>
          <div className="flex flex-col items-center">
            {qrCode ? (
              <>
                <img src={qrCode} alt="Emergency QR Code" className="w-64 h-64 rounded-lg shadow-md" />
                <button
                  onClick={downloadQR}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </button>
              </>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No QR Code generated</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Info Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-lg">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-medium text-lg text-red-600">{profile?.bloodGroup || 'Not Set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.allergies?.length > 0 ? (
                  profile.allergies.map((allergy, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chronic Diseases</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.chronicDiseases?.length > 0 ? (
                  profile.chronicDiseases.map((disease, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      {disease}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
            {profile?.emergencyContact && (
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="font-medium">{profile.emergencyContact.name}</p>
                <p className="text-gray-600">{profile.emergencyContact.phone}</p>
                <p className="text-sm text-gray-500">{profile.emergencyContact.relation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">How to Use</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Download and save this QR code on your phone</li>
          <li>Print it and keep it in your wallet or purse</li>
          <li>In case of emergency, medical personnel can scan this QR code</li>
          <li>It contains vital information like blood group, allergies, and emergency contact</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyQR;

