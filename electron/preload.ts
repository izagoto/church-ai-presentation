import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  app: {
    name: "Church AI Worship Presentation",
    version: "0.1.0",
  },
  system: {
    getDisplays: () => ipcRenderer.invoke("system:get-displays"),
  },
  settings: {
    isSecureStorageAvailable: () =>
      ipcRenderer.invoke("settings:is-secure-storage-available"),
    getOpenAIApiKey: () => ipcRenderer.invoke("settings:get-openai-api-key"),
    setOpenAIApiKey: (value: string) =>
      ipcRenderer.invoke("settings:set-openai-api-key", value),
    clearOpenAIApiKey: () => ipcRenderer.invoke("settings:clear-openai-api-key"),
  },
  ai: {
    suggestServicePlan: (payload: {
      model: string;
      theme: string;
      serviceName: string;
      preacher: string;
      songs: Array<{ id: string; title: string; category: string; tags: string[] }>;
      verses: Array<{ id: string; reference: string; topic: string; aiContext: string }>;
    }) => ipcRenderer.invoke("ai:suggest-service-plan", payload),
    searchSongs: (payload: {
      model: string;
      query: string;
      songs: Array<{
        id: string;
        title: string;
        author: string;
        category: string;
        songKey: string;
        tags: string[];
        lyricPreview: string;
      }>;
    }) => ipcRenderer.invoke("ai:search-songs", payload),
    searchBible: (payload: {
      model: string;
      query: string;
      translation: string;
      verses: Array<{
        id: string;
        reference: string;
        topic: string;
        book: string;
        aiContext: string;
        content: string;
      }>;
    }) => ipcRenderer.invoke("ai:search-bible", payload),
  },
  presentation: {
    openProjectorWindow: (options?: {
      displayId?: number | null;
      fullscreen?: boolean;
    }) => ipcRenderer.invoke("presentation:open-projector", options),
    closeProjectorWindow: () =>
      ipcRenderer.invoke("presentation:close-projector"),
    toggleProjectorFullscreen: (options?: {
      displayId?: number | null;
      fullscreen?: boolean;
    }) => ipcRenderer.invoke("presentation:toggle-projector-fullscreen", options),
  },
});
