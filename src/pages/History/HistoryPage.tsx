import { useState, type ElementType, type ReactNode } from "react";

import {
  BookOpen,
  Clock3,
  ExternalLink,
  FileText,
  ListMusic,
  RefreshCcw,
  Search,
  Tag,
  UserRound,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

type HistoryService = {
  id: string;
  month: string;
  day: string;
  year: string;
  title: string;
  preacher: string;
  theme: string;
  songs: string[];
  verses: string[];
  pdfTitle: string;
  duration: string;
  monthName: string;
};

const historyServices: HistoryService[] = [
  {
    id: "1",
    month: "JUN",
    day: "09",
    year: "2026",
    title: "Minggu Pagi",
    preacher: "Pdt. Samuel Jonathan",
    theme: "Hidup Dalam Kasih Kristus",
    songs: [
      "Kau setia Tuhan",
      "S’bab Engkau Tuhan baik",
      "Kuasa Nama-Mu",
      "Bukan Kar’na Upayaku",
    ],
    verses: ["Mazmur 23:1-4", "Yohanes 3:16"],
    pdfTitle: "Materi Khotbah (PDF)",
    duration: "01:15:30",
    monthName: "Juni 2026",
  },
  {
    id: "2",
    month: "JUN",
    day: "02",
    year: "2026",
    title: "Minggu Pagi",
    preacher: "Pdt. Samuel Jonathan",
    theme: "Berjalan Dalam Terang-Nya",
    songs: [
      "Ku Bersyukur",
      "Great Is Thy Faithfulness",
      "Allah Peduli",
      "Satu Hal Yang Kurindu",
    ],
    verses: ["1 Yohanes 1:5-7", "Efesus 5:8"],
    pdfTitle: "Materi Khotbah (PDF)",
    duration: "01:10:45",
    monthName: "Juni 2026",
  },
  {
    id: "3",
    month: "MAY",
    day: "26",
    year: "2026",
    title: "Minggu Pagi",
    preacher: "Pdt. Samuel Jonathan",
    theme: "Iman yang Menggerakkan",
    songs: [
      "Bapa Kami Datang",
      "Yesus Setia",
      "Hanya Dekat Allah",
      "Dengan Sayap-Mu",
    ],
    verses: ["Ibrani 11:1-6", "Markus 9:23"],
    pdfTitle: "Materi Khotbah (PDF)",
    duration: "01:18:20",
    monthName: "Mei 2026",
  },
  {
    id: "4",
    month: "MAY",
    day: "19",
    year: "2026",
    title: "Minggu Pagi",
    preacher: "Pdt. Samuel Jonathan",
    theme: "Berakar Dalam Firman",
    songs: [
      "Firman-Mu Pelita",
      "Tak Tergoyahkan",
      "Ku Mau Cinta Yesus",
      "Sungguh Indah",
    ],
    verses: ["Mazmur 1:1-3", "Kolose 2:6-7"],
    pdfTitle: "Materi Khotbah (PDF)",
    duration: "01:12:10",
    monthName: "Mei 2026",
  },
  {
    id: "5",
    month: "MAY",
    day: "12",
    year: "2026",
    title: "Minggu Pagi",
    preacher: "Pdt. Samuel Jonathan",
    theme: "Kasih yang Memulihkan",
    songs: [
      "Kasih Setia-Mu",
      "Kau Allah Yang Besar",
      "Sampai Akhir Hidupku",
      "Besar Anugerah-Mu",
    ],
    verses: ["1 Yohanes 4:8", "Roma 8:38-39"],
    pdfTitle: "Materi Khotbah (PDF)",
    duration: "01:16:05",
    monthName: "Mei 2026",
  },
];

const months = ["Semua", "Mei 2026", "April 2026", "Maret 2026"];

function DateBadge({ service }: { service: HistoryService }) {
  return (
    <div className="flex h-[96px] w-[74px] shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
      <p className="text-xs font-semibold text-red-400">{service.month}</p>

      <p className="mt-1 text-[34px] font-semibold leading-none text-white">
        {service.day}
      </p>

      <p className="mt-1 text-sm text-white/55">{service.year}</p>
    </div>
  );
}

function HistoryFilterBar() {
  return (
    <Card className="mt-4 shrink-0 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {months.map((month, index) => (
            <button
              key={month}
              type="button"
              className={[
                "inline-flex h-10 items-center rounded-lg px-5 text-sm font-medium transition",
                index === 0
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/25"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {month}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white"
        >
          Terbaru
          <span className="text-white/35">⌄</span>
        </button>
      </div>
    </Card>
  );
}

function HistoryRow({
  service,
  active,
  onSelect,
}: {
  service: HistoryService;
  active?: boolean;
  onSelect: (service: HistoryService) => void;
}) {
  return (
    <Card
      onClick={() => onSelect(service)}
      className={[
        "grid min-h-[156px] cursor-pointer grid-cols-[96px_1.15fr_1fr_1fr] items-center gap-4 p-4 transition",
        active
          ? "border-red-500/70 bg-white/[0.045]"
          : "hover:border-white/15 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <DateBadge service={service} />

      <div className="min-w-0">
        <h3 className="text-xl font-semibold text-white">{service.title}</h3>

        <div className="mt-3 space-y-2 text-sm text-white/65">
          <div className="flex items-center gap-2">
            <UserRound size={15} className="text-white/45" />
            <span className="truncate">{service.preacher}</span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-white/45" />
            <span className="truncate">{service.theme}</span>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-white/65">Lagu</p>

        <ul className="space-y-1 text-sm text-white/65">
          {service.songs.slice(0, 2).map((song) => (
            <li key={song} className="truncate">
              • {song}
            </li>
          ))}

          <li className="text-white/45">
            +{Math.max(service.songs.length - 2, 0)} lainnya
          </li>
        </ul>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-white/65">Ayat</p>

        <ul className="space-y-1 text-sm text-white/65">
          {service.verses.map((verse) => (
            <li key={verse} className="truncate">
              • {verse}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function HistoryList({
  selectedHistoryId,
  onSelectHistory,
}: {
  selectedHistoryId: string;
  onSelectHistory: (service: HistoryService) => void;
}) {
  const shouldScroll = historyServices.length > 4;

  return (
    <Card
      className={[
        "mt-4 p-4",
        shouldScroll ? "flex min-h-0 flex-1 flex-col" : "shrink-0",
      ].join(" ")}
    >
      <div
        className={
          shouldScroll
            ? "history-list-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0"
            : "overflow-visible"
        }
      >
        <div className="space-y-3">
          {historyServices.map((service) => (
            <HistoryRow
              key={service.id}
              service={service}
              active={service.id === selectedHistoryId}
              onSelect={onSelectHistory}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function DetailInfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[190px_1fr] gap-6 border-b border-white/10 py-5">
      <div className="flex items-center gap-4 text-white/65">
        <Icon size={24} className="text-red-500" />
        <p className="text-base font-medium">{label}</p>
      </div>

      <div className="text-base leading-7 text-white/75">{children}</div>
    </div>
  );
}

function HistoryDetailPanel({ service }: { service: HistoryService }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-6">
      <div className="flex items-start gap-6">
        <DateBadge service={service} />

        <div className="min-w-0 pt-1">
          <h3 className="text-[28px] font-semibold leading-tight text-white">
            {service.title}
          </h3>

          <div className="mt-4 space-y-2 text-base text-white/70">
            <div className="flex items-center gap-3">
              <UserRound size={18} className="text-white/45" />
              <span>{service.preacher}</span>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-white/45" />
              <span>{service.theme}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 h-px bg-white/10" />

      <div className="min-h-0 flex-1 overflow-hidden">
        <DetailInfoRow icon={ListMusic} label="Lagu yang digunakan">
          <ul className="space-y-1">
            {service.songs.map((song) => (
              <li key={song}>• {song}</li>
            ))}
          </ul>
        </DetailInfoRow>

        <DetailInfoRow icon={BookOpen} label="Ayat yang digunakan">
          <ul className="space-y-1">
            {service.verses.map((verse) => (
              <li key={verse}>• {verse}</li>
            ))}
          </ul>
        </DetailInfoRow>

        <DetailInfoRow icon={FileText} label="Materi PDF">
          <div className="inline-flex items-center gap-3">
            <span className="rounded-lg bg-purple-500/20 px-3 py-1 text-sm font-semibold text-purple-300">
              PDF
            </span>

            <span>{service.pdfTitle}</span>
          </div>
        </DetailInfoRow>

        <DetailInfoRow icon={Clock3} label="Durasi Layanan">
          {service.duration}
        </DetailInfoRow>

        <DetailInfoRow icon={Tag} label="Bulan">
          {service.monthName}
        </DetailInfoRow>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<RefreshCcw size={20} />}
          className="h-14"
        >
          Reuse Service
        </Button>

        <Button
          variant="secondary"
          size="lg"
          leftIcon={<ExternalLink size={19} />}
          className="h-14"
        >
          Open Detail
        </Button>
      </div>
    </Card>
  );
}

export function HistoryPage() {
  const [selectedHistory, setSelectedHistory] = useState<HistoryService>(
    historyServices[0],
  );

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          History
        </h2>

        <p className="mt-1 text-base text-white/45">
          Previous services and reusable worship plans
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)] gap-6">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Input
              className="h-14 shrink-0 rounded-xl text-base"
              leftIcon={<Search size={24} />}
              placeholder="Search"
            />

            <HistoryFilterBar />

            <HistoryList
              selectedHistoryId={selectedHistory.id}
              onSelectHistory={setSelectedHistory}
            />
          </div>

          <HistoryDetailPanel service={selectedHistory} />
        </div>
      </div>
    </div>
  );
}
