import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BrowserChromeSkeleton } from "./browser-chrome-skeleton";

export function ReviewPagePreviewSkeleton({
  viewMode = "mobile",
  page = false,
  mobilePreviewOnly,
}: {
  viewMode?: "mobile" | "desktop";
  page?: boolean;
  mobilePreviewOnly?: boolean;
}) {
  // Render as full page without preview controls or sized container
  if (page) {
    return (
      <div className="w-full flex flex-col h-screen">
        {/* Split Layout - Cover Left, Content Right */}
        <div className="flex flex-1">
          {/* Cover Image */}
          <div className="w-1/2 bg-muted hidden sm:block flex-1/2">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* Right Side - Review Content */}
          <div className="flex flex-col items-center justify-center p-10 bg-background w-1/2 flex-1/2">
            <div className="text-center space-y-8 max-w-sm w-full">
              {/* Logo Skeleton */}
              <div className="flex justify-center">
                <Skeleton className="w-16 h-16 rounded-2xl" />
              </div>

              {/* Business Name & Headline Skeleton */}
              <div className="space-y-3">
                {/* Business Name */}
                <Skeleton className="h-4 w-32 mx-auto" />
                {/* Headline */}
                <Skeleton className="h-7 w-64 mx-auto" />
                {/* Subheadline */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>

              {/* Star Rating Skeleton */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview mode with controls and sized container
  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls Skeleton */}
      {!page && !mobilePreviewOnly && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* View Mode Toggle Skeleton */}
            <Skeleton className="h-10 w-24 rounded-lg" />
            {/* Status Text Skeleton */}
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Reset Button Skeleton */}
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      )}

      {/* Preview Content */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center",
          !page && !mobilePreviewOnly ? "p-6" : undefined,
        )}
      >
        <div
          className={cn(
            "bg-background shadow-2xl shadow-black/40 w-full h-full dark:shadow-black/60 relative overflow-hidden transition-all duration-300",
            viewMode === "mobile" && !mobilePreviewOnly
              ? "w-93.75 rounded-2xl"
              : "w-180 rounded-2xl",
          )}
        >
          {/* Browser Chrome Skeleton */}
          {!page && !mobilePreviewOnly && <BrowserChromeSkeleton />}

          {/* Split Layout - Cover Left, Content Right */}
          <div className="flex min-h-125">
            {/* Cover Image (Desktop only) */}
            {viewMode === "desktop" && (
              <div className="w-1/2 bg-muted">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
            )}

            {/* Right Side - Review Content */}
            <div
              className={cn(
                "flex flex-col items-center justify-center p-10 bg-background",
                viewMode === "desktop" ? "w-1/2" : "w-full",
              )}
            >
              <div className="text-center space-y-8 max-w-sm w-full">
                {/* Logo Skeleton */}
                <div className="flex justify-center">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                </div>

                {/* Business Name & Headline Skeleton */}
                <div className="space-y-3">
                  {/* Business Name */}
                  <Skeleton className="h-4 w-32 mx-auto" />
                  {/* Headline */}
                  <Skeleton className="h-7 w-64 mx-auto" />
                  {/* Subheadline */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </div>

                {/* Star Rating Skeleton */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="w-12 h-12 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Footer Skeleton */}
          <div className="py-4 text-center bg-background">
            <Skeleton className="h-3 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
