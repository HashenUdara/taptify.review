import { ReviewLinkConfig } from "@/types/google-business";

export const defaultConfig: ReviewLinkConfig = {
  // Link Settings
  customSlug: "",
  isActive: true,
  status: "draft",

  // Appearance
  theme: "light",
  primaryColor: "#22C55E",

  // Content
  headline: "How was your experience?",
  subheadline:
    "We value your feedback! Please take a moment to rate your visit.",
  showBusinessName: true,
  showLogo: true,
  showBranding: true,
  showAddress: false,

  // Positive Response
  positiveHeadline: "Thank you! 🎉",
  positiveSubheadline:
    "We're thrilled you had a great experience! Would you mind sharing your feedback on Google?",
  positiveCtaText: "Leave a Google Review",
  positiveRedirectUrl: "",

  // Negative Response
  negativeHeadline: "We're sorry to hear that",
  negativeSubheadline:
    "We appreciate your honesty. Please let us know how we can improve.",
  negativeCtaText: "Submit Feedback",
  negativeUserFirstName: "",
  negativeUserLastName: "",
  negativeUserPhone: "",
  negativeUserEmail: "",
  enableFeedbackForLowRating: true,
  collectContactDetails: true,
  feedbackPlaceholder:
    "Tell us what went wrong and how we can make it right...",

  // Behavior
  minRatingForGoogle: 4,

  // Top 5 Features
  logoUrl: "",
  coverUrl: "",
  notifyEmail: "",
  notifyOnNegative: false,
};
