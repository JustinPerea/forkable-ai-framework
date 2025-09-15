/**
 * Enhanced Forkable AI Framework - Main Server Entry Point
 *
 * This is the new enhanced server that replaces server.js
 * Run with: node server-enhanced.js
 */

const ForkableAIServer = require('./src/app');

// Create and start server
async function startServer() {
  const server = new ForkableAIServer();

  try {
    // Initialize server
    await server.initialize();

    // Start server
    await server.start();

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);

      try {
        await server.stop();
        console.log('👋 Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error.message);
        process.exit(1);
      }
    };

    // Listen for shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();