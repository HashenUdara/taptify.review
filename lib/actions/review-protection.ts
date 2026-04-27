"use server";

import { Contact, Result, ViewSource } from "@/types";
import { ReviewFeedback } from "@/types/review-feedback";
import { ReviewLinkConfig } from "@/schemas/review-link";

import { apiRequest } from "@/lib/api-client";

export async function getReviewLinkAction(
  linkId: string,
): Promise<Result<ReviewLinkConfig>> {
  return apiRequest<ReviewLinkConfig>("/review-link", {
    params: { linkId },
  });
}

export async function getLocationReviewLinksAction(): Promise<
  Result<ReviewLinkConfig[]>
> {
  return apiRequest<ReviewLinkConfig[]>("/location-review-links");
}

export async function checkSlugAvailabilityAction(
  slug: string,
  excludeId?: string,
): Promise<Result<boolean>> {
  return apiRequest<boolean>("/check-slug", {
    params: { slug, excludeId },
  });
}

export async function getPublicReviewLinkBySlugAction(
  slug: string,
): Promise<Result<ReviewLinkConfig>> {
  return apiRequest<ReviewLinkConfig>("/review-link/by-slug", {
    params: { slug },
  });
}

export async function submitNegativeReviewFeedbackAction(params: {
  slug: string;
  rating: number;
  feedbackText?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactId?: string;
  viewSource?: ViewSource;
}): Promise<Result<Partial<ReviewFeedback>>> {
  return apiRequest<Partial<ReviewFeedback>>("/negative-feedback", {
    method: "POST",
    body: params,
  });
}

export async function submitPositiveReviewAction(params: {
  slug: string;
  rating: number;
  contactId?: string;
  contactPhone?: string;
  viewSource?: ViewSource;
}): Promise<Result<{ logged: boolean }>> {
  return apiRequest<{ logged: boolean }>("/positive-review", {
    method: "POST",
    body: params,
  });
}

export async function cancelSmsOnLinkClickAction(
  contactId: string | undefined | null,
  slug: string | undefined | null,
  source: string,
): Promise<Result<{ cancelled: number; contact: Contact | null }>> {
  return apiRequest<{ cancelled: number; contact: Contact | null }>(
    "/cancel-sms",
    {
      method: "POST",
      body: { contactId, slug, source },
    },
  );
}
