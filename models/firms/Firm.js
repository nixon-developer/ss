import mongoose from 'mongoose';

const FirmSchema = new mongoose.Schema({
  rbInfo: [
    {
        rbOnlineURL: {
          type: String,
        },
        rbReportURL: {
          type: String,
        },
        activateLocal: {
          type: Boolean,
          default: false,
        },
        activateOnline: {
          type: Boolean,
          default: false,
        },
        activateReport: {
          type: Boolean,
          default: false,
        },
        softwareGroup: {
          type: String,
        },
        packagePlan: {
          type: String,
          default: "Trail",
        },
        activatePackage: {
          type: String,
          default: "Pending",
        },

        motherboardManufacturer: {
          type: String,
        },
        motherboardModel: {
          type: String,
        },
        motherboardVersion: {
          type: String,
        },
        motherboardSerialNumber: {
          type: String,
        },



    locationInfo: {
      type: String,
    },

    firmName: {
      type: String,
      required: true,
    },
    firmLogo: {
      type: image,
    },
    primaryContactNumber: {
      type: Number,
      required: true,
    },
    secondaryContactNumber: {
      type: Number,
    },
    primaryEmail: {
      type: String,
      required: true,
    },
    
    secondaryEmail: {
      type: String,
    },
    firmAddress: {
      type: String,
    },
    firmPlace: {
      type: String,
    },
    firmDistrict: {
      type: String,
    },
    locationArea: {
      type: String,
    },
    taxNumber: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    primaryAccountNumber: {
      type: String,
    },
    primaryAccountHolder: {
      type: String,
    },
    primaryBankName: {
      type: String,
    },
    primaryBankBranch: {
      type: String,
    },
    primaryIFSC: {
      type: String,
    },
    primaryQR: {
      type: String,
    },
    secondaryAccountNumber: {
      type: String,
    },
    secondaryAccountHolder: {
      type: String,
    },
    secondaryBankName: {
      type: String,
    },
    secondaryBankBranch: {
      type: String,
    },
    secondaryIFSC: {
      type: String,
    },
    secondaryQR: {
      type: String,
    },

    topTitleOne: {
      type: String,
    },
    topTitleTwo: {
      type: String,
    },
    topTitleThree: {
      type: String,
    },
    topTitleFour: {
      type: String,
    },
    topTitleFive: {
      type: String,
    },
    topTitleSix: {
      type: String,
    },

    bottomTitleOne: {
      type: String,
    },
    bottomTitleTwo: {
      type: String,
    },
    bottomTitleThree: {
      type: String,
    },
    bottomTitleFour: {
      type: String,
    },
    bottomTitleFive: {
      type: String,
    },
    bottomTitleSix: {
      type: String,
    },

    firmUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FirmUser',
      required: true,
    },

    firmUserPermision: {
      type: Boolean, default: true
    },
    
      active: { type: Boolean, default: true },
  },

],

  active: { type: Boolean, default: true },
},
{ 
  timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 } // Adding 5.5 hours for IST
});

export default mongoose.models.Firm || mongoose.model('Firm', FirmSchema);
