import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  Brain,
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Circle,
  Copy,
  FileText,
  Maximize2,
  Monitor,
  Music2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Tv,
  X,
  AlertTriangle,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";
import {
  buildPresentationCatalog,
  type PresentationCatalogItem as SearchCatalogItem,
} from "../../lib/presentation-catalog";
import {
  getCurrentPresentationSlide,
  getPresentationSlides,
} from "../../lib/presentation-slides";
import { useBibleStore } from "../../stores/bible.store";
import { useNavigationStore } from "../../stores/navigation.store";
import { useHistoryStore } from "../../stores/history.store";
import {
  usePresentationStore,
  type PresentationItem,
  type PresentationItemType,
} from "../../stores/presentation.store";
import { useSettingsStore } from "../../stores/settings.store";
import { useSongsStore } from "../../stores/songs.store";

function getItemBadge(type: PresentationItemType) {
  if (type === "song") {
    return "bg-red-500/15 text-red-200 border-red-500/20";
  }

  if (type === "bible") {
    return "bg-blue-500/15 text-blue-200 border-blue-500/20";
  }

  return "bg-purple-500/15 text-purple-200 border-purple-500/20";
}

function getItemLabel(type: PresentationItemType) {
  if (type === "song") return "Song";
  if (type === "bible") return "Bible";
  return "PDF";
}

function getItemIcon(type: PresentationItemType) {
  if (type === "song") return Music2;
  if (type === "bible") return BookOpen;
  return FileText;
}

function addCatalogItemToPresentation(
  addItem: ReturnType<typeof usePresentationStore.getState>["addItem"],
  item: SearchCatalogItem,
) {
  addItem({
    sourceId: item.sourceId,
    type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    content: item.content,
    reference: item.reference,
    key: item.key,
    bpm: item.bpm,
  });
}

