import express from 'express';
import { setup, verify, disable, validate } from '../controllers/twoFactorController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/setup', auth, setup);
router.post('/verify', auth, verify);
router.post('/disable', auth, disable);
router.post('/validate', auth, validate);

export default router;