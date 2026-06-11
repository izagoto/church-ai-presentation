import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { useNavigationStore } from "./navigation.store";
import {
  createPresentationSnapshot,
  type PresentationItem,
  type PresentationPlanSnapshot,
  usePresentationStore,
} from "./presentation.store";
import { createPersistStorage, resolveStorage } from "./store-utils";

export const HISTORY_STORAGE_KEY = "church-ai-history-store";

export type HistoryService = PresentationPlanSnapshot & {
  id: string;
  savedAt: string;
  duration: string;
};

type HistoryStore = {
  services: HistoryService[];
  saveCurrentPlan: () => HistoryService | null;
  loadServiceIntoPresentation: (id: string) => void;
  removeService: (id: string) => void;
};

function createHistoryServiceId() {
  return `history_service_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function estimateDuration(items: PresentationItem[]) {
  const totalMinutes = Math.max(items.length * 4, 12);
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:00`;
}

function createHistoryStoreInitializer(storage: StateStorage) {
  return persist<HistoryStore>(
    (set, get) => ({
      services: [],

      saveCurrentPlan: () => {
        const presentationState = usePresentationStore.getState();
        if (presentationState.items.length === 0) return null;

        const snapshot = createPresentationSnapshot(presentationState);
        const service: HistoryService = {
          id: createHistoryServiceId(),
          savedAt: new Date().toISOString(),
          duration: estimateDuration(snapshot.items),
          ...snapshot,
        };

        set((state) => ({
          services: [service, ...state.services],
        }));

        return service;
      },

      loadServiceIntoPresentation: (id) => {
        const service = get().services.find((item) => item.id === id);
        if (!service) return;

        usePresentationStore.getState().loadSnapshot(service);
        useNavigationStore.getState().setActivePage("presentation");
      },

      removeService: (id) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        }));
      },
    }),
    {
      name: HISTORY_STORAGE_KEY,
      storage: createPersistStorage(storage),
      version: 2,
      migrate: (persistedState) =>
        ({
          ...(persistedState as Partial<HistoryStore>),
          services: [],
        }) as HistoryStore,
    },
  );
}

export function createHistoryStore(storage?: StateStorage) {
  return createStore<HistoryStore>()(
    createHistoryStoreInitializer(resolveStorage(storage)),
  );
}

export const useHistoryStore = create<HistoryStore>()(
  createHistoryStoreInitializer(resolveStorage()),
);
