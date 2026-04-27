import { z } from "zod";

/**
 * Review Link Validation Schemas
 * Shared schemas for client-side and server-side validation
 * Standardized lengths and strict email/URL patterns.
 */

const REQUIRED_MSG = "This field is required";
const MAX_25_MSG = "Must not exceed 25 characters";
const MAX_50_MSG = "Must not exceed 50 characters";
const MAX_250_MSG = "Must not exceed 250 characters";

// Reusable snippets
const reqStr = (min = 1, max = 50) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? REQUIRED_MSG : `Must be at least ${min} characters`)
    .max(max, `Must not exceed ${max} characters`);

// Content Step Schemas
export const headlineSchema = reqStr(2, 50);
export const subheadlineSchema = z
  .string()
  .trim()
  .max(250, MAX_250_MSG)
  .optional()
  .or(z.literal(""));

export const positiveHeadlineSchema = reqStr(5, 50);
export const positiveSubheadlineSchema = z
  .string()
  .trim()
  .max(250, MAX_250_MSG)
  .optional()
  .or(z.literal(""));
export const positiveCtaTextSchema = z
  .string()
  .trim()
  .max(25, MAX_25_MSG)
  .optional()
  .or(z.literal(""));

export const negativeHeadlineSchema = reqStr(5, 50);
export const negativeSubheadlineSchema = z
  .string()
  .trim()
  .max(250, MAX_250_MSG)
  .optional()
  .or(z.literal(""));
export const negativeCtaTextSchema = z
  .string()
  .trim()
  .max(25, MAX_25_MSG)
  .optional()
  .or(z.literal(""));

const INVALID_EMAIL_MSG = "Invalid email address";
const INVALID_URL_MSG = "Invalid URL format (e.g. https://...)";
const INVALID_COLOR_MSG = "Invalid color format (e.g. #FFFFFF)";

// Responses Step Schemas
export const minRatingForGoogleSchema = z
  .number({ message: "Must be a number" })
  .min(1, "Must be at least 1")
  .max(5, "Must not exceed 5");

export const notifyEmailSchema = z
  .string()
  .trim()
  .email(INVALID_EMAIL_MSG)
  .max(50, MAX_50_MSG)
  .optional()
  .or(z.literal(""));

export const customSlugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .min(3, "Slug must be at least 3 characters")
  .max(50, MAX_50_MSG)
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  );

// Appearance Step Schemas
export const primaryColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-F]{6}$/i, INVALID_COLOR_MSG);

export const themeSchema = z.enum(["light", "dark"], {
  message: "Please select a valid theme",
});

