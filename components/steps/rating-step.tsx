import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { ReviewLinkConfig } from "@/types/google-business";

interface RatingStepProps {
  config: ReviewLinkConfig;
  isDarkTheme: boolean;
  onRatingSelect: (rating: number) => void;
  previewRating: number;
  title?: string;
}

export function RatingStep({
  title,
  config,
  isDarkTheme,
  onRatingSelect,
  previewRating,
}: RatingStepProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div className="text-center space-y-8 max-w-sm relative z-10">
      {/* Logo */}
      {config.showLogo && (
        <div className="flex justify-center">
          {config.logoUrl ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <Image
                width={100}
                height={100}
                src={config.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
              style={{
                backgroundColor: config.primaryColor,
                color: "#ffffff",
              }}
            >
              T
            </div>
          )}
        </div>
      )}

      {/* Business Name & Headline */}
      <div className="space-y-3">
        {config.showBusinessName && (
          <p
            className={cn(
              "text-sm font-medium",
              isDarkTheme ? "text-white/50" : "text-zinc-400",
            )}
          >
            {config.businessName || title}
          </p>
        )}
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight",
            isDarkTheme ? "text-white" : "text-zinc-900",
          )}
        >
          {config.headline}
        </h1>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isDarkTheme ? "text-white/50" : "text-zinc-500",
          )}
        >
          {config.subheadline}
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => onRatingSelect(star)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={cn(
                "w-12 h-12 transition-all",

                hoveredStar >= star || previewRating >= star
                  ? "fill-amber-400 text-amber-400"
                  : isDarkTheme
                    ? "text-white/15"
                    : "text-zinc-200",
              )}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      {previewRating > 0 && (
        <p
          className={cn(
            "text-sm font-medium animate-in fade-in",
            isDarkTheme ? "text-white/60" : "text-zinc-500",
          )}
        >
          {previewRating === 5 && "Excellent!"}
          {previewRating === 4 && "Great!"}
          {previewRating === 3 && "Good"}
          {previewRating === 2 && "Fair"}
          {previewRating === 1 && "We're sorry"}
        </p>
      )}
    </div>
  );
}
