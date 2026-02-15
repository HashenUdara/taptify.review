/**
 * Client Error Layer
 * Error handling utilities for client-side code
 */

import type { SerializedError, ErrorMetadata } from "./app-error";
import { ErrorCode, HttpStatus } from "./app-error";

/**
 * Client-side error class that mirrors server AppError
 * Use this on the client to handle errors from server actions
 */
export class ClientError extends Error {
    public readonly status: HttpStatus;
    public readonly code: ErrorCode;
    public readonly metadata?: ErrorMetadata;

    constructor(
        message: string,
        status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode = ErrorCode.UNKNOWN,
        metadata?: ErrorMetadata
    ) {
        super(message);
        this.name = "ClientError";
        this.status = status;
        this.code = code;
        this.metadata = metadata;
    }

    /**
     * Check if this is a specific error type by code
     */
    is(code: ErrorCode): boolean {
        return this.code === code;
    }

    /**
     * Check if this error is due to authentication issues
     */
    isAuthError(): boolean {
        return this.code === ErrorCode.UNAUTHORIZED || this.code === ErrorCode.SESSION_EXPIRED;
    }

    /**
     * Check if this error is retryable
     */
    isRetryable(): boolean {
        return this.metadata?.retryable === true;
    }

    /**
     * Get retry delay in milliseconds
     */
    getRetryDelay(): number {
        return (this.metadata?.retryAfter ?? 1) * 1000;
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage(): string {
        // Map error codes to user-friendly messages
        const userMessages: Partial<Record<ErrorCode, string>> = {
            [ErrorCode.UNAUTHORIZED]: "Please sign in to continue",
            [ErrorCode.SESSION_EXPIRED]: "Your session has expired. Please sign in again",
            [ErrorCode.FORBIDDEN]: "You don't have permission to do this",
            [ErrorCode.NOT_FOUND]: "The requested item was not found",
            [ErrorCode.RATE_LIMITED]: "Too many requests. Please wait a moment and try again",
            [ErrorCode.NETWORK_ERROR]: "Network error. Please check your connection",
            [ErrorCode.INTERNAL_ERROR]: "Something went wrong. Please try again later",
        };

        return userMessages[this.code] || this.message;
    }
}

/**
 * Create ClientError from server serialized error data
 */
export function createClientError(data: SerializedError): ClientError {
    return new ClientError(data.message, data.status, data.code, data.metadata);
}

/**
 * Create ClientError from standard Error object
 * Useful for wrapping caught exceptions
 */
export function wrapError(error: unknown): ClientError {
    if (error instanceof ClientError) {
        return error;
    }

    if (error instanceof Error) {
        // Try to parse as SerializedError if it looks like JSON
        if (error.message.startsWith("{")) {
            try {
                const parsed = JSON.parse(error.message) as SerializedError;
                return createClientError(parsed);
            } catch {
                // Not JSON, continue with regular error handling
            }
        }

        return new ClientError(error.message);
    }

    return new ClientError(
        typeof error === "string" ? error : "An unexpected error occurred"
    );
}

/**
 * Error handler result type
 */
export interface ErrorHandlerResult {
    handled: boolean;
    message: string;
    shouldRetry: boolean;
    retryDelay?: number;
}

/**
 * Handle common error patterns and provide appropriate responses
 */
export function handleError(error: unknown): ErrorHandlerResult {
    const clientError = wrapError(error);

    return {
        handled: true,
        message: clientError.getUserMessage(),
        shouldRetry: clientError.isRetryable(),
        retryDelay: clientError.isRetryable() ? clientError.getRetryDelay() : undefined,
    };
}

/**
 * Type guard for checking if a value is a SerializedError
 */
export function isSerializedError(value: unknown): value is SerializedError {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const obj = value as Record<string, unknown>;
    return (
        typeof obj.message === "string" &&
        typeof obj.code === "string" &&
        typeof obj.status === "number"
    );
}

/**
 * Parse error from action result
 * Handles both Error objects and serialized error data
 */
export function parseActionError(error: Error | SerializedError): ClientError {
    if (isSerializedError(error)) {
        return createClientError(error);
    }

    return wrapError(error);
}

// Re-export types and enums for convenient client usage
export { ErrorCode, HttpStatus } from "./app-error";
export type { SerializedError, ErrorMetadata } from "./app-error";
