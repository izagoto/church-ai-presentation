import {
  createJSONStorage,
  type StateStorage,
  type StorageValue,
} from "zustand/middleware";

function createMemoryStorage(): StateStorage {
  const storage = new Map<string, string>();

  return {
    getItem: (name) => storage.get(name) ?? null,
    setItem: (name, value) => {
      storage.set(name, value);
    },
    removeItem: (name) => {
      storage.delete(name);
    },
  };
}

export function resolveStorage(storage?: StateStorage) {
  return storage ??
    (typeof window === "undefined" ? createMemoryStorage() : window.localStorage);
}

export function createPersistStorage<T>(storage?: StateStorage) {
  return createJSONStorage<T>(() => resolveStorage(storage));
}

export function readPersistedState<T>(key: string) {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as StorageValue<T>;
    return parsed.state;
  } catch {
    return null;
  }
}
