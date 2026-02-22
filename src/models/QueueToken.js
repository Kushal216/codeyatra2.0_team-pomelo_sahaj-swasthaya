import mongoose from 'mongoose';

const QueueTokenSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true, unique: true },
  patientName: { type: String, required: true },
  stage: { 
    type: String, 
    enum: ['Registration', 'Consultation', 'Lab', 'Pharmacy', 'Completed'],
    default: 'Registration' 
  },
  status: { 
    type: String, 
    enum: ['Waiting', 'InProgress', 'Completed'], 
    default: 'Waiting' 
  },
}, { timestamps: true });

export default mongoose.models.QueueToken || mongoose.model('QueueToken', QueueTokenSchema);