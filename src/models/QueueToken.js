import mongoose from 'mongoose';

const QueueTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tokenNumber: { type: Number, required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  
  
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  
  appointmentTime: { type: Date, required: true },
  missedCount: { type: Number, default: 0 },
  isCheckedIn: { type: Boolean, default: false },
  
  stage: { 
    type: String, 
    enum: ['Registration', 'Consultation', 'Lab', 'Pharmacy', 'Completed'],
    default: 'Registration' 
  },
  status: { 
    type: String, 
    enum: ['Waiting', 'InProgress', 'Completed', 'Cancelled'], 
    default: 'Waiting' 
  },
}, { timestamps: true });

export default mongoose.models.QueueToken || mongoose.model('QueueToken', QueueTokenSchema);