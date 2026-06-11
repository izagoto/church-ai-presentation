import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { songsDb, type SongRecord } from "../data/songs";
import { createPersistStorage, resolveStorage } from "./store-utils";

export const SONGS_STORAGE_KEY = "church-ai-songs-store";

type SongInput = Omit<SongRecord, "id" | "lyricPreview"> & {
  lyricPreview?: string;
};

type SongsStore = {
  songs: SongRecord[];
  addSong: (song: SongInput) => SongRecord;
  updateSong: (id: string, song: Partial<SongInput>) => void;
  deleteSong: (id: string) => void;
  resetSongs: () => void;
};

function createSongId() {
  return `song_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildLyricPreview(lyrics: string, fallback?: string) {
  const preview = fallback?.trim() || lyrics.split("\n").join(" ").trim();
  if (preview.length <= 92) return preview;
  return `${preview.slice(0, 89).trim()}...`;
}

function createSongRecord(song: SongInput): SongRecord {
  return {
    ...song,
    id: createSongId(),
    lyricPreview: buildLyricPreview(song.lyrics, song.lyricPreview),
  };
}

function createSongsStoreInitializer(storage: StateStorage) {
  return persist<SongsStore>(
    (set) => ({
      songs: songsDb,

      addSong: (song) => {
        const nextSong = createSongRecord(song);
        set((state) => ({
          songs: [nextSong, ...state.songs],
        }));
        return nextSong;
      },

      updateSong: (id, song) => {
        set((state) => ({
          songs: state.songs.map((currentSong) =>
            currentSong.id === id
              ? {
                  ...currentSong,
                  ...song,
                  lyricPreview: buildLyricPreview(
                    song.lyrics ?? currentSong.lyrics,
                    song.lyricPreview ?? currentSong.lyricPreview,
                  ),
                }
              : currentSong,
          ),
        }));
      },

      deleteSong: (id) => {
        set((state) => ({
          songs: state.songs.filter((song) => song.id !== id),
        }));
      },

      resetSongs: () => {
        set({ songs: songsDb });
      },
    }),
    {
      name: SONGS_STORAGE_KEY,
      storage: createPersistStorage(storage),
      version: 2,
      migrate: (persistedState) =>
        ({
          ...(persistedState as Partial<SongsStore>),
          songs: [],
        }) as SongsStore,
    },
  );
}

export function createSongsStore(storage?: StateStorage) {
  return createStore<SongsStore>()(
    createSongsStoreInitializer(resolveStorage(storage)),
  );
}

export const useSongsStore = create<SongsStore>()(
  createSongsStoreInitializer(resolveStorage()),
);
