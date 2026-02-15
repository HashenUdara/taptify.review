import { z } from "zod";

/**
 * Review Link Validation Schemas
 * Shared schemas for client-side and server-side validation
 */

// Content Step Schemas
export const headlineSchema = z
  .string()
  .min(1, "Headline is required")
  .min(5, "Headline must be at least 5 characters")
  .max(100, "Headline must not exceed 100 characters");

export const subheadlineSchema = z
  .string()
  .max(200, "Subheadline must not exceed 200 characters")
  .optional()
  .or(z.literal(""));

export const positiveHeadlineSchema = z
  .string()
  .min(1, "Positive response headline is required")
  .min(5, "Must be at least 5 characters")
  .max(100, "Must not exceed 100 characters");

export const negativeHeadlineSchema = z
  .string()
  .min(1, "Negative response headline is required")
  .min(5, "Must be at least 5 characters")
  .max(100, "Must not exceed 100 characters")
  .optional();

// Responses Step Schemas
export const minRatingForGoogleSchema = z
  .number()
  .min(1, "Must be at least 1")
  .max(5, "Must not exceed 5");

export const notifyEmailSchema = z
  .string()
  .email("Invalid email address")
  .optional()
  .or(z.literal(""));

export const customSlugSchema = z
  .string()
  .min(1, "Slug is required")
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  );

// Appearance Step Schemas
export const primaryColorSchema = z
  .string()
  .regex(/^#[0-9A-F]{6}$/i, "Invalid color format");

export const themeSchema = z.enum(["light", "dark"]);

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
  positiveSubheadline: z.string().optional().or(z.literal("")),
  positiveCtaText: z.string().optional().or(z.literal("")),
  positiveRedirectUrl: z.string().url().optional().or(z.literal("")),
  negativeHeadline: negativeHeadlineSchema.optional(),
  negativeSubheadline: z.string().optional().or(z.literal("")),
  negativeCtaText: z.string().optional().or(z.literal("")),
  negativeRedirectUrl: z.string().url().optional().or(z.literal("")),
  negativeUserFirstName: z.string().max(50).optional().or(z.literal("")),
  negativeUserLastName: z.string().max(50).optional().or(z.literal("")),
  negativeUserPhone: z.string().max(50).optional().or(z.literal("")),
  negativeUserEmail: z.string().email().optional().or(z.literal("")),
  enableFeedbackForLowRating: z.boolean().default(false),
  feedbackPlaceholder: z.string().optional().or(z.literal("")),
  minRatingForGoogle: minRatingForGoogleSchema.default(4),
  notifyOnNegative: z.boolean().default(false),
  collectContactDetails: z.boolean().default(true),
  notifyEmail: notifyEmailSchema,
  customSlug: customSlugSchema,
  status: z.enum(["draft", "published"]).default("draft"),
  isActive: z.boolean().default(false),
  logoUrl: z.string().optional().or(z.literal("")),
  coverUrl: z.string().optional().or(z.literal("")),
  businessName: z.string().optional().or(z.literal("")),
  createdDate: z.date().optional(),
  publishedAt: z.date().optional(),
});

export type ReviewLinkConfig = z.infer<typeof reviewLinkConfigSchema>;

/**
 * Field-level validation helper
 * Returns error message or null
 */
export function validateField(
  field: keyof ReviewLinkConfig,
  value: unknown
): string | null {
  const schemaMap: Record<keyof ReviewLinkConfig, z.ZodSchema> = {
    headline: headlineSchema,
    subheadline: subheadlineSchema,
    positiveHeadline: positiveHeadlineSchema,
    negativeHeadline: negativeHeadlineSchema,
    notifyEmail: notifyEmailSchema,
    customSlug: customSlugSchema,
    primaryColor: primaryColorSchema,
    theme: themeSchema,
    minRatingForGoogle: minRatingForGoogleSchema,
    // Non-validated fields return null
    id: z.any(),
    locationId: z.any(),
    showBusinessName: z.any(),
    showLogo: z.any(),
    showAddress: z.any(),
    showBranding: z.any(),
    positiveSubheadline: z.any(),
    positiveCtaText: z.any(),
    positiveRedirectUrl: z.any(),
    negativeSubheadline: z.any(),
    negativeCtaText: z.any(),
    negativeRedirectUrl: z.any(),
    negativeUserFirstName: z.any(),
    negativeUserLastName: z.any(),
    negativeUserPhone: z.any(),
    negativeUserEmail: z.any(),
    enableFeedbackForLowRating: z.any(),
    feedbackPlaceholder: z.any(),
    notifyOnNegative: z.any(),
    collectContactDetails: z.any(),
    logoUrl: z.any(),
    coverUrl: z.any(),
    businessName: z.any(),
    createdDate: z.any(),
    publishedAt: z.any(),
    status: z.any(),
    isActive: z.any(),
  };

  const schema = schemaMap[field];
  if (!schema) return null;

  const result = schema.safeParse(value);
  if (!result.success) {
    // Use the first Zod issue message instead of the aggregated stringified message array
    const firstError = result.error.issues?.[0]?.message;
    return firstError || "Invalid value";
  }

  return null;
}
