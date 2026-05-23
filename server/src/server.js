import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`API server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start API server', error);
    process.exit(1);
  }
}

startServer();
