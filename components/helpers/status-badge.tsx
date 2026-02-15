import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReviewLinkStatus } from "@/types/google-business";
import { getPublishStatus } from "@/utils/client/review-links";
import { FC } from "react";

interface ReviewLinkStatusBadgeProps {
  status: ReviewLinkStatus;
  isActive: boolean;
}

export const ReviewLinkStatusBadge: FC<ReviewLinkStatusBadgeProps> = ({
  status,
  isActive,
}) => {
  const statusLabel = getPublishStatus(status, isActive);

  return (
    <Badge
      variant={statusLabel === "Published" ? "default" : "secondary"}
      className={cn(
        statusLabel === "Published"
          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
          : statusLabel === "Draft" &&
              "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
      )}
    >
      {statusLabel}
    </Badge>
  );
};
