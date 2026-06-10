import { BookOpen, Clock3, Monitor, Music2, Settings } from "lucide-react";

import type { AppPage } from "../../stores/navigation.store";
import { useNavigationStore } from "../../stores/navigation.store";

const menuItems: Array<{
  key: AppPage;
  label: string;
  icon: React.ElementType;
}> = [
  {
    key: "presentation",
    label: "Presentation",
    icon: Monitor,
  },
  {
    key: "songs",
    label: "Songs",
    icon: Music2,
  },
  {
    key: "bible",
    label: "Bible",
    icon: BookOpen,
  },
  {
    key: "history",
    label: "History",
    icon: Clock3,
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function ChurchLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <svg
        width="62"
        height="62"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_14px_rgba(239,68,68,0.24)]"
      >
        <path
          d="M60 18V63"
          stroke="#ff3b45"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M43 36H77"
          stroke="#ff3b45"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M29 73C40 69 51 72 60 82C69 72 80 69 91 73V91C78 87 68 89 60 99C52 89 42 87 29 91V73Z"
          stroke="#ff3b45"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>

      <h1 className="mt-3 text-[22px] font-semibold leading-none text-white">
        Church AI
      </h1>

      <p className="mt-2 text-[14px] font-medium text-white/45">
        Worship Presentation
      </p>
    </div>
  );
}

export function Sidebar() {
  const { activePage, setActivePage } = useNavigationStore();

  return (
    <aside className="relative flex h-screen w-[220px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0c1116]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.055),transparent_34%)]" />

      <div className="relative z-10 px-4 pt-8">
        <ChurchLogo />
      </div>

      <nav className="relative z-10 mt-10 flex flex-col gap-1.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              className={[
                "group relative flex h-[52px] w-full items-center gap-3 rounded-xl px-4 text-left outline-none transition-all duration-200",
                isActive
                  ? "border border-white/10 bg-white/[0.055] text-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "border border-transparent text-white/62 hover:bg-white/[0.035] hover:text-white",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute -left-2 top-1/2 h-[34px] w-[4px] -translate-y-1/2 rounded-r-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />
              )}

              <Icon
                size={21}
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
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-sm font-semibold leading-none text-white">
            Operator
          </p>
          <p className="mt-1.5 text-xs text-white/40">Local Device</p>
        </div>
      </div>
    </aside>
  );
}
