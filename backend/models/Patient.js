const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  chronicDiseases: [{ type: String }],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  avatar: { type: String },
  qrCode: { type: String },
  isApproved: { type: Boolean, default: true },
  role: { type: String, default: 'patient' },
  createdAt: { type: Date, default: Date.now }
});

patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);

