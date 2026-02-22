import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., Cardiology
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);