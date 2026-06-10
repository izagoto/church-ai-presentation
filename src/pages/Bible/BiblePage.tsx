export function BiblePage() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="shrink-0 border-b border-white/10 bg-[#090a0d] px-8 py-6">
        <h2 className="text-[30px] font-semibold leading-tight text-white">
          Bible
        </h2>
        <p className="mt-1 text-sm text-white/45">
          AI Bible search and topic explorer
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-8 py-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-white/70">
            Belum ada hasil ayat. Cari ayat berdasarkan referensi atau topik
            menggunakan AI.
          </p>
        </div>
      </div>
    </div>
  );
}
