import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  events: [{
    type: String,
    enum: ['user.created', 'user.updated', 'user.deleted', 'auth.login', 'auth.logout']
  }],
  secret: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: Date,
  failureCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Webhook = mongoose.model('Webhook', webhookSchema);