import { ReviewLinkConfig } from "@/schemas/review-link";

/**
 * Maps database review link data to ReviewLinkConfig
 * Handles field name differences between DB schema and UI config
 *
 * @param dbData - Review link data from database
 * @returns ReviewLinkConfig object ready for UI consumption
 */
export function mapDbToReviewLinkConfig(
  dbData: Record<string, unknown>,
): ReviewLinkConfig {
  return {
    // Link Settings
    id: dbData.id as string,
    customSlug: (dbData.slug as string) || "",
    isActive: (dbData.isActive as boolean) ?? true,
    status: (dbData.status as "draft" | "published") || "draft",

    // Appearance
    theme: (dbData.theme as "light" | "dark") || "light",
    primaryColor: (dbData.primaryColor as string) || "#4F46E5",

    // Content
    headline: (dbData.headline as string) || "",
    subheadline: (dbData.subheadline as string) || "",
    showBusinessName: (dbData.showBusinessName as boolean) ?? true,
    showLogo: (dbData.showBusinessLogo as boolean) ?? true,
    showBranding: (dbData.showBusinessBranding as boolean) ?? true,
    showAddress: (dbData.showBusinessAddress as boolean) ?? true,

    // Positive Response
    positiveHeadline: (dbData.positiveHeadline as string) || "",
    positiveSubheadline: (dbData.positiveSubheadline as string) || "",
    positiveCtaText: (dbData.positiveCtaText as string) || "",
    positiveRedirectUrl: (dbData.positiveRedirectUrl as string) || "",

    // Negative Response
    negativeHeadline: (dbData.negativeHeadline as string) || "",
    negativeSubheadline: (dbData.negativeSubheadline as string) || "",
    negativeRedirectUrl: (dbData.negativeRedirectUrl as string) || "",
    negativeCtaText: (dbData.negativeCtaText as string) || "",
    enableFeedbackForLowRating:
      (dbData.enableFeedbackForLowRating as boolean) ?? true,
    feedbackPlaceholder: (dbData.feedbackPlaceholder as string) || "",
    collectContactDetails: (dbData.collectContactDetails as boolean) ?? true,

    // Behavior
    minRatingForGoogle: (dbData.minRatingForGoogle as number) || 4,

    // Media & Notifications
    logoUrl: (dbData.logoUrl as string) || "",
    coverUrl: (dbData.coverUrl as string) || "",
    notifyEmail: (dbData.notifyEmail as string) || "",
    notifyOnNegative: (dbData.notifyOnNegative as boolean) ?? false,

    // Optional business name
    businessName: (dbData.businessName as string) || undefined,
    enableSmartReviewEditor:
      (dbData.enableSmartReviewEditor as boolean) ?? false,
    smartKeywords: (dbData.smartKeywords as string[]) || [],
  };
}

/**
 * Maps ReviewLinkConfig to database insert/update format
 * Converts UI config field names to DB column names
 *
 * @param config - ReviewLinkConfig from UI
 * @returns Database-ready object
 */
export function mapConfigToDb(
  config: Partial<ReviewLinkConfig>,
): Record<string, unknown> {
  const dbData: Record<string, unknown> = {};

  if (config.customSlug !== undefined) dbData.slug = config.customSlug;
  if (config.isActive !== undefined) dbData.isActive = config.isActive;
  if (config.status !== undefined) dbData.status = config.status;
  if (config.theme !== undefined) dbData.theme = config.theme;
  if (config.primaryColor !== undefined)
    dbData.primaryColor = config.primaryColor;
  if (config.headline !== undefined) dbData.headline = config.headline;
  if (config.subheadline !== undefined) dbData.subheadline = config.subheadline;
  if (config.showBusinessName !== undefined)
    dbData.showBusinessName = config.showBusinessName;
  if (config.showLogo !== undefined) dbData.showBusinessLogo = config.showLogo;
  if (config.showAddress !== undefined)
    dbData.showBusinessAddress = config.showAddress;
  if (config.positiveHeadline !== undefined)
    dbData.positiveHeadline = config.positiveHeadline;
  if (config.positiveSubheadline !== undefined)
    dbData.positiveSubheadline = config.positiveSubheadline;
  if (config.positiveCtaText !== undefined)
    dbData.positiveCtaText = config.positiveCtaText;
  if (config.positiveRedirectUrl !== undefined)
    dbData.positiveRedirectUrl = config.positiveRedirectUrl;
  if (config.negativeHeadline !== undefined)
    dbData.negativeHeadline = config.negativeHeadline;
  if (config.negativeSubheadline !== undefined)
    dbData.negativeSubheadline = config.negativeSubheadline;
  if (config.negativeRedirectUrl !== undefined)
    dbData.negativeRedirectUrl = config.negativeRedirectUrl;
  if (config.negativeCtaText !== undefined)
    dbData.negativeCtaText = config.negativeCtaText;
  if (config.enableFeedbackForLowRating !== undefined)
    dbData.enableFeedbackForLowRating = config.enableFeedbackForLowRating;
  if (config.feedbackPlaceholder !== undefined)
    dbData.feedbackPlaceholder = config.feedbackPlaceholder;
  if (config.collectContactDetails !== undefined)
    dbData.collectContactDetails = config.collectContactDetails;
  if (config.minRatingForGoogle !== undefined)
    dbData.minRatingForGoogle = config.minRatingForGoogle;
  if (config.logoUrl !== undefined) dbData.logoUrl = config.logoUrl;
  if (config.coverUrl !== undefined) dbData.coverUrl = config.coverUrl;
  if (config.notifyEmail !== undefined) dbData.notifyEmail = config.notifyEmail;
  if (config.notifyOnNegative !== undefined)
    dbData.notifyOnNegative = config.notifyOnNegative;

  return dbData;
}
