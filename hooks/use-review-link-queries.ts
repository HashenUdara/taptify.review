import { useQuery } from "@tanstack/react-query";
import { reviewLinkQueries } from "@/lib/queries/review-link.queries";

/**
 * Hook for fetching all review links for a location
 */
export function useReviewLinks() {
  return useQuery(reviewLinkQueries.list());
}

/**
 * Hook for fetching a single review link
 */
export function useReviewLinkDetail(
  linkId: string,
  options?: { enabled?: boolean },
  isPublic?: boolean,
) {
  return useQuery({
    ...reviewLinkQueries.detail(linkId, isPublic),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook for fetching a public review link by slug
 */
// export function usePublicReviewLink(slug: string, enabled = true) {
//   return useQuery({
//     ...reviewLinkQueries.publicBySlug(slug),
//     enabled,
//   });
// }

/**
 * Hook for checking slug availability
 */
export function useSlugAvailability(
  slug: string,
  excludeId?: string,
  enabled = true,
) {
  return useQuery({
    ...reviewLinkQueries.slugAvailability(slug, excludeId),
    enabled: enabled && !!slug,
  });
}

/**
 * Hook for fetching public reviews context for AI
 */
export function usePublicReviews(
  slug: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...reviewLinkQueries.publicReviews(slug),
    enabled: options?.enabled ?? !!slug,
  });
}
