import {
  Eye,
  Gauge,
  KeyRound,
  Music2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Timer,
} from "lucide-react";

import { Badge, Button, Card, Input } from "../../components/ui";

type SongResult = {
  id: string;
  title: string;
  author: string;
  category: string;
  songKey: string;
  bpm: number;
  timeSignature: string;
  lyricPreview: string;
};

const songResults: SongResult[] = [
  {
    id: "1",
    title: "Kau Setia Tuhan",
    author: "True Worshippers",
    category: "Penyembahan",
    songKey: "G",
    bpm: 72,
    timeSignature: "4/4",
    lyricPreview:
      "Kau setia Tuhan dari dulu s’lamanya, kasih-Mu tak pernah berubah...",
  },
  {
    id: "2",
    title: "Great Is Our God",
    author: "Sidney Mohede",
    category: "Penyembahan",
    songKey: "D",
    bpm: 80,
    timeSignature: "4/4",
    lyricPreview:
      "Great is our God, and all will see how great, how great is our God...",
  },
  {
    id: "3",
    title: "Bersorak-sorai",
    author: "NDC Worship",
    category: "Penyembahan",
    songKey: "A",
    bpm: 140,
    timeSignature: "4/4",
    lyricPreview: "Bersorak-sorai bagi Raja kita, angkatlah pujian bagi Dia...",
  },
  {
    id: "4",
    title: "Ku Bersyukur",
    author: "JPCC Worship",
    category: "Syukur",
    songKey: "E",
    bpm: 68,
    timeSignature: "4/4",
    lyricPreview: "Ku bersyukur kepada-Mu Tuhan, atas kasih dan kebaikan-Mu...",
  },
];

const selectedSong = songResults[0];

const chordPreview = ["G", "Em", "C", "D", "G", "C", "D"];

function FilterChips() {
  const chips = ["Lagu penyembahan", "Lagu natal", "Lagu pembukaan ibadah"];

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Music2 size={16} className="text-white/45" />
          {chip}
        </button>
      ))}

      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Plus size={16} className="text-white/45" />
        Lebih banyak
      </button>
    </div>
  );
}

function SongCard({ song, active }: { song: SongResult; active?: boolean }) {
  return (
    <Card
      className={[
        "p-4 transition",
        active
          ? "border-red-500/70 bg-white/[0.045]"
          : "hover:border-white/15 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_340px] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-500">
            <Music2 size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {song.title}
            </h3>
            <p className="mt-1 text-sm text-white/45">{song.author}</p>

            <p className="mt-3 truncate text-sm text-white/45">
              {song.lyricPreview}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[90px_62px_62px_130px] items-center gap-3">
          <div>
            <p className="text-sm font-medium text-white/85">{song.category}</p>
            <p className="mt-0.5 text-xs text-white/35">Kategori</p>
          </div>

          <div>
            <p className="text-sm font-medium text-white/85">{song.songKey}</p>
            <p className="mt-0.5 text-xs text-white/35">Key</p>
          </div>

          <div>
            <p className="text-sm font-medium text-white/85">{song.bpm}</p>
            <p className="mt-0.5 text-xs text-white/35">BPM</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] text-sm font-medium text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Eye size={15} />
              View Detail
            </button>

            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] text-sm font-medium text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SongList() {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-white/55">4 hasil ditemukan</p>

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          Urutkan:{" "}
          <span className="ml-1 font-medium text-white">Relevansi</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {songResults.map((song, index) => (
          <SongCard key={song.id} song={song} active={index === 0} />
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-white/35">
        Menampilkan 4 dari 4 hasil
      </p>
    </div>
  );
}

function SongMeta() {
  const items = [
    {
      icon: Tag,
      value: selectedSong.category,
      label: "Kategori",
    },
    {
      icon: KeyRound,
      value: selectedSong.songKey,
      label: "Key",
    },
    {
      icon: Gauge,
      value: selectedSong.bpm.toString(),
      label: "BPM",
    },
    {
      icon: Timer,
      value: selectedSong.timeSignature,
      label: "Time Signature",
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-4 gap-3 border-b border-white/10 pb-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.label} className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-white/70">
              <Icon size={15} className="text-white/45" />
              <span className="truncate text-sm font-semibold">
                {item.value}
              </span>
            </div>
            <p className="text-xs text-white/35">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function LyricsPreview() {
  return (
    <div className="mt-5">
      <h4 className="text-sm font-semibold text-white">Lirik Preview</h4>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/15 p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-white/75">
          {`Kau setia Tuhan dari dulu s’lamanya
Kasih-Mu tak pernah berubah
Engkaulah Tuhan yang selalu ada
Di setiap musim dalam hidupku

Ku bersyukur atas kebaikan-Mu
Yang tak pernah habis di hidupku
Kau setia, Kau mulia
S’lama-lamanya`}
        </p>
      </div>
    </div>
  );
}

function ChordPreview() {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">
          Chord Preview <span className="text-white/35">(Intro)</span>
        </h4>

        <span className="text-sm text-white/40">Capo 0</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {chordPreview.map((chord, index) => (
          <span
            key={`${chord}-${index}`}
            className="inline-flex h-9 min-w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-white"
          >
            {chord}
          </span>
        ))}
      </div>
    </div>
  );
}

function PresentationSongPreview() {
  return (
    <div className="mt-5">
      <h4 className="text-sm font-semibold text-white">Presentation Preview</h4>

      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#28213b] via-[#6b2b30] to-[#ef9d4b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.28),transparent_28%)]" />
        <div className="absolute inset-0 bg-black/15" />

        <div className="relative flex aspect-video flex-col items-center justify-center px-6 text-center">
          <h3 className="text-2xl font-bold leading-tight text-white drop-shadow">
            Kau setia Tuhan
            <br />
            dari dulu s’lamanya
          </h3>
          <p className="mt-2 text-base font-medium text-white/90">
            Kasih-Mu tak pernah berubah
          </p>
        </div>

        <span className="absolute bottom-2 left-2 rounded-lg bg-black/45 px-2 py-1 text-xs font-medium text-white">
          1 / 6
        </span>
      </div>
    </div>
  );
}

function SongDetailPanel() {
  return (
    <Card className="self-start p-5">
      <div>
        <h3 className="text-2xl font-semibold text-white">
          {selectedSong.title}
        </h3>
        <p className="mt-1 text-base text-white/45">{selectedSong.author}</p>
      </div>

      <SongMeta />

      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-1">
        <button
          type="button"
          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Show Chord
        </button>

        <button
          type="button"
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
        >
          Hide Chord
        </button>
      </div>

      <LyricsPreview />
      <ChordPreview />
      <PresentationSongPreview />

      <Button
        variant="primary"
        size="lg"
        className="mt-5 w-full"
        leftIcon={<Plus size={18} />}
      >
        Add to Presentation
      </Button>
    </Card>
  );
}

export function SongsPage() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 pb-6">
      <header>
        <h2 className="text-[30px] font-semibold leading-tight text-white">
          Songs
        </h2>
        <p className="mt-1 text-sm text-white/45">
          AI song search and worship library
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <Input
            leftIcon={<Search size={20} />}
            rightIcon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
                <Sparkles size={18} />
              </div>
            }
            placeholder="Cari lagu berdasarkan judul, lirik, tema, atau penulis..."
          />

          <FilterChips />
          <SongList />
        </div>

        <SongDetailPanel />
      </div>
    </div>
  );
}
