const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const MedicalRecord = require('../models/MedicalRecord');

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

// Get all medical records (admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient's medical records
router.get('/patient/:patientId', auth, authorize('patient', 'doctor', 'admin'), async (req, res) => {
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

// Get doctor's medical records
router.get('/doctor', auth, authorize('doctor'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create medical record
router.post('/', auth, authorize('doctor'), async (req, res) => {
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

// Upload report to existing medical record
router.post('/:recordId/reports', auth, authorize('doctor', 'patient'), upload.single('file'), async (req, res) => {
  try {
    const { name, type } = req.body;
    
    const medicalRecord = await MedicalRecord.findById(req.params.recordId);
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Check if user has permission
    if (req.user.role === 'patient' && medicalRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    medicalRecord.reports.push({
      name: name || 'Report',
      file: req.file.filename,
      type: type || 'report'
    });

    await medicalRecord.save();
    res.json(medicalRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single medical record
router.get('/:id', auth, authorize('patient', 'doctor', 'admin'), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('doctor', 'name specialization hospital')
      .populate('patient', 'name email phone bloodGroup allergies chronicDiseases');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Check if user has permission
    if (req.user.role === 'patient' && record.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

