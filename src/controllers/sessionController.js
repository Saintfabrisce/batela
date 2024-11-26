import {
  getActiveSessions,
  invalidateSession,
  invalidateAllUserSessions
} from '../services/sessionService.js';
import { logActivity } from '../services/logService.js';

export const getCurrentSessions = async (req, res) => {
  try {
    const sessions = await getActiveSessions(req.user.id);
    
    await logActivity(
      req.user.id,
      'VIEW_SESSIONS',
      { sessionCount: sessions.length },
      req.ip,
      req.headers['user-agent'],
      'success'
    );
    
    res.json(sessions);
  } catch (error) {
    await logActivity(
      req.user.id,
      'VIEW_SESSIONS',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );
    
    res.status(500).json({ message: 'Erreur lors de la récupération des sessions' });
  }
};

export const terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await invalidateSession(sessionId);
    
    await logActivity(
      req.user.id,
      'TERMINATE_SESSION',
      { sessionId },
      req.ip,
      req.headers['user-agent'],
      'success'
    );
    
    res.json({ message: 'Session terminée avec succès' });
  } catch (error) {
    await logActivity(
      req.user.id,
      'TERMINATE_SESSION',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );
    
    res.status(500).json({ message: 'Erreur lors de la terminaison de la session' });
  }
};

export const terminateAllSessions = async (req, res) => {
  try {
    await invalidateAllUserSessions(req.user.id);
    
    await logActivity(
      req.user.id,
      'TERMINATE_ALL_SESSIONS',
      {},
      req.ip,
      req.headers['user-agent'],
      'success'
    );
    
    res.json({ message: 'Toutes les sessions ont été terminées' });
  } catch (error) {
    await logActivity(
      req.user.id,
      'TERMINATE_ALL_SESSIONS',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );
    
    res.status(500).json({ message: 'Erreur lors de la terminaison des sessions' });
  }
};