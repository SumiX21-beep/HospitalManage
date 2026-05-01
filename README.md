# Digital Health Record System

A comprehensive healthcare management system for hospitals and patients to securely manage medical records online.

## Features

### For Patients
- View personal health profile
- View medical history
- Upload medical reports (PDF or image)
- View prescriptions from doctor
- Book and manage appointments
- Generate emergency health QR code
- AI-powered health analysis
- Medicine reminders
- Medical history timeline
- Symptom checker
- Health analytics with charts

### For Doctors
- Search patients by name or ID
- View patient medical history
- Add diagnosis and prescriptions
- Upload lab reports
- Manage appointments
- View patient reports

### For Admins
- Approve/reject doctor accounts
- View all patients and doctors
- System statistics and analytics
- Manage users

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd digital-health-record
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Configure Environment

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digitalhealth
JWT_SECRET=your-secret-key
```

### 4. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 5. Seed Database (Optional)

```bash
cd backend
node seed.js
```

This will create sample data for testing.

### 6. Start Backend

```bash
cd backend
npm start
```

The backend will run on http://localhost:5000

### 7. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Demo Accounts

After running the seed script, you can login with these accounts:

### Admin
- Email: admin@digitalhealth.com
- Password: admin123

### Doctors
- Email: johnsmith@digitalhealth.com
- Password: doctor123
- Specialization: Cardiology

- Email: sarahjohnson@digitalhealth.com
- Password: doctor123
- Specialization: General Medicine

### Patients
- Email: alice@digitalhealth.com
- Password: patient123

- Email: bob@digitalhealth.com
- Password: patient123

- Email: charlie@digitalhealth.com
- Password: patient123

## API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/patient/signup - Patient registration
- POST /api/auth/doctor/signup - Doctor registration
- GET /api/auth/me - Get current user

### Patient Routes
- GET /api/patient/profile - Get patient profile
- PUT /api/patient/profile - Update patient profile
- GET /api/patient/medical-records - Get medical records
- GET /api/patient/health-summary - Get AI health analysis
- GET /api/patient/appointments - Get appointments
- POST /api/patient/appointments - Book appointment
- GET /api/patient/emergency-qr - Get QR code
- GET /api/patient/medicines - Get prescriptions
- POST /api/patient/symptom-checker - Check symptoms
- GET /api/patient/timeline - Get medical timeline
- GET /api/patient/analytics - Get health analytics

### Doctor Routes
- GET /api/doctor/profile - Get doctor profile
- GET /api/doctor/patients - Get all patients
- GET /api/doctor/patients/search - Search patients
- GET /api/doctor/patients/:id/medical-records - Get patient records
- POST /api/doctor/medical-records - Add medical record
- GET /api/doctor/appointments - Get appointments
- PUT /api/doctor/appointments/:id - Update appointment

### Admin Routes
- GET /api/admin/doctors - Get all doctors
- PUT /api/admin/doctors/:id/approve - Approve doctor
- GET /api/admin/patients - Get all patients
- GET /api/admin/statistics - Get system statistics

## Project Structure

```
digital-health-record/
├── backend/
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Admin.js
│   │   ├── MedicalRecord.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patient.js
│   │   ├── doctor.js
│   │   ├── admin.js
│   │   ├── appointment.js
│   │   └── medicalRecord.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   └── admin/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Security Features

- JWT Authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes

## Screenshots

The application features a modern, clean UI with:
- Dashboard cards with statistics
- Medical timeline visualization
- Health charts using Chart.js
- Emergency QR code generation
- Responsive design for all devices

## License

MIT License

## Author

Built for Hackathon 2024

