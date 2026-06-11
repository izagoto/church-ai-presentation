export type BibleVerseRecord = {
  id: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  reference: string;
  translation: string;
  topic: string;
  content: string;
  aiContext: string;
};

export const bibleTranslations = ["TB", "FAYH"] as const;

export const bibleDb: BibleVerseRecord[] = [];
