"use server";

import { Contact, Result, ViewSource } from "@/types";
import { ReviewFeedback } from "@/types/review-feedback";
import { ReviewLinkConfig } from "@/schemas/review-link";

const BASE_URL = process.env.TAPTIFY_REVIEWS_BASE_URL;
const API_KEY = process.env.TAPTIFY_REVIEWS_API_KEY;

async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST";
    params?: Record<string, string | undefined>;
    body?: unknown;
  } = {},
): Promise<Result<T>> {
  const { method = "GET", params, body } = options;

  if (!BASE_URL || !API_KEY) {
    return {
      success: false,
      error: new Error("API configuration missing"),
    };
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      return {
        success: false,
        error: new Error(json.error || "Request failed"),
        notFound: response.status === 404,
      };
    }

    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

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
): Promise<Result<{ cancelled: number; contact: Contact | null }>> {
  return apiRequest<{ cancelled: number; contact: Contact | null }>(
    "/cancel-sms",
    {
      method: "POST",
      body: { contactId, slug },
    },
  );
}
