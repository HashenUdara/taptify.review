"use client";

import { ReviewPagePreview } from "@/components/review-page-preview";
import {
  useCancelSmsOnLinkClick,
  useReviewLinkDetail,
  useReviewTracker,
} from "@/hooks";
import { useReviewLinkStore } from "@/stores";
import { mapDbToReviewLinkConfig } from "@/utils/common";
import { FC, useEffect, useRef } from "react";

export const ReviewLinkContainer: FC<{
  linkId: string;
  isPublic?: boolean;
  pageView?: boolean;
  mobilePreviewOnly?: boolean;
}> = ({ linkId, isPublic, mobilePreviewOnly, pageView = true }) => {
  // Fetch existing review link data if linkId exists (uses hydrated cache from server prefetch)
  const { data: existingLinkData, isLoading } = useReviewLinkDetail(
    linkId!,
    {
      enabled: !!linkId,
    },
    isPublic,
  );

  // Cancel SMS queue entries when customer clicks review link
  const { contact } = useCancelSmsOnLinkClick();

  // Track if user has already submitted a review via cookie
  const { hasAlreadyReviewed, markReviewed } = useReviewTracker(linkId);

  const { setConfig } = useReviewLinkStore();

  // Track if we've already initialized to prevent re-syncing
  const hasInitialized = useRef(false);

  // Sync fetched review link data to config (edit mode - runs once when data arrives)
  useEffect(() => {
    if (existingLinkData && !hasInitialized.current) {
      setConfig(mapDbToReviewLinkConfig(existingLinkData));
      hasInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingLinkData]);

  return (
    <ReviewPagePreview
      identifiedContact={contact}
      mobilePreviewOnly={mobilePreviewOnly}
      isLoading={isLoading}
      title={existingLinkData?.businessName ?? ""}
      page={pageView}
      googleReviewUrl={existingLinkData?.positiveRedirectUrl ?? undefined}
      hasAlreadyReviewed={hasAlreadyReviewed}
      onReviewComplete={markReviewed}
    />
  );
};
