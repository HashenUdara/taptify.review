export type ReviewFeedback = {
  id: string;
  status: string;
  createdAt: Date;
  reviewLinkId: string;
  rating: number;
  interactionId: string | null;
  feedbackText: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  internalNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: Date | null;
};
