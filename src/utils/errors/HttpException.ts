import { logger } from '@config/logger'; // Assuming logger is available for internal logging if needed

/**
 * Base class for custom HTTP exceptions.
 * Includes statusCode, a machine-readable errorCode, an optional details payload,
 * and support for chaining the original error cause.
 */
export class HttpException extends Error {
  public statusCode: number;
  public errorCode: string; // Machine-readable code (e.g., 'NOT_FOUND', 'INVALID_INPUT')
  public details?: any; // Optional payload for additional details (like validation errors)

  /**
   * Creates an instance of HttpException.
   * @param statusCode - The HTTP status code (e.g., 404, 400).
   * @param message - The human-readable error message.
   * @param errorCode - A machine-readable error code string.
   * @param details - Optional additional details payload.
   * @param cause - Optional original error that caused this exception.
   */
  constructor(
    statusCode: number,
    message: string,
    errorCode: string, // Make errorCode mandatory for the base class
    details?: any,
    options?: { cause?: Error }
  ) {
    super(message); // Pass only the message to the base Error constructor
    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.details = details;
    this.name = this.constructor.name; // Set name to the specific subclass name (e.g., 'NotFoundException')
    if (options?.cause) {
      (this as any).cause = options.cause; // Manually assign cause for compatibility
    }

    // Ensure the stack trace captures the location where the exception was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// --- Specific HTTP Exception Subclasses ---

export class BadRequestException extends HttpException {
  constructor(
    message = 'Bad Request',
    details?: any,
    errorCode = 'BAD_REQUEST', // Default errorCode for this type
    options?: { cause?: Error }
  ) {
    super(400, message, errorCode, details, options);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(
    message = 'Unauthorized',
    details?: any,
    errorCode = 'UNAUTHORIZED',
    options?: { cause?: Error }
  ) {
    super(401, message, errorCode, details, options);
  }
}

export class ForbiddenException extends HttpException {
  constructor(
    message = 'Forbidden',
    details?: any,
    errorCode = 'FORBIDDEN',
    options?: { cause?: Error }
  ) {
    super(403, message, errorCode, details, options);
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message = 'Not Found',
    details?: any,
    errorCode = 'NOT_FOUND',
    options?: { cause?: Error }
  ) {
    super(404, message, errorCode, details, options);
  }
}

export class ConflictException extends HttpException {
  constructor(
    message = 'Conflict',
    details?: any,
    errorCode = 'CONFLICT',
    options?: { cause?: Error }
  ) {
    super(409, message, errorCode, details, options);
  }
}

// Example: Validation Exception extending BadRequest
export class ValidationException extends BadRequestException {
    constructor(
        details: any, // Typically an array of validation errors
        message = 'Input validation failed',
        errorCode = 'VALIDATION_ERROR', // More specific code
        options?: { cause?: Error }
    ) {
        super(message, details, errorCode, options);
    }
}


export class InternalServerErrorException extends HttpException {
  constructor(
    message = 'Internal Server Error',
    details?: any,
    errorCode = 'INTERNAL_SERVER_ERROR',
    options?: { cause?: Error } // Important for logging the original error
  ) {
    super(500, message, errorCode, details, options);
    // Log the original cause if provided, as it might be hidden from the client
    if (options?.cause) {
        logger.error(`InternalServerError caused by: ${options.cause.message}`, { originalError: options.cause });
    }
  }
}

// --- Example Usage ---
// throw new NotFoundException('User with ID 123 not found.');
// throw new BadRequestException('Missing required field: email');
// try {
//   // some operation that fails
// } catch (error) {
//   throw new InternalServerErrorException('Failed to process request', undefined, undefined, { cause: error as Error });
// }
// const validationErrors = [{ field: 'email', message: 'Invalid format' }];
// throw new ValidationException(validationErrors);