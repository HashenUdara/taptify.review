/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Action Middleware
 * Provides a wrapper for server actions to handle errors consistently
 */

import { unstable_rethrow } from "next/navigation";
import { isAppError, toAppError } from "@/lib/errors/app-error";
import { Result } from "@/types/api-client";
import { ActionOptions, handleTriggers, performNavigation } from "./triggers";

export type { ActionOptions };

/**
 * Handles navigation effects in an action result.
 * Useful for calling actions from other server functions.
 */
export function handleActionResult<T>(result: Result<T, string>) {
  if (!result.success) {
    performNavigation(result);
  }
}

/**
 * Type for a server action function
 */
export type ServerAction<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<Result<TResult, string>>;

/**
 * Wraps a server action with consistent error handling
 *
 * @param action The server action function to wrap
 * @param options Configuration for error handling behavior
 * @returns A wrapped action that returns a Result object
 */
export function createAction<TArgs extends any[], TResult>(
  action: (...args: TArgs) => Promise<Result<TResult>>,
  options: ActionOptions = {},
): ServerAction<TArgs, TResult> {
  return async (...args: TArgs): Promise<Result<TResult, string>> => {
    try {
      const result = await action(...args);

      // If the action returned a failure result, process navigation triggers
      if (!result.success) {
        const error = toAppError(result.error);
        const triggerEffect = handleTriggers(error, options);

        if (triggerEffect) {
          return {
            ...{
              success: false,
              error: error.message,
            },
            ...triggerEffect,
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }

      return result;
    } catch (error) {
      // 1. Re-throw Next.js internal errors (redirect, notFound)
      // This allows direct use of redirect() or notFound() inside actions
      unstable_rethrow(error);

      // 2. Convert to AppError for consistent processing
      const appError = toAppError(error);

      // 3. Handle navigation triggers
      const triggerEffect = handleTriggers(appError, options);
      if (triggerEffect) {
        return {
          success: false,
          error: appError.message,
          ...triggerEffect,
        };
      }

      // 4. Fallback: Log and return generic error result
      if (!isAppError(error)) {
        console.error("[Action Unexpected Error]:", error);
      } else {
        console.error(`[Action Error ${appError.code}]:`, appError.message);
      }

      return {
        success: false,
        error: appError.message,
      };
    }
  };
}
