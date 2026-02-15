/**
 * Action Middleware Triggers
 * Defines automatic navigation triggers based on action results/errors
 */

import { notFound, redirect } from "next/navigation";
import { AppError, ErrorCode, HttpStatus } from "@/lib/errors/app-error";

/**
 * Options for the createAction middleware
 */
export interface ActionOptions {
    /**
     * If true, NOT_FOUND errors will return notFound: true in the result.
     */
    handleNotFound?: boolean;

    /**
     * Custom redirect URL for authentication/authorization errors.
     * If not provided, defaults to the dashboard integrations page.
     */
    authRedirect?: string;

    /**
     * Disable automatic navigation triggers for this action.
     */
    disableTriggers?: boolean;

    /**
     * Legacy option: If true, NOT_FOUND errors will return notFound: true.
     * @deprecated Use handleNotFound instead.
     */
    throwNotFound?: boolean;
}

/**
 * Navigation result that can be merged into a Result object
 */
export interface NavigationEffect {
    redirect?: string;
    notFound?: boolean;
}

/**
 * Navigation trigger definition for scalable error handling
 */
export interface NavigationTrigger {
    id: string;
    match: (error: AppError) => boolean;
    handle: (error: AppError, options: ActionOptions) => NavigationEffect | null;
}

/**
 * Registry of navigation triggers.
 * Add new system-wide triggers here to scale the middleware.
 */
export const NAVIGATION_TRIGGERS: NavigationTrigger[] = [
    {
        id: "not-found",
        match: (error) =>
            error.code === ErrorCode.NOT_FOUND ||
            error.status === HttpStatus.NOT_FOUND ||
            error.message.toLowerCase().includes("not found"),
        handle: (error, options) =>
            options.handleNotFound || options.throwNotFound
                ? { notFound: true }
                : null,
    },
    {
        id: "auth-failure",
        match: (error) =>
            error.code === ErrorCode.UNAUTHORIZED ||
            error.code === ErrorCode.FORBIDDEN ||
            error.code === ErrorCode.SESSION_EXPIRED ||
            error.status === HttpStatus.UNAUTHORIZED ||
            error.status === HttpStatus.FORBIDDEN ||
            error.message.toLowerCase().includes("invalid authentication credentials"),
        handle: (error, options) => ({
            redirect: options.authRedirect || "/dashboard/integrations/google",
        }),
    },
];

/**
 * Applies navigation triggers to an error based on options
 */
export function applyTriggers(
    error: AppError,
    options: ActionOptions
): NavigationEffect | null {
    if (options.disableTriggers) return null;

    for (const trigger of NAVIGATION_TRIGGERS) {
        if (trigger.match(error)) {
            const effect = trigger.handle(error, options);
            if (effect) return effect;
        }
    }

    return null;
}

/**
 * Executes navigation side effects from a NavigationEffect
 */
export function performNavigation(effect: NavigationEffect) {
    if (effect.redirect) {
        redirect(effect.redirect);
    }
    if (effect.notFound) {
        notFound();
    }
}

/**
 * Applies navigation triggers to an error and executes them if found
 */
export function handleTriggers(
    error: AppError,
    options: ActionOptions
): NavigationEffect | null {
    const effect = applyTriggers(error, options);
    if (effect) {
        performNavigation(effect);
    }
    return effect;
}

