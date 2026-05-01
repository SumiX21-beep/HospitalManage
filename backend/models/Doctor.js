const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  specialization: { type: String, required: true },
  qualification: { type: String },
  experience: { type: Number },
  hospital: { type: String },
  address: { type: String },
  avatar: { type: String },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: 'doctor' },
  createdAt: { type: Date, default: Date.now }
});

doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);

