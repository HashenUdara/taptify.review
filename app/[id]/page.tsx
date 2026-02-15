import { getQueryClient } from "@/utils/get-query-client";
import { ReviewLinkContainer } from "./container";
import { connection } from "next/server";
import { prefetchReviewLinkDetailQuery } from "@/lib/queries/review-link.queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ReviewLinkPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;

  const queryClient = getQueryClient();

  await prefetchReviewLinkDetailQuery(queryClient, id || "", true);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewLinkContainer linkId={id || ""} isPublic={true} />
    </HydrationBoundary>
  );
}
