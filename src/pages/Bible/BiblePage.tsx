import { useEffect, useMemo, useState } from "react";

import { BookOpen, Copy, Plus, Search, X } from "lucide-react";

import type { BibleVerseRecord } from "../../data/bible";
import { Button, Card, Input } from "../../components/ui";
import { useBibleStore } from "../../stores/bible.store";
import { usePresentationStore } from "../../stores/presentation.store";

function BibleResultRow({
  verse,
  active,
  onSelect,
}: {
  verse: BibleVerseRecord;
  active?: boolean;
  onSelect: (verse: BibleVerseRecord) => void;
}) {
  return (
    <Card
      onClick={() => onSelect(verse)}
      className={[
        "min-h-[126px] cursor-pointer p-4 transition",
        active
          ? "border-red-500/70 bg-white/[0.045]"
          : "hover:border-white/15 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="flex gap-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500">
          <BookOpen size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">
            {verse.reference}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/75">
            {verse.content}
          </p>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/45">
            AI Context: {verse.aiContext}
          </p>
        </div>
      </div>
    </Card>
  );
}

function BibleResultList({
  verses,
  totalVerses,
  selectedVerseId,
  onSelectVerse,
}: {
  verses: BibleVerseRecord[];
  totalVerses: number;
  selectedVerseId: string;
  onSelectVerse: (verse: BibleVerseRecord) => void;
}) {
  const shouldScroll = verses.length > 4;

  return (
    <Card
      className={[
        "mt-3 p-4",
        shouldScroll ? "flex min-h-0 flex-1 flex-col" : "shrink-0",
      ].join(" ")}
    >
      <div
        className={
          shouldScroll
            ? "bible-list-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
            : "overflow-visible"
        }
      >
        <div className="space-y-3">
          {verses.map((verse) => (
            <BibleResultRow
              key={verse.id}
              verse={verse}
              active={verse.id === selectedVerseId}
              onSelect={onSelectVerse}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 shrink-0 text-sm text-white/45">
        Menampilkan {verses.length} hasil dari {totalVerses} ayat
      </p>
    </Card>
  );
}

function BibleDetailPanel({ verse }: { verse: BibleVerseRecord }) {
  const { addItem } = usePresentationStore();

  const handleAddToPresentation = () => {
    addItem({
      sourceId: verse.id,
      type: "bible",
      title: verse.reference,
      subtitle: verse.translation,
      content: verse.content,
      reference: verse.reference,
    });
  };

  const handleCopyVerse = async () => {
    await navigator.clipboard.writeText(`${verse.reference}\n${verse.content}`);
  };

  return (
    <Card className="flex h-full min-h-0 flex-col p-5">
      <div className="shrink-0 border-b border-white/10 pb-4">
        <p className="text-sm font-semibold text-white/55">Detail Ayat</p>
        <p className="mt-1 text-xs text-white/35">
          Fokus ayat terpilih dan preview untuk slide presentasi.
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-500">
                <BookOpen size={20} />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Scripture Focus
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-red-400">
                  {verse.reference}
                </h3>
              </div>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/55">
              {verse.translation}
            </div>
          </div>

          <p className="mt-5 text-[21px] font-semibold leading-[1.28] tracking-tight text-white">
            {verse.content}
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-4">
            <h4 className="text-sm font-semibold text-white">
              Ringkasan Konteks (AI)
            </h4>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {verse.aiContext}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Bible Presentation Preview
              </h4>
              <p className="mt-1 text-xs text-white/40">
                Tampilan ringkas untuk projector mode.
              </p>
            </div>

            <p className="text-sm text-white/45">Projector Mode</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-[1px]">
            <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-[#171724] via-[#2f2330] to-[#6d2b2a]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,138,76,0.28),transparent_35%)]" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-black/35" />

              <div className="relative flex aspect-[16/6.2] flex-col items-center justify-center px-8 text-center">
                <p className="max-w-[620px] text-[19px] font-semibold leading-[1.35] text-white drop-shadow">
                  {verse.content}
                </p>

                <p className="mt-4 text-base font-semibold text-red-400">
                  {verse.reference}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid shrink-0 grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus size={20} />}
          className="h-12"
          onClick={handleAddToPresentation}
        >
          Add to Presentation
        </Button>

        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Copy size={18} />}
          className="h-12"
          onClick={handleCopyVerse}
        >
          Copy Verse
        </Button>
      </div>
    </Card>
  );
}

export function BiblePage() {
  const verses = useBibleStore((state) => state.verses);
  const activeTranslation = useBibleStore((state) => state.activeTranslation);
  const availableTranslations = useBibleStore(
    (state) => state.availableTranslations,
  );
  const setActiveTranslation = useBibleStore(
    (state) => state.setActiveTranslation,
  );
  const [query, setQuery] = useState("");
  const [selectedVerseId, setSelectedVerseId] = useState<string>(verses[0]?.id ?? "");

  const filteredVerses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return verses.filter((verse) => {
      const matchTranslation = verse.translation === activeTranslation;
      const matchQuery =
        normalizedQuery.length === 0 ||
        verse.reference.toLowerCase().includes(normalizedQuery) ||
        verse.topic.toLowerCase().includes(normalizedQuery) ||
        verse.book.toLowerCase().includes(normalizedQuery) ||
        verse.content.toLowerCase().includes(normalizedQuery) ||
        verse.aiContext.toLowerCase().includes(normalizedQuery);

      return matchTranslation && matchQuery;
    });
  }, [activeTranslation, query, verses]);

  useEffect(() => {
    if (filteredVerses.length === 0) {
      setSelectedVerseId("");
      return;
    }

    if (!filteredVerses.some((verse) => verse.id === selectedVerseId)) {
      setSelectedVerseId(filteredVerses[0].id);
    }
  }, [filteredVerses, selectedVerseId]);

  const selectedVerse =
    filteredVerses.find((verse) => verse.id === selectedVerseId) ??
    filteredVerses[0];

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          Bible
        </h2>

        <p className="mt-1 text-base text-white/45">
          Bible library siap dihubungkan ke data real dan pencarian referensi
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,0.92fr)_minmax(420px,0.9fr)] gap-6">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Card className="shrink-0 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_112px] gap-3">
                <Input
                  className="h-14 rounded-xl text-base"
                  leftIcon={<Search size={22} />}
                  rightIcon={
                    query ? (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-white/45 transition hover:text-white"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    ) : undefined
                  }
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari referensi, topik, isi ayat, atau konteks..."
                />

                <select
                  value={activeTranslation}
                  onChange={(event) => setActiveTranslation(event.target.value)}
                  className="h-14 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none"
                >
                  {availableTranslations.map((translation) => (
                    <option key={translation} value={translation}>
                      {translation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Daftar Ayat
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Menampilkan ayat berdasarkan translation yang dipilih.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  {filteredVerses.length} hasil
                </div>
              </div>
            </Card>

            {filteredVerses.length > 0 ? (
              <BibleResultList
                verses={filteredVerses}
                totalVerses={verses.length}
                selectedVerseId={selectedVerseId}
                onSelectVerse={(verse) => setSelectedVerseId(verse.id)}
              />
            ) : (
              <Card className="mt-3 flex min-h-[220px] items-center justify-center p-6 text-center">
                <div>
                  <p className="text-base font-semibold text-white/65">
                    Belum ada data ayat
                  </p>
                  <p className="mt-2 text-sm text-white/35">
                    Hubungkan data Bible real atau import source utama terlebih dahulu.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {selectedVerse ? (
            <BibleDetailPanel verse={selectedVerse} />
          ) : (
            <Card className="flex h-full items-center justify-center p-6 text-center text-white/45">
              Belum ada ayat untuk ditampilkan.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
