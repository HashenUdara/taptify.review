import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedirectStepProps {
  primaryColor: string;
  isDarkTheme: boolean;
}

export function RedirectStep({ primaryColor, isDarkTheme }: RedirectStepProps) {
  return (
    <div className="text-center space-y-6 animate-in fade-in relative z-10">
      <div className="flex justify-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ backgroundColor: primaryColor }}
        >
          <ArrowRight className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <h2
          className={cn(
            "text-xl font-semibold tracking-tight",
            isDarkTheme ? "text-white" : "text-zinc-900"
          )}
        >
          Opening Google...
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkTheme ? "text-white/50" : "text-zinc-500"
          )}
        >
          Please share your review there
        </p>
      </div>
    </div>
  );
}
