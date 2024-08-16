import mongoose from 'mongoose';

const FirmUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  firmAccess: [{
    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firm',
    },
    permissionOnline: {
      type: Boolean, default: false,
    },
    permissionReport: {
      type: Boolean, default: false,
    },
    permissionLocal: {
      type: Boolean, default: false,
    }
  }],
  active: { type: Boolean, default: true },

  createdUser: {
    type: String,
  },
  lastUpdatedUser: {
    type: String,
  },
},
{
  timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }, // Adding 5.5 hours for IST
});

export default mongoose.models.FirmUser || mongoose.model('FirmUser', FirmUserSchema);
