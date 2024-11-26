import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la performance des requêtes
sessionSchema.index({ userId: 1, token: 1 });
sessionSchema.index({ lastActivity: 1 });

export const Session = mongoose.model('Session', sessionSchema);