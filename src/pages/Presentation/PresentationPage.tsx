import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Circle,
  Copy,
  GripVertical,
  Maximize2,
  Monitor,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "../../components/ui";

type ServiceItemType = "song" | "bible" | "pdf";

type ServiceItem = {
  id: string;
  type: ServiceItemType;
  title: string;
};

const serviceItems: ServiceItem[] = [
  {
    id: "1",
    type: "song",
    title: "Lagu Pembukaan",
  },
  {
    id: "2",
    type: "song",
    title: "Lagu Penyembahan",
  },
  {
    id: "3",
    type: "song",
    title: "Lagu Penyembahan",
  },
  {
    id: "4",
    type: "bible",
    title: "Ayat Firman Tuhan",
  },
  {
    id: "5",
    type: "pdf",
    title: "Materi Khotbah (PDF)",
  },
  {
    id: "6",
    type: "song",
    title: "Lagu Penutup",
  },
];

function getItemBadge(type: ServiceItemType) {
  if (type === "song") {
    return "bg-red-500/15 text-red-200 border-red-500/20";
  }

  if (type === "bible") {
    return "bg-blue-500/15 text-blue-200 border-blue-500/20";
  }

  return "bg-purple-500/15 text-purple-200 border-purple-500/20";
}

function getItemLabel(type: ServiceItemType) {
  if (type === "song") return "Song";
  if (type === "bible") return "Bible";
  return "PDF";
}

function ServiceInfoCard() {
  const info = [
    {
      label: "Service Name",
      value: "Minggu Pagi",
      icon: CalendarDays,
    },
    {
      label: "Date",
      value: "09 Juni 2026",
      icon: CalendarDays,
    },
    {
      label: "Pastor",
      value: "Pdt. Samuel Jonathan",
      icon: UserRound,
    },
    {
      label: "Sermon Theme",
      value: "Hidup Dalam Kasih Kristus",
      icon: BookOpen,
    },
  ];

  return (
    <section className="grid min-w-0 grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] md:grid-cols-2 2xl:grid-cols-4">
      {info.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={[
              "flex items-center gap-3 px-5 py-4",
              index !== 0
                ? "border-t border-white/10 md:border-l md:border-t-0"
                : "",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <Icon size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-white/40">{item.label}</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ServicePlanner() {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Service Planner
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Susun urutan ibadah dari awal sampai akhir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button leftIcon={<Plus size={17} className="text-red-500" />}>
            Quick Add
          </Button>

          <Button leftIcon={<Search size={17} />} variant="secondary">
            Search Item
          </Button>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {serviceItems.map((item) => {
          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 py-3.5 transition"
            >
              <button
                type="button"
                className="text-white/25 transition group-hover:text-white/50"
                aria-label="Drag item"
              >
                <GripVertical size={20} />
              </button>

              <span
                className={[
                  "min-w-[52px] rounded-md border px-2.5 py-1 text-center text-[11px] font-semibold",
                  getItemBadge(item.type),
                ].join(" ")}
              >
                {getItemLabel(item.type)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {item.title}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-80 transition group-hover:opacity-100">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  aria-label="Edit item"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  aria-label="Duplicate item"
                >
                  <Copy size={17} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
                  aria-label="Delete item"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-center text-sm text-white/35">
        Drag items to reorder the service flow
      </div>
    </section>
  );
}

function SlideThumbnail({
  title,
  subtitle,
  index,
}: {
  title: string;
  subtitle: string;
  index: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#28213b] via-[#6b2b30] to-[#ef9d4b] p-4 shadow-lg shadow-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.28),transparent_28%)]" />
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative flex h-[104px] w-full flex-col items-center justify-center text-center">
        <p className="text-lg font-bold leading-tight text-white drop-shadow">
          {title}
        </p>
        <p className="mt-1 text-sm font-medium text-white/90">{subtitle}</p>
      </div>

      <span className="absolute bottom-2 left-2 rounded-lg bg-black/45 px-2 py-1 text-xs font-medium text-white">
        {index}
      </span>
    </div>
  );
}

function ProjectorPreview() {
  return (
    <section className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Projector Preview
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Tampilan yang akan dilihat jemaat.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
          <Circle size={8} fill="currentColor" />
          Live
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#202035] via-[#6f2d3b] to-[#f29c44] shadow-xl shadow-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.32),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />

        <div className="relative flex aspect-[16/8.7] flex-col items-center justify-center px-10 text-center">
          <h2 className="max-w-[720px] text-[38px] font-bold leading-[1.15] tracking-tight text-white drop-shadow-xl">
            Kau setia Tuhan
            <br />
            Dari dulu s’lamanya
          </h2>

          <p className="mt-3 text-xl font-medium text-white/90 drop-shadow">
            Kasih-Mu tak pernah berubah
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 2xl:grid-cols-5">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronLeft size={19} />
          Previous
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500"
        >
          Next
          <ChevronRight size={19} />
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Maximize2 size={17} />
          Fullscreen
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Monitor size={18} />
          Blank
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Circle size={9} fill="#ef4444" className="text-red-500" />
          Live
        </button>
      </div>
    </section>
  );
}

function OperatorPreview() {
  return (
    <section className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Operator Preview
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Slide saat ini dan slide berikutnya.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/60">
          Total Slides <span className="ml-2 font-semibold text-white">12</span>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-white/55">
            Current Slide
          </p>

          <SlideThumbnail
            title="Kau setia Tuhan"
            subtitle="Kasih-Mu tak pernah berubah"
            index="1 / 12"
          />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-white/55">Next Slide</p>

          <SlideThumbnail
            title="S’bab Engkau Tuhan baik"
            subtitle="Dan kasih-Mu nyata"
            index="2 / 12"
          />
        </div>
      </div>
    </section>
  );
}

export function PresentationPage() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 pb-6">
      <header>
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          Presentation
        </h2>
        <p className="mt-1 text-base text-white/45">Service control center</p>
      </header>

      <ServiceInfoCard />

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <ServicePlanner />

        <div className="flex w-full min-w-0 flex-col gap-5">
          <OperatorPreview />
          <ProjectorPreview />
        </div>
      </div>
    </div>
  );
}
