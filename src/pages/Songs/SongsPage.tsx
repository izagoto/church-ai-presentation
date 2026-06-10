import { useState } from "react";

import {
  Gauge,
  KeyRound,
  Music2,
  Plus,
  Search,
  Sparkles,
  Tag,
  Timer,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

type SongResult = {
  id: string;
  title: string;
  author: string;
  category: string;
  songKey: string;
  bpm: number;
  timeSignature: string;
  lyricPreview: string;
  lyrics: string;
  chords: string[];
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
    lyrics: `Kau setia Tuhan dari dulu s’lamanya
Kasih-Mu tak pernah berubah
Engkaulah Tuhan yang selalu ada
Di setiap musim dalam hidupku

Ku bersyukur atas kebaikan-Mu
Yang tak pernah habis di hidupku
Kau setia, Kau mulia
S’lama-lamanya`,
    chords: ["G", "Em", "C", "D", "G", "C", "D"],
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
    lyrics: `Great is our God
And all will see
How great is our God

Name above all names
Worthy of all praise
My heart will sing
How great is our God`,
    chords: ["D", "Bm", "G", "A", "D"],
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
    lyrics: `Bersorak-sorai bagi Raja kita
Angkatlah pujian bagi Dia
Sebab Dia baik
Kasih setia-Nya untuk selamanya`,
    chords: ["A", "F#m", "D", "E", "A"],
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
    lyrics: `Ku bersyukur kepada-Mu Tuhan
Atas kasih dan kebaikan-Mu
Di setiap langkah hidupku
Engkau selalu menyertaiku`,
    chords: ["E", "C#m", "A", "B", "E"],
  },
  {
    id: "5",
    title: "S’bab Engkau Tuhan Baik",
    author: "Worship Team",
    category: "Pujian",
    songKey: "C",
    bpm: 76,
    timeSignature: "4/4",
    lyricPreview:
      "S’bab Engkau Tuhan baik, dan kasih-Mu nyata dalam hidupku...",
    lyrics: `S’bab Engkau Tuhan baik
Dan kasih-Mu nyata dalam hidupku
Tak pernah habis rahmat-Mu
S’lama-lamanya`,
    chords: ["C", "Am", "F", "G", "C"],
  },
  {
    id: "6",
    title: "Bapa Sentuh Hatiku",
    author: "Maria Shandi",
    category: "Penyembahan",
    songKey: "D",
    bpm: 70,
    timeSignature: "4/4",
    lyricPreview:
      "Betapa kumencintai segala yang t’lah terjadi dalam hidupku...",
    lyrics: `Betapa kumencintai
Segala yang t’lah terjadi
Dalam hidupku ini
Kau menjadikan semuanya indah`,
    chords: ["D", "Bm", "G", "A", "D"],
  },
  {
    id: "7",
    title: "Hati Ku Percaya",
    author: "Maria Shandi",
    category: "Penyembahan",
    songKey: "D",
    bpm: 70,
    timeSignature: "4/4",
    lyricPreview:
      "Saat ku tak melihat jalan-Mu, saat ku tak mengerti rencana-Mu...",
    lyrics: `Saat ku tak melihat jalan-Mu
Saat ku tak mengerti rencana-Mu
Namun tetap kupegang janji-Mu
Pengharapanku hanya pada-Mu`,
    chords: ["D", "A", "Bm", "G", "D"],
  },
];

function FilterChips() {
  const chips = ["Lagu penyembahan", "Lagu natal", "Lagu pembukaan ibadah"];

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Music2 size={13} className="text-white/45" />
          {chip}
        </button>
      ))}

      <button
        type="button"
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Plus size={13} className="text-white/45" />
        Lebih banyak
      </button>
    </div>
  );
}

