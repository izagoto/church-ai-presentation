import { AppTitleBar } from "../components/layout/AppTitleBar";
import { Sidebar } from "../components/sidebar/Sidebar";

import { BiblePage } from "../pages/Bible/BiblePage";
import { HistoryPage } from "../pages/History/HistoryPage";
import { PresentationPage } from "../pages/Presentation/PresentationPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { SongsPage } from "../pages/Songs/SongsPage";

import { useNavigationStore } from "../stores/navigation.store";

export default function App() {
  const { activePage } = useNavigationStore();

  const renderPage = () => {
    if (activePage === "presentation") return <PresentationPage />;
    if (activePage === "songs") return <SongsPage />;
    if (activePage === "bible") return <BiblePage />;
    if (activePage === "history") return <HistoryPage />;
    if (activePage === "settings") return <SettingsPage />;

    return <PresentationPage />;
  };

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
