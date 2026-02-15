"server only";

import { QueryClient } from "@tanstack/react-query";
import {
  getReviewLinkAction,
  getLocationReviewLinksAction,
  checkSlugAvailabilityAction,
  getPublicReviewLinkBySlugAction,
} from "@/lib/actions";

/**
 * Query key factory for review links
 * Enables organized caching and invalidation strategies
 */
import { handleActionResult } from "../actions/middleware";
import { reviewLinkKeys } from ".";
type ReviewLinksListResult = Awaited<
  ReturnType<typeof getLocationReviewLinksAction>
>;
type ReviewLinkDetailResult = Awaited<ReturnType<typeof getReviewLinkAction>>;
type SlugAvailabilityResult = Awaited<
  ReturnType<typeof checkSlugAvailabilityAction>
>;

/**
 * Review link query definitions for TanStack Query
 */
export const reviewLinkQueries = {
  /**
   * Fetch all review links for a location (authenticated)
   */
  list: (prefetchedResult?: ReviewLinksListResult) => ({
    queryKey: reviewLinkKeys.list(),
    queryFn: async () => {
      const result = prefetchedResult ?? (await getLocationReviewLinksAction());
      if (!result.success) {
        throw new Error("Failed to fetch review links");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  }),

  /**
   * Fetch a single review link details (authenticated)
   */
  detail: (
    linkId: string,
    isPublic?: boolean,
    prefetchedResult?: ReviewLinkDetailResult,
  ) => ({
    queryKey: reviewLinkKeys.detail(linkId),
    queryFn: async () => {
      const result =
        prefetchedResult ??
        (isPublic
          ? await getPublicReviewLinkBySlugAction(linkId)
          : await getReviewLinkAction(linkId));
      if (!result.success) {
        throw new Error("Failed to fetch review link details");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
  }),

  /**
   * Check slug availability (unauthenticated)
   */
  slugAvailability: (
    slug: string,
    excludeId?: string,
    prefetchedResult?: SlugAvailabilityResult,
  ) => ({
    queryKey: reviewLinkKeys.slugAvailability(slug, excludeId),
    queryFn: async () => {
      const result =
        prefetchedResult ??
        (await checkSlugAvailabilityAction(slug, excludeId));
      if (!result.success) {
        throw new Error("Failed to check slug availability");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  }),
};

/**
 * Prefetch helper for review links
 * Useful for SSR and route transitions
 */
export async function prefetchReviewLinkQueries(queryClient: QueryClient) {
  const resList = await getLocationReviewLinksAction();

  handleActionResult(resList);

  await Promise.all([
    queryClient.prefetchQuery(reviewLinkQueries.list(resList)),
  ]);
}

export async function prefetchReviewLinkDetailQuery(
  queryClient: QueryClient,
  linkId?: string,
  isPublic?: boolean,
) {
  if (linkId) {
    const resDetail = isPublic
      ? await getPublicReviewLinkBySlugAction(linkId)
      : await getReviewLinkAction(linkId);

    handleActionResult(resDetail);

    await queryClient.prefetchQuery(
      reviewLinkQueries.detail(linkId, isPublic, resDetail),
    );
  }
}
