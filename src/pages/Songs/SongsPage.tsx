import { useEffect, useMemo, useState } from "react";

import {
  Gauge,
  KeyRound,
  Music2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Timer,
  Trash2,
  X,
} from "lucide-react";

import type { SongRecord } from "../../data/songs";
import { Button, Card, Input } from "../../components/ui";
import { usePresentationStore } from "../../stores/presentation.store";
import { useSettingsStore } from "../../stores/settings.store";
import { useSongsStore } from "../../stores/songs.store";

type SongFormValue = {
  title: string;
  author: string;
  category: string;
  songKey: string;
  bpm: string;
  timeSignature: string;
  tags: string;
  lyrics: string;
  chords: string;
};

const emptySongForm: SongFormValue = {
  title: "",
  author: "",
  category: "",
  songKey: "",
  bpm: "",
  timeSignature: "4/4",
  tags: "",
  lyrics: "",
  chords: "",
};

function buildFormValue(song?: SongRecord | null): SongFormValue {
  if (!song) return emptySongForm;

  return {
    title: song.title,
    author: song.author,
    category: song.category,
    songKey: song.songKey,
    bpm: song.bpm.toString(),
    timeSignature: song.timeSignature,
    tags: song.tags.join(", "),
    lyrics: song.lyrics,
    chords: song.chords.join(", "),
  };
}

function mapSettingsModelToApiModel(model: string) {
  if (model.startsWith("GPT-4.1-mini")) return "gpt-4.1-mini";
  if (model.startsWith("GPT-4.1")) return "gpt-4.1";
  if (model.startsWith("GPT-4o")) return "gpt-4o";
  return "gpt-4o";
}

function AiSongResults({
  summary,
  notes,
  resultCount,
  onClear,
}: {
  summary: string;
  notes: string[];
  resultCount: number;
  onClear: () => void;
}) {
  return (
    <Card className="mt-4 border-red-500/20 bg-red-500/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
            <Sparkles size={14} />
            AI Song Search
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">{summary}</p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
          aria-label="Clear AI song results"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/55">
        <span>{resultCount} lagu direkomendasikan AI</span>
        {notes.map((note) => (
          <span
            key={note}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"
          >
            {note}
          </span>
        ))}
      </div>
    </Card>
  );
}

function FilterChips({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={[
              "inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition",
              active
                ? "border-red-500/25 bg-red-500/15 text-red-200"
                : "border-white/10 bg-white/[0.035] text-white/70 hover:bg-white/[0.06] hover:text-white",
            ].join(" ")}
          >
            <Music2 size={13} className="text-white/45" />
            {category}
          </button>
        );
      })}
    </div>
  );
}

