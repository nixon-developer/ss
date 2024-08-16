import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this item.'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  unit: {
    type: String,
    required: [true, 'Please provide a unit for this item.'],
    enum: ['pcs', 'kgs', 'size', 'nos'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    // required: [true, 'Please provide a category for this item.']
  },
  basePrice: {
    plu: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    }
  },
  quarterPrice: {
    plu: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    }
  },
  halfPrice: {
    plu: {
      type: String,
      default: 0,
    },
    price: {
      type: Number,
    }
  },
  fullPrice: {
    plu: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    }
  }
}, { 
  timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 } // Adding 5.5 hours for IST
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
