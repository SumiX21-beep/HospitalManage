const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const dotenv = require('dotenv');
const { Patient, Doctor, Admin, MedicalRecord, Appointment } = require('./models');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalhealth';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Admin.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = new Admin({
      name: 'System Admin',
      email: 'admin@digitalhealth.com',
      password: 'admin123'
    });
    await admin.save();
    console.log('Admin created: admin@digitalhealth.com / admin123');

    // Create Doctors
    const doctors = [
      {
        name: 'Dr. John Smith',
        email: 'johnsmith@digitalhealth.com',
        password: 'doctor123',
        phone: '+1234567890',
        specialization: 'Cardiology',
        qualification: 'MD, FACC',
        experience: 15,
        hospital: 'City Heart Center',
        address: '123 Medical Street',
        isApproved: true
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarahjohnson@digitalhealth.com',
        password: 'doctor123',
        phone: '+1234567891',
        specialization: 'General Medicine',
        qualification: 'MD, MBBS',
        experience: 10,
        hospital: 'City General Hospital',
        address: '456 Health Avenue',
        isApproved: true
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michaelbrown@digitalhealth.com',
        password: 'doctor123',
        phone: '+1234567892',
        specialization: 'Orthopedics',
        qualification: 'MD, Ortho',
        experience: 12,
        hospital: 'Bone & Joint Center',
        address: '789 Care Road',
        isApproved: true
      }
    ];

    const savedDoctors = [];
    for (const doctor of doctors) {
      const newDoctor = new Doctor(doctor);
      await newDoctor.save();
      savedDoctors.push(newDoctor);
    }
    console.log('Doctors created');

    // Create Patients with QR Codes
    const patients = [
      {
        name: 'Alice Williams',
        email: 'alice@digitalhealth.com',
        password: 'patient123',
        phone: '+9876543210',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Female',
        bloodGroup: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        chronicDiseases: ['Asthma'],
        emergencyContact: {
          name: 'Robert Williams',
          phone: '+9876543211',
          relation: 'Husband'
        }
      },
      {
        name: 'Bob Martinez',
        email: 'bob@digitalhealth.com',
        password: 'patient123',
        phone: '+9876543212',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'Male',
        bloodGroup: 'A+',
        allergies: [],
        chronicDiseases: ['Diabetes Type 2'],
        emergencyContact: {
          name: 'Maria Martinez',
          phone: '+9876543213',
          relation: 'Wife'
        }
      },
      {
        name: 'Charlie Davis',
        email: 'charlie@digitalhealth.com',
        password: 'patient123',
        phone: '+9876543214',
        dateOfBirth: new Date('1978-12-10'),
        gender: 'Male',
        bloodGroup: 'B+',
        allergies: ['Latex'],
        chronicDiseases: ['Hypertension', 'High Cholesterol'],
        emergencyContact: {
          name: 'Emily Davis',
          phone: '+9876543215',
          relation: 'Sister'
        }
      }
    ];

    const savedPatients = [];
    for (const patient of patients) {
      const newPatient = new Patient(patient);
      
      // Generate QR Code
      const emergencyData = JSON.stringify({
        name: newPatient.name,
        bloodGroup: newPatient.bloodGroup,
        allergies: newPatient.allergies,
        chronicDiseases: newPatient.chronicDiseases,
        emergencyContact: newPatient.emergencyContact,
        patientId: newPatient._id
      });
      
      newPatient.qrCode = await QRCode.toDataURL(emergencyData);
      await newPatient.save();
      savedPatients.push(newPatient);
    }
    console.log('Patients created');

    // Create Medical Records
    const medicalRecords = [
      {
        patient: savedPatients[0]._id,
        doctor: savedDoctors[0]._id,
        diagnosis: 'Mild Hypertension',
        symptoms: ['Headache', 'Fatigue'],
        vitalSigns: {
          bloodPressure: { systolic: 145, diastolic: 92 },
          heartRate: 78,
          temperature: 98.4,
          bloodSugar: 110,
          cholesterol: 210,
          weight: 65,
          height: 165
        },
        prescriptions: [
          {
            medicine: 'Lisinopril',
            dosage: '10mg',
            frequency: { morning: true, afternoon: false, night: true },
            duration: '30 days',
            instructions: 'Take in the morning and night'
          }
        ],
        notes: 'Follow up in 1 month',
        visitType: 'General',
        createdAt: new Date('2024-01-15')
      },
      {
        patient: savedPatients[0]._id,
        doctor: savedDoctors[1]._id,
        diagnosis: 'Common Cold',
        symptoms: ['Cough', 'Sore Throat', 'Runny Nose'],
        vitalSigns: {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          temperature: 99.2,
          bloodSugar: 95,
          weight: 65,
          height: 165
        },
        prescriptions: [
          {
            medicine: 'Paracetamol',
            dosage: '500mg',
            frequency: { morning: true, afternoon: true, night: true },
            duration: '5 days',
            instructions: 'Take when fever occurs'
          }
        ],
        notes: 'Rest and stay hydrated',
        visitType: 'General',
        createdAt: new Date('2024-02-20')
      },
      {
        patient: savedPatients[1]._id,
        doctor: savedDoctors[0]._id,
        diagnosis: 'Type 2 Diabetes - Regular Checkup',
        symptoms: [],
        vitalSigns: {
          bloodPressure: { systolic: 130, diastolic: 85 },
          heartRate: 75,
          temperature: 98.6,
          bloodSugar: 145,
          cholesterol: 195,
          weight: 80,
          height: 175
        },
        prescriptions: [
          {
            medicine: 'Metformin',
            dosage: '500mg',
            frequency: { morning: true, afternoon: false, night: true },
            duration: '90 days',
            instructions: 'Take with meals'
          }
        ],
        notes: 'Continue current dosage, monitor blood sugar',
        visitType: 'Follow-up',
        createdAt: new Date('2024-03-10')
      },
      {
        patient: savedPatients[2]._id,
        doctor: savedDoctors[0]._id,
        diagnosis: 'High Cholesterol',
        symptoms: [],
        vitalSigns: {
          bloodPressure: { systolic: 138, diastolic: 88 },
          heartRate: 80,
          temperature: 98.2,
          bloodSugar: 120,
          cholesterol: 245,
          weight: 85,
          height: 170
        },
        prescriptions: [
          {
            medicine: 'Atorvastatin',
            dosage: '20mg',
            frequency: { morning: false, afternoon: false, night: true },
            duration: '60 days',
            instructions: 'Take at night'
          }
        ],
        notes: 'Low fat diet recommended',
        visitType: 'General',
        createdAt: new Date('2024-01-25')
      }
    ];

    for (const record of medicalRecords) {
      const newRecord = new MedicalRecord(record);
      await newRecord.save();
    }
    console.log('Medical Records created');

    // Create Appointments
    const appointments = [
      {
        patient: savedPatients[0]._id,
        doctor: savedDoctors[1]._id,
        date: new Date('2024-04-15'),
        time: '10:00 AM',
        reason: 'Annual Checkup',
        status: 'approved'
      },
      {
        patient: savedPatients[1]._id,
        doctor: savedDoctors[0]._id,
        date: new Date('2024-04-20'),
        time: '2:00 PM',
        reason: 'Diabetes Follow-up',
        status: 'pending'
      },
      {
        patient: savedPatients[2]._id,
        doctor: savedDoctors[2]._id,
        date: new Date('2024-04-18'),
        time: '11:00 AM',
        reason: 'Joint Pain Consultation',
        status: 'completed'
      }
    ];

    for (const appointment of appointments) {
      const newAppointment = new Appointment(appointment);
      await newAppointment.save();
    }
    console.log('Appointments created');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('\nAdmin:');
    console.log('  Email: admin@digitalhealth.com');
    console.log('  Password: admin123');
    console.log('\nDoctors:');
    console.log('  Email: johnsmith@digitalhealth.com / Password: doctor123');
    console.log('  Email: sarahjohnson@digitalhealth.com / Password: doctor123');
    console.log('  Email: michaelbrown@digitalhealth.com / Password: doctor123');
    console.log('\nPatients:');
    console.log('  Email: alice@digitalhealth.com / Password: patient123');
    console.log('  Email: bob@digitalhealth.com / Password: patient123');
    console.log('  Email: charlie@digitalhealth.com / Password: patient123');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();

