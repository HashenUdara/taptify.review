import { Smartphone, Monitor, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReviewLinkStore } from "@/stores";
import { ReviewLinkStatusBadge } from "./status-badge";

interface PreviewControlsProps {
  viewMode: "mobile" | "desktop";
  onViewModeChange: (mode: "mobile" | "desktop") => void;
  previewRating: number;
  minRatingForGoogle: number;
  onReset: () => void;
  isActive?: boolean;
  status?: "draft" | "published";
}

export function PreviewControls({
  viewMode,
  onViewModeChange,
  isActive,
  previewRating,
  minRatingForGoogle,
  onReset,
  status,
}: PreviewControlsProps) {
  const previewStep = useReviewLinkStore((s) => s.previewStep);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      {/* Left: Preview label + View Mode Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Preview</span>
        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("mobile")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "mobile"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("desktop")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "desktop"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
        {previewRating > 0 && (
          <span
            className={cn(
              "text-xs",
              previewRating >= minRatingForGoogle
                ? "text-emerald-400"
                : "text-orange-400",
            )}
          >
            {previewRating >= minRatingForGoogle
              ? "Positive Flow"
              : "Negative Flow"}
          </span>
        )}
      </div>

      {/* Right: Status Badge + Reset */}
      <div className="flex items-center gap-3">
        <ReviewLinkStatusBadge
          status={status ?? "draft"}
          isActive={isActive ?? false}
        />
        {previewStep !== "rating" && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset preview
          </button>
        )}
      </div>
    </div>
  );
}
