import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true, ref: 'QueueToken' },
  reportUrl: { type: String, default: '' },
  department: { type: String, required: true },
  reportType: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'uploaded', 'reviewed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);