import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getHealth = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'railway-exam-prep-api',
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});
