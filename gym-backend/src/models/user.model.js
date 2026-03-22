const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    plan: {
      type: {
        type: String,
        enum: ['1M', '3M', '6M', '1Y'],
        required: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    currentPlanPrice: {
      type: Number,
      default: 0
    },
    billImage: {
      // Will store extremely large base64 strings
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
