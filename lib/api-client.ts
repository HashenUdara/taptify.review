"use server";
import { Result } from "@/types/api-client";

const BASE_URL = process.env.TAPTIFY_REVIEWS_BASE_URL;
const API_KEY = process.env.TAPTIFY_REVIEWS_API_KEY;

/**
 * Reusable API request helper for Taptify Reviews API
 */
export async function apiRequest<T>(
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

    return { success: true, data: json.data !== undefined ? json.data : json };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
