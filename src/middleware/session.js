import { updateSessionActivity } from '../services/sessionService.js';

export const trackSession = async (req, res, next) => {
  try {
    if (req.user && req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      await updateSessionActivity(token);
    }
    next();
  } catch (error) {
    next(error);
  }
};