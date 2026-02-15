/**
 * Application Error Layer
 * Base error classes for consistent error handling across the application
 */

/**
 * HTTP Status Codes enum for type safety
 */
export enum HttpStatus {
    // 2xx Success
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // 4xx Client Errors
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

/**
 * Application Error Codes
 * Use these codes for programmatic error handling on the client
 */
export enum ErrorCode {
    // Authentication & Authorization
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    SESSION_EXPIRED = "SESSION_EXPIRED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

    // Resource Errors
    NOT_FOUND = "NOT_FOUND",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CONFLICT = "CONFLICT",

    // Validation Errors
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

    // Business Logic Errors
    BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
    OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

    // External Service Errors
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    GOOGLE_API_ERROR = "GOOGLE_API_ERROR",
    STRIPE_ERROR = "STRIPE_ERROR",
    S3_ERROR = "S3_ERROR",

    // Rate Limiting
    RATE_LIMITED = "RATE_LIMITED",

    // Server Errors
    INTERNAL_ERROR = "INTERNAL_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",

    // Unknown
    UNKNOWN = "UNKNOWN",
}

/**
 * Error metadata interface for additional context
 */
export interface ErrorMetadata {
    field?: string;
    fields?: string[];
    details?: Record<string, unknown>;
    cause?: Error;
    retryable?: boolean;
    retryAfter?: number;
}

/**
 * Serializable error data for client transmission
 */
export interface SerializedError {
    message: string;
    code: ErrorCode;
    status: HttpStatus;
    metadata?: ErrorMetadata;
}

/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class AppError extends Error {
    public readonly status: HttpStatus;
    public readonly code: ErrorCode;
    public readonly metadata?: ErrorMetadata;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        metadata?: ErrorMetadata
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.metadata = metadata;
        this.isOperational = true; // Distinguishes operational errors from programmer errors

        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Serialize error for transmission to client
     */
    toJSON(): SerializedError {
        return {
            message: this.message,
            code: this.code,
            status: this.status,
            metadata: this.metadata,
        };
    }

    /**
     * Create a copy of this error with additional metadata
     */
    withMetadata(metadata: Partial<ErrorMetadata>): AppError {
        return new AppError(this.message, this.status, this.code, {
            ...this.metadata,
            ...metadata,
        });
    }
}

// ============================================================================
// Authentication & Authorization Errors
// ============================================================================

/**
 * Unauthorized Error (401)
 * User is not authenticated
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = "Authentication required", metadata?: ErrorMetadata) {
        super(message, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, metadata);
    }
}

/**
 * Forbidden Error (403)
 * User is authenticated but lacks permission
 */
export class ForbiddenError extends AppError {
    constructor(
        message: string = "You do not have permission to perform this action",
        metadata?: ErrorMetadata
    ) {
        super(message, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, metadata);
    }
}

/**
 * Session Expired Error (401)
 * User session has expired
 */
export class SessionExpiredError extends AppError {
    constructor(message: string = "Your session has expired. Please sign in again.", metadata?: ErrorMetadata) {
        super(message, HttpStatus.UNAUTHORIZED, ErrorCode.SESSION_EXPIRED, metadata);
    }
}

// ============================================================================
// Resource Errors
// ============================================================================

/**
 * Not Found Error (404)
 * Requested resource does not exist
 */
export class NotFoundError extends AppError {
    constructor(resource: string = "Resource", metadata?: ErrorMetadata) {
        super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, metadata);
    }
}

/**
 * Already Exists Error (409)
 * Resource already exists (duplicate)
 */
export class AlreadyExistsError extends AppError {
    constructor(resource: string = "Resource", metadata?: ErrorMetadata) {
        super(`${resource} already exists`, HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS, metadata);
    }
}

/**
 * Conflict Error (409)
 * Generic conflict error
 */
export class ConflictError extends AppError {
    constructor(message: string = "A conflict occurred", metadata?: ErrorMetadata) {
        super(message, HttpStatus.CONFLICT, ErrorCode.CONFLICT, metadata);
    }
}

// ============================================================================
// Validation Errors
// ============================================================================

/**
 * Validation Error (422)
 * Input validation failed
 */
export class ValidationError extends AppError {
    constructor(message: string = "Validation failed", metadata?: ErrorMetadata) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, metadata);
    }

    /**
     * Create a validation error with field-specific details
     */
    static forField(field: string, message: string): ValidationError {
        return new ValidationError(message, { field });
    }

    /**
     * Create a validation error with multiple fields
     */
    static forFields(fields: string[], message: string): ValidationError {
        return new ValidationError(message, { fields });
    }
}

