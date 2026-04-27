"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { apiRequest } from "@/lib/api-client";

export async function streamAIReviewDraftAction(params: {
  keywords: string[];
  businessName?: string;
  recentReviews?: string[];
}) {
  const stream = createStreamableValue();

  (async () => {
    try {
      const BASE_URL = process.env.TAPTIFY_REVIEWS_BASE_URL;
      const API_KEY = process.env.TAPTIFY_REVIEWS_API_KEY;

      const response = await fetch(`${BASE_URL}/review-link/ai-draft`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to AI stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep any incomplete chunk in the buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.success && parsed.draft) {
                // Instantly pipe each character update to the frontend UI
                stream.update({ draft: parsed.draft });
              } else if (!parsed.success && parsed.error) {
                stream.error(parsed.error);
                return;
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      stream.done();
    } catch (error) {
      console.error("Error in streamAIReviewDraft:", error);
      stream.error(error);
    }
  })();

  return stream.value;
}

export async function transcribeVoiceAction(audioBase64: string) {
  return apiRequest<{ text: string }>("/review-link/transcribe", {
    method: "POST",
    body: { audio: audioBase64 },
  });
}
