import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  logger.error(message, error);

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