// Full Config Schema
export const reviewLinkConfigSchema = z.object({
  id: z.string().optional(),
  locationId: z.string().optional(),
  headline: headlineSchema,
  subheadline: subheadlineSchema,
  showBusinessName: z.boolean().default(true),
  showLogo: z.boolean().default(true),
  showAddress: z.boolean().default(true),
  showBranding: z.boolean().default(true),
  theme: themeSchema.default("light"),
  primaryColor: primaryColorSchema.default("#4F46E5"),

  positiveHeadline: positiveHeadlineSchema,
  positiveSubheadline: positiveSubheadlineSchema,
  positiveCtaText: positiveCtaTextSchema,
  positiveRedirectUrl: z
    .string()
    .trim()
    .url(INVALID_URL_MSG)
    .max(500, MAX_250_MSG)
    .optional()
    .or(z.literal("")),

  negativeHeadline: negativeHeadlineSchema,
  negativeSubheadline: negativeSubheadlineSchema,
  negativeCtaText: negativeCtaTextSchema,
  negativeRedirectUrl: z
    .string()
    .trim()
    .url(INVALID_URL_MSG)
    .max(500, MAX_250_MSG)
    .optional()
    .or(z.literal("")),

  negativeUserFirstName: z
    .string()
    .trim()
    .max(50, MAX_50_MSG)
    .optional()
    .or(z.literal("")),
  negativeUserLastName: z
    .string()
    .trim()
    .max(50, MAX_50_MSG)
    .optional()
    .or(z.literal("")),
  negativeUserPhone: z
    .string()
    .trim()
    .max(20, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  negativeUserEmail: z
    .string()
    .trim()
    .email(INVALID_EMAIL_MSG)
    .max(50, MAX_50_MSG)
    .optional()
    .or(z.literal("")),

  enableFeedbackForLowRating: z.boolean().default(false),
  feedbackPlaceholder: z
    .string()
    .trim()
    .max(250, MAX_250_MSG)
    .optional()
    .or(z.literal("")),
  minRatingForGoogle: minRatingForGoogleSchema.default(4),
  notifyOnNegative: z.boolean().default(false),
  collectContactDetails: z.boolean().default(true),
  notifyEmail: notifyEmailSchema,
  customSlug: customSlugSchema,
  status: z.enum(["draft", "published"]).default("draft"),
  isActive: z.boolean().default(false),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  coverUrl: z.string().trim().optional().or(z.literal("")),
  businessName: z
    .string()
    .trim()
    .max(50, MAX_50_MSG)
    .optional()
    .or(z.literal("")),
  createdDate: z.date().optional(),
  publishedAt: z.date().optional(),
  enableSmartReviewEditor: z.boolean().default(false),
  smartKeywords: z.array(z.string()).default([]),
});

export type ReviewLinkConfig = z.infer<typeof reviewLinkConfigSchema>;

/**
 * Field-level validation helper
 * Returns error message or null
 */
export function validateField(
  field: keyof ReviewLinkConfig,
  value: unknown,
): string | null {
  const schemaMap: Record<keyof ReviewLinkConfig, z.ZodSchema> = {
    headline: headlineSchema,
    subheadline: subheadlineSchema,
    positiveHeadline: positiveHeadlineSchema,
    positiveSubheadline: positiveSubheadlineSchema,
    positiveCtaText: positiveCtaTextSchema,
    positiveRedirectUrl: z
      .string()
      .trim()
      .url(INVALID_URL_MSG)
      .optional()
      .or(z.literal("")),
    negativeHeadline: negativeHeadlineSchema,
    negativeSubheadline: negativeSubheadlineSchema,
    negativeCtaText: negativeCtaTextSchema,
    negativeRedirectUrl: z
      .string()
      .trim()
      .url(INVALID_URL_MSG)
      .optional()
      .or(z.literal("")),
    negativeUserFirstName: z
      .string()
      .trim()
      .max(50, MAX_50_MSG)
      .optional()
      .or(z.literal("")),
    negativeUserLastName: z
      .string()
      .trim()
      .max(50, MAX_50_MSG)
      .optional()
      .or(z.literal("")),
    negativeUserPhone: z
      .string()
      .trim()
      .max(20, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    negativeUserEmail: z
      .string()
      .trim()
      .email(INVALID_EMAIL_MSG)
      .max(50, MAX_50_MSG)
      .optional()
      .or(z.literal("")),
    notifyEmail: notifyEmailSchema,
    customSlug: customSlugSchema,
    primaryColor: primaryColorSchema,
    theme: themeSchema,
    minRatingForGoogle: minRatingForGoogleSchema,
    feedbackPlaceholder: z
      .string()
      .trim()
      .max(250, MAX_250_MSG)
      .optional()
      .or(z.literal("")),
    businessName: z
      .string()
      .trim()
      .max(50, MAX_50_MSG)
      .optional()
      .or(z.literal("")),
    // Non-validated or simple boolean fields return null (z.any() handles it)
    id: z.any(),
    locationId: z.any(),
    showBusinessName: z.any(),
    showLogo: z.any(),
    showAddress: z.any(),
    showBranding: z.any(),
    enableFeedbackForLowRating: z.any(),
    notifyOnNegative: z.any(),
    collectContactDetails: z.any(),
    logoUrl: z.any(),
    coverUrl: z.any(),
    createdDate: z.any(),
    publishedAt: z.any(),
    status: z.any(),
    isActive: z.any(),
    enableSmartReviewEditor: z.any(),
    smartKeywords: z.any(),
  };

  const schema = schemaMap[field];
  if (!schema) return null;

  const result = schema.safeParse(value);
  if (!result.success) {
    const firstError = result.error.issues?.[0]?.message;
    return firstError || "Invalid value";
  }

  return null;
}
