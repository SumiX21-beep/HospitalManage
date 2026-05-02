import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctorAPI } from '../../services/api';

const DoctorAddRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPatient = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    patientId: prefilledPatient,
    visitType: 'General',
    diagnosis: '',
    symptoms: '',
    notes: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    bloodSugar: '',
    cholesterol: '',
    weight: '',
    height: '',
    medicine: '',
    dosage: '',
    morning: false,
    afternoon: false,
    night: false,
    duration: ''
  });

  useEffect(() => {
    doctorAPI.getPatients().then((r) => setPatients(r.data)).catch(console.error);
  }, []);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.patientId) {
      setError('Please select a patient');
      return;
    }
    setSubmitting(true);

    const vitalSigns = {};
    if (form.bloodPressureSystolic && form.bloodPressureDiastolic) {
      vitalSigns.bloodPressure = {
        systolic: Number(form.bloodPressureSystolic),
        diastolic: Number(form.bloodPressureDiastolic)
      };
    }
    if (form.heartRate) vitalSigns.heartRate = Number(form.heartRate);
    if (form.temperature) vitalSigns.temperature = Number(form.temperature);
    if (form.bloodSugar) vitalSigns.bloodSugar = Number(form.bloodSugar);
    if (form.cholesterol) vitalSigns.cholesterol = Number(form.cholesterol);
    if (form.weight) vitalSigns.weight = Number(form.weight);
    if (form.height) vitalSigns.height = Number(form.height);

    const prescriptions = form.medicine
      ? [{
          medicine: form.medicine,
          dosage: form.dosage,
          frequency: { morning: form.morning, afternoon: form.afternoon, night: form.night },
          duration: form.duration
        }]
      : [];

    const symptoms = form.symptoms.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      await doctorAPI.addMedicalRecord({
        patientId: form.patientId,
        visitType: form.visitType,
        diagnosis: form.diagnosis,
        symptoms,
        vitalSigns,
        prescriptions,
        notes: form.notes
      });
      setSuccess('Medical record added successfully');
      setTimeout(() => navigate(`/doctor/patients/${form.patientId}`), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800">Add Medical Record</h2>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}

      <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
            <select
              value={form.patientId}
              onChange={(e) => update('patientId', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">Choose a patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
            <select
              value={form.visitType}
              onChange={(e) => update('visitType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            >
              <option>General</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Consultation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
          <input
            type="text"
            value={form.diagnosis}
            onChange={(e) => update('diagnosis', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            placeholder="e.g. Common Cold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma-separated)</label>
          <input
            type="text"
            value={form.symptoms}
            onChange={(e) => update('symptoms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            placeholder="Fever, Cough, Headache"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Vital Signs (all optional)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input type="number" placeholder="BP Systolic" value={form.bloodPressureSystolic}
              onChange={(e) => update('bloodPressureSystolic', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" placeholder="BP Diastolic" value={form.bloodPressureDiastolic}
              onChange={(e) => update('bloodPressureDiastolic', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" placeholder="Heart Rate" value={form.heartRate}
              onChange={(e) => update('heartRate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" step="0.1" placeholder="Temperature °F" value={form.temperature}
              onChange={(e) => update('temperature', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" placeholder="Blood Sugar" value={form.bloodSugar}
              onChange={(e) => update('bloodSugar', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" placeholder="Cholesterol" value={form.cholesterol}
              onChange={(e) => update('cholesterol', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="number" step="0.1" placeholder="Height (cm)" value={form.height}
              onChange={(e) => update('height', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Prescription (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Medicine" value={form.medicine}
              onChange={(e) => update('medicine', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="text" placeholder="Dosage (e.g. 500mg)" value={form.dosage}
              onChange={(e) => update('dosage', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input type="text" placeholder="Duration (e.g. 5 days)" value={form.duration}
              onChange={(e) => update('duration', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={form.morning} onChange={(e) => update('morning', e.target.checked)} />
              Morning
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={form.afternoon} onChange={(e) => update('afternoon', e.target.checked)} />
              Afternoon
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={form.night} onChange={(e) => update('night', e.target.checked)} />
              Night
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            placeholder="Additional observations or instructions"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Record'}
        </button>
      </form>
    </div>
  );
};

export default DoctorAddRecord;
