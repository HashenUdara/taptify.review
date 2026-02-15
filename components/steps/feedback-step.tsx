import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types";

interface FeedbackStepProps {
  config: {
    customSlug: string;
    negativeHeadline: string;
    negativeSubheadline: string;
    feedbackPlaceholder: string;
    negativeCtaText: string;
    primaryColor: string;
    collectContactDetails: boolean;
  };
  isDarkTheme: boolean;
  previewRating: number;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: (
    slug: string,
    rating: number,
    feedbackText?: string,
    userInfo?: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    },
  ) => void | Promise<void>;
  isSubmitting?: boolean;
  identifiedContact: Contact | null;
}

export function FeedbackStep({
  config,
  isDarkTheme,
  previewRating,
  feedback,
  onFeedbackChange,
  onSubmit,
  isSubmitting = false,
  identifiedContact,
}: FeedbackStepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (config.collectContactDetails && !identifiedContact) {
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!phone.trim()) {
        newErrors.phone = "Phone is required";
      }
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    onSubmit(
      config.customSlug,
      previewRating,
      feedback,
      identifiedContact
        ? {
            firstName: identifiedContact.firstName || "",
            lastName: identifiedContact.lastName || "",
            phone: identifiedContact.telephone || "",
            email: identifiedContact.email || "",
          }
        : config.collectContactDetails
          ? {
              firstName,
              lastName,
              phone,
              email,
            }
          : undefined,
    );
  };

  const inputStyles = cn(
    "h-11 rounded-xl border-0",
    isDarkTheme
      ? "bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/20"
      : "bg-zinc-100 focus-visible:ring-zinc-300",
  );

  return (
    <div className="text-center space-y-5 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 relative z-10">
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-5 h-5",
              previewRating >= star
                ? "fill-amber-400 text-amber-400"
                : isDarkTheme
                  ? "text-white/15"
                  : "text-zinc-200",
            )}
          />
        ))}
      </div>

      <div className="space-y-2">
        {identifiedContact && (
          <p
            className={cn(
              "text-lg font-medium",
              isDarkTheme ? "text-white/80" : "text-zinc-700",
            )}
          >
            Hi {identifiedContact.firstName} {identifiedContact.lastName}
          </p>
        )}
        <h2
          className={cn(
            "text-xl font-semibold tracking-tight",
            isDarkTheme ? "text-white" : "text-zinc-900",
          )}
        >
          {config.negativeHeadline}
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkTheme ? "text-white/50" : "text-zinc-500",
          )}
        >
          {config.negativeSubheadline}
        </p>
      </div>

      {/* User Contact Fields - Conditional */}
      {config.collectContactDetails && (
        <div className={cn("space-y-3", identifiedContact && "hidden")}>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-left">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                disabled={isSubmitting}
                className={cn(
                  inputStyles,
                  errors.firstName && "ring-2 ring-red-500",
                )}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="text-left">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                disabled={isSubmitting}
                className={cn(
                  inputStyles,
                  errors.lastName && "ring-2 ring-red-500",
                )}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="text-left">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              type="tel"
              disabled={isSubmitting}
              className={cn(inputStyles, errors.phone && "ring-2 ring-red-500")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="text-left">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              disabled={isSubmitting}
              className={cn(inputStyles, errors.email && "ring-2 ring-red-500")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      )}

      <Textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder={config.feedbackPlaceholder}
        disabled={isSubmitting}
        className={cn(
          "min-h-25 resize-none rounded-xl border-0",
          isDarkTheme
            ? "bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/20"
            : "bg-zinc-100 focus-visible:ring-zinc-300",
        )}
      />

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl font-medium text-white"
        style={{ backgroundColor: config.primaryColor }}
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </>
        ) : (
          config.negativeCtaText
        )}
      </Button>
    </div>
  );
}
