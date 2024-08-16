import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePicture: { type: String, required: true },
  qrCodeImage: { type: String, required: true }
});

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
