import { app, BrowserWindow, ipcMain, safeStorage, screen } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;
let projectorWindow: BrowserWindow | null = null;
const secureSettingsPath = () =>
  path.join(app.getPath("userData"), "secure-settings.json");

type ProjectorOpenOptions = {
  displayId?: number | null;
  fullscreen?: boolean;
};

type SecureSettingsFile = {
  openAIApiKey?: string;
};

type ServicePlanSuggestionPayload = {
  model: string;
  theme: string;
  serviceName: string;
  preacher: string;
  songs: Array<{ id: string; title: string; category: string; tags: string[] }>;
  verses: Array<{ id: string; reference: string; topic: string; aiContext: string }>;
};

type ServicePlanSuggestionResult = {
  summary: string;
  songIds: string[];
  verseIds: string[];
  notes: string[];
  sections: Array<{
    key: string;
    title: string;
    description: string;
    entries: Array<{
      kind: "song" | "bible";
      id: string;
      reason: string;
    }>;
  }>;
};

type SongSearchPayload = {
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
};

type BibleSearchPayload = {
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
};

function getAppUrl(hash?: string) {
  if (isDev) {
    return `http://localhost:5173/${hash ? hash : ""}`;
  }

  const baseUrl = pathToFileURL(path.join(__dirname, "../dist/index.html")).toString();
  return hash ? `${baseUrl}${hash}` : baseUrl;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: "#0b0b0f",
    title: "Church AI Worship Presentation",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(getAppUrl());
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(getAppUrl());
  }
}

async function readSecureSettingsFile() {
  try {
    const rawValue = await fs.readFile(secureSettingsPath(), "utf8");
    return JSON.parse(rawValue) as SecureSettingsFile;
  } catch {
    return {};
  }
}

async function writeSecureSettingsFile(value: SecureSettingsFile) {
  await fs.mkdir(path.dirname(secureSettingsPath()), { recursive: true });
  await fs.writeFile(
    secureSettingsPath(),
    JSON.stringify(value, null, 2),
    "utf8",
  );
}

async function getSecureOpenAIApiKey() {
  if (!safeStorage.isEncryptionAvailable()) return "";

  const file = await readSecureSettingsFile();
  if (!file.openAIApiKey) return "";

  try {
    return safeStorage.decryptString(
      Buffer.from(file.openAIApiKey, "base64"),
    );
  } catch {
    return "";
  }
}

async function setSecureOpenAIApiKey(value: string) {
  if (!safeStorage.isEncryptionAvailable()) return false;

  const encryptedValue = safeStorage
    .encryptString(value)
    .toString("base64");

  const file = await readSecureSettingsFile();
  file.openAIApiKey = encryptedValue;
  await writeSecureSettingsFile(file);

  return true;
}

async function clearSecureOpenAIApiKey() {
  if (!safeStorage.isEncryptionAvailable()) return false;

  const file = await readSecureSettingsFile();
  delete file.openAIApiKey;
  await writeSecureSettingsFile(file);

  return true;
}

