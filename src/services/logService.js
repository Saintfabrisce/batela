import winston from 'winston';
import 'winston-daily-rotate-file';
import { ActivityLog } from '../models/ActivityLog.js';

// Configuration de Winston pour les logs système
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d'
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export const logActivity = async (userId, action, details, ip, userAgent, status) => {
  try {
    const log = new ActivityLog({
      userId,
      action,
      details,
      ip,
      userAgent,
      status
    });
    
    await log.save();
    
    logger.info('Activity logged', {
      userId: userId.toString(),
      action,
      status,
      ip
    });
  } catch (error) {
    logger.error('Error logging activity', {
      error: error.message,
      userId: userId.toString(),
      action
    });
  }
};

export const getActivityLogs = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    action,
    status
  } = options;

  const query = { userId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  if (action) query.action = action;
  if (status) query.status = status;

  const logs = await ActivityLog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await ActivityLog.countDocuments(query);

  return {
    logs,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
};

export const systemLog = logger;