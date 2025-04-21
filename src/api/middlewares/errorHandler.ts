import { Request, Response, NextFunction } from 'express';
import { HttpException, NotFoundException } from '@utils/errors/HttpException'; // Assuming HttpException is defined
import { logger } from '@config/logger'; // Your enhanced Winston logger
import { environment } from '@config/environment';
import { v4 as uuidv4 } from 'uuid'; // For generating unique error IDs

// Interface for a standardized error response
interface ErrorResponse {
  status: 'error';
  statusCode: number;
  code: string; // A machine-readable error code
  message: string;
  errorId?: string; // Unique ID for tracking in logs (especially in production)
  details?: any; // Specific error details (e.g., validation errors)
  stack?: string; // Stack trace (only in development)
}

/**
 * Middleware to handle routes that are not found (404).
 * Passes a NotFoundException to the main error handler.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundException(`Route not found: ${req.method} ${req.originalUrl}`);
  next(error); // Pass the error to the next middleware (the errorHandler)
};

/**
 * Centralized Express error handling middleware.
 * Logs errors and sends standardized JSON responses.
 */
export const errorHandler = (
  error: any, // Use 'any' initially to handle various error types, then narrow down
  req: Request,
  res: Response,
  next: NextFunction // 'next' is required for Express error handlers, even if not explicitly used
) => {
  // If headers were already sent, delegate to the default Express error handler
  // This prevents errors like "Cannot set headers after they are sent to the client"
  if (res.headersSent) {
    logger.warn('Headers already sent, delegating error handling to Express default.', { error });
    // Note: Express's default handler might close the connection or log differently.
    // Depending on the scenario, you might need more sophisticated handling here.
    // For now, we log a warning and let the default handler take over.
    return next(error);
  }

  // Generate a unique ID for this error instance for tracking purposes
  const errorId = uuidv4();

  // --- Prepare Error Details ---
  let statusCode: number = 500; // Default to Internal Server Error
  let message: string = 'An unexpected internal server error occurred.';
  let errorCode: string = 'INTERNAL_SERVER_ERROR';
  let details: any = undefined;

  // --- Handle Specific Known Error Types ---

  // 1. Handle custom HttpException (most specific)
  if (error instanceof HttpException) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode || 'HTTP_EXCEPTION'; // Use custom code if available
    details = error.details; // Include details if provided by the exception
  }
  // 2. Handle class-validator errors (often wrapped or thrown as BadRequest)
  //    This check assumes validation errors might be in an array attached to the error,
  //    or the error itself might indicate validation failure. Adjust based on your setup.
  else if (Array.isArray(error) && error[0]?.constraints) { // Common pattern for class-validator errors passed directly
      statusCode = 400;
      message = 'Input validation failed.';
      errorCode = 'VALIDATION_ERROR';
      details = error.map(err => ({
          property: err.property,
          constraints: err.constraints,
          value: err.value,
      }));
  } else if (error.name === 'ValidationException' || error.name === 'BadRequestError' || (error.status === 400 && error.errors)) { // Handle custom validation wrappers or common names
      statusCode = 400;
      message = error.message || 'Input validation failed.';
      errorCode = 'VALIDATION_ERROR';
      details = error.details || error.errors; // Use provided details/errors
  }
  // 3. Handle specific database errors (e.g., TypeORM QueryFailedError)
  else if (error.name === 'QueryFailedError') {
    statusCode = 500; // Internal error, don't expose raw DB errors
    message = 'A database error occurred.'; // Generic message for production
    errorCode = 'DATABASE_ERROR';
    // Log the specific DB error detail for internal debugging
    logger.error('Database Query Failed', { detail: error.message });
  }
  // 4. Handle other common error names (add more as needed)
  else if (error.name === 'UnauthorizedError') { // Example: from express-jwt
      statusCode = 401;
      message = error.message || 'Authentication required.';
      errorCode = 'UNAUTHORIZED';
  } else if (error.name === 'ForbiddenError') {
      statusCode = 403;
      message = error.message || 'Permission denied.';
      errorCode = 'FORBIDDEN';
  }

  // --- Log the Error ---
  // Log with consistent structure, including the error ID
  logger.error(`Error handled: ${message}`, {
    errorId, // Include the unique ID for tracking
    errorCode,
    statusCode,
    originalMessage: error.message, // Log original message regardless of what's sent to client
    path: req.path,
    method: req.method,
    requestId: (req as any).id, // If using request ID middleware like express-request-id
    userId: (req as any).user?.id, // If user is available on the request
    // Avoid logging raw error object in production if it might contain sensitive data
    // In development, logging the full error can be useful
    ...(environment.nodeEnv === 'development' && { errorObject: error }),
    stack: error.stack, // Always log the stack trace
  });

  // --- Construct the Response ---
  const responseBody: ErrorResponse = {
    status: 'error',
    statusCode,
    code: errorCode,
    // Use the determined message, but fall back to a generic one for 500 errors in production
    message: (statusCode === 500 && environment.nodeEnv === 'production')
      ? 'Internal server error. Please try again later or contact support if the issue persists.'
      : message,
    // Include errorId in production response to help users report issues
    ...(environment.nodeEnv === 'production' && { errorId }),
    // Include details only if they exist and are deemed safe to expose
    ...(details && { details }),
    // Include stack trace ONLY in development environment
    ...(environment.nodeEnv === 'development' && { stack: error.stack }),
  };

  // --- Send the Response ---
  res.status(statusCode).json(responseBody);
};
