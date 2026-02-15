interface BrowserChromeProps {
  customSlug: string;
  isDarkTheme?: boolean;
}

const appUrlDisplay =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ||
  "localhost:3000";

export function BrowserChrome({
  customSlug,
  isDarkTheme = false,
}: BrowserChromeProps) {
  return (
    <div
      className={
        isDarkTheme
          ? "bg-[#111318] px-4 py-2.5 flex items-center isolate preview-dark"
          : "bg-zinc-100 px-4 py-2.5 flex items-center isolate preview-light"
      }
    >
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 mx-4">
        <div
          className={
            isDarkTheme
              ? "bg-[#1A1D24] rounded-lg px-3 py-1.5 text-[11px] text-zinc-400 text-center max-w-55 mx-auto truncate font-mono"
              : "bg-white rounded-lg px-3 py-1.5 text-[11px] text-zinc-500 text-center max-w-55 mx-auto truncate font-mono"
          }
        >
          {appUrlDisplay}/rvlnk/{customSlug}
        </div>
      </div>
    </div>
  );
}
