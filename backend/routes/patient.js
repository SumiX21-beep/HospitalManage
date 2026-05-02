const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const { auth, authorize } = require('../middleware/auth');
const { Patient, Doctor, MedicalRecord, Appointment } = require('../models');

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

// Get patient profile
router.get('/profile', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id).select('-password');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update patient profile
router.put('/profile', auth, authorize('patient'), async (req, res) => {
  try {
    const updates = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient medical history
router.get('/medical-records', auth, authorize('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get AI Health Summary
router.get('/health-summary', auth, authorize('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (records.length === 0) {
      return res.json({ message: 'No medical records found', analysis: [] });
    }

    const analysis = [];
    
    // Get latest vital signs
    const latestRecord = records[0];
    if (latestRecord.vitalSigns) {
      const vs = latestRecord.vitalSigns;
      
      // Blood Pressure Analysis
      if (vs.bloodPressure) {
        if (vs.bloodPressure.systolic > 140 || vs.bloodPressure.diastolic > 90) {
          analysis.push({
            metric: 'Blood Pressure',
            value: `${vs.bloodPressure.systolic}/${vs.bloodPressure.diastolic}`,
            status: 'High',
            recommendation: 'High Blood Pressure Risk - Consult a cardiologist'
          });
        } else if (vs.bloodPressure.systolic < 90 || vs.bloodPressure.diastolic < 60) {
          analysis.push({
            metric: 'Blood Pressure',
            value: `${vs.bloodPressure.systolic}/${vs.bloodPressure.diastolic}`,
            status: 'Low',
            recommendation: 'Low Blood Pressure - Monitor and consult doctor'
          });
        } else {
          analysis.push({
            metric: 'Blood Pressure',
            value: `${vs.bloodPressure.systolic}/${vs.bloodPressure.diastolic}`,
            status: 'Normal',
            recommendation: 'Blood pressure is within normal range'
          });
        }
      }

      // Blood Sugar Analysis
      if (vs.bloodSugar) {
        if (vs.bloodSugar > 150) {
          analysis.push({
            metric: 'Blood Sugar',
            value: `${vs.bloodSugar} mg/dL`,
            status: 'High',
            recommendation: 'Possible Diabetes Risk - Consult a doctor'
          });
        } else if (vs.bloodSugar < 70) {
          analysis.push({
            metric: 'Blood Sugar',
            value: `${vs.bloodSugar} mg/dL`,
            status: 'Low',
            recommendation: 'Low Blood Sugar - Eat something sweet'
          });
        } else {
          analysis.push({
            metric: 'Blood Sugar',
            value: `${vs.bloodSugar} mg/dL`,
            status: 'Normal',
            recommendation: 'Blood sugar is within normal range'
          });
        }
      }

      // Cholesterol Analysis
      if (vs.cholesterol) {
        if (vs.cholesterol > 200) {
          analysis.push({
            metric: 'Cholesterol',
            value: `${vs.cholesterol} mg/dL`,
            status: 'High',
            recommendation: 'High Cholesterol - Reduce fatty foods'
          });
        } else if (vs.cholesterol < 125) {
          analysis.push({
            metric: 'Cholesterol',
            value: `${vs.cholesterol} mg/dL`,
            status: 'Low',
            recommendation: 'Cholesterol is low - Maintain a balanced diet'
          });
        } else {
          analysis.push({
            metric: 'Cholesterol',
            value: `${vs.cholesterol} mg/dL`,
            status: 'Normal',
            recommendation: 'Cholesterol is within normal range'
          });
        }
      }

      // BMI Analysis
      if (vs.weight && vs.height) {
        const bmi = vs.weight / ((vs.height / 100) ** 2);
        if (bmi > 30) {
          analysis.push({
            metric: 'BMI',
            value: bmi.toFixed(1),
            status: 'High',
            recommendation: 'Obese - Consider weight management'
          });
        } else if (bmi < 18.5) {
          analysis.push({
            metric: 'BMI',
            value: bmi.toFixed(1),
            status: 'Low',
            recommendation: 'Underweight - Gain weight with healthy diet'
          });
        } else if (bmi >= 25 && bmi <= 30) {
          analysis.push({
            metric: 'BMI',
            value: bmi.toFixed(1),
            status: 'Medium',
            recommendation: 'Overweight - Maintain healthy lifestyle'
          });
        } else {
          analysis.push({
            metric: 'BMI',
            value: bmi.toFixed(1),
            status: 'Normal',
            recommendation: 'BMI is within normal range'
          });
        }
      }
    }

    res.json({ analysis, records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List approved doctors (for patient appointment booking)
router.get('/doctors', auth, authorize('patient'), async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true })
      .select('name specialization hospital qualification experience');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient appointments
router.get('/appointments', auth, authorize('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization hospital')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book appointment
router.post('/appointments', auth, authorize('patient'), async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get emergency QR code
router.get('/emergency-qr', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    res.json({ qrCode: patient.qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Regenerate QR Code
router.put('/emergency-qr', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    
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

    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get medicine reminders
router.get('/medicines', auth, authorize('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const medicines = [];
    records.forEach(record => {
      if (record.prescriptions) {
        record.prescriptions.forEach(pres => {
          medicines.push({
            medicine: pres.medicine,
            dosage: pres.dosage,
            frequency: pres.frequency,
            duration: pres.duration,
            doctor: record.doctor.name,
            date: record.createdAt
          });
        });
      }
    });

    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Symptom Checker
router.post('/symptom-checker', auth, authorize('patient'), async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    const symptomDiseases = {
      'Fever': ['Flu', 'Viral Infection', 'Typhoid', 'COVID-19'],
      'Cough': ['Common Cold', 'Flu', 'Bronchitis', 'COVID-19'],
      'Headache': ['Migraine', 'Tension', 'Sinusitis', 'Dehydration'],
      'Fatigue': ['Anemia', 'Depression', 'Thyroid', 'Viral Infection'],
      'Nausea': ['Food Poisoning', 'Migraine', 'Pregnancy', 'Gastritis'],
      'Vomiting': ['Food Poisoning', 'Gastritis', 'Migraine', 'Appendicitis'],
      'Diarrhea': ['Food Poisoning', 'Viral Infection', 'IBS', 'Food Allergy'],
      'Body Pain': ['Flu', 'Viral Infection', 'Dengue', 'Malaria'],
      'Sore Throat': ['Strep Throat', 'Common Cold', 'Tonsillitis'],
      'Shortness of Breath': ['Asthma', 'COVID-19', 'Pneumonia', 'Anxiety'],
      'Chest Pain': ['Heart Attack', 'Acid Reflux', 'Panic Attack', 'Costochondritis'],
      'Dizziness': ['Low Blood Pressure', 'Anemia', 'Dehydration', 'Vertigo']
    };

    const possibleDiseases = {};
    
    symptoms.forEach(symptom => {
      if (symptomDiseases[symptom]) {
        symptomDiseases[symptom].forEach(disease => {
          possibleDiseases[disease] = (possibleDiseases[disease] || 0) + 1;
        });
      }
    });

    const sortedDiseases = Object.entries(possibleDiseases)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([disease, count]) => ({
        disease,
        matchCount: count,
        probability: Math.round((count / symptoms.length) * 100)
      }));

    res.json({ 
      selectedSymptoms: symptoms, 
      possibleDiseases: sortedDiseases,
      message: sortedDiseases.length > 0 
        ? 'Please consult a doctor for proper diagnosis' 
        : 'No matching conditions found'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get medical timeline
router.get('/timeline', auth, authorize('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    const timeline = records.map(record => ({
      year: new Date(record.createdAt).getFullYear(),
      date: record.createdAt,
      type: record.visitType,
      diagnosis: record.diagnosis,
      doctor: record.doctor.name,
      doctorSpecialization: record.doctor.specialization,
      prescriptions: record.prescriptions,
      reports: record.reports
    }));

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get health analytics data
router.get('/analytics', auth, authorize('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const bpData = records.map(r => ({
      date: r.createdAt,
      systolic: r.vitalSigns?.bloodPressure?.systolic,
      diastolic: r.vitalSigns?.bloodPressure?.diastolic
    })).filter(r => r.systolic);

    const sugarData = records.map(r => ({
      date: r.createdAt,
      sugar: r.vitalSigns?.bloodSugar
    })).filter(r => r.sugar);

    const visitsData = records.map(r => ({
      date: r.createdAt,
      type: r.visitType
    }));

    res.json({
      bloodPressure: bpData,
      sugarLevel: sugarData,
      visits: visitsData,
      totalVisits: records.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

