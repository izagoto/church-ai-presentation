import { Sidebar } from "../components/sidebar/Sidebar";
import { BiblePage } from "../pages/Bible/BiblePage";
import { HistoryPage } from "../pages/History/HistoryPage";
import { PresentationPage } from "../pages/Presentation/PresentationPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { SongsPage } from "../pages/Songs/SongsPage";
import { useNavigationStore } from "../stores/navigation.store";

export default function App() {
  const activePage = useNavigationStore((state) => state.activePage);

  const renderPage = () => {
    switch (activePage) {
      case "presentation":
        return <PresentationPage />;
      case "songs":
        return <SongsPage />;
      case "bible":
        return <BiblePage />;
      case "history":
        return <HistoryPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <PresentationPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0d] text-white">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-hidden">{renderPage()}</main>
    </div>
  );
}
