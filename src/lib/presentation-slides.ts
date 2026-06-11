import type { PresentationItem } from "../stores/presentation.store";

export type PresentationSlide = {
  id: string;
  title: string;
  body: string;
  footer?: string;
};

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function createSongSlides(item: PresentationItem) {
  const lines = (item.content ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const slideLines = lines.length > 0 ? chunkArray(lines, 2) : [[item.title]];

  return slideLines.map((group, index) => ({
    id: `${item.id}_slide_${index + 1}`,
    title: item.title,
    body: group.join("\n"),
    footer: item.subtitle || "",
  }));
}

function createBibleSlides(item: PresentationItem) {
  const words = (item.content ?? "").split(/\s+/).filter(Boolean);
  const slideWords = words.length > 0 ? chunkArray(words, 18) : [[item.title]];

  return slideWords.map((group, index) => ({
    id: `${item.id}_slide_${index + 1}`,
    title: item.reference || item.title,
    body: group.join(" "),
    footer: item.subtitle || "",
  }));
}

function createPdfSlides(item: PresentationItem) {
  return [
    {
      id: `${item.id}_slide_1`,
      title: item.title,
      body: item.content || item.subtitle || "PDF presentation",
      footer: item.subtitle || "",
    },
  ];
}

export function getPresentationSlides(item?: PresentationItem | null) {
  if (!item) {
    return [
      {
        id: "empty_slide",
        title: "No Slide Selected",
        body: "Select item from Service Planner",
      },
    ];
  }

  if (item.type === "song") return createSongSlides(item);
  if (item.type === "bible") return createBibleSlides(item);
  return createPdfSlides(item);
}

export function getBoundedSlideIndex(
  item: PresentationItem | null | undefined,
  slideIndex: number,
) {
  const slides = getPresentationSlides(item);
  return Math.min(Math.max(slideIndex, 0), slides.length - 1);
}

export function getCurrentPresentationSlide(
  item: PresentationItem | null | undefined,
  slideIndex: number,
) {
  const slides = getPresentationSlides(item);
  return slides[getBoundedSlideIndex(item, slideIndex)] ?? slides[0];
}
