import mongoose from 'mongoose';

const UserRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
{ 
  timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 } // Adding 5.5 hours for IST
});

export default mongoose.models.UserRole || mongoose.model('UserRole', UserRoleSchema);
