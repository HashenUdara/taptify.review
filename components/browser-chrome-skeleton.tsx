import { Skeleton } from "@/components/ui/skeleton";

export function BrowserChromeSkeleton() {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 flex items-center">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 mx-4">
        <Skeleton className="h-7 max-w-55 mx-auto rounded-lg" />
      </div>
    </div>
  );
}
