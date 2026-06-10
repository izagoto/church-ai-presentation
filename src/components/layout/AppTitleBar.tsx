import { Minus, Square, X } from "lucide-react";

function AppLogoSmall() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]"
    >
      <path
        d="M60 17V63"
        stroke="#ff313d"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <path
        d="M43 36H77"
        stroke="#ff313d"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <path
        d="M29 73C40 69 51 72 60 82C69 72 80 69 91 73V91C78 87 68 89 60 99C52 89 42 87 29 91V73Z"
        stroke="#ff313d"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <path
        d="M38 78C46 77 53 80 60 87C67 80 74 77 82 78"
        stroke="#ff313d"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function AppTitleBar() {
  return (
    <header className="relative z-50 flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-transparent px-4 backdrop-blur-md [-webkit-app-region:drag]">
      <div className="flex min-w-0 items-center gap-3">
        <AppLogoSmall />

        <p className="truncate text-sm font-semibold text-white/80">
          Church AI Worship Presentation
        </p>
      </div>

      <div className="flex h-full items-center gap-1 [-webkit-app-region:no-drag]">
        <button
          type="button"
          className="flex h-9 w-10 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
          aria-label="Minimize"
        >
          <Minus size={17} />
        </button>

        <button
          type="button"
          className="flex h-9 w-10 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
          aria-label="Maximize"
        >
          <Square size={15} />
        </button>

        <button
          type="button"
          className="flex h-9 w-10 items-center justify-center rounded-lg text-white/55 transition hover:bg-red-500/15 hover:text-red-300"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
