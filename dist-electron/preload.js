"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    app: {
        name: "Church AI Worship Presentation",
        version: "0.1.0",
    },
    system: {
        getDisplays: () => electron_1.ipcRenderer.invoke("system:get-displays"),
    },
    settings: {
        isSecureStorageAvailable: () => electron_1.ipcRenderer.invoke("settings:is-secure-storage-available"),
        getOpenAIApiKey: () => electron_1.ipcRenderer.invoke("settings:get-openai-api-key"),
        setOpenAIApiKey: (value) => electron_1.ipcRenderer.invoke("settings:set-openai-api-key", value),
        clearOpenAIApiKey: () => electron_1.ipcRenderer.invoke("settings:clear-openai-api-key"),
    },
    ai: {
        suggestServicePlan: (payload) => electron_1.ipcRenderer.invoke("ai:suggest-service-plan", payload),
        searchSongs: (payload) => electron_1.ipcRenderer.invoke("ai:search-songs", payload),
        searchBible: (payload) => electron_1.ipcRenderer.invoke("ai:search-bible", payload),
    },
    presentation: {
        openProjectorWindow: (options) => electron_1.ipcRenderer.invoke("presentation:open-projector", options),
        closeProjectorWindow: () => electron_1.ipcRenderer.invoke("presentation:close-projector"),
        toggleProjectorFullscreen: (options) => electron_1.ipcRenderer.invoke("presentation:toggle-projector-fullscreen", options),
    },
});
