import express from 'express';
import {
  getCurrentSessions,
  terminateSession,
  terminateAllSessions
} from '../controllers/sessionController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/sessions', auth, getCurrentSessions);
router.delete('/sessions/:sessionId', auth, terminateSession);
router.delete('/sessions', auth, terminateAllSessions);

export default router;