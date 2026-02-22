import mongoose from 'mongoose';

const QueueTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tokenNumber: { type: Number, required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  
  // New Fields for Slot System
  appointmentTime: { type: Date, required: true }, // Selected slot time
  missedCount: { type: Number, default: 0 },       // Tracks strikes (0 to 3)
  isCheckedIn: { type: Boolean, default: false },  // Did they arrive?
  
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