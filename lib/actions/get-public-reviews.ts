"use server";

import { Result } from "@/types/api-client";

import { apiRequest } from "@/lib/api-client";

/**
 * Fetches the latest 20 reviews for a public review link.
 * This is used to provide context for AI review generation to ensure uniqueness.
 */
export async function getPublicReviewsAction(
  slug: string,
): Promise<Result<string[]>> {
  return apiRequest<string[]>("/review-link/public-reviews", {
    params: { slug },
  });
}
