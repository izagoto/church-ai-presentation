import { useState, type ElementType, type ReactNode } from "react";

import {
  Brain,
  Check,
  ChevronDown,
  Database,
  Eye,
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
    <Card className="min-h-[270px] p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <Icon size={25} className="text-red-500" />

        <h3 className="text-xl font-semibold text-white">
          {number}. {title}
        </h3>
      </div>

      <div className="mt-4 space-y-0">{children}</div>
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
    <div className="grid min-h-[58px] grid-cols-[230px_1fr] items-center gap-5 border-b border-white/10 py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <Icon size={24} className="shrink-0 text-white/55" />

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

function SelectField({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-left text-sm font-medium text-white/75 transition hover:bg-white/[0.055]"
    >
      <span className="truncate">{value}</span>
      <ChevronDown size={18} className="shrink-0 text-white/45" />
    </button>
  );
}

function PasswordField() {
  return (
    <div className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4">
      <span className="flex-1 truncate text-sm font-medium tracking-[0.18em] text-white/75">
        ••••••••••••••••••••••••••••
      </span>

      <Eye size={18} className="shrink-0 text-white/50" />
    </div>
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

function ThemePreview() {
  return (
    <div className="mt-4">
      <p className="mb-3 text-sm font-semibold text-white/65">Theme Preview</p>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[#252137] via-[#713238] to-[#ef8d42]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.25),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-black/30" />

        <div className="relative flex h-[92px] flex-col items-center justify-center px-6 text-center">
          <h4 className="text-2xl font-semibold leading-tight text-white drop-shadow">
            Kaulah yang setia Tuhan
          </h4>

          <p className="mt-1 text-base font-medium text-white/90">
            Kasih-Mu tak pernah berubah
          </p>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <SectionCard icon={Settings} number="1" title="General">
      <SettingRow icon={Globe2} label="Language">
        <SelectField value="English" />
      </SettingRow>

      <SettingRow icon={Paintbrush} label="App Theme">
        <SelectField value="Dark (Default)" />
      </SettingRow>

      <SettingRow icon={Type} label="Default Font Size">
        <SelectField value="Large (36px)" />
      </SettingRow>
    </SectionCard>
  );
}

function ProjectorSettings() {
  const [fullscreen, setFullscreen] = useState(true);

  return (
    <SectionCard icon={Monitor} number="2" title="Projector">
      <SettingRow icon={Monitor} label="Selected Monitor">
        <SelectField value="Screen 2 (1920x1080)" />
      </SettingRow>

      <SettingRow icon={Maximize} label="Resolution">
        <SelectField value="1920 x 1080 (16:9)" />
      </SettingRow>

      <SettingRow icon={View} label="Fullscreen by Default">
        <ToggleSwitch
          enabled={fullscreen}
          onChange={() => setFullscreen((value) => !value)}
        />
      </SettingRow>

      <ThemePreview />
    </SectionCard>
  );
}

function AiSettings() {
  return (
    <SectionCard icon={Brain} number="3" title="AI">
      <SettingRow icon={KeyRound} label="OpenAI API Key">
        <PasswordField />
      </SettingRow>

      <SettingRow icon={HardDrive} label="Model">
        <SelectField value="GPT-4o (Recommended)" />
      </SettingRow>

      <SettingRow
        icon={Search}
        label="AI Search Mode"
        description="Balanced results between accuracy and speed."
      >
        <SelectField value="Balanced (Default)" />
      </SettingRow>
    </SectionCard>
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

function DataStorageSettings() {
  return (
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
  );
}

export function SettingsPage() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 bg-[#090a0d] px-8 pb-4 pt-6">
        <h2 className="text-[34px] font-semibold leading-tight text-white">
          Settings
        </h2>

        <p className="mt-1 text-base text-white/45">
          Application preferences and projector configuration
        </p>
      </header>

      <div className="settings-page-scroll min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-3">
        <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-2">
          <GeneralSettings />
          <ProjectorSettings />
          <AiSettings />
          <DataStorageSettings />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="h-14 min-w-[280px]"
            leftIcon={<RefreshCcw size={20} />}
          >
            Reset to Default
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="h-14 min-w-[280px]"
            leftIcon={<Check size={22} />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
