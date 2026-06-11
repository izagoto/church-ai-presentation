"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;
let projectorWindow = null;
const secureSettingsPath = () => node_path_1.default.join(electron_1.app.getPath("userData"), "secure-settings.json");
function getAppUrl(hash) {
    if (isDev) {
        return `http://localhost:5173/${hash ? hash : ""}`;
    }
    const baseUrl = (0, node_url_1.pathToFileURL)(node_path_1.default.join(__dirname, "../dist/index.html")).toString();
    return hash ? `${baseUrl}${hash}` : baseUrl;
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1200,
        minHeight: 760,
        backgroundColor: "#0b0b0f",
        title: "Church AI Worship Presentation",
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (isDev) {
        mainWindow.loadURL(getAppUrl());
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadURL(getAppUrl());
    }
}
async function readSecureSettingsFile() {
    try {
        const rawValue = await node_fs_1.promises.readFile(secureSettingsPath(), "utf8");
        return JSON.parse(rawValue);
    }
    catch {
        return {};
    }
}
async function writeSecureSettingsFile(value) {
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(secureSettingsPath()), { recursive: true });
    await node_fs_1.promises.writeFile(secureSettingsPath(), JSON.stringify(value, null, 2), "utf8");
}
async function getSecureOpenAIApiKey() {
    if (!electron_1.safeStorage.isEncryptionAvailable())
        return "";
    const file = await readSecureSettingsFile();
    if (!file.openAIApiKey)
        return "";
    try {
        return electron_1.safeStorage.decryptString(Buffer.from(file.openAIApiKey, "base64"));
    }
    catch {
        return "";
    }
}
async function setSecureOpenAIApiKey(value) {
    if (!electron_1.safeStorage.isEncryptionAvailable())
        return false;
    const encryptedValue = electron_1.safeStorage
        .encryptString(value)
        .toString("base64");
    const file = await readSecureSettingsFile();
    file.openAIApiKey = encryptedValue;
    await writeSecureSettingsFile(file);
    return true;
}
async function clearSecureOpenAIApiKey() {
    if (!electron_1.safeStorage.isEncryptionAvailable())
        return false;
    const file = await readSecureSettingsFile();
    delete file.openAIApiKey;
    await writeSecureSettingsFile(file);
    return true;
}
function extractJsonObject(rawText) {
    const codeBlockMatch = rawText.match(/```json\s*([\s\S]*?)```/i);
    if (codeBlockMatch?.[1])
        return codeBlockMatch[1].trim();
    const genericBlockMatch = rawText.match(/```\s*([\s\S]*?)```/);
    if (genericBlockMatch?.[1])
        return genericBlockMatch[1].trim();
    return rawText.trim();
}
async function requestOpenAiJson(apiKey, model, developerPrompt, payload) {
    const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            input: [
                {
                    role: "developer",
                    content: developerPrompt,
                },
                {
                    role: "user",
                    content: JSON.stringify(payload),
                },
            ],
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${errorText}`);
    }
    const result = (await response.json());
    return extractJsonObject(result.output_text ?? "");
}
function getDisplayPayload() {
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    return electron_1.screen.getAllDisplays().map((display, index) => ({
        id: display.id,
        label: display.label || `Screen ${index + 1}`,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        scaleFactor: display.scaleFactor,
        isPrimary: display.id === primaryDisplay.id,
    }));
}
function resolveTargetDisplay(displayId) {
    if (displayId != null) {
        const matchedDisplay = electron_1.screen
            .getAllDisplays()
            .find((display) => display.id === displayId);
        if (matchedDisplay)
            return matchedDisplay;
    }
    return electron_1.screen.getPrimaryDisplay();
}
function positionProjectorWindow(window, options) {
    const targetDisplay = resolveTargetDisplay(options?.displayId);
    const { x, y, width, height } = targetDisplay.bounds;
    window.setBounds({
        x,
        y,
        width,
        height,
    });
    window.center();
}
function createProjectorWindow(options) {
    if (projectorWindow && !projectorWindow.isDestroyed()) {
        positionProjectorWindow(projectorWindow, options);
        if (typeof options?.fullscreen === "boolean") {
            projectorWindow.setFullScreen(options.fullscreen);
        }
        projectorWindow.focus();
        return projectorWindow;
    }
    projectorWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 960,
        minHeight: 540,
        backgroundColor: "#000000",
        title: "Church AI Projector",
        autoHideMenuBar: true,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    projectorWindow.on("closed", () => {
        projectorWindow = null;
    });
    positionProjectorWindow(projectorWindow, options);
    if (typeof options?.fullscreen === "boolean") {
        projectorWindow.setFullScreen(options.fullscreen);
    }
    projectorWindow.loadURL(getAppUrl("#/projector"));
    return projectorWindow;
}
electron_1.ipcMain.handle("system:get-displays", () => {
    return getDisplayPayload();
});
electron_1.ipcMain.handle("settings:is-secure-storage-available", () => {
    return electron_1.safeStorage.isEncryptionAvailable();
});
electron_1.ipcMain.handle("settings:get-openai-api-key", async () => {
    return getSecureOpenAIApiKey();
});
electron_1.ipcMain.handle("settings:set-openai-api-key", async (_, value) => {
    return setSecureOpenAIApiKey(value);
});
electron_1.ipcMain.handle("settings:clear-openai-api-key", async () => {
    return clearSecureOpenAIApiKey();
});
electron_1.ipcMain.handle("ai:suggest-service-plan", async (_, payload) => {
    const apiKey = await getSecureOpenAIApiKey();
    if (!apiKey) {
        throw new Error("OpenAI API key belum tersedia di secure storage.");
    }
    const rawJson = await requestOpenAiJson(apiKey, payload.model, "You recommend worship service plans. Return raw JSON only with keys summary, notes, sections. Each section must include key, title, description, entries. Each entry must include kind, id, reason. Valid kinds are song or bible. Only choose IDs from the provided lists. Build a coherent worship flow such as opening, worship, sermon, response, closing.", payload);
    const parsed = JSON.parse(rawJson);
    const sections = parsed.sections?.map((section, index) => ({
        key: section.key?.trim() || `section_${index + 1}`,
        title: section.title?.trim() || `Section ${index + 1}`,
        description: section.description?.trim() || "",
        entries: section.entries
            ?.filter((entry) => entry.kind && entry.id)
            .map((entry) => ({
            kind: entry.kind,
            id: entry.id,
            reason: entry.reason?.trim() || "",
        })) ?? [],
    })) ?? [];
    const sectionSongIds = sections.flatMap((section) => section.entries
        .filter((entry) => entry.kind === "song")
        .map((entry) => entry.id));
    const sectionVerseIds = sections.flatMap((section) => section.entries
        .filter((entry) => entry.kind === "bible")
        .map((entry) => entry.id));
    const result = {
        summary: parsed.summary ?? "",
        songIds: sectionSongIds.length > 0 ? sectionSongIds : (parsed.songIds ?? []),
        verseIds: sectionVerseIds.length > 0 ? sectionVerseIds : (parsed.verseIds ?? []),
        notes: parsed.notes ?? [],
        sections,
    };
    return result;
});
electron_1.ipcMain.handle("ai:search-songs", async (_, payload) => {
    const apiKey = await getSecureOpenAIApiKey();
    if (!apiKey) {
        throw new Error("OpenAI API key belum tersedia di secure storage.");
    }
    const rawJson = await requestOpenAiJson(apiKey, payload.model, "You rank worship songs for an operator. Return raw JSON only with keys summary, songIds, notes. Only choose IDs from the provided list and rank the best matches first.", payload);
    const parsed = JSON.parse(rawJson);
    return {
        summary: parsed.summary ?? "",
        songIds: parsed.songIds ?? [],
        notes: parsed.notes ?? [],
    };
});
electron_1.ipcMain.handle("ai:search-bible", async (_, payload) => {
    const apiKey = await getSecureOpenAIApiKey();
    if (!apiKey) {
        throw new Error("OpenAI API key belum tersedia di secure storage.");
    }
    const rawJson = await requestOpenAiJson(apiKey, payload.model, "You rank Bible verses for a worship service operator. Return raw JSON only with keys summary, verseIds, notes. Only choose IDs from the provided list and rank the best matches first.", payload);
    const parsed = JSON.parse(rawJson);
    return {
        summary: parsed.summary ?? "",
        verseIds: parsed.verseIds ?? [],
        notes: parsed.notes ?? [],
    };
});
electron_1.ipcMain.handle("presentation:open-projector", (_, options) => {
    createProjectorWindow(options);
});
electron_1.ipcMain.handle("presentation:close-projector", () => {
    if (projectorWindow && !projectorWindow.isDestroyed()) {
        projectorWindow.close();
        projectorWindow = null;
    }
});
electron_1.ipcMain.handle("presentation:toggle-projector-fullscreen", (_, options) => {
    const window = createProjectorWindow(options);
    const nextValue = !window.isFullScreen();
    window.setFullScreen(nextValue);
    return nextValue;
});
electron_1.app.whenReady().then(() => {
    createMainWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
