const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const { Doctor, Patient, MedicalRecord, Appointment } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get doctor profile
router.get('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update doctor profile
router.put('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const updates = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search patients
router.get('/patients/search', auth, authorize('doctor'), async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { _id: query }
      ]
    }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all patients
router.get('/patients', auth, authorize('doctor'), async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View patient medical history
router.get('/patients/:patientId/medical-records', auth, authorize('doctor'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient profile
router.get('/patients/:patientId', auth, authorize('doctor'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId).select('-password');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add medical record
router.post('/medical-records', auth, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, diagnosis, symptoms, vitalSigns, prescriptions, notes, followUpDate, visitType } = req.body;

    const medicalRecord = new MedicalRecord({
      patient: patientId,
      doctor: req.user._id,
      diagnosis,
      symptoms: symptoms || [],
      vitalSigns,
      prescriptions: prescriptions || [],
      notes,
      followUpDate,
      visitType: visitType || 'General'
    });

    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload lab report
router.post('/medical-records/:patientId/reports', auth, authorize('doctor'), upload.single('file'), async (req, res) => {
  try {
    const { name, type } = req.body;
    
    const medicalRecord = new MedicalRecord({
      patient: req.params.patientId,
      doctor: req.user._id,
      reports: [{
        name: name || 'Lab Report',
        file: req.file.filename,
        type: type || 'report'
      }],
      visitType: 'Follow-up'
    });

    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor appointments
router.get('/appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone bloodGroup')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Reject appointment
router.put('/appointments/:appointmentId', auth, authorize('doctor'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status, notes },
      { new: true }
    ).populate('patient', 'name email');
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create appointment
router.post('/appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, date, time, reason } = req.body;
    const appointment = new Appointment({
      patient: patientId,
      doctor: req.user._id,
      date,
      time,
      reason,
      status: 'approved'
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor's patients (patients who have visited this doctor)
router.get('/my-patients', auth, authorize('doctor'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.user._id })
      .populate('patient', 'name email phone dateOfBirth bloodGroup')
      .sort({ createdAt: -1 });

    const uniquePatients = [];
    const patientIds = new Set();
    
    records.forEach(record => {
      if (!patientIds.has(record.patient._id.toString())) {
        patientIds.add(record.patient._id.toString());
        uniquePatients.push(record.patient);
      }
    });

    res.json(uniquePatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

