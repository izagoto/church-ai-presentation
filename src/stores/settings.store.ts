import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { createPersistStorage, resolveStorage } from "./store-utils";

export const SETTINGS_STORAGE_KEY = "church-ai-settings-store";

export type AppTheme = "Dark (Default)" | "Midnight Red";
export type FontSizeOption = "Medium (32px)" | "Large (36px)" | "XL (42px)";
export type AiSearchMode = "Balanced (Default)" | "Fast" | "Accurate";

export type SettingsState = {
  language: string;
  theme: AppTheme;
  defaultFontSize: FontSizeOption;
  selectedMonitorId: number | null;
  resolution: string;
  fullscreenDefault: boolean;
  openAIApiKey: string;
  model: string;
  aiSearchMode: AiSearchMode;
};

type SettingsStore = SettingsState & {
  updateSettings: (value: Partial<SettingsState>) => void;
  resetSettings: () => void;
};

export const defaultSettingsState: SettingsState = {
  language: "English",
  theme: "Dark (Default)",
  defaultFontSize: "Large (36px)",
  selectedMonitorId: null,
  resolution: "1920 x 1080 (16:9)",
  fullscreenDefault: true,
  openAIApiKey: "",
  model: "GPT-4o (Recommended)",
  aiSearchMode: "Balanced (Default)",
};

function createSettingsPersistStorage(storage: StateStorage) {
  const resolvedStorage = resolveStorage(storage);

  const sanitizedStorage: StateStorage = {
    getItem: (name) => {
      const rawValue = resolvedStorage.getItem(name);
      if (!rawValue || typeof rawValue !== "string") return rawValue;

      try {
        const parsed = JSON.parse(rawValue) as {
          state?: Partial<SettingsState>;
          version?: number;
        };

        if (parsed.state) {
          parsed.state.openAIApiKey = "";
        }

        return JSON.stringify(parsed);
      } catch {
        return rawValue;
      }
    },
    setItem: (name, value) => {
      try {
        const parsed = JSON.parse(value) as {
          state?: Partial<SettingsState>;
          version?: number;
        };

        if (parsed.state) {
          parsed.state.openAIApiKey = "";
        }

        resolvedStorage.setItem(name, JSON.stringify(parsed));
      } catch {
        resolvedStorage.setItem(name, value);
      }
    },
    removeItem: (name) => {
      resolvedStorage.removeItem(name);
    },
  };

  return createPersistStorage<SettingsStore>(sanitizedStorage);
}

function createSettingsStoreInitializer(storage: StateStorage) {
  return persist<SettingsStore>(
    (set) => ({
      ...defaultSettingsState,

      updateSettings: (value) => {
        set((state) => ({
          ...state,
          ...value,
        }));
      },

      resetSettings: () => {
        set(defaultSettingsState);
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createSettingsPersistStorage(storage),
    },
  );
}

export function createSettingsStore(storage?: StateStorage) {
  return createStore<SettingsStore>()(
    createSettingsStoreInitializer(resolveStorage(storage)),
  );
}

export const useSettingsStore = create<SettingsStore>()(
  createSettingsStoreInitializer(resolveStorage()),
);
