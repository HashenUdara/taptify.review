import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitNegativeReviewFeedbackAction,
  submitPositiveReviewAction,
} from "@/lib/actions";
import { ViewSource } from "@/types";

export interface SubmitFeedbackParams {
  slug: string;
  rating: number;
  feedbackText?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactId?: string;
  viewSource?: ViewSource;
}

export interface SubmitPositiveReviewParams {
  slug: string;
  rating: number;
  contactId?: string;
  contactPhone?: string;
  viewSource?: ViewSource;
}

export function useReviewFeedbackMutation() {
  // Mutation for negative feedback (with message/feedback text)
  const submitMutation = useMutation({
    mutationFn: async (params: SubmitFeedbackParams) => {
      const res = await submitNegativeReviewFeedbackAction(params);

      if (!res.success) {
        const error = res.error;
        throw error || new Error("Failed to submit feedback");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback. We will review it shortly.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  // Mutation for positive review completion (just star count, no message)
  const submitPositiveMutation = useMutation({
    mutationFn: async (params: SubmitPositiveReviewParams) => {
      const res = await submitPositiveReviewAction(params);

      if (!res.success) {
        throw res.error || new Error("Failed to log positive review");
      }

      return res.data;
    },
    // Silent - no toast for positive reviews (user is redirected to Google)
  });

  return {
    submitMutation,
    submitPositiveMutation,
  };
}
