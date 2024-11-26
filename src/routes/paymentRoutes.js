import express from 'express';
import { processPayment, getPaymentHistory } from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', auth, processPayment);
router.get('/history', auth, getPaymentHistory);

export default router;