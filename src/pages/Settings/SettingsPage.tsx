import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import {
  Brain,
  Check,
  Database,
  Folder,
  Gauge,
  Globe2,
  HardDrive,
  KeyRound,
  Maximize,
  Monitor,
  Paintbrush,
  RefreshCcw,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Type,
  View,
} from "lucide-react";

import { Button, Card } from "../../components/ui";
import {
  useSettingsStore,
  type AiSearchMode,
  type AppTheme,
  type FontSizeOption,
} from "../../stores/settings.store";

function SectionCard({
  icon: Icon,
  number,
  title,
  children,
}: {
  icon: ElementType;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="min-h-[240px] p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Icon size={24} className="text-red-500" />

        <h3 className="text-xl font-semibold text-white">
          {number}. {title}
        </h3>
      </div>

      <div className="mt-3 space-y-0">{children}</div>
    </Card>
  );
}

function SettingRow({
  icon: Icon,
  label,
  children,
  description,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="grid min-h-[54px] grid-cols-[210px_1fr] items-center gap-5 border-b border-white/10 py-2.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <Icon size={22} className="shrink-0 text-white/55" />

        <div className="min-w-0">
          <p className="truncate text-base font-medium text-white/75">
            {label}
          </p>

          {description && (
            <p className="mt-1 text-xs leading-5 text-white/35">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-left text-sm font-medium text-white/75 outline-none transition hover:bg-white/[0.055]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function PasswordField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/75 outline-none transition hover:bg-white/[0.055]"
      placeholder="Masukkan OpenAI API Key"
    />
  );
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={[
        "relative ml-auto flex h-8 w-14 items-center rounded-full border transition",
        enabled
          ? "border-red-500/30 bg-red-600 shadow-lg shadow-red-950/30"
          : "border-white/10 bg-white/[0.08]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute h-6 w-6 rounded-full bg-white shadow transition",
          enabled ? "left-7" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

function ThemePreview({ fontSize }: { fontSize: FontSizeOption }) {
  const titleClass =
    fontSize === "XL (42px)"
      ? "text-2xl"
      : fontSize === "Medium (32px)"
        ? "text-lg"
        : "text-xl";

  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-semibold text-white/65">Theme Preview</p>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-[1px]">
        <div className="relative overflow-hidden rounded-[11px] bg-gradient-to-r from-[#252137] via-[#713238] to-[#ef8d42]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.25),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-black/30" />

          <div className="relative flex h-[72px] flex-col items-center justify-center px-6 text-center">
            <h4
              className={`${titleClass} font-semibold leading-tight text-white drop-shadow`}
            >
              Kaulah yang setia Tuhan
            </h4>

            <p className="mt-1 text-sm font-medium text-white/90">
              Kasih-Mu tak pernah berubah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataValue({
  children,
  success,
}: {
  children: ReactNode;
  success?: boolean;
}) {
  if (success) {
    return (
      <div className="flex items-center justify-end gap-3">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        <span className="text-base font-medium text-white/70">{children}</span>
      </div>
    );
  }

  return <p className="text-base font-medium text-white/70">{children}</p>;
}

export function SettingsPage() {
  const settings = useSettingsStore();
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const selectedMonitorId = useSettingsStore((state) => state.selectedMonitorId);
  const openAIApiKey = useSettingsStore((state) => state.openAIApiKey);
  const [displays, setDisplays] = useState<ElectronDisplayInfo[]>([]);
  const [secureStorageAvailable, setSecureStorageAvailable] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saved" | "secure_unavailable" | "error"
  >("idle");

  useEffect(() => {
    const loadSettingsContext = async () => {
      const nextDisplays = (await window.api?.system.getDisplays()) ?? [];
      setDisplays(nextDisplays);

      const secureAvailable =
        (await window.api?.settings.isSecureStorageAvailable()) ?? false;
      setSecureStorageAvailable(secureAvailable);

      const secureApiKey =
        (await window.api?.settings.getOpenAIApiKey()) ?? "";
      updateSettings({ openAIApiKey: secureApiKey });

      if (nextDisplays.length > 0 && selectedMonitorId == null) {
        const primaryDisplay =
          nextDisplays.find((display) => display.isPrimary) ?? nextDisplays[0];
        updateSettings({ selectedMonitorId: primaryDisplay.id });
      }
    };

    void loadSettingsContext();
  }, [selectedMonitorId, updateSettings]);

  const monitorOptions = useMemo(() => {
    if (displays.length === 0) return ["Primary Display"];

    return displays.map(
      (display) =>
        `${display.id}|${display.label}${display.isPrimary ? " (Primary)" : ""} (${display.width}x${display.height})`,
    );
  }, [displays]);

  const selectedMonitorValue = useMemo(() => {
    const fallback = monitorOptions[0] ?? "Primary Display";
    const matched = monitorOptions.find((option) =>
      option.startsWith(`${selectedMonitorId}|`),
    );
    return matched ?? fallback;
  }, [monitorOptions, selectedMonitorId]);

  const handleSaveChanges = async () => {
    if (!secureStorageAvailable) {
      setSaveState("secure_unavailable");
      window.setTimeout(() => setSaveState("idle"), 2200);
      return;
    }

    try {
      const saved = openAIApiKey
        ? await window.api?.settings.setOpenAIApiKey(openAIApiKey)
        : await window.api?.settings.clearOpenAIApiKey();

      setSaveState(saved ? "saved" : "error");
    } catch {
      setSaveState("error");
    }

    window.setTimeout(() => setSaveState("idle"), 2200);
  };

  const handleReset = async () => {
    resetSettings();
    const primaryDisplay =
      displays.find((display) => display.isPrimary) ?? displays[0] ?? null;

    if (primaryDisplay) {
      updateSettings({ selectedMonitorId: primaryDisplay.id });
    }

    if (secureStorageAvailable) {
      await window.api?.settings.clearOpenAIApiKey();
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          Settings
        </h2>

        <p className="mt-1 text-base text-white/45">
          Application preferences and projector configuration
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 pb-6 pt-3">
        <div className="settings-grid-scroll min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-2">
            <SectionCard icon={Settings} number="1" title="General">
              <SettingRow icon={Globe2} label="Language">
                <SelectField
                  value={settings.language}
                  options={["English", "Indonesia"]}
                  onChange={(value) => updateSettings({ language: value })}
                />
              </SettingRow>

              <SettingRow icon={Paintbrush} label="App Theme">
                <SelectField
                  value={settings.theme}
                  options={["Dark (Default)", "Midnight Red"]}
                  onChange={(value) => updateSettings({ theme: value as AppTheme })}
                />
              </SettingRow>

              <SettingRow icon={Type} label="Default Font Size">
                <SelectField
                  value={settings.defaultFontSize}
                  options={["Medium (32px)", "Large (36px)", "XL (42px)"]}
                  onChange={(value) =>
                    updateSettings({
                      defaultFontSize: value as FontSizeOption,
                    })
                  }
                />
              </SettingRow>
            </SectionCard>

            <SectionCard icon={Monitor} number="2" title="Projector">
              <SettingRow
                icon={Monitor}
                label="Selected Monitor"
                description="Monitor ini akan dipakai saat membuka projector window."
              >
                <SelectField
                  value={selectedMonitorValue}
                  options={monitorOptions}
                  onChange={(value) =>
                    updateSettings({
                      selectedMonitorId: Number(value.split("|")[0]) || null,
                    })
                  }
                />
              </SettingRow>

              <SettingRow icon={Maximize} label="Resolution">
                <SelectField
                  value={settings.resolution}
                  options={[
                    "1920 x 1080 (16:9)",
                    "1600 x 900 (16:9)",
                    "1280 x 720 (16:9)",
                  ]}
                  onChange={(value) => updateSettings({ resolution: value })}
                />
              </SettingRow>

              <SettingRow icon={View} label="Fullscreen by Default">
                <ToggleSwitch
                  enabled={settings.fullscreenDefault}
                  onChange={() =>
                    updateSettings({
                      fullscreenDefault: !settings.fullscreenDefault,
                    })
                  }
                />
              </SettingRow>

              <ThemePreview fontSize={settings.defaultFontSize} />
            </SectionCard>

            <SectionCard icon={Brain} number="3" title="AI">
              <SettingRow icon={KeyRound} label="OpenAI API Key">
                <PasswordField
                  value={settings.openAIApiKey}
                  onChange={(value) => updateSettings({ openAIApiKey: value })}
                />
              </SettingRow>

              <div className="mt-2 text-xs text-white/40">
                {secureStorageAvailable
                  ? "API key akan disimpan terenkripsi di device ini."
                  : "Secure storage tidak tersedia, jadi API key tidak akan disimpan permanen."}
              </div>

              <SettingRow icon={HardDrive} label="Model">
                <SelectField
                  value={settings.model}
                  options={["GPT-4o (Recommended)", "GPT-4.1", "GPT-4.1-mini"]}
                  onChange={(value) => updateSettings({ model: value })}
                />
              </SettingRow>

              <SettingRow
                icon={Search}
                label="AI Search Mode"
                description="Balanced results between accuracy and speed."
              >
                <SelectField
                  value={settings.aiSearchMode}
                  options={["Balanced (Default)", "Fast", "Accurate"]}
                  onChange={(value) =>
                    updateSettings({
                      aiSearchMode: value as AiSearchMode,
                    })
                  }
                />
              </SettingRow>
            </SectionCard>

            <SectionCard icon={Database} number="4" title="Data Storage">
              <SettingRow icon={Database} label="Local Database">
                <DataValue success>Active</DataValue>
              </SettingRow>

              <SettingRow icon={Folder} label="Cache Size">
                <div className="flex items-center justify-between gap-4">
                  <DataValue>245 MB</DataValue>

                  <button
                    type="button"
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <Trash2 size={16} />
                    Clear Cache
                  </button>
                </div>
              </SettingRow>

              <SettingRow icon={RotateCcw} label="History Size">
                <DataValue>128 MB</DataValue>
              </SettingRow>

              <SettingRow icon={Gauge} label="Total App Data">
                <DataValue>373 MB</DataValue>
              </SettingRow>
            </SectionCard>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-sm text-white/45">
            {saveState === "saved"
              ? "Settings saved. API key terenkripsi."
              : saveState === "secure_unavailable"
                ? "Secure storage tidak tersedia, API key tidak disimpan."
                : saveState === "error"
                  ? "Gagal menyimpan API key secara aman."
                  : ""}
          </p>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 min-w-[280px]"
              leftIcon={<RefreshCcw size={20} />}
              onClick={handleReset}
            >
              Reset to Default
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="h-12 min-w-[280px]"
              leftIcon={<Check size={22} />}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
