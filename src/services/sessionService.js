import { Session } from '../models/Session.js';

export const createSession = async (userId, token, device, ip) => {
  const session = new Session({
    userId,
    token,
    device,
    ip
  });
  
  await session.save();
  return session;
};

export const updateSessionActivity = async (token) => {
  await Session.findOneAndUpdate(
    { token },
    { lastActivity: new Date() }
  );
};

export const invalidateSession = async (token) => {
  await Session.findOneAndUpdate(
    { token },
    { isActive: false }
  );
};

export const invalidateAllUserSessions = async (userId) => {
  await Session.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

export const getActiveSessions = async (userId) => {
  return Session.find({
    userId,
    isActive: true
  }).sort({ lastActivity: -1 });
};

export const cleanupOldSessions = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  await Session.deleteMany({
    lastActivity: { $lt: thirtyDaysAgo }
  });
};