"use client";

import { useCallback, useSyncExternalStore, useRef } from "react";

const COOKIE_PREFIX = "taptify_reviewed_";
const COOKIE_MAX_AGE_DAYS = 365;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Hook to track whether a user has already submitted a review for a given slug.
 *
 * On first visit: no cookie exists → `hasAlreadyReviewed` is false.
 * After completing a review: call `markReviewed()` → sets a cookie.
 * On subsequent visits: cookie is detected → `hasAlreadyReviewed` is true.
 *
 * Uses useSyncExternalStore so the server always returns false (no hydration mismatch)
 * and the client reads the real cookie value after hydration.
 */
export function useReviewTracker(slug: string | undefined) {
  const cookieName = slug ? `${COOKIE_PREFIX}${slug}` : "";

  // Listeners that get notified when we write a cookie
  const listeners = useRef(new Set<() => void>());

  const subscribe = useCallback((onStoreChange: () => void) => {
    listeners.current.add(onStoreChange);
    return () => {
      listeners.current.delete(onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (!cookieName) return false;
    return !!getCookie(cookieName);
  }, [cookieName]);

  // Server always returns false — matches initial client render
  const getServerSnapshot = useCallback(() => false, []);

  const hasAlreadyReviewed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Call this after the user completes their review
  const markReviewed = useCallback(
    (rating?: number) => {
      if (!cookieName) return;
      const value = JSON.stringify({
        reviewedAt: new Date().toISOString(),
        rating: rating ?? null,
      });
      setCookie(cookieName, value, COOKIE_MAX_AGE_DAYS);
      // Notify useSyncExternalStore that the cookie changed
      listeners.current.forEach((fn) => fn());
    },
    [cookieName],
  );

  return { hasAlreadyReviewed, markReviewed };
}
