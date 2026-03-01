"use client";

import { useCallback, useState } from "react";

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
 */
export function useReviewTracker(slug: string | undefined) {
  const cookieName = slug ? `${COOKIE_PREFIX}${slug}` : "";

  // Track when we set the cookie this session (triggers re-render)
  const [markedThisSession, setMarkedThisSession] = useState(false);

  // Read cookie synchronously during render — cheap and always up to date.
  // This correctly handles: SSR (returns false), async slug arrival, and page reloads.
  const hasAlreadyReviewed =
    markedThisSession || (cookieName ? !!getCookie(cookieName) : false);

  // Call this after the user completes their review
  const markReviewed = useCallback(
    (rating?: number) => {
      if (!cookieName) return;
      const value = JSON.stringify({
        reviewedAt: new Date().toISOString(),
        rating: rating ?? null,
      });
      setCookie(cookieName, value, COOKIE_MAX_AGE_DAYS);
      setMarkedThisSession(true);
    },
    [cookieName],
  );

  return { hasAlreadyReviewed, markReviewed };
}