/**
 * Invalid Input Error (400)
 * Input is malformed or invalid
 */
export class InvalidInputError extends AppError {
    constructor(message: string = "Invalid input provided", metadata?: ErrorMetadata) {
        super(message, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT, metadata);
    }
}

/**
 * Missing Required Field Error (400)
 * Required field is missing
 */
export class MissingRequiredFieldError extends AppError {
    constructor(field: string, metadata?: ErrorMetadata) {
        super(`Missing required field: ${field}`, HttpStatus.BAD_REQUEST, ErrorCode.MISSING_REQUIRED_FIELD, {
            field,
            ...metadata,
        });
    }
}

// ============================================================================
// Business Logic Errors
// ============================================================================

/**
 * Business Rule Violation Error (400)
 * Business rule was violated
 */
export class BusinessRuleError extends AppError {
    constructor(message: string, metadata?: ErrorMetadata) {
        super(message, HttpStatus.BAD_REQUEST, ErrorCode.BUSINESS_RULE_VIOLATION, metadata);
    }
}

/**
 * Operation Not Allowed Error (403)
 * Operation cannot be performed in current state
 */
export class OperationNotAllowedError extends AppError {
    constructor(message: string = "This operation is not allowed", metadata?: ErrorMetadata) {
        super(message, HttpStatus.FORBIDDEN, ErrorCode.OPERATION_NOT_ALLOWED, metadata);
    }
}

// ============================================================================
// External Service Errors
// ============================================================================

/**
 * External Service Error (502)
 * Error from external service
 */
export class ExternalServiceError extends AppError {
    constructor(
        serviceName: string,
        message: string = "External service error",
        metadata?: ErrorMetadata
    ) {
        super(
            `${serviceName}: ${message}`,
            HttpStatus.BAD_GATEWAY,
            ErrorCode.EXTERNAL_SERVICE_ERROR,
            metadata
        );
    }
}

/**
 * Google API Error (502)
 * Error from Google APIs
 */
export class GoogleApiError extends AppError {
    constructor(message: string = "Google API error", metadata?: ErrorMetadata) {
        super(message, HttpStatus.BAD_GATEWAY, ErrorCode.GOOGLE_API_ERROR, metadata);
    }
}

/**
 * Stripe Error (502)
 * Error from Stripe API
 */
export class StripeError extends AppError {
    constructor(message: string = "Payment processing error", metadata?: ErrorMetadata) {
        super(message, HttpStatus.BAD_GATEWAY, ErrorCode.STRIPE_ERROR, metadata);
    }
}

/**
 * S3 Error (502)
 * Error from AWS S3
 */
export class S3Error extends AppError {
    constructor(message: string = "Storage service error", metadata?: ErrorMetadata) {
        super(message, HttpStatus.BAD_GATEWAY, ErrorCode.S3_ERROR, metadata);
    }
}

// ============================================================================
// Rate Limiting Errors
// ============================================================================

/**
 * Rate Limited Error (429)
 * Too many requests
 */
export class RateLimitedError extends AppError {
    constructor(
        message: string = "Too many requests. Please try again later.",
        retryAfter?: number,
        metadata?: ErrorMetadata
    ) {
        super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMITED, {
            retryable: true,
            retryAfter,
            ...metadata,
        });
    }
}

// ============================================================================
// Server Errors
// ============================================================================

/**
 * Internal Server Error (500)
 * Unexpected server error
 */
export class InternalError extends AppError {
    constructor(message: string = "An unexpected error occurred", metadata?: ErrorMetadata) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, metadata);
    }
}

/**
 * Database Error (500)
 * Database operation failed
 */
export class DatabaseError extends AppError {
    constructor(message: string = "Database operation failed", metadata?: ErrorMetadata) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, metadata);
    }
}

/**
 * Network Error (503)
 * Network connectivity issue
 */
export class NetworkError extends AppError {
    constructor(message: string = "Network error occurred", metadata?: ErrorMetadata) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, ErrorCode.NETWORK_ERROR, {
            retryable: true,
            ...metadata,
        });
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Convert any error to an AppError
 */
export function toAppError(error: unknown): AppError {
    if (isAppError(error)) {
        return error;
    }

    if (error instanceof Error) {
        return new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.UNKNOWN, {
            cause: error,
        });
    }

    return new AppError(
        typeof error === "string" ? error : "An unexpected error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN
    );
}

/**
 * Create an AppError from a serialized error object
 */
export function fromSerializedError(data: SerializedError): AppError {
    return new AppError(data.message, data.status, data.code, data.metadata);
}
