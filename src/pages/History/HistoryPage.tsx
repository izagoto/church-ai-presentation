import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Clock3,
  FileText,
  ListMusic,
  RefreshCcw,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";
import { type HistoryService, useHistoryStore } from "../../stores/history.store";

function formatBadgeDate(savedAt: string) {
  const date = new Date(savedAt);

  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(date)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
    year: new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date),
  };
}

function getServiceSongs(service: HistoryService) {
  return service.items.filter((item) => item.type === "song");
}

function getServiceVerses(service: HistoryService) {
  return service.items.filter((item) => item.type === "bible");
}

function getServicePdf(service: HistoryService) {
  return service.items.find((item) => item.type === "pdf");
}

function DateBadge({ savedAt }: { savedAt: string }) {
  const { month, day, year } = formatBadgeDate(savedAt);

  return (
    <div className="flex h-[96px] w-[74px] shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
      <p className="text-xs font-semibold text-red-400">{month}</p>
      <p className="mt-1 text-[34px] font-semibold leading-none text-white">
        {day}
      </p>
      <p className="mt-1 text-sm text-white/55">{year}</p>
    </div>
  );
}

function HistoryRow({
  service,
  active,
  onSelect,
}: {
  service: HistoryService;
  active: boolean;
  onSelect: (service: HistoryService) => void;
}) {
  const songs = getServiceSongs(service);
  const verses = getServiceVerses(service);

  return (
    <Card
      onClick={() => onSelect(service)}
      className={[
        "grid min-h-[156px] cursor-pointer grid-cols-[96px_1.2fr_1fr_1fr] items-center gap-4 p-4 transition",
        active
          ? "border-red-500/70 bg-white/[0.045]"
          : "hover:border-white/15 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <DateBadge savedAt={service.savedAt} />

      <div className="min-w-0">
        <h3 className="truncate text-xl font-semibold text-white">
          {service.serviceInfo.serviceName}
        </h3>

        <div className="mt-3 space-y-2 text-sm text-white/65">
          <div className="flex items-center gap-2">
            <UserRound size={15} className="text-white/45" />
            <span className="truncate">{service.serviceInfo.preacher}</span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-white/45" />
            <span className="truncate">{service.serviceInfo.theme}</span>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-white/65">Lagu</p>

        <ul className="space-y-1 text-sm text-white/65">
          {songs.slice(0, 2).map((song) => (
            <li key={song.id} className="truncate">
              • {song.title}
            </li>
          ))}

          <li className="text-white/45">
            {songs.length > 2 ? `+${songs.length - 2} lainnya` : `${songs.length} item`}
          </li>
        </ul>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-white/65">Ayat</p>

        <ul className="space-y-1 text-sm text-white/65">
          {verses.slice(0, 2).map((verse) => (
            <li key={verse.id} className="truncate">
              • {verse.reference || verse.title}
            </li>
          ))}

          <li className="text-white/45">
            {verses.length > 2
              ? `+${verses.length - 2} lainnya`
              : `${verses.length} item`}
          </li>
        </ul>
      </div>
    </Card>
  );
}

function HistoryDetailPanel({ service }: { service: HistoryService }) {
  const loadServiceIntoPresentation = useHistoryStore(
    (state) => state.loadServiceIntoPresentation,
  );
  const removeService = useHistoryStore((state) => state.removeService);

  const songs = getServiceSongs(service);
  const verses = getServiceVerses(service);
  const pdf = getServicePdf(service);

  return (
    <Card className="flex h-full min-h-0 flex-col p-6">
      <div className="flex items-start gap-6">
        <DateBadge savedAt={service.savedAt} />

        <div className="min-w-0 pt-1">
          <h3 className="text-[28px] font-semibold leading-tight text-white">
            {service.serviceInfo.serviceName}
          </h3>

          <div className="mt-4 space-y-2 text-base text-white/70">
            <div className="flex items-center gap-3">
              <UserRound size={18} className="text-white/45" />
              <span>{service.serviceInfo.preacher}</span>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-white/45" />
              <span>{service.serviceInfo.theme}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-white/45" />
              <span>
                {service.serviceInfo.serviceDate} • {service.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 h-px bg-white/10" />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto py-6">
        <div>
          <div className="mb-3 flex items-center gap-3 text-white/65">
            <ListMusic size={20} className="text-red-500" />
            <p className="text-base font-semibold">Lagu yang digunakan</p>
          </div>

          <ul className="space-y-2 text-base text-white/75">
            {songs.map((song) => (
              <li key={song.id}>• {song.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3 text-white/65">
            <BookOpen size={20} className="text-red-500" />
            <p className="text-base font-semibold">Ayat yang digunakan</p>
          </div>

          <ul className="space-y-2 text-base text-white/75">
            {verses.map((verse) => (
              <li key={verse.id}>• {verse.reference || verse.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3 text-white/65">
            <FileText size={20} className="text-red-500" />
            <p className="text-base font-semibold">Materi PDF</p>
          </div>

          <p className="text-base text-white/75">
            {pdf ? pdf.title : "Tidak ada materi PDF"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<RefreshCcw size={20} />}
          className="h-14"
          onClick={() => loadServiceIntoPresentation(service.id)}
        >
          Reuse Service
        </Button>

        <Button
          variant="danger"
          size="lg"
          leftIcon={<Trash2 size={19} />}
          className="h-14"
          onClick={() => removeService(service.id)}
        >
          Delete History
        </Button>
      </div>
    </Card>
  );
}

export function HistoryPage() {
  const services = useHistoryStore((state) => state.services);
  const [query, setQuery] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    services[0]?.id ?? null,
  );

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return services;

    return services.filter((service) => {
      const haystacks = [
        service.serviceInfo.serviceName,
        service.serviceInfo.serviceDate,
        service.serviceInfo.preacher,
        service.serviceInfo.theme,
        ...service.items.map((item) => item.title),
        ...service.items
          .map((item) => item.reference)
          .filter((value): value is string => Boolean(value)),
      ];

      return haystacks.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [query, services]);

  useEffect(() => {
    if (filteredServices.length === 0) {
      setSelectedHistoryId(null);
      return;
    }

    if (!selectedHistoryId || !filteredServices.some((item) => item.id === selectedHistoryId)) {
      setSelectedHistoryId(filteredServices[0].id);
    }
  }, [filteredServices, selectedHistoryId]);

  const selectedHistory =
    filteredServices.find((service) => service.id === selectedHistoryId) ?? null;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          History
        </h2>

        <p className="mt-1 text-base text-white/45">
          Saved service plans ready to reopen and reuse
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-3">
        <div className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)] gap-6">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <Input
              className="h-14 shrink-0 rounded-xl text-base"
              leftIcon={<Search size={24} />}
              placeholder="Cari service, lagu, ayat, atau tema"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <Card className="mt-4 flex min-h-0 flex-1 flex-col p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white/70">
                  {filteredServices.length} service plan
                </p>

                <p className="text-sm text-white/40">
                  Tersimpan otomatis dari Presentation
                </p>
              </div>

              {filteredServices.length === 0 ? (
                <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10 px-4 text-center">
                  <div>
                    <p className="text-base font-semibold text-white/65">
                      Belum ada history service
                    </p>
                    <p className="mt-2 text-sm text-white/35">
                      Gunakan tombol Save Service Plan di halaman Presentation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="history-list-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0">
                  <div className="space-y-3">
                    {filteredServices.map((service) => (
                      <HistoryRow
                        key={service.id}
                        service={service}
                        active={service.id === selectedHistoryId}
                        onSelect={(nextService) => setSelectedHistoryId(nextService.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {selectedHistory ? (
            <HistoryDetailPanel service={selectedHistory} />
          ) : (
            <Card className="flex h-full items-center justify-center p-6 text-center text-white/45">
              Pilih service plan dari daftar di sebelah kiri.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
