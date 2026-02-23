import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g. "500mg"
    frequency: { type: String, required: true }, // e.g. "Twice a day"
    duration: { type: String, required: true }, // e.g. "7 days"
    notes: { type: String, default: '' },
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
    tokenNumber: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    diagnosis: { type: String, required: true },
    medicines: { type: [MedicineSchema], default: [] },
    advice: { type: String, default: '' },  // General advice / lifestyle notes
    followUpDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Prescription ||
    mongoose.model('Prescription', PrescriptionSchema);
