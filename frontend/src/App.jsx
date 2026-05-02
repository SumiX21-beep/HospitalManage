import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/patient/PatientDashboard';
import MedicalRecords from './pages/patient/MedicalRecords';
import PatientAppointments from './pages/patient/PatientAppointments';
import Prescriptions from './pages/patient/Prescriptions';
import EmergencyQR from './pages/patient/EmergencyQR';
import SymptomChecker from './pages/patient/SymptomChecker';
import MedicalTimeline from './pages/patient/MedicalTimeline';
import HealthAnalytics from './pages/patient/HealthAnalytics';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AdminLayout from './layouts/AdminLayout';

const homeForRole = (role) =>
  role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homeForRole(user.role)} replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={homeForRole(user.role)} replace /> : <Signup />} />
      
      <Route path="/" element={
        <PrivateRoute allowedRoles={['patient']}>
          <PatientLayout />
        </PrivateRoute>
      }>
        <Route index element={<PatientDashboard />} />
        <Route path="patient/records" element={<MedicalRecords />} />
        <Route path="patient/appointments" element={<PatientAppointments />} />
        <Route path="patient/prescriptions" element={<Prescriptions />} />
        <Route path="patient/qrcode" element={<EmergencyQR />} />
        <Route path="patient/symptoms" element={<SymptomChecker />} />
        <Route path="patient/timeline" element={<MedicalTimeline />} />
        <Route path="patient/analytics" element={<HealthAnalytics />} />
      </Route>
      
      <Route path="/patient" element={
        <PrivateRoute allowedRoles={['patient']}>
          <PatientLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/" />} />
      </Route>
      
      <Route path="/doctor" element={
        <PrivateRoute allowedRoles={['doctor']}>
          <DoctorLayout />
        </PrivateRoute>
      }>
        <Route index element={<DoctorDashboard />} />
      </Route>
      
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

