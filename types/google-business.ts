export type ReviewLinkStatus = "draft" | "published";

export interface ReviewLinkConfig {
  // Link Settings
  customSlug: string;
  isActive: boolean;
  status: ReviewLinkStatus;

  // Appearance
  theme: "light" | "dark";
  primaryColor: string;

  // Content
  headline: string;
  subheadline: string;
  showBusinessName: boolean;
  showLogo: boolean;
  showBranding: boolean;
  showAddress: boolean;

  // Positive Response
  positiveHeadline: string;
  positiveSubheadline: string;
  positiveCtaText: string;
  positiveRedirectUrl: string;

  // Negative Response
  negativeHeadline: string;
  negativeSubheadline: string;
  negativeRedirectUrl?: string;
  negativeCtaText: string;
  negativeUserFirstName?: string;
  negativeUserLastName?: string;
  negativeUserPhone?: string;
  negativeUserEmail?: string;
  enableFeedbackForLowRating: boolean;
  collectContactDetails: boolean;
  feedbackPlaceholder: string;

  // Behavior
  minRatingForGoogle: number;

  // Top 5 Features
  logoUrl: string;
  coverUrl: string;
  notifyEmail: string;
  notifyOnNegative: boolean;

  // TypeValues
  id?: string;
  locationId?: string;
  businessName?: string;
  createdDate?: Date;
  publishedAt?: Date;
}
