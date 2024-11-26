import express from 'express';
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', getSubscriptionPlans);
router.get('/current', auth, getCurrentSubscription);
router.post('/create', auth, createSubscription);
router.post('/cancel', auth, cancelSubscription);

export default router;