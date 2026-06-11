export {};

declare global {
  type ElectronDisplayInfo = {
    id: number;
    label: string;
    width: number;
    height: number;
    x: number;
    y: number;
    scaleFactor: number;
    isPrimary: boolean;
  };

  interface Window {
    api?: {
      app: {
        name: string;
        version: string;
      };
      system: {
        getDisplays: () => Promise<ElectronDisplayInfo[]>;
      };
      settings: {
        isSecureStorageAvailable: () => Promise<boolean>;
        getOpenAIApiKey: () => Promise<string>;
        setOpenAIApiKey: (value: string) => Promise<boolean>;
        clearOpenAIApiKey: () => Promise<boolean>;
      };
      ai: {
        suggestServicePlan: (payload: {
          model: string;
          theme: string;
          serviceName: string;
          preacher: string;
          songs: Array<{ id: string; title: string; category: string; tags: string[] }>;
          verses: Array<{ id: string; reference: string; topic: string; aiContext: string }>;
        }) => Promise<{
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
        }>;
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
        }) => Promise<{
          summary: string;
          songIds: string[];
          notes: string[];
        }>;
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
        }) => Promise<{
          summary: string;
          verseIds: string[];
          notes: string[];
        }>;
      };
      presentation: {
        openProjectorWindow: (options?: {
          displayId?: number | null;
          fullscreen?: boolean;
        }) => Promise<void>;
        closeProjectorWindow: () => Promise<void>;
        toggleProjectorFullscreen: (options?: {
          displayId?: number | null;
          fullscreen?: boolean;
        }) => Promise<boolean>;
      };
    };
  }
}