function SongCard({
  song,
  active,
  onSelect,
}: {
  song: SongRecord;
  active?: boolean;
  onSelect: (song: SongRecord) => void;
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
  songs,
  totalSongs,
  selectedSongId,
  onSelectSong,
}: {
  songs: SongRecord[];
  totalSongs: number;
  selectedSongId: string;
  onSelectSong: (song: SongRecord) => void;
}) {
  const shouldScroll = songs.length > 6;

  return (
    <div
      className={[
        "mt-4",
        shouldScroll ? "flex min-h-0 flex-1 flex-col" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="text-xs text-white/55">{songs.length} hasil ditemukan</p>

        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          Database:
          <span className="ml-1 font-semibold text-white">Local Worship DB</span>
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
          {songs.map((song) => (
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
        Menampilkan {songs.length} dari {totalSongs} lagu
      </p>
    </div>
  );
}

function SongMeta({ song }: { song: SongRecord }) {
  const items = [
    { icon: Tag, value: song.category, label: "Kategori" },
    { icon: KeyRound, value: song.songKey, label: "Key" },
    { icon: Gauge, value: song.bpm.toString(), label: "BPM" },
    { icon: Timer, value: song.timeSignature, label: "Time" },
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

function PresentationSongPreview({ song }: { song: SongRecord }) {
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
            1 / {Math.max(song.lyrics.split("\n\n").length, 1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SongFormModal({
  open,
  title,
  value,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  value: SongFormValue;
  onChange: (nextValue: SongFormValue) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) return null;

  const updateField = (field: keyof SongFormValue, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f13]/95 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/45">
              Kelola data library lagu lokal untuk kebutuhan worship planner.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close song modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid max-h-[75vh] grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-white/65">Title</label>
            <input
              value={value.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">Author</label>
            <input
              value={value.author}
              onChange={(event) => updateField("author", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">
              Category
            </label>
            <input
              value={value.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">Key</label>
            <input
              value={value.songKey}
              onChange={(event) => updateField("songKey", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">BPM</label>
            <input
              value={value.bpm}
              onChange={(event) => updateField("bpm", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">
              Time Signature
            </label>
            <input
              value={value.timeSignature}
              onChange={(event) =>
                updateField("timeSignature", event.target.value)
              }
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-white/65">Tags</label>
            <input
              value={value.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
              placeholder="pisahkan dengan koma"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-white/65">Lyrics</label>
            <textarea
              value={value.lyrics}
              onChange={(event) => updateField("lyrics", event.target.value)}
              className="mt-2 h-[180px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-red-500/40"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-white/65">Chords</label>
            <input
              value={value.chords}
              onChange={(event) => updateField("chords", event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-red-500/40"
              placeholder="G, Em, C, D"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Song
          </Button>
        </div>
      </div>
    </div>
  );
}

function SongDetailPanel({
  song,
  onEdit,
  onDelete,
}: {
  song: SongRecord;
  onEdit: (song: SongRecord) => void;
  onDelete: (song: SongRecord) => void;
}) {
  const { addItem } = usePresentationStore();

  const handleAddToPresentation = () => {
    addItem({
      sourceId: song.id,
      type: "song",
      title: song.title,
      subtitle: `${song.author} · ${song.songKey}`,
      content: song.lyrics,
      key: song.songKey,
      bpm: song.bpm,
    });
  };

  return (
    <Card className="flex h-[760px] min-h-[760px] w-full self-start flex-col bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{song.title}</h3>
          <p className="mt-1 text-sm text-white/45">{song.author}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil size={14} />}
            onClick={() => onEdit(song)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            onClick={() => onDelete(song)}
          >
            Delete
          </Button>
        </div>
      </div>

      <SongMeta song={song} />
      <LyricsPreview lyrics={song.lyrics} />
      <ChordPreview chords={song.chords} />
      <PresentationSongPreview song={song} />

      <div className="mt-3">
        <h4 className="mb-2 text-xs font-semibold text-white">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {song.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-white/65"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <Button
        variant="primary"
        size="md"
        className="mt-3 w-full shrink-0"
        leftIcon={<Plus size={16} />}
        onClick={handleAddToPresentation}
      >
        Add to Presentation
      </Button>
    </Card>
  );
}

export function SongsPage() {
  const songs = useSongsStore((state) => state.songs);
  const addSong = useSongsStore((state) => state.addSong);
  const updateSong = useSongsStore((state) => state.updateSong);
  const deleteSong = useSongsStore((state) => state.deleteSong);
  const settingsModel = useSettingsStore((state) => state.model);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedSongId, setSelectedSongId] = useState<string>(songs[0]?.id ?? "");
  const [songModalOpen, setSongModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<SongRecord | null>(null);
  const [songForm, setSongForm] = useState<SongFormValue>(emptySongForm);
  const [aiResultIds, setAiResultIds] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [aiNotes, setAiNotes] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const categories = useMemo(
    () => ["Semua", ...new Set(songs.map((song) => song.category))],
    [songs],
  );

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return songs.filter((song) => {
      const matchCategory =
        activeCategory === "Semua" || song.category === activeCategory;

      const matchQuery =
        normalizedQuery.length === 0 ||
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.author.toLowerCase().includes(normalizedQuery) ||
        song.songKey.toLowerCase().includes(normalizedQuery) ||
        song.lyrics.toLowerCase().includes(normalizedQuery) ||
        song.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchCategory && matchQuery;
    });
  }, [activeCategory, query, songs]);

  const aiSongs = useMemo(() => {
    if (aiResultIds.length === 0) return [];

    const songMap = new Map(songs.map((song) => [song.id, song]));
    return aiResultIds
      .map((id) => songMap.get(id))
      .filter((song): song is SongRecord => Boolean(song))
      .filter((song) => {
        const matchCategory =
          activeCategory === "Semua" || song.category === activeCategory;
        return matchCategory;
      });
  }, [activeCategory, aiResultIds, songs]);

  const visibleSongs = aiResultIds.length > 0 ? aiSongs : filteredSongs;

  useEffect(() => {
    if (visibleSongs.length === 0) {
      setSelectedSongId("");
      return;
    }

    if (!visibleSongs.some((song) => song.id === selectedSongId)) {
      setSelectedSongId(visibleSongs[0].id);
    }
  }, [selectedSongId, visibleSongs]);

  const selectedSong =
    visibleSongs.find((song) => song.id === selectedSongId) ?? visibleSongs[0];

  const openCreateModal = () => {
    setEditingSong(null);
    setSongForm(emptySongForm);
    setSongModalOpen(true);
  };

  const openEditModal = (song: SongRecord) => {
    setEditingSong(song);
    setSongForm(buildFormValue(song));
    setSongModalOpen(true);
  };

  const closeSongModal = () => {
    setSongModalOpen(false);
    setEditingSong(null);
    setSongForm(emptySongForm);
  };

  const handleSaveSong = () => {
    const payload = {
      title: songForm.title.trim(),
      author: songForm.author.trim(),
      category: songForm.category.trim(),
      songKey: songForm.songKey.trim(),
      bpm: Number(songForm.bpm) || 0,
      timeSignature: songForm.timeSignature.trim() || "4/4",
      tags: songForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      lyrics: songForm.lyrics.trim(),
      chords: songForm.chords
        .split(",")
        .map((chord) => chord.trim())
        .filter(Boolean),
    };

    if (
      !payload.title ||
      !payload.author ||
      !payload.category ||
      !payload.songKey ||
      !payload.lyrics
    ) {
      return;
    }

    if (editingSong) {
      updateSong(editingSong.id, payload);
      setSelectedSongId(editingSong.id);
    } else {
      const nextSong = addSong(payload);
      setSelectedSongId(nextSong.id);
    }

    closeSongModal();
  };

  const handleDeleteSong = (song: SongRecord) => {
    deleteSong(song.id);
  };

  const clearAiResults = () => {
    setAiResultIds([]);
    setAiSummary("");
    setAiNotes([]);
    setAiError("");
  };

  const handleAiSearch = async () => {
    if (!window.api?.ai?.searchSongs) {
      setAiError("AI search belum tersedia di mode browser ini.");
      return;
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setAiError("Masukkan tema, suasana, atau kebutuhan lagu terlebih dahulu.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const result = await window.api.ai.searchSongs({
        model: mapSettingsModelToApiModel(settingsModel),
        query: trimmedQuery,
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          author: song.author,
          category: song.category,
          songKey: song.songKey,
          tags: song.tags,
          lyricPreview: song.lyricPreview,
        })),
      });

      setAiResultIds(result.songIds);
      setAiSummary(
        result.summary || `AI memilih ${result.songIds.length} lagu yang paling dekat dengan kebutuhan ini.`,
      );
      setAiNotes(result.notes);

      if (result.songIds[0]) {
        setSelectedSongId(result.songIds[0]);
      }
    } catch (error) {
      setAiError(
        error instanceof Error ? error.message : "AI search gagal dijalankan.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight text-white">
              Songs
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Song library siap dihubungkan ke data real dan tetap mendukung CRUD
            </p>
          </div>

          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={openCreateModal}
          >
            Add Song
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Input
              className="h-11 shrink-0 rounded-xl"
              leftIcon={<Search size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={handleAiSearch}
                  disabled={aiLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/15 disabled:cursor-wait disabled:opacity-70"
                  aria-label="AI search songs"
                >
                  <Sparkles size={16} />
                </button>
              }
              placeholder="Cari judul lagu, penulis, tema, key, atau penggalan lirik..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            {aiResultIds.length > 0 ? (
              <AiSongResults
                summary={aiSummary}
                notes={aiNotes}
                resultCount={aiSongs.length}
                onClear={clearAiResults}
              />
            ) : null}

            {aiError ? (
              <Card className="mt-4 border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-100">
                {aiError}
              </Card>
            ) : null}

            <div className="shrink-0">
              <FilterChips
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>

            {visibleSongs.length > 0 ? (
              <SongList
                songs={visibleSongs}
                totalSongs={songs.length}
                selectedSongId={selectedSongId}
                onSelectSong={(song) => setSelectedSongId(song.id)}
              />
            ) : (
              <Card className="mt-4 flex min-h-[220px] items-center justify-center p-6 text-center">
                <div>
                  <p className="text-base font-semibold text-white/65">
                    {aiResultIds.length > 0
                      ? "AI tidak menemukan lagu yang cocok"
                      : "Library lagu masih kosong"}
                  </p>
                  <p className="mt-2 text-sm text-white/35">
                    {aiResultIds.length > 0
                      ? "Coba ubah prompt AI atau kembali ke pencarian manual."
                      : "Tambahkan data lagu real terlebih dahulu atau import dari source utama."}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {selectedSong ? (
            <SongDetailPanel
              song={selectedSong}
              onEdit={openEditModal}
              onDelete={handleDeleteSong}
            />
          ) : (
            <Card className="flex h-[760px] items-center justify-center p-4 text-center text-white/45">
              Belum ada lagu untuk ditampilkan.
            </Card>
          )}
        </div>
      </div>

      <SongFormModal
        open={songModalOpen}
        title={editingSong ? "Edit Song" : "Add Song"}
        value={songForm}
        onChange={setSongForm}
        onClose={closeSongModal}
        onSubmit={handleSaveSong}
      />
    </div>
  );
}
