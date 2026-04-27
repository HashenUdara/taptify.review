"use server";

import { createAction } from "./middleware";
import * as reviewLink from "./review-protection";
import * as getPublicReviews from "./get-public-reviews";
import * as reviewEditor from "./review-editor";

export const transcribeVoiceAction = createAction(
  reviewEditor.transcribeVoiceAction,
);

export const getPublicReviewsAction = createAction(
  getPublicReviews.getPublicReviewsAction,
  {
    handleNotFound: true,
  },
);

export const getReviewLinkAction = createAction(
  reviewLink.getReviewLinkAction,
  {
    handleNotFound: true,
  },
);
export const getPublicReviewLinkBySlugAction = createAction(
  reviewLink.getPublicReviewLinkBySlugAction,
  {
    handleNotFound: true,
  },
);
export const getLocationReviewLinksAction = createAction(
  reviewLink.getLocationReviewLinksAction,
  {
    handleNotFound: true,
  },
);

export const checkSlugAvailabilityAction = createAction(
  reviewLink.checkSlugAvailabilityAction,
  {
    handleNotFound: true,
  },
);
export const submitNegativeReviewFeedbackAction = createAction(
  reviewLink.submitNegativeReviewFeedbackAction,
);
export const submitPositiveReviewAction = createAction(
  reviewLink.submitPositiveReviewAction,
);

export const cancelSmsOnLinkClickAction = createAction(
  reviewLink.cancelSmsOnLinkClickAction,
);
