import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['in', 'out'], required: true }
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
