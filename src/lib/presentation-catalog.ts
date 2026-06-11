import type { BibleVerseRecord } from "../data/bible";
import type { SongRecord } from "../data/songs";
import type { PresentationItemType } from "../stores/presentation.store";

export type PresentationCatalogItem = {
  id: string;
  sourceId: string;
  type: PresentationItemType;
  title: string;
  subtitle?: string;
  content?: string;
  reference?: string;
  key?: string;
  bpm?: number;
  description: string;
};

export function buildSongCatalogItems(songs: SongRecord[]): PresentationCatalogItem[] {
  return songs.map((song) => ({
    id: `catalog_${song.id}`,
    sourceId: song.id,
    type: "song",
    title: song.title,
    subtitle: `${song.author} · ${song.songKey}`,
    content: song.lyrics,
    key: song.songKey,
    bpm: song.bpm,
    description: `${song.category} • ${song.tags.join(", ")}`,
  }));
}

export function buildBibleCatalogItems(
  verses: BibleVerseRecord[],
): PresentationCatalogItem[] {
  return verses.map((verse) => ({
    id: `catalog_${verse.id}`,
    sourceId: verse.id,
    type: "bible",
    title: verse.reference,
    subtitle: verse.translation,
    content: verse.content,
    reference: verse.reference,
    description: `${verse.topic} • ${verse.aiContext}`,
  }));
}

export function buildPresentationCatalog(
  songs: SongRecord[],
  verses: BibleVerseRecord[],
): PresentationCatalogItem[] {
  return [
    ...buildSongCatalogItems(songs),
    ...buildBibleCatalogItems(verses),
    {
      id: "catalog_pdf_sermon_material",
      sourceId: "catalog_pdf_sermon_material",
      type: "pdf",
      title: "Materi Khotbah (PDF)",
      subtitle: "PDF presentation",
      content: "Materi Khotbah",
      description: "File PDF untuk materi khotbah.",
    },
  ];
}
