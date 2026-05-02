const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { Patient, Doctor, Admin } = require('../models');
const { auth, authorize, JWT_SECRET } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Patient Signup
router.post('/patient/signup', async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, bloodGroup, allergies, chronicDiseases, emergencyContact } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists with this email' });
    }

    const patient = new Patient({
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies: allergies || [],
      chronicDiseases: chronicDiseases || [],
      emergencyContact
    });

    await patient.save();

    // Generate QR Code for emergency
    const emergencyData = JSON.stringify({
      name: patient.name,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      chronicDiseases: patient.chronicDiseases,
      emergencyContact: patient.emergencyContact,
      patientId: patient._id
    });

    const qrCode = await QRCode.toDataURL(emergencyData);
    patient.qrCode = qrCode;
    await patient.save();

    const token = generateToken(patient);
    res.status(201).json({
      token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doctor Signup
router.post('/doctor/signup', async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, hospital, address } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      hospital,
      address,
      isApproved: true
    });

    await doctor.save();

    const token = generateToken(doctor);
    res.status(201).json({
      token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        isApproved: doctor.isApproved
      },
      message: 'Account created pending approval by admin'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Signup
router.post('/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = generateToken(admin);
    res.status(201).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      // Try to find in all collections
      user = await Patient.findOne({ email }) || 
             await Doctor.findOne({ email }) || 
             await Admin.findOne({ email });
      
      if (user) {
        if (user.role === 'doctor' && !user.isApproved) {
          return res.status(403).json({ message: 'Your account is pending approval' });
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user.role === 'patient' ? 
      await Patient.findById(req.user._id).select('-password') :
      req.user.role === 'doctor' ?
      await Doctor.findById(req.user._id).select('-password') :
      await Admin.findById(req.user._id).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

