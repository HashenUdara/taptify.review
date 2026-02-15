/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useReviewFeedbackMutation } from "@/hooks";
import { ViewSource } from "@/types";

interface ThankYouStepProps {
  config: {
    positiveHeadline: string;
    positiveSubheadline: string;
    positiveCtaText: string;
    primaryColor: string;
    customSlug?: string;
  };
  isDarkTheme: boolean;
  previewRating: number;
  minRatingForGoogle: number;
  googleReviewUrl?: string;
  page?: boolean;
  contactId?: string;
  contactPhone?: string;
  viewSource?: ViewSource;
}

export function ThankYouStep({
  config,
  isDarkTheme,
  page = false,
  previewRating,
  viewSource,
  minRatingForGoogle,
  googleReviewUrl,
  contactId,
  contactPhone,
}: ThankYouStepProps) {
  const { submitPositiveMutation } = useReviewFeedbackMutation();
  // Prevent duplicate submissions
  const hasLogged = useRef(false);

  useEffect(() => {
    const isPositiveReview = previewRating >= minRatingForGoogle;

    // Log positive review completion when on actual page (not preview)
    if (
      isPositiveReview &&
      googleReviewUrl &&
      page &&
      config.customSlug &&
      !hasLogged.current
    ) {
      hasLogged.current = true;

      // Log activity first, then redirect
      submitPositiveMutation.mutate({
        slug: config.customSlug,
        rating: previewRating,
        viewSource,
        contactId,
        contactPhone,
      });

      // Redirect to Google after short delay
      setTimeout(() => {
        window.location.href = googleReviewUrl;
      }, 2000);
    }
  }, [
    previewRating,
    minRatingForGoogle,
    googleReviewUrl,
    page,
    config.customSlug,
    contactId,
    contactPhone,
    submitPositiveMutation,
  ]);

  return (
    <div className="text-center space-y-6 animate-in fade-in zoom-in-95 relative z-10">
      <div className="flex justify-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: config.primaryColor }}
        >
          <Check className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <h2
          className={cn(
            "text-2xl font-semibold tracking-tight",
            isDarkTheme ? "text-white" : "text-zinc-900",
          )}
        >
          {config.positiveHeadline}
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkTheme ? "text-white/50" : "text-zinc-500",
          )}
        >
          {config.positiveSubheadline}
        </p>
      </div>

      {previewRating >= minRatingForGoogle && googleReviewUrl && page && (
        <div className="flex flex-col justify-center animate-pulse items-center gap-2 mx-auto w-fit text-muted-foreground pt-4">
          <p>Redirecting to Google...</p>
          <IconLoader className="size-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
