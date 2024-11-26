import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'business']
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 30 // durée en jours
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentHistory: [{
    amount: Number,
    paymentMethod: String,
    transactionId: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
export const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);