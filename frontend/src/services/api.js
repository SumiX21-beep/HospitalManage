import axios from 'axios';

const API_URL = '/api';

// Auth API
export const authAPI = {
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
  signup: (data) => axios.post(`${API_URL}/auth/patient/signup`, data),
  doctorSignup: (data) => axios.post(`${API_URL}/auth/doctor/signup`, data),
  getMe: () => axios.get(`${API_URL}/auth/me`),
};

// Patient API
export const patientAPI = {
  getProfile: () => axios.get(`${API_URL}/patient/profile`),
  updateProfile: (data) => axios.put(`${API_URL}/patient/profile`, data),
  getMedicalRecords: () => axios.get(`${API_URL}/patient/medical-records`),
  getHealthSummary: () => axios.get(`${API_URL}/patient/health-summary`),
  getAppointments: () => axios.get(`${API_URL}/patient/appointments`),
  bookAppointment: (data) => axios.post(`${API_URL}/patient/appointments`, data),
  getEmergencyQR: () => axios.get(`${API_URL}/patient/emergency-qr`),
  getMedicines: () => axios.get(`${API_URL}/patient/medicines`),
  symptomChecker: (symptoms) => axios.post(`${API_URL}/patient/symptom-checker`, { symptoms }),
  getTimeline: () => axios.get(`${API_URL}/patient/timeline`),
  getAnalytics: () => axios.get(`${API_URL}/patient/analytics`),
  getDoctors: () => axios.get(`${API_URL}/patient/doctors`),
};

// Doctor API
export const doctorAPI = {
  getProfile: () => axios.get(`${API_URL}/doctor/profile`),
  updateProfile: (data) => axios.put(`${API_URL}/doctor/profile`, data),
  searchPatients: (query) => axios.get(`${API_URL}/doctor/patients/search?query=${query}`),
  getPatients: () => axios.get(`${API_URL}/doctor/patients`),
  getPatient: (id) => axios.get(`${API_URL}/doctor/patients/${id}`),
  getPatientMedicalRecords: (id) => axios.get(`${API_URL}/doctor/patients/${id}/medical-records`),
  addMedicalRecord: (data) => axios.post(`${API_URL}/doctor/medical-records`, data),
  getAppointments: () => axios.get(`${API_URL}/doctor/appointments`),
  updateAppointment: (id, data) => axios.put(`${API_URL}/doctor/appointments/${id}`, data),
  createAppointment: (data) => axios.post(`${API_URL}/doctor/appointments`, data),
  getMyPatients: () => axios.get(`${API_URL}/doctor/my-patients`),
};

// Admin API
export const adminAPI = {
  getProfile: () => axios.get(`${API_URL}/admin/profile`),
  getDoctors: () => axios.get(`${API_URL}/admin/doctors`),
  approveDoctor: (id) => axios.put(`${API_URL}/admin/doctors/${id}/approve`),
  rejectDoctor: (id) => axios.put(`${API_URL}/admin/doctors/${id}/reject`),
  getPatients: () => axios.get(`${API_URL}/admin/patients`),
  getPendingDoctors: () => axios.get(`${API_URL}/admin/pending-doctors`),
  getAppointments: () => axios.get(`${API_URL}/admin/appointments`),
  getStatistics: () => axios.get(`${API_URL}/admin/statistics`),
  deleteUser: (id, role) => axios.delete(`${API_URL}/admin/users/${id}?role=${role}`),
};

