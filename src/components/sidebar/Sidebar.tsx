import { BookOpen, Clock3, Monitor, Music2, Settings } from "lucide-react";

import type { AppPage } from "../../stores/navigation.store";
import { useNavigationStore } from "../../stores/navigation.store";

const menuItems: Array<{
  key: AppPage;
  label: string;
  icon: React.ElementType;
}> = [
  { key: "presentation", label: "Presentation", icon: Monitor },
  { key: "songs", label: "Songs", icon: Music2 },
  { key: "bible", label: "Bible", icon: BookOpen },
  { key: "history", label: "History", icon: Clock3 },
  { key: "settings", label: "Settings", icon: Settings },
];

function ChurchLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <svg
        width="76"
        height="76"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]"
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

      <h1 className="text-[22px] font-semibold leading-tight text-white">
        Persekutuan
      </h1>

      <p className="mt-1 text-[18px] font-semibold leading-tight text-white">
        Oikumene SII
      </p>
    </div>
  );
}

export function Sidebar() {
  const { activePage, setActivePage } = useNavigationStore();

  return (
    <aside className="relative flex h-full w-[230px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#05080b]/35 shadow-[inset_-1px_0_0_rgba(255,255,255,0.025)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.045),transparent_38%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_30%,rgba(0,0,0,0.08))]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 px-4 pt-9">
        <ChurchLogo />
      </div>

      <nav className="relative z-10 mt-12 flex flex-col gap-2 px-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              className={[
                "group relative flex h-[56px] w-full items-center gap-3 rounded-xl px-4 text-left outline-none transition-all duration-200",
                isActive
                  ? "border border-white/10 bg-white/[0.075] text-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.14)]"
                  : "border border-transparent text-white/62 hover:bg-white/[0.045] hover:text-white",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute -left-2.5 top-1/2 h-[38px] w-[4px] -translate-y-1/2 rounded-r-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)]" />
              )}

              <Icon
                size={22}
                strokeWidth={2}
                className={[
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-red-500"
                    : "text-white/62 group-hover:text-white",
                ].join(" ")}
              />

              <span
                className={[
                  "text-[14px] font-semibold transition-colors",
                  isActive
                    ? "text-red-500"
                    : "text-white/62 group-hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative z-10 mt-auto px-3 pb-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md">
          <p className="text-sm font-semibold leading-none text-white">
            Operator
          </p>

          <p className="mt-1.5 text-xs text-white/40">Local Device</p>
        </div>
      </div>
    </aside>
  );
}
