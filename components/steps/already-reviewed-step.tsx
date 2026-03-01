"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlreadyReviewedStepProps {
  config: {
    primaryColor: string;
    positiveHeadline?: string;
    positiveSubheadline?: string;
  };
  isDarkTheme: boolean;
}

export function AlreadyReviewedStep({
  config,
  isDarkTheme,
}: AlreadyReviewedStepProps) {
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
          You&apos;ve Already Reviewed
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkTheme ? "text-white/50" : "text-zinc-500",
          )}
        >
          Thank you! Your feedback has already been submitted.
        </p>
      </div>
    </div>
  );
}
