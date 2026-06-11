export type SongRecord = {
  id: string;
  title: string;
  author: string;
  category: string;
  songKey: string;
  bpm: number;
  timeSignature: string;
  tags: string[];
  lyricPreview: string;
  lyrics: string;
  chords: string[];
};

export const songsDb: SongRecord[] = [];
