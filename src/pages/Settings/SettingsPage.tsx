export function SettingsPage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-white">Settings</h2>
      <p className="mt-2 text-white/50">
        Application preferences and projector configuration
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-medium text-white">General</h3>
          <p className="mt-2 text-sm text-white/50">
            Language, theme, and default font size.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-medium text-white">AI</h3>
          <p className="mt-2 text-sm text-white/50">
            OpenAI API key and AI search settings.
          </p>
        </div>
      </div>
    </div>
  );
}
