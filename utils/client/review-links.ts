import { ReviewLinkStatus } from "@/types/google-business";

// Helper: derive a short status label without hooks
export const getPublishStatus = (
  status: ReviewLinkStatus,
  isActive: boolean,
) => {
  if (status === "published" && isActive) return "Published";
  if (status === "published" && !isActive) return "Inactive";
  return status === "draft" ? "Draft" : "Draft";
};
