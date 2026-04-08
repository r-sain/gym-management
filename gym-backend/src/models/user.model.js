const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      set: v => v ? v.toUpperCase() : v,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    plan: {
      type: {
        type: String,
        enum: ['1M', '3M', '6M', '1Y'],
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    currentPlanPrice: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: {
      type: Date,
      default: Date.now,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    birthdate: {
      type: Date,
    },
    enrollmentFees: {
      type: Number,
      default: 0,
    },
    enrollmentDate: {
      type: Date,
    },
    discountReason: {
      type: String,
      trim: true,
    },
    billNumber: {
      type: String,
      trim: true,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    idType: {
      type: String,
      enum: ['Aadhaar', 'Voter ID', 'PAN', 'Driving License', ''],
      default: '',
    },
    idNumber: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    paymentHistory: [
      {
        date: Date,
        planType: String,
        amount: Number,
        billNumber: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
