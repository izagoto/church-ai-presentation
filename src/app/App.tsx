import { useEffect } from "react";

import { AppTitleBar } from "../components/layout/AppTitleBar";
import { Sidebar } from "../components/sidebar/Sidebar";

import { BiblePage } from "../pages/Bible/BiblePage";
import { HistoryPage } from "../pages/History/HistoryPage";
import { PresentationPage } from "../pages/Presentation/PresentationPage";
import { ProjectorScreen } from "../pages/Presentation/ProjectorScreen";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { SongsPage } from "../pages/Songs/SongsPage";

import { useNavigationStore } from "../stores/navigation.store";
import {
  PRESENTATION_STORAGE_KEY,
  usePresentationStore,
} from "../stores/presentation.store";

export default function App() {
  const { activePage } = useNavigationStore();
  const selectNextItem = usePresentationStore((state) => state.selectNextItem);
  const selectPreviousItem = usePresentationStore(
    (state) => state.selectPreviousItem,
  );
  const toggleProjectorBlank = usePresentationStore(
    (state) => state.toggleProjectorBlank,
  );
  const setProjectorBlank = usePresentationStore(
    (state) => state.setProjectorBlank,
  );

  const isProjectorMode =
    typeof window !== "undefined" && window.location.hash === "#/projector";

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PRESENTATION_STORAGE_KEY) {
        void usePresentationStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLElement
      ) {
        if (target.isContentEditable) return;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          return;
        }
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        selectNextItem();
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        selectPreviousItem();
      }

      if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleProjectorBlank();
      }

      if (event.key === "Escape") {
        setProjectorBlank(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectNextItem,
    selectPreviousItem,
    setProjectorBlank,
    toggleProjectorBlank,
  ]);

  const renderPage = () => {
    if (activePage === "presentation") return <PresentationPage />;
    if (activePage === "songs") return <SongsPage />;
    if (activePage === "bible") return <BiblePage />;
    if (activePage === "history") return <HistoryPage />;
    if (activePage === "settings") return <SettingsPage />;

    return <PresentationPage />;
  };

  if (isProjectorMode) {
    return <ProjectorScreen />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden text-white">
      <AppTitleBar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-hidden">{renderPage()}</main>
      </div>
    </div>
  );
}
