import pino from 'pino';

// Define the transport explicitly. 
// Uses pino-pretty in development for highly readable logs.
// In production, logs are serialized to standard JSON without pretty-printing for maximal performance.
const transport =
  process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined;

// Create and export the central Pino logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport,
  base: {
    env: process.env.NODE_ENV,
    app: 'credda-ulpgl',
  },
});
