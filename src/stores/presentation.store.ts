import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import {
  getBoundedSlideIndex,
  getPresentationSlides,
} from "../lib/presentation-slides";
import { createPersistStorage, resolveStorage } from "./store-utils";

export const PRESENTATION_STORAGE_KEY = "church-ai-presentation-store";

export type PresentationItemType = "song" | "bible" | "pdf";

export type PresentationItem = {
  id: string;
  sourceId: string;
  type: PresentationItemType;
  title: string;
  subtitle?: string;
  content?: string;
  reference?: string;
  key?: string;
  bpm?: number;
};

export type PresentationServiceInfo = {
  serviceName: string;
  serviceDate: string;
  preacher: string;
  theme: string;
};

export type PresentationPlanSnapshot = {
  serviceInfo: PresentationServiceInfo;
  items: PresentationItem[];
  selectedItemId: string | null;
  selectedSlideIndex: number;
};

type PresentationState = {
  serviceInfo: PresentationServiceInfo;
  items: PresentationItem[];
  selectedItemId: string | null;
  selectedSlideIndex: number;
  isProjectorBlank: boolean;
};

type PresentationActions = {
  updateServiceInfo: (value: Partial<PresentationServiceInfo>) => void;
  addItem: (item: Omit<PresentationItem, "id">) => void;
  updateItem: (id: string, item: Partial<PresentationItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  selectItem: (id: string) => void;
  selectSlideIndex: (index: number) => void;
  selectNextItem: () => void;
  selectPreviousItem: () => void;
  moveItemToIndex: (id: string, targetIndex: number) => void;
  moveItemUp: (id: string) => void;
  moveItemDown: (id: string) => void;
  setProjectorBlank: (value: boolean) => void;
  toggleProjectorBlank: () => void;
  clearItems: () => void;
  resetPlan: () => void;
  loadSnapshot: (snapshot: PresentationPlanSnapshot) => void;
};

export type PresentationStore = PresentationState & PresentationActions;

function formatDefaultServiceDate() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export const defaultPresentationServiceInfo: PresentationServiceInfo = {
  serviceName: "",
  serviceDate: formatDefaultServiceDate(),
  preacher: "",
  theme: "",
};

export const defaultPresentationItems: PresentationItem[] = [];

function createPresentationItemId() {
  return `presentation_item_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function createInitialPresentationState(): PresentationState {
  return {
    serviceInfo: defaultPresentationServiceInfo,
    items: defaultPresentationItems,
    selectedItemId: defaultPresentationItems[0]?.id ?? null,
    selectedSlideIndex: 0,
    isProjectorBlank: false,
  };
}

function normalizeSelectedItemId(
  items: PresentationItem[],
  selectedItemId: string | null,
) {
  if (items.length === 0) return null;
  if (selectedItemId && items.some((item) => item.id === selectedItemId)) {
    return selectedItemId;
  }

  return items[0].id;
}

function createPresentationStoreInitializer(storage: StateStorage) {
  return persist<PresentationStore>(
    (set, get) => ({
      ...createInitialPresentationState(),

      updateServiceInfo: (value) => {
        set((state) => ({
          serviceInfo: {
            ...state.serviceInfo,
            ...value,
          },
        }));
      },

      addItem: (item) => {
        const newItem: PresentationItem = {
          ...item,
          id: createPresentationItemId(),
        };

        set((state) => ({
          items: [...state.items, newItem],
          selectedItemId: newItem.id,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        }));
      },

      updateItem: (id, item) => {
        set((state) => ({
          items: state.items.map((currentItem) => {
            if (currentItem.id !== id) return currentItem;

            return {
              ...currentItem,
              ...item,
            };
          }),
          selectedItemId: id,
          selectedSlideIndex: getBoundedSlideIndex(
            state.items
              .map((currentItem) =>
                currentItem.id === id
                  ? {
                      ...currentItem,
                      ...item,
                    }
                  : currentItem,
              )
              .find((currentItem) => currentItem.id === id) ?? null,
            state.selectedSlideIndex,
          ),
        }));
      },

      removeItem: (id) => {
        const currentItems = get().items;
        const currentIndex = currentItems.findIndex((item) => item.id === id);
        const nextItems = currentItems.filter((item) => item.id !== id);
        const nextSelectedItemId =
          get().selectedItemId === id
            ? normalizeSelectedItemId(
                nextItems,
                nextItems[currentIndex]?.id ?? nextItems[currentIndex - 1]?.id ?? null,
              )
            : normalizeSelectedItemId(nextItems, get().selectedItemId);

        set({
          items: nextItems,
          selectedItemId: nextSelectedItemId,
          selectedSlideIndex: 0,
        });
      },

      duplicateItem: (id) => {
        const item = get().items.find((currentItem) => currentItem.id === id);
        if (!item) return;

        const duplicatedItem: PresentationItem = {
          ...item,
          id: createPresentationItemId(),
          sourceId: `${item.sourceId}_copy_${Date.now()}`,
        };

        const currentItems = get().items;
        const currentIndex = currentItems.findIndex(
          (currentItem) => currentItem.id === id,
        );

        const nextItems = [...currentItems];
        nextItems.splice(currentIndex + 1, 0, duplicatedItem);

        set({
          items: nextItems,
          selectedItemId: duplicatedItem.id,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        });
      },

      selectItem: (id) => {
        set({
          selectedItemId: id,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        });
      },

      selectSlideIndex: (index) => {
        const { items, selectedItemId } = get();
        const currentItem =
          items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

        set({
          selectedSlideIndex: getBoundedSlideIndex(currentItem, index),
          isProjectorBlank: false,
        });
      },

      selectNextItem: () => {
        const { items, selectedItemId, selectedSlideIndex } = get();
        if (items.length === 0) return;

        const currentIndex = items.findIndex((item) => item.id === selectedItemId);
        const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
        const currentItem = items[normalizedIndex];
        const currentSlides = getPresentationSlides(currentItem);

        if (selectedSlideIndex < currentSlides.length - 1) {
          set({
            selectedItemId: currentItem.id,
            selectedSlideIndex: selectedSlideIndex + 1,
            isProjectorBlank: false,
          });
          return;
        }

        const nextIndex = Math.min(normalizedIndex + 1, items.length - 1);

        set({
          selectedItemId: items[nextIndex].id,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        });
      },

      selectPreviousItem: () => {
        const { items, selectedItemId, selectedSlideIndex } = get();
        if (items.length === 0) return;

        const currentIndex = items.findIndex((item) => item.id === selectedItemId);
        const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
        const currentItem = items[normalizedIndex];

        if (selectedSlideIndex > 0) {
          set({
            selectedItemId: currentItem.id,
            selectedSlideIndex: selectedSlideIndex - 1,
            isProjectorBlank: false,
          });
          return;
        }

        const previousIndex = Math.max(normalizedIndex - 1, 0);
        const previousItem = items[previousIndex];
        const previousSlides = getPresentationSlides(previousItem);

        set({
          selectedItemId: previousItem.id,
          selectedSlideIndex: Math.max(previousSlides.length - 1, 0),
          isProjectorBlank: false,
        });
      },

      moveItemToIndex: (id, targetIndex) => {
        const items = [...get().items];
        const currentIndex = items.findIndex((item) => item.id === id);

        if (currentIndex < 0) return;

        const boundedTargetIndex = Math.min(
          Math.max(targetIndex, 0),
          items.length - 1,
        );

        if (currentIndex === boundedTargetIndex) return;

        const [movedItem] = items.splice(currentIndex, 1);
        items.splice(boundedTargetIndex, 0, movedItem);

        set({
          items,
          selectedItemId: id,
          selectedSlideIndex: 0,
        });
      },

      moveItemUp: (id) => {
        const items = [...get().items];
        const index = items.findIndex((item) => item.id === id);

        if (index <= 0) return;

        [items[index - 1], items[index]] = [items[index], items[index - 1]];

        set({
          items,
          selectedItemId: id,
          selectedSlideIndex: 0,
        });
      },

      moveItemDown: (id) => {
        const items = [...get().items];
        const index = items.findIndex((item) => item.id === id);

        if (index < 0 || index >= items.length - 1) return;

        [items[index], items[index + 1]] = [items[index + 1], items[index]];

        set({
          items,
          selectedItemId: id,
          selectedSlideIndex: 0,
        });
      },

      setProjectorBlank: (value) => {
        set({ isProjectorBlank: value });
      },

      toggleProjectorBlank: () => {
        set((state) => ({ isProjectorBlank: !state.isProjectorBlank }));
      },

      clearItems: () => {
        set({
          items: [],
          selectedItemId: null,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        });
      },

      resetPlan: () => {
        set(createInitialPresentationState());
      },

      loadSnapshot: (snapshot) => {
        const items = snapshot.items.map((item) => ({ ...item }));

        set({
          serviceInfo: { ...snapshot.serviceInfo },
          items,
          selectedItemId: normalizeSelectedItemId(items, snapshot.selectedItemId),
          selectedSlideIndex: getBoundedSlideIndex(
            items.find(
              (item) =>
                item.id === normalizeSelectedItemId(items, snapshot.selectedItemId),
            ) ?? null,
            snapshot.selectedSlideIndex ?? 0,
          ),
          isProjectorBlank: false,
        });
      },
    }),
    {
      name: PRESENTATION_STORAGE_KEY,
      storage: createPersistStorage(storage),
      version: 2,
      migrate: (persistedState) =>
        ({
          ...createInitialPresentationState(),
          ...(persistedState as Partial<PresentationStore>),
          items: [],
          selectedItemId: null,
          selectedSlideIndex: 0,
          isProjectorBlank: false,
        }) as PresentationStore,
    },
  );
}

export function createPresentationStore(storage?: StateStorage) {
  return createStore<PresentationStore>()(
    createPresentationStoreInitializer(resolveStorage(storage)),
  );
}

export const usePresentationStore = create<PresentationStore>()(
  createPresentationStoreInitializer(resolveStorage()),
);

export function createPresentationSnapshot(
  state: Pick<
    PresentationStore,
    "serviceInfo" | "items" | "selectedItemId" | "selectedSlideIndex"
  >,
): PresentationPlanSnapshot {
  return {
    serviceInfo: { ...state.serviceInfo },
    items: state.items.map((item) => ({ ...item })),
    selectedItemId: state.selectedItemId,
    selectedSlideIndex: state.selectedSlideIndex,
  };
}
