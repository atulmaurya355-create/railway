import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`API server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start API server', error);
    process.exit(1);
  }
}

startServer();