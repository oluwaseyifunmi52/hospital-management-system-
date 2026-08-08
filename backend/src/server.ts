import app from './app';
import { config } from './config/env';
import connectDB from './config/db';

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`SmartCare API running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
