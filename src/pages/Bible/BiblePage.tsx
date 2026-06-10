import { useState } from "react";

import { BookOpen, Copy, Plus, Search, Sparkles, X } from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

type BibleResult = {
  id: string;
  reference: string;
  translation: string;
  topic: string;
  content: string;
  aiContext: string;
};

const bibleResults: BibleResult[] = [
  {
    id: "1",
    reference: "1 Yohanes 4:8",
    translation: "TB",
    topic: "Kasih",
    content:
      "Allah adalah kasih. Barangsiapa tetap di dalam kasih, ia tetap di dalam Allah dan Allah di dalam dia.",
    aiContext:
      "Menegaskan bahwa kasih adalah sifat dasar Allah yang menjadi sumber hubungan yang benar dengan-Nya.",
  },
  {
    id: "2",
    reference: "Yohanes 13:34",
    translation: "TB",
    topic: "Kasih",
    content:
      "Aku memberikan perintah baru kepadamu, yaitu supaya kamu saling mengasihi; sama seperti Aku telah mengasihi kamu, demikian jugalah kamu harus saling mengasihi.",
    aiContext:
      "Perintah baru Yesus yang menjadi tanda pengenal murid-Nya adalah saling mengasihi.",
  },
  {
    id: "3",
    reference: "Roma 8:38-39",
    translation: "TB",
    topic: "Kasih",
    content:
      "Sebab aku yakin bahwa baik maut, maupun hidup, baik malaikat-malaikat, maupun pemerintah-pemerintah, baik yang ada, maupun yang akan datang, ataupun kuasa-kuasa...",
    aiContext:
      "Tidak ada kuasa apa pun yang dapat memisahkan kita dari kasih Allah dalam Kristus Yesus.",
  },
  {
    id: "4",
    reference: "1 Korintus 13:4-7",
    translation: "TB",
    topic: "Kasih",
    content:
      "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri...",
    aiContext: "Karakter kasih sejati yang mencerminkan hati Allah.",
  },
  {
    id: "5",
    reference: "Kolose 3:14",
    translation: "TB",
    topic: "Kasih",
    content:
      "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
    aiContext:
      "Kasih menjadi pengikat utama yang mempersatukan kehidupan orang percaya.",
  },
];

const topics = ["Semua", "Iman", "Kasih", "Pengharapan", "Keselamatan"];

function BibleTabs() {
  return (
    <div className="mt-3 inline-grid h-10 shrink-0 grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-1">
      <button
        type="button"
        className="rounded-lg px-5 text-sm font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white"
      >
        Reference Search
      </button>

      <button
        type="button"
        className="relative rounded-lg px-5 text-sm font-semibold text-white"
      >
        Topic Search
        <span className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-red-500" />
      </button>
    </div>
  );
}

function BibleTopicFilter() {
  return (
    <Card className="mt-3 shrink-0 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold text-white/70">Topik:</p>

        {topics.map((topic, index) => (
          <button
            key={topic}
            type="button"
            className={[
              "inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition",
              index === 0
                ? "border-red-500/25 bg-red-500/15 text-red-200"
                : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07] hover:text-white",
            ].join(" ")}
          >
            {topic}
          </button>
        ))}
      </div>
    </Card>
  );
}

function BibleResultRow({
  verse,
  active,
  onSelect,
}: {
  verse: BibleResult;
  active?: boolean;
  onSelect: (verse: BibleResult) => void;
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
  selectedVerseId,
  onSelectVerse,
}: {
  selectedVerseId: string;
  onSelectVerse: (verse: BibleResult) => void;
}) {
  const shouldScroll = bibleResults.length > 4;

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
          {bibleResults.map((verse) => (
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
        Menampilkan {bibleResults.length} hasil
      </p>
    </Card>
  );
}

function BibleDetailPanel({ verse }: { verse: BibleResult }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <p className="text-sm font-semibold text-white/55">Detail Ayat</p>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-red-500" />
            <h3 className="text-xl font-semibold text-red-400">
              {verse.reference}
            </h3>
          </div>

          <p className="text-sm font-semibold text-white/50">
            {verse.translation}
          </p>
        </div>

        <p className="mt-8 text-[34px] font-semibold leading-[1.22] tracking-tight text-white">
          {verse.content}
        </p>

        <div className="mt-8 border-t border-white/10 pt-5">
          <h4 className="text-base font-semibold text-white">
            Ringkasan Konteks (AI)
          </h4>

          <p className="mt-3 text-sm leading-7 text-white/65">
            Ayat ini menegaskan bahwa kasih adalah hakikat Allah. Ketika
            seseorang hidup di dalam kasih, ia mengalami persekutuan yang erat
            dengan Allah. Kasih Allah bukan hanya perasaan, tetapi tindakan
            nyata yang dinyatakan melalui pengorbanan Yesus Kristus di kayu
            salib.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            Bible Presentation Preview
          </h4>

          <p className="text-sm text-white/45">Projector Mode</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-[1px]">
          <div className="relative overflow-hidden rounded-[11px] bg-gradient-to-br from-[#171724] via-[#2f2330] to-[#6d2b2a]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,138,76,0.28),transparent_35%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-black/35" />

            <div className="relative flex aspect-[16/6.7] flex-col items-center justify-center px-8 text-center">
              <p className="max-w-[720px] text-[28px] font-semibold leading-tight text-white drop-shadow">
                {verse.content}
              </p>

              <p className="mt-5 text-xl font-semibold text-red-400">
                {verse.reference}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[220px_160px] gap-3">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus size={20} />}
          className="h-12"
        >
          Add to Presentation
        </Button>

        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Copy size={18} />}
          className="h-12"
        >
          Copy Verse
        </Button>
      </div>
    </Card>
  );
}

export function BiblePage() {
  const [selectedVerse, setSelectedVerse] = useState<BibleResult>(
    bibleResults[0],
  );

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          Bible
        </h2>

        <p className="mt-1 text-base text-white/45">
          AI Bible search and topic explorer
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,0.92fr)_minmax(420px,0.9fr)] gap-6">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Input
              className="h-14 shrink-0 rounded-xl text-base"
              leftIcon={<Search size={24} />}
              rightIcon={
                <div className="flex items-center gap-3">
                  <X size={18} className="text-white/45" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500">
                    <Sparkles size={17} />
                  </div>
                </div>
              }
              value="Ayat tentang kasih"
              readOnly
            />

            <BibleTabs />
            <BibleTopicFilter />

            <BibleResultList
              selectedVerseId={selectedVerse.id}
              onSelectVerse={setSelectedVerse}
            />
          </div>

          <BibleDetailPanel verse={selectedVerse} />
        </div>
      </div>
    </div>
  );
}
