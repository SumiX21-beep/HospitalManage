const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { Admin, Doctor, Patient, MedicalRecord, Appointment } = require('../models');

// Get admin profile
router.get('/profile', auth, authorize('admin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all doctors (including pending)
router.get('/doctors', auth, authorize('admin'), async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve doctor
router.put('/doctors/:doctorId/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { isApproved: true },
      { new: true }
    ).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject doctor
router.put('/doctors/:doctorId/reject', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.doctorId);
    res.json({ message: 'Doctor rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all patients
router.get('/patients', auth, authorize('admin'), async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending doctor approvals
router.get('/pending-doctors', auth, authorize('admin'), async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all appointments
router.get('/appointments', auth, authorize('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all medical records
router.get('/medical-records', auth, authorize('admin'), async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get system statistics
router.get('/statistics', auth, authorize('admin'), async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({ isApproved: true });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();

    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalPatients,
      totalDoctors,
      approvedDoctors,
      pendingDoctors,
      totalAppointments,
      totalRecords,
      appointmentsByStatus,
      recentAppointments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (patient or doctor)
router.delete('/users/:userId', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    let user;
    if (role === 'patient') {
      user = await Patient.findByIdAndDelete(req.params.userId);
    } else if (role === 'doctor') {
      user = await Doctor.findByIdAndDelete(req.params.userId);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