function extractJsonObject(rawText: string) {
  const codeBlockMatch = rawText.match(/```json\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) return codeBlockMatch[1].trim();

  const genericBlockMatch = rawText.match(/```\s*([\s\S]*?)```/);
  if (genericBlockMatch?.[1]) return genericBlockMatch[1].trim();

  return rawText.trim();
}

async function requestOpenAiJson(
  apiKey: string,
  model: string,
  developerPrompt: string,
  payload: unknown,
) {
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

  const result = (await response.json()) as { output_text?: string };
  return extractJsonObject(result.output_text ?? "");
}

function getDisplayPayload() {
  const primaryDisplay = screen.getPrimaryDisplay();

  return screen.getAllDisplays().map((display, index) => ({
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

function resolveTargetDisplay(displayId?: number | null) {
  if (displayId != null) {
    const matchedDisplay = screen
      .getAllDisplays()
      .find((display) => display.id === displayId);

    if (matchedDisplay) return matchedDisplay;
  }

  return screen.getPrimaryDisplay();
}

function positionProjectorWindow(
  window: BrowserWindow,
  options?: ProjectorOpenOptions,
) {
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

function createProjectorWindow(options?: ProjectorOpenOptions) {
  if (projectorWindow && !projectorWindow.isDestroyed()) {
    positionProjectorWindow(projectorWindow, options);
    if (typeof options?.fullscreen === "boolean") {
      projectorWindow.setFullScreen(options.fullscreen);
    }
    projectorWindow.focus();
    return projectorWindow;
  }

  projectorWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    backgroundColor: "#000000",
    title: "Church AI Projector",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

ipcMain.handle("system:get-displays", () => {
  return getDisplayPayload();
});

ipcMain.handle("settings:is-secure-storage-available", () => {
  return safeStorage.isEncryptionAvailable();
});

ipcMain.handle("settings:get-openai-api-key", async () => {
  return getSecureOpenAIApiKey();
});

ipcMain.handle("settings:set-openai-api-key", async (_, value: string) => {
  return setSecureOpenAIApiKey(value);
});

ipcMain.handle("settings:clear-openai-api-key", async () => {
  return clearSecureOpenAIApiKey();
});

ipcMain.handle(
  "ai:suggest-service-plan",
  async (_, payload: ServicePlanSuggestionPayload) => {
    const apiKey = await getSecureOpenAIApiKey();
    if (!apiKey) {
      throw new Error("OpenAI API key belum tersedia di secure storage.");
    }

    const rawJson = await requestOpenAiJson(
      apiKey,
      payload.model,
      "You recommend worship service plans. Return raw JSON only with keys summary, notes, sections. Each section must include key, title, description, entries. Each entry must include kind, id, reason. Valid kinds are song or bible. Only choose IDs from the provided lists. Build a coherent worship flow such as opening, worship, sermon, response, closing.",
      payload,
    );
    const parsed = JSON.parse(rawJson) as {
      summary?: string;
      songIds?: string[];
      verseIds?: string[];
      notes?: string[];
      sections?: Array<{
        key?: string;
        title?: string;
        description?: string;
        entries?: Array<{
          kind?: "song" | "bible";
          id?: string;
          reason?: string;
        }>;
      }>;
    };

    const sections =
      parsed.sections?.map((section, index) => ({
        key: section.key?.trim() || `section_${index + 1}`,
        title: section.title?.trim() || `Section ${index + 1}`,
        description: section.description?.trim() || "",
        entries:
          section.entries
            ?.filter((entry) => entry.kind && entry.id)
            .map((entry) => ({
              kind: entry.kind as "song" | "bible",
              id: entry.id as string,
              reason: entry.reason?.trim() || "",
            })) ?? [],
      })) ?? [];

    const sectionSongIds = sections.flatMap((section) =>
      section.entries
        .filter((entry) => entry.kind === "song")
        .map((entry) => entry.id),
    );
    const sectionVerseIds = sections.flatMap((section) =>
      section.entries
        .filter((entry) => entry.kind === "bible")
        .map((entry) => entry.id),
    );

    const result: ServicePlanSuggestionResult = {
      summary: parsed.summary ?? "",
      songIds:
        sectionSongIds.length > 0 ? sectionSongIds : (parsed.songIds ?? []),
      verseIds:
        sectionVerseIds.length > 0 ? sectionVerseIds : (parsed.verseIds ?? []),
      notes: parsed.notes ?? [],
      sections,
    };

    return result;
  },
);

ipcMain.handle("ai:search-songs", async (_, payload: SongSearchPayload) => {
  const apiKey = await getSecureOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key belum tersedia di secure storage.");
  }

  const rawJson = await requestOpenAiJson(
    apiKey,
    payload.model,
    "You rank worship songs for an operator. Return raw JSON only with keys summary, songIds, notes. Only choose IDs from the provided list and rank the best matches first.",
    payload,
  );
  const parsed = JSON.parse(rawJson) as {
    summary?: string;
    songIds?: string[];
    notes?: string[];
  };

  return {
    summary: parsed.summary ?? "",
    songIds: parsed.songIds ?? [],
    notes: parsed.notes ?? [],
  };
});

ipcMain.handle("ai:search-bible", async (_, payload: BibleSearchPayload) => {
  const apiKey = await getSecureOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key belum tersedia di secure storage.");
  }

  const rawJson = await requestOpenAiJson(
    apiKey,
    payload.model,
    "You rank Bible verses for a worship service operator. Return raw JSON only with keys summary, verseIds, notes. Only choose IDs from the provided list and rank the best matches first.",
    payload,
  );
  const parsed = JSON.parse(rawJson) as {
    summary?: string;
    verseIds?: string[];
    notes?: string[];
  };

  return {
    summary: parsed.summary ?? "",
    verseIds: parsed.verseIds ?? [],
    notes: parsed.notes ?? [],
  };
});

ipcMain.handle("presentation:open-projector", (_, options?: ProjectorOpenOptions) => {
  createProjectorWindow(options);
});

ipcMain.handle("presentation:close-projector", () => {
  if (projectorWindow && !projectorWindow.isDestroyed()) {
    projectorWindow.close();
    projectorWindow = null;
  }
});

ipcMain.handle(
  "presentation:toggle-projector-fullscreen",
  (_, options?: ProjectorOpenOptions) => {
    const window = createProjectorWindow(options);
  const nextValue = !window.isFullScreen();
  window.setFullScreen(nextValue);
  return nextValue;
  },
);

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
