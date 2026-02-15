"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cancelSmsOnLinkClickAction } from "@/lib/actions";
import { Contact } from "@/types";

/**
 * Hook to cancel SMS queue entries when a customer clicks a review link
 * Only triggers if customerId search parameter exists
 * Runs once on page load
 */
export function useCancelSmsOnLinkClick() {
  const searchParams = useSearchParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const customerId = searchParams.get("customerId");

    // Only process if customerId exists and hasn't been processed yet
    if (!customerId || hasProcessed.current) {
      return;
    }

    // Mark as processed immediately to prevent duplicate calls
    hasProcessed.current = true;

    // Cancel SMS queue entries for this customer
    const cancelSmsQueues = async () => {
      setIsLoading(true);
      try {
        const result = await cancelSmsOnLinkClickAction(customerId);

        if (result.success) {
          console.log(
            `Successfully cancelled ${result.data.cancelled} SMS queue entries for customer`,
          );
          if (result.data.contact) {
            setContact(result.data.contact);
          }
        } else {
          console.error("Failed to cancel SMS queue entries:", result.error);
        }
      } catch (error) {
        console.error("Error in useCancelSmsOnLinkClick:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cancelSmsQueues();
  }, [searchParams]);

  return { contact, isLoading };
}
