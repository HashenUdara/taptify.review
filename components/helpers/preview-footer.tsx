import { cn } from "@/lib/utils";

interface PreviewFooterProps {
  isDarkTheme: boolean;
  backgroundColor: React.CSSProperties;
}

// Scoped footer that honors preview theme without inheriting app theme variables
export function PreviewFooter({
  isDarkTheme,
  backgroundColor,
}: PreviewFooterProps) {
  return (
    <div
      className={cn(
        "py-4 text-center isolate absolute bottom-0 w-full",
        isDarkTheme ? "preview-dark" : "preview-light"
      )}
      style={backgroundColor}
    >
      <p
        className={cn(
          "text-xs tracking-tight transition-opacity duration-300",
          isDarkTheme ? "text-white/40" : "text-zinc-500 font-medium"
        )}
      >
        Powered by <span className={cn("font-bold", isDarkTheme ? "text-white/60" : "text-zinc-900")}>Taptify</span>
      </p>
    </div>
  );
}
