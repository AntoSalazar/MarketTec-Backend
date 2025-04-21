import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'; // Import for log rotation
import path from 'path';
import { environment } from './environment'; // Assuming environment.ts is in the same directory

// Define log directory
const logDirectory = path.join(process.cwd(), 'logs');

// Define base log format usable by multiple transports
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
  winston.format.errors({ stack: true }), // Log the full stack trace for errors
  winston.format.splat(), // Necessary to interpolate strings like %s, %d
  winston.format.metadata() // Adds metadata object
);

// Custom format for console logging
const consoleFormat = winston.format.combine(
  baseFormat,
  winston.format.colorize(), // Add colors
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    let log = `${timestamp} ${level}: ${message}`;
    // Include stack trace in development console logs for errors
    if (
      environment.nodeEnv !== 'production' &&
      metadata &&
      typeof metadata === 'object' &&
      'stack' in metadata &&
      typeof (metadata as any).stack === 'string'
    ) {
      log += `\n${(metadata as any).stack}`;
    }
    // Optionally include other metadata if present
    // if (metadata && Object.keys(metadata).length > 0 && !metadata.stack) {
    //   log += ` ${JSON.stringify(metadata)}`;
    // }
    return log;
  })
);

// Format for file logging (structured JSON is often preferred for machine readability)
const fileFormat = winston.format.combine(
  baseFormat,
  winston.format.json() // Log as JSON in files
);

// Define transports based on environment
const transports: winston.transport[] = [
  // Always log to the console
  new winston.transports.Console({
    format: consoleFormat,
    level: environment.logLevel, // Use level from environment config
    handleExceptions: true, // Handle uncaught exceptions with this transport
  }),
];

// Add file transports only in production (or other non-development environments)
if (environment.nodeEnv !== 'development') {
  transports.push(
    // Rotate error logs daily
    new DailyRotateFile({
      level: 'error', // Log only errors and above
      filename: path.join(logDirectory, 'error-%DATE%.log'), // Filename pattern
      datePattern: 'YYYY-MM-DD', // Daily rotation
      zippedArchive: true, // Compress old log files
      maxSize: '20m', // Max size before rotating (e.g., 20MB)
      maxFiles: '14d', // Keep logs for 14 days
      format: fileFormat, // Use JSON format for files
      handleExceptions: true, // Handle uncaught exceptions
    })
  );

  transports.push(
    // Rotate combined logs daily
    new DailyRotateFile({
      level: environment.logLevel, // Log based on environment config level
      filename: path.join(logDirectory, 'combined-%DATE%.log'), // Filename pattern
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep combined logs for 30 days
      format: fileFormat, // Use JSON format for files
      handleExceptions: true, // Handle uncaught exceptions
    })
  );
}

// Create the main logger instance
export const logger = winston.createLogger({
  level: environment.logLevel, // Set the default minimum log level
  format: baseFormat, // Base format applied to all logs before transport-specific formatting
  defaultMeta: { service: 'finsur-api' }, // Default metadata added to all logs
  transports: transports,
  exitOnError: false, // Do not exit after logging an uncaught exception
});

// Optional: Handle unhandled promise rejections
// Note: Winston's handleExceptions often covers this, but explicit handling can be clearer
process.on('unhandledRejection', (reason, promise) => {
  // Log the unhandled rejection with error level
  // Ensure 'reason' is logged appropriately (it might be an Error object or something else)
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason instanceof Error ? reason.stack : reason}`);
  // Consider whether to exit the process depending on the severity/context
  // process.exit(1);
});

// Add a simple stream interface for use with morgan (HTTP request logging) if needed
// logger.stream = {
//   write: (message: string): void => {
//     // Morgan adds a newline, remove it to avoid double lines
//     logger.info(message.substring(0, message.lastIndexOf('\n')));
//   },
// };

// Example log messages
// logger.error('This is an error message.');
// logger.warn('This is a warning message.');
// logger.info('This is an info message.');
// logger.http('This is an http message.'); // If http level is enabled
// logger.verbose('This is a verbose message.'); // If verbose level is enabled
// logger.debug('This is a debug message.'); // If debug level is enabled
// logger.silly('This is a silly message.'); // If silly level is enabled