function PlannerActionButton({
  icon,
  children,
  primary,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-[132px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
        "whitespace-nowrap leading-none",
        primary
          ? "border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15"
          : "border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

function mapSettingsModelToApiModel(model: string) {
  if (model.startsWith("GPT-4.1-mini")) return "gpt-4.1-mini";
  if (model.startsWith("GPT-4.1")) return "gpt-4.1";
  if (model.startsWith("GPT-4o")) return "gpt-4o";
  return "gpt-4o";
}

type AiServiceSuggestion = {
  summary: string;
  songIds: string[];
  verseIds: string[];
  notes: string[];
  sections: Array<{
    key: string;
    title: string;
    description: string;
    entries: Array<{
      kind: "song" | "bible";
      id: string;
      reason: string;
    }>;
  }>;
};

function ServiceInfoCard({
  onSaveService,
  onOpenAiSuggest,
}: {
  onSaveService: () => void;
  onOpenAiSuggest: () => void;
}) {
  const { serviceInfo, items, updateServiceInfo } = usePresentationStore();
  const songCount = items.filter((item) => item.type === "song").length;
  const bibleCount = items.filter((item) => item.type === "bible").length;
  const pdfCount = items.filter((item) => item.type === "pdf").length;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Service Plan</h3>
          <p className="mt-1 text-xs text-white/40">
            Data service, persistence lokal, dan aksi save ke History.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/60">
            {items.length} item
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/60">
            {songCount} songs • {bibleCount} verses • {pdfCount} pdf
          </div>
          <Button
            variant="secondary"
            leftIcon={<Brain size={17} />}
            onClick={onOpenAiSuggest}
          >
            AI Suggest Service
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save size={17} />}
            onClick={onSaveService}
          >
            Save Service Plan
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <Input
          value={serviceInfo.serviceName}
          onChange={(event) =>
            updateServiceInfo({ serviceName: event.target.value })
          }
          placeholder="Nama service"
        />
        <Input
          value={serviceInfo.serviceDate}
          onChange={(event) =>
            updateServiceInfo({ serviceDate: event.target.value })
          }
          placeholder="Tanggal service"
        />
        <Input
          value={serviceInfo.preacher}
          onChange={(event) =>
            updateServiceInfo({ preacher: event.target.value })
          }
          placeholder="Nama pembicara"
        />
        <Input
          value={serviceInfo.theme}
          onChange={(event) => updateServiceInfo({ theme: event.target.value })}
          placeholder="Tema khotbah"
        />
      </div>
    </Card>
  );
}

function AiSuggestionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { serviceInfo, clearItems, addItem } = usePresentationStore();
  const settingsModel = useSettingsStore((state) => state.model);
  const songs = useSongsStore((state) => state.songs);
  const verses = useBibleStore((state) => state.verses);
  const activeTranslation = useBibleStore((state) => state.activeTranslation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AiServiceSuggestion | null>(null);

  const translatedVerses = useMemo(
    () => verses.filter((verse) => verse.translation === activeTranslation),
    [activeTranslation, verses],
  );

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError("");
      setResult(null);
    }
  }, [open]);

  if (!open) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const suggestion = await window.api?.ai.suggestServicePlan({
        model: mapSettingsModelToApiModel(settingsModel),
        theme: serviceInfo.theme,
        serviceName: serviceInfo.serviceName,
        preacher: serviceInfo.preacher,
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          category: song.category,
          tags: song.tags,
        })),
        verses: translatedVerses.map((verse) => ({
          id: verse.id,
          reference: verse.reference,
          topic: verse.topic,
          aiContext: verse.aiContext,
        })),
      });

      if (!suggestion) {
        throw new Error("AI suggestion tidak mengembalikan hasil.");
      }

      setResult(suggestion);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Gagal mendapatkan rekomendasi AI.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;

    clearItems();

    const appliedIds = new Set<string>();

    result.sections.forEach((section) => {
      section.entries.forEach((entry) => {
        if (appliedIds.has(`${entry.kind}:${entry.id}`)) return;

        if (entry.kind === "song") {
          const song = songs.find((item) => item.id === entry.id);
          if (!song) return;

          addItem({
            sourceId: song.id,
            type: "song",
            title: song.title,
            subtitle: `${song.author} · ${song.songKey}`,
            content: song.lyrics,
            key: song.songKey,
            bpm: song.bpm,
          });
          appliedIds.add(`${entry.kind}:${entry.id}`);
          return;
        }

        const verse = translatedVerses.find((item) => item.id === entry.id);
        if (!verse) return;

        addItem({
          sourceId: verse.id,
          type: "bible",
          title: verse.reference,
          subtitle: verse.translation,
          content: verse.content,
          reference: verse.reference,
        });
        appliedIds.add(`${entry.kind}:${entry.id}`);
      });
    });

    if (appliedIds.size === 0) {
      result.songIds.forEach((songId) => {
        const song = songs.find((item) => item.id === songId);
        if (!song) return;

        addItem({
          sourceId: song.id,
          type: "song",
          title: song.title,
          subtitle: `${song.author} · ${song.songKey}`,
          content: song.lyrics,
          key: song.songKey,
          bpm: song.bpm,
        });
      });

      result.verseIds.forEach((verseId) => {
        const verse = translatedVerses.find((item) => item.id === verseId);
        if (!verse) return;

        addItem({
          sourceId: verse.id,
          type: "bible",
          title: verse.reference,
          subtitle: verse.translation,
          content: verse.content,
          reference: verse.reference,
        });
      });
    }

    onClose();
  };

  const suggestedSongs = result
    ? result.songIds
        .map((songId) => songs.find((song) => song.id === songId))
        .filter((song): song is (typeof songs)[number] => Boolean(song))
    : [];

  const suggestedVerses = result
    ? result.verseIds
        .map((verseId) =>
          translatedVerses.find((verse) => verse.id === verseId),
        )
        .filter((verse): verse is (typeof translatedVerses)[number] =>
          Boolean(verse),
        )
    : [];

  const sectionLookup = {
    song: new Map(songs.map((song) => [song.id, song])),
    bible: new Map(translatedVerses.map((verse) => [verse.id, verse])),
  };

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f13]/95 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="text-xl font-semibold text-white">
              AI Suggest Service
            </h3>
            <p className="mt-1 text-sm text-white/45">
              AI akan memilih lagu dan ayat dari library lokal berdasarkan tema
              service saat ini.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close AI modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-white/70">Current Theme</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {serviceInfo.theme || "Tema belum diisi"}
            </p>
            <p className="mt-2 text-sm text-white/45">
              Service: {serviceInfo.serviceName} • {serviceInfo.preacher}
            </p>
          </Card>

          {!result && (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-white/65">
                Belum ada rekomendasi AI
              </p>
              <p className="mt-1 text-xs text-white/35">
                Gunakan tema ibadah lalu klik generate untuk membuat service
                suggestion.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <Card className="p-4">
                <p className="text-sm font-semibold text-white/70">Summary</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {result.summary}
                </p>
              </Card>

              {result.sections.length > 0 && (
                <Card className="p-4">
                  <p className="text-sm font-semibold text-white/70">
                    Suggested Flow
                  </p>
                  <div className="mt-4 space-y-3">
                    {result.sections.map((section) => (
                      <div
                        key={section.key}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {section.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-white/45">
                              {section.description}
                            </p>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/50">
                            {section.entries.length} item
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {section.entries.map((entry, index) => {
                            if (entry.kind === "song") {
                              const song = sectionLookup.song.get(entry.id);
                              if (!song) return null;

                              return (
                                <div
                                  key={`${section.key}-${entry.kind}-${entry.id}-${index}`}
                                  className="rounded-lg border border-white/10 bg-black/15 p-3"
                                >
                                  <div className="flex items-center gap-2 text-sm text-white">
                                    <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-200">
                                      song
                                    </span>

                                    <span className="font-semibold">
                                      {song.title}
                                    </span>
                                  </div>

                                  <p className="mt-1 text-xs leading-5 text-white/50">
                                    {song.category} · {song.author}
                                  </p>

                                  {entry.reason ? (
                                    <p className="mt-2 text-xs leading-5 text-white/70">
                                      {entry.reason}
                                    </p>
                                  ) : null}
                                </div>
                              );
                            }

                            const verse = sectionLookup.bible.get(entry.id);
                            if (!verse) return null;

                            return (
                              <div
                                key={`${section.key}-${entry.kind}-${entry.id}-${index}`}
                                className="rounded-lg border border-white/10 bg-black/15 p-3"
                              >
                                <div className="flex items-center gap-2 text-sm text-white">
                                  <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                                    bible
                                  </span>

                                  <span className="font-semibold">
                                    {verse.reference}
                                  </span>
                                </div>

                                <p className="mt-1 text-xs leading-5 text-white/50">
                                  {verse.topic} · {verse.translation}
                                </p>

                                {entry.reason ? (
                                  <p className="mt-2 text-xs leading-5 text-white/70">
                                    {entry.reason}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <p className="text-sm font-semibold text-white/70">
                    Suggested Songs
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    {suggestedSongs.map((song) => (
                      <p key={song.id}>
                        • {song.title}{" "}
                        <span className="text-white/40">({song.category})</span>
                      </p>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-sm font-semibold text-white/70">
                    Suggested Verses
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    {suggestedVerses.map((verse) => (
                      <p key={verse.id}>
                        • {verse.reference}{" "}
                        <span className="text-white/40">({verse.topic})</span>
                      </p>
                    ))}
                  </div>
                </Card>
              </div>

              {result.notes.length > 0 && (
                <Card className="p-4">
                  <p className="text-sm font-semibold text-white/70">Notes</p>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    {result.notes.map((note, index) => (
                      <p key={`${note}-${index}`}>• {note}</p>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {result ? (
            <Button variant="primary" onClick={handleApply}>
              Apply to Planner
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Suggestion"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ClearServiceModal({
  open,
  itemCount,
  onClose,
  onConfirm,
}: {
  open: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f13]/95 shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-400">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Clear Service Planner
              </h3>
              <p className="mt-1 text-sm text-white/45">
                Semua {itemCount} item di planner akan dihapus. Service info di
                bagian atas tetap disimpan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Clear Items
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServicePlanner({
  onOpenSearch,
  onEditItem,
  onClearService,
}: {
  onOpenSearch: () => void;
  onEditItem: (item: PresentationItem) => void;
  onClearService: () => void;
}) {
  const {
    items,
    selectedItemId,
    addItem,
    selectItem,
    removeItem,
    duplicateItem,
    moveItemUp,
    moveItemDown,
    moveItemToIndex,
  } = usePresentationStore();
  const songs = useSongsStore((state) => state.songs);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleQuickAdd = () => {
    const quickSong = songs[0];
    if (!quickSong) return;

    addItem({
      sourceId: quickSong.id,
      type: "song",
      title: quickSong.title,
      subtitle: `${quickSong.author} · ${quickSong.songKey}`,
      content: quickSong.lyrics,
      key: quickSong.songKey,
      bpm: quickSong.bpm,
    });
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggingItemId) return;

    moveItemToIndex(draggingItemId, targetIndex);
    setDraggingItemId(null);
    setDropTargetIndex(null);
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">
            Service Planner
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Add, edit, duplicate, move, dan hapus item presentasi.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <PlannerActionButton
            onClick={onClearService}
            icon={<Trash2 size={17} className="shrink-0 text-white/65" />}
          >
            Clear Service
          </PlannerActionButton>

          <PlannerActionButton
            primary
            onClick={handleQuickAdd}
            icon={<Plus size={17} className="shrink-0 text-red-400" />}
          >
            Quick Add
          </PlannerActionButton>

          <PlannerActionButton
            onClick={onOpenSearch}
            icon={<Search size={17} className="shrink-0 text-white/65" />}
          >
            Search Item
          </PlannerActionButton>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-white/65">
            Belum ada item presentation
          </p>

          <p className="mt-1 text-xs text-white/35">
            Tambahkan lagu, ayat, atau PDF ke dalam service plan.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {items.map((item, index) => {
            const isActive = selectedItemId === item.id;
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const isDragging = draggingItemId === item.id;
            const showDropIndicator = dropTargetIndex === index;

            return (
              <div
                key={item.id}
                draggable
                onClick={() => selectItem(item.id)}
                onDragStart={() => {
                  setDraggingItemId(item.id);
                  setDropTargetIndex(index);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (draggingItemId !== item.id) {
                    setDropTargetIndex(index);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={() => {
                  setDraggingItemId(null);
                  setDropTargetIndex(null);
                }}
                className={[
                  "group relative flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition",
                  isActive
                    ? "border border-red-500/35 bg-red-500/10"
                    : "border border-transparent hover:bg-white/[0.035]",
                  isDragging ? "opacity-45" : "",
                ].join(" ")}
              >
                {showDropIndicator && draggingItemId !== item.id && (
                  <span className="absolute -top-1 left-2 right-2 h-[2px] rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    selectItem(item.id);
                    onEditItem(item);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  aria-label="Edit item"
                >
                  <Pencil size={16} />
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

                  <p className="mt-0.5 truncate text-xs text-white/35">
                    {item.subtitle || item.reference || "No subtitle"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 opacity-80 transition group-hover:opacity-100">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveItemUp(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label="Move item up"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={isLast}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveItemDown(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label="Move item down"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      duplicateItem(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                    aria-label="Duplicate item"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
                    aria-label="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-2.5 text-center text-xs text-white/35">
        Shortcut: `←` previous, `→` next, `B` blank screen. Drag item untuk
        reorder cepat.
      </div>
    </section>
  );
}

function ProjectorPreview() {
  const {
    items,
    selectedItemId,
    selectedSlideIndex,
    selectNextItem,
    selectPreviousItem,
    isProjectorBlank,
    toggleProjectorBlank,
    setProjectorBlank,
  } = usePresentationStore();
  const selectedMonitorId = useSettingsStore(
    (state) => state.selectedMonitorId,
  );
  const fullscreenDefault = useSettingsStore(
    (state) => state.fullscreenDefault,
  );

  const selectedIndex = items.findIndex((item) => item.id === selectedItemId);
  const currentItem = selectedIndex >= 0 ? items[selectedIndex] : items[0];
  const slides = getPresentationSlides(currentItem);
  const currentSlide = getCurrentPresentationSlide(
    currentItem,
    selectedSlideIndex,
  );
  const monitorLabel =
    selectedMonitorId == null
      ? "Primary display"
      : `Monitor ${selectedMonitorId}`;

  const projectorOptions = {
    displayId: selectedMonitorId,
    fullscreen: fullscreenDefault,
  };

  const handleOpenProjector = async () => {
    await window.api?.presentation.openProjectorWindow(projectorOptions);
  };

  const handleFullscreen = async () => {
    await window.api?.presentation.toggleProjectorFullscreen(projectorOptions);
  };

  return (
    <section className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Projector Preview
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Live preview untuk window projector Electron.
          </p>
          <p className="mt-1 text-xs text-white/35">
            Target output: {monitorLabel} •{" "}
            {fullscreenDefault
              ? "fullscreen default aktif"
              : "windowed by default"}
          </p>
        </div>

        <div
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
            isProjectorBlank
              ? "border border-white/10 bg-white/[0.04] text-white/55"
              : "border border-green-500/20 bg-green-500/10 text-green-400",
          ].join(" ")}
        >
          <Circle size={8} fill="currentColor" />
          {isProjectorBlank ? "Blank" : "Live"}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-[1px] shadow-xl shadow-black/30">
        <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-[#202035] via-[#6f2d3b] to-[#f29c44]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.32),transparent_26%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />

          {isProjectorBlank ? (
            <div className="relative flex aspect-[16/7.4] items-center justify-center bg-black">
              <p className="text-lg font-semibold text-white/35">
                Blank Screen
              </p>
            </div>
          ) : (
            <div className="relative flex aspect-[16/7.4] flex-col items-center justify-center px-10 text-center">
              {currentItem?.type === "pdf" && (
                <FileText size={42} className="mb-5 text-white/85" />
              )}

              <h2 className="max-w-[760px] whitespace-pre-line text-[34px] font-bold leading-[1.15] tracking-tight text-white drop-shadow-xl">
                {currentSlide.title}
              </h2>

              <p className="mt-3 max-w-[620px] text-lg font-medium text-white/90 drop-shadow">
                {currentSlide.body}
              </p>
            </div>
          )}

          <span className="absolute bottom-4 left-4 rounded-lg bg-black/45 px-3 py-1 text-xs font-medium text-white">
            Item {selectedIndex >= 0 ? selectedIndex + 1 : 0} / {items.length} •
            Slide {Math.min(selectedSlideIndex + 1, slides.length)} /{" "}
            {slides.length}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 2xl:grid-cols-5">
        <button
          type="button"
          onClick={selectPreviousItem}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronLeft size={19} />
          Previous
        </button>

        <button
          type="button"
          onClick={selectNextItem}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500"
        >
          Next
          <ChevronRight size={19} />
        </button>

        <button
          type="button"
          onClick={handleOpenProjector}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Tv size={17} />
          Open Window
        </button>

        <button
          type="button"
          onClick={handleFullscreen}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Maximize2 size={17} />
          Fullscreen
        </button>

        <button
          type="button"
          onClick={() =>
            isProjectorBlank ? setProjectorBlank(false) : toggleProjectorBlank()
          }
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Monitor size={18} />
          {isProjectorBlank ? "Go Live" : "Blank"}
        </button>
      </div>
    </section>
  );
}

function SearchItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addItem } = usePresentationStore();
  const songs = useSongsStore((state) => state.songs);
  const verses = useBibleStore((state) => state.verses);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<PresentationItemType | "all">(
    "all",
  );

  const searchCatalogItems = useMemo(
    () => buildPresentationCatalog(songs, verses),
    [songs, verses],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return searchCatalogItems.filter((item) => {
      const matchType = activeType === "all" || item.type === activeType;
      const matchQuery =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle?.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.content?.toLowerCase().includes(normalizedQuery);

      return matchType && matchQuery;
    });
  }, [query, activeType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f13]/95 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="text-xl font-semibold text-white">Search Item</h3>
            <p className="mt-1 text-sm text-white/45">
              Pilih lagu, ayat, atau PDF untuk dimasukkan ke Service Planner.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4">
            <Search size={18} className="text-white/45" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              placeholder="Cari lagu, ayat, atau file PDF..."
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "song", label: "Songs" },
              { key: "bible", label: "Bible" },
              { key: "pdf", label: "PDF" },
            ].map((filter) => {
              const active = activeType === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() =>
                    setActiveType(filter.key as PresentationItemType | "all")
                  }
                  className={[
                    "inline-flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition",
                    active
                      ? "border-red-500/30 bg-red-500/15 text-red-200"
                      : "border-white/10 bg-white/[0.035] text-white/60 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="presentation-search-scroll mt-4 max-h-[420px] overflow-y-auto pr-0">
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const Icon = getItemIcon(item.type);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      addCatalogItemToPresentation(addItem, item);
                      onClose();
                    }}
                    className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-red-500/35 hover:bg-red-500/10"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-400">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                            getItemBadge(item.type),
                          ].join(" ")}
                        >
                          {getItemLabel(item.type)}
                        </span>

                        <p className="truncate text-sm font-semibold text-white">
                          {item.title}
                        </p>
                      </div>

                      <p className="mt-1 truncate text-xs text-white/45">
                        {item.subtitle}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">
                        {item.description}
                      </p>
                    </div>

                    <Plus size={18} className="shrink-0 text-red-400" />
                  </button>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-white/65">
                    Item tidak ditemukan
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Coba gunakan keyword lain.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditItemModal({
  item,
  onClose,
}: {
  item: PresentationItem | null;
  onClose: () => void;
}) {
  const { updateItem } = usePresentationStore();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!item) return;

    setTitle(item.title);
    setSubtitle(item.subtitle ?? "");
    setContent(item.content ?? "");
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    updateItem(item.id, {
      title: title.trim() || item.title,
      subtitle: subtitle.trim(),
      content: content.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f13]/95 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="text-xl font-semibold text-white">Edit Item</h3>

            <p className="mt-1 text-sm text-white/45">
              Ubah title, subtitle, atau content slide presentation.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close edit modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="text-sm font-semibold text-white/65">Title</label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-500/40"
              placeholder="Masukkan title"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">
              Subtitle
            </label>

            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-500/40"
              placeholder="Masukkan subtitle"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/65">
              Content
            </label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 h-[180px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/35 focus:border-red-500/40"
              placeholder="Masukkan content slide"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PresentationPage() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PresentationItem | null>(null);
  const [clearServiceOpen, setClearServiceOpen] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const saveCurrentPlan = useHistoryStore((state) => state.saveCurrentPlan);
  const setActivePage = useNavigationStore((state) => state.setActivePage);
  const itemCount = usePresentationStore((state) => state.items.length);
  const clearItems = usePresentationStore((state) => state.clearItems);

  const handleSaveService = () => {
    const savedService = saveCurrentPlan();
    if (!savedService) return;
    setActivePage("history");
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[28px] font-semibold leading-tight text-white">
          Presentation
        </h2>

        <p className="mt-1 text-sm text-white/45">
          Service control center with local persistence, history, and projector
          window
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="flex h-full w-full min-w-0 flex-col gap-4">
          <ServiceInfoCard
            onSaveService={handleSaveService}
            onOpenAiSuggest={() => setAiSuggestionOpen(true)}
          />

          <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <ServicePlanner
              onOpenSearch={() => setSearchModalOpen(true)}
              onEditItem={setEditingItem}
              onClearService={() => setClearServiceOpen(true)}
            />

            <div className="flex w-full min-w-0 flex-col gap-4">
              <ProjectorPreview />
            </div>
          </div>
        </div>
      </div>

      <SearchItemModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} />

      <AiSuggestionModal
        open={aiSuggestionOpen}
        onClose={() => setAiSuggestionOpen(false)}
      />

      <ClearServiceModal
        open={clearServiceOpen}
        itemCount={itemCount}
        onClose={() => setClearServiceOpen(false)}
        onConfirm={() => {
          clearItems();
          setClearServiceOpen(false);
        }}
      />
    </div>
  );
}
