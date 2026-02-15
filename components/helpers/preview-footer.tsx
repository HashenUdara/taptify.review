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
          "text-xs",
          isDarkTheme ? "text-white/30" : "text-zinc-500"
        )}
      >
        Powered by <span className="font-medium">Taptify</span>
      </p>
    </div>
  );
}