function SongCard({
  song,
  active,
  onSelect,
}: {
  song: SongResult;
  active?: boolean;
  onSelect: (song: SongResult) => void;
}) {
  return (
    <Card
      onClick={() => onSelect(song)}
      className={[
        "group flex min-h-[185px] cursor-pointer flex-col justify-between p-4 transition",
        active
          ? "border-red-500/70 bg-white/[0.045]"
          : "hover:border-white/15 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-500">
            <Music2 size={21} />
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] font-semibold text-white/50">
            {song.songKey} · {song.bpm} BPM
          </div>
        </div>

        <h3 className="truncate text-base font-semibold text-white">
          {song.title}
        </h3>

        <p className="mt-1 truncate text-sm text-white/45">{song.author}</p>

        <div className="mt-3 inline-flex rounded-lg border border-red-500/15 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200">
          {song.category}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/45">
          {song.lyricPreview}
        </p>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs font-medium text-white/35">
          Klik card untuk melihat detail lagu
        </p>
      </div>
    </Card>
  );
}

function SongList({
  selectedSongId,
  onSelectSong,
}: {
  selectedSongId: string;
  onSelectSong: (song: SongResult) => void;
}) {
  const shouldScroll = songResults.length > 6;

  return (
    <div
      className={[
        "mt-4",
        shouldScroll ? "flex min-h-0 flex-1 flex-col" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="text-xs text-white/55">
          {songResults.length} hasil ditemukan
        </p>

        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          Urutkan:
          <span className="ml-1 font-semibold text-white">Relevansi</span>
        </button>
      </div>

      <div
        className={
          shouldScroll
            ? "song-list-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0"
            : "overflow-visible"
        }
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {songResults.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              active={song.id === selectedSongId}
              onSelect={onSelectSong}
            />
          ))}
        </div>
      </div>

      <p
        className={[
          "text-center text-xs text-white/35",
          shouldScroll ? "shrink-0 pt-3" : "mt-3",
        ].join(" ")}
      >
        Menampilkan {songResults.length} dari {songResults.length} hasil
      </p>
    </div>
  );
}

function SongMeta({ song }: { song: SongResult }) {
  const items = [
    {
      icon: Tag,
      value: song.category,
      label: "Kategori",
    },
    {
      icon: KeyRound,
      value: song.songKey,
      label: "Key",
    },
    {
      icon: Gauge,
      value: song.bpm.toString(),
      label: "BPM",
    },
    {
      icon: Timer,
      value: song.timeSignature,
      label: "Time",
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-4 gap-2 border-b border-white/10 pb-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.label} className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-white/70">
              <Icon size={12} className="text-white/45" />
              <span className="truncate text-xs font-semibold">
                {item.value}
              </span>
            </div>

            <p className="text-[10px] text-white/35">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function LyricsPreview({ lyrics }: { lyrics: string }) {
  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-white">Lirik Preview</h4>

      <div className="mt-2 rounded-xl border border-white/10 bg-black/15 p-3">
        <p className="whitespace-pre-line text-xs leading-5 text-white/75">
          {lyrics}
        </p>
      </div>
    </div>
  );
}

function ChordPreview({ chords }: { chords: string[] }) {
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white">
          Chord Preview <span className="text-white/35">(Intro)</span>
        </h4>

        <span className="text-xs text-white/40">Capo 0</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chords.map((chord, index) => (
          <span
            key={`${chord}-${index}`}
            className="inline-flex h-7 min-w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.035] px-2 text-xs font-semibold text-white"
          >
            {chord}
          </span>
        ))}
      </div>
    </div>
  );
}

function PresentationSongPreview({ song }: { song: SongResult }) {
  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-white">Presentation Preview</h4>

      <div className="relative mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-[1px]">
        <div className="relative overflow-hidden rounded-[11px] bg-gradient-to-br from-[#28213b] via-[#6b2b30] to-[#ef9d4b]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.28),transparent_28%)]" />
          <div className="absolute inset-0 bg-black/15" />

          <div className="relative flex aspect-[16/7.6] flex-col items-center justify-center px-5 text-center">
            <h3 className="text-xl font-bold leading-tight text-white drop-shadow">
              {song.title}
            </h3>

            <p className="mt-1.5 line-clamp-1 text-sm font-medium text-white/90">
              {song.lyricPreview.replace("...", "")}
            </p>
          </div>

          <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-2 py-0.5 text-[11px] font-medium text-white">
            1 / 6
          </span>
        </div>
      </div>
    </div>
  );
}

function SongDetailPanel({ song }: { song: SongResult }) {
  return (
    <Card className="flex h-[760px] min-h-[760px] w-full self-start flex-col bg-white/[0.04] p-4">
      <div>
        <h3 className="text-xl font-semibold text-white">{song.title}</h3>

        <p className="mt-1 text-sm text-white/45">{song.author}</p>
      </div>

      <SongMeta song={song} />

      <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-1">
        <button
          type="button"
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Show Chord
        </button>

        <button
          type="button"
          className="rounded-lg px-3 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
        >
          Hide Chord
        </button>
      </div>

      <LyricsPreview lyrics={song.lyrics} />
      <ChordPreview chords={song.chords} />
      <PresentationSongPreview song={song} />

      <div className="flex-1" />

      <Button
        variant="primary"
        size="md"
        className="mt-3 w-full shrink-0"
        leftIcon={<Plus size={16} />}
      >
        Add to Presentation
      </Button>
    </Card>
  );
}

export function SongsPage() {
  const [selectedSong, setSelectedSong] = useState<SongResult>(songResults[0]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[28px] font-semibold leading-tight text-white">
          Songs
        </h2>

        <p className="mt-1 text-sm text-white/45">
          AI song search and worship library
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Input
              className="h-11 shrink-0 rounded-xl"
              leftIcon={<Search size={18} />}
              rightIcon={
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500">
                  <Sparkles size={16} />
                </div>
              }
              placeholder="Search"
            />

            <div className="shrink-0">
              <FilterChips />
            </div>

            <SongList
              selectedSongId={selectedSong.id}
              onSelectSong={setSelectedSong}
            />
          </div>

          <SongDetailPanel song={selectedSong} />
        </div>
      </div>
    </div>
  );
}
