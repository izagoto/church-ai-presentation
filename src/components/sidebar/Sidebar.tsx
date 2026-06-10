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
    <div className="flex flex-col items-center">
      <svg
        width="76"
        height="76"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_16px_rgba(239,68,68,0.22)]"
      >
        <path
          d="M60 18V64"
          stroke="#ef4444"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M42 36H78"
          stroke="#ef4444"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M28 73C40 69 51 72 60 82C69 72 80 69 92 73V92C78 87 68 89 60 99C52 89 42 87 28 92V73Z"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M60 82V99"
          stroke="#ef4444"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      <h1 className="mt-3 text-center text-[24px] font-semibold leading-tight text-white">
        Church AI
      </h1>

      <p className="mt-1 text-center text-[15px] font-medium text-white/45">
        Worship Presentation
      </p>
    </div>
  );
}

export function Sidebar() {
  const { activePage, setActivePage } = useNavigationStore();

  return (
    <aside className="relative flex h-screen w-[245px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0d1116]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_34%)]" />

      <div className="relative z-10 px-4 pt-10">
        <ChurchLogo />
      </div>

      <nav className="relative z-10 mt-12 flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              className={[
                "group relative flex h-[58px] w-full items-center gap-4 rounded-2xl px-5 text-left outline-none transition-all duration-200",
                isActive
                  ? "border border-white/10 bg-white/[0.045] text-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.18)]"
                  : "border border-transparent text-white/65 hover:bg-white/[0.035] hover:text-white focus-visible:border-white/15 focus-visible:bg-white/[0.035]",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute -left-3 top-1/2 h-[42px] w-[5px] -translate-y-1/2 rounded-r-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.75)]" />
              )}

              <Icon
                size={25}
                strokeWidth={2}
                className={[
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-red-500"
                    : "text-white/65 group-hover:text-white",
                ].join(" ")}
              />

              <span
                className={[
                  "text-[16px] font-semibold transition-colors",
                  isActive
                    ? "text-red-500"
                    : "text-white/65 group-hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative z-10 mt-auto px-4 pb-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-sm font-medium text-white">Operator</p>
          <p className="mt-0.5 text-xs text-white/45">Local Device</p>
        </div>
      </div>
    </aside>
  );
}
