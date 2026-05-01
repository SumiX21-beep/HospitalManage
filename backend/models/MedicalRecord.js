const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  diagnosis: { type: String },
  symptoms: [{ type: String }],
  vitalSigns: {
    bloodPressure: { systolic: Number, diastolic: Number },
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    bloodSugar: Number,
    cholesterol: Number,
    weight: Number,
    height: Number
  },
  prescriptions: [{
    medicine: { type: String },
    dosage: { type: String },
    frequency: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      night: { type: Boolean, default: false }
    },
    duration: { type: String },
    instructions: { type: String }
  }],
  reports: [{
    name: { type: String },
    file: { type: String },
    type: { type: String },
    date: { type: Date, default: Date.now }
  }],
  notes: { type: String },
  followUpDate: { type: Date },
  visitType: { type: String, enum: ['General', 'Follow-up', 'Emergency', 'Consultation'] },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

