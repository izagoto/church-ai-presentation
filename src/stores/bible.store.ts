import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import {
  bibleDb,
  bibleTranslations,
  type BibleVerseRecord,
} from "../data/bible";
import { createPersistStorage, resolveStorage } from "./store-utils";

export const BIBLE_STORAGE_KEY = "church-ai-bible-store";

type BibleStore = {
  verses: BibleVerseRecord[];
  activeTranslation: string;
  availableTranslations: string[];
  setActiveTranslation: (translation: string) => void;
  resetBible: () => void;
};

function createBibleStoreInitializer(storage: StateStorage) {
  return persist<BibleStore>(
    (set) => ({
      verses: bibleDb,
      activeTranslation: "TB",
      availableTranslations: [...bibleTranslations],

      setActiveTranslation: (translation) => {
        set({ activeTranslation: translation });
      },

      resetBible: () => {
        set({
          verses: bibleDb,
          activeTranslation: "TB",
          availableTranslations: [...bibleTranslations],
        });
      },
    }),
    {
      name: BIBLE_STORAGE_KEY,
      storage: createPersistStorage(storage),
      version: 2,
      migrate: (persistedState) =>
        ({
          ...(persistedState as Partial<BibleStore>),
          verses: [],
          activeTranslation: "TB",
          availableTranslations: [...bibleTranslations],
        }) as BibleStore,
    },
  );
}

export function createBibleStore(storage?: StateStorage) {
  return createStore<BibleStore>()(
    createBibleStoreInitializer(resolveStorage(storage)),
  );
}

export const useBibleStore = create<BibleStore>()(
  createBibleStoreInitializer(resolveStorage()),
);
