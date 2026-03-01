"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BrowserChrome,
  CoverImage,
  PreviewControls,
  PreviewFooter,
} from "./helpers";
import {
  AlreadyReviewedStep,
  FeedbackStep,
  RatingStep,
  RedirectStep,
  ThankYouStep,
} from "./steps";
import useReviewLinkStore from "@/stores/review-link-store";
import { toast } from "sonner";
import { Contact, ViewSource } from "@/types";
import { useSearchParams } from "next/navigation";
import { useReviewFeedbackMutation } from "@/hooks";
import { ReviewPagePreviewSkeleton } from "./review-page-preview-skeleton";

export function ReviewPagePreview({
  isLoading,
  title,
  page = false,
  googleReviewUrl,
  status,
  identifiedContact,
  mobilePreviewOnly,
  hasAlreadyReviewed = false,
  onReviewComplete,
}: {
  isLoading: boolean;
  title: string;
  page?: boolean;
  googleReviewUrl?: string;
  mobilePreviewOnly?: boolean;
  status?: "draft" | "published";
  identifiedContact: Contact | null;
  hasAlreadyReviewed?: boolean;
  onReviewComplete?: (rating?: number) => void;
}) {
  // Local UI-only state (feedback input, view mode)
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [feedback, setFeedback] = useState("");

  // Subscribe to store state - granular subscriptions
  const config = useReviewLinkStore((s) => s.config);
  const previewRating = useReviewLinkStore((s) => s.previewRating);
  const setPreviewRating = useReviewLinkStore((s) => s.setPreviewRating);
  const previewStep = useReviewLinkStore((s) => s.previewStep);
  const setPreviewStep = useReviewLinkStore((s) => s.setPreviewStep);
  const resetPreview = useReviewLinkStore((s) => s.resetPreview);

  const searchParams = useSearchParams();
  const source = searchParams.get("source") as ViewSource | undefined;

  const handleStarClick = (rating: number) => {
    setPreviewRating(rating);
    setTimeout(() => {
      if (rating >= config.minRatingForGoogle) {
        setPreviewStep("redirect");
        setTimeout(() => {
          setPreviewStep("thankyou");
          onReviewComplete?.(rating);
        }, 1500);
      } else if (config.enableFeedbackForLowRating) {
        setPreviewStep("feedback");
      } else {
        setPreviewStep("thankyou");
        onReviewComplete?.(rating);
      }
    }, 500);
  };

  const { submitMutation } = useReviewFeedbackMutation();

  const handleFeedbackSubmit = async (
    slug: string,
    rating: number,
    feedbackText?: string,
    userInfo?: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    },
  ) => {
    try {
      await submitMutation.mutateAsync({
        slug,
        rating,
        feedbackText,
        viewSource: source ?? ViewSource.SHARED,
        contactName: userInfo
          ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
          : undefined,
        contactEmail: userInfo?.email,
        contactPhone: userInfo?.phone,
        contactId: identifiedContact?.id,
      });
      setPreviewStep("thankyou");
      setFeedback("");
      onReviewComplete?.(rating);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "There was an error submitting your feedback. Please try again.",
      );
    }
  };

  const handleReset = () => {
    resetPreview();
    setFeedback("");
  };

  const isDarkTheme = config.theme === "dark";

  // Scoped theming: isolate preview from app theme by setting explicit styles/classes
  const previewThemeStyles = useMemo(() => {
    if (isDarkTheme) {
      return {
        backgroundColor: "#0B0B0F",
        color: "#E5E7EB",
      } as React.CSSProperties;
    }
    return {
      backgroundColor: "#FFFFFF",
      color: "#0B0B0F",
    } as React.CSSProperties;
  }, [isDarkTheme]);

  const previewThemeClass = useMemo(
    () => (isDarkTheme ? "preview-dark" : "preview-light"),
    [isDarkTheme],
  );

  if (isLoading) {
    return <ReviewPagePreviewSkeleton mobilePreviewOnly={mobilePreviewOnly} />;
  }

  return (
    <div className="h-full flex flex-col">
      {!page && !mobilePreviewOnly && (
        <PreviewControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          previewRating={previewRating}
          minRatingForGoogle={config.minRatingForGoogle}
          onReset={handleReset}
          status={status}
          isActive={config.isActive}
        />
      )}

      {/* Preview Content */}
      <div
        className={cn(
          !page && "flex-1 flex items-center justify-center",
          !page && !mobilePreviewOnly ? "p-6" : undefined,
        )}
        style={
          !page && !mobilePreviewOnly
            ? {
                backgroundImage:
                  "radial-gradient(circle, rgba(150, 150, 150, 0.3) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }
            : undefined
        }
      >
        <div
          className={cn(
            "shadow-2xl shadow-black/40 relative h-[80%] overflow-hidden transition-all duration-300 isolate",
            previewThemeClass,
            !page && !mobilePreviewOnly
              ? viewMode === "mobile"
                ? "w-93.75 rounded-2xl"
                : "w-180 rounded-2xl"
              : "w-screen",
            mobilePreviewOnly && "w-full h-full",
          )}
          style={previewThemeStyles}
        >
          {!page && !mobilePreviewOnly && (
            <BrowserChrome
              customSlug={config.customSlug}
              isDarkTheme={isDarkTheme}
            />
          )}

          {/* Split Layout - Content Left, Cover Right */}
          <div className={cn("flex", page ? "h-screen" : "h-125")}>
            {/* Left Side - Review Content */}
            <div
              className={cn(
                "flex flex-col flex-1/2 items-center justify-center p-10 transition-colors duration-300",
                config.coverUrl && viewMode === "desktop" ? "w-1/2" : "w-full",
              )}
              style={previewThemeStyles}
            >
              {hasAlreadyReviewed && page ? (
                <AlreadyReviewedStep
                  config={config}
                  isDarkTheme={isDarkTheme}
                />
              ) : previewStep === "rating" ? (
                <RatingStep
                  title={title}
                  config={config}
                  isDarkTheme={isDarkTheme}
                  onRatingSelect={handleStarClick}
                  previewRating={previewRating}
                />
              ) : null}

              {!hasAlreadyReviewed && previewStep === "feedback" && (
                <FeedbackStep
                  config={config}
                  isDarkTheme={isDarkTheme}
                  previewRating={previewRating}
                  feedback={feedback}
                  onFeedbackChange={setFeedback}
                  onSubmit={handleFeedbackSubmit}
                  isSubmitting={submitMutation.isPending}
                  identifiedContact={identifiedContact}
                />
              )}

              {!hasAlreadyReviewed && previewStep === "redirect" && (
                <RedirectStep
                  primaryColor={config.primaryColor}
                  isDarkTheme={isDarkTheme}
                />
              )}

              {!hasAlreadyReviewed && previewStep === "thankyou" && (
                <ThankYouStep
                  page={page}
                  config={config}
                  googleReviewUrl={googleReviewUrl}
                  viewSource={source}
                  isDarkTheme={isDarkTheme}
                  previewRating={previewRating}
                  minRatingForGoogle={config.minRatingForGoogle}
                  contactId={identifiedContact?.id}
                  contactPhone={identifiedContact?.telephone ?? undefined}
                />
              )}
              {config.showBranding && (
                <PreviewFooter
                  isDarkTheme={isDarkTheme}
                  backgroundColor={{
                    backgroundColor: previewThemeStyles.backgroundColor,
                  }}
                />
              )}
            </div>

            {/* Right Side - Cover Image */}
            {page ? (
              <CoverImage coverUrl={config.coverUrl} />
            ) : (
              config.coverUrl &&
              viewMode === "desktop" && (
                <CoverImage coverUrl={config.coverUrl} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
