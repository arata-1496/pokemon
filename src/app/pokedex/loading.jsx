export default function Loading() {
  return (
    <main
      className="flex flex-col bg-pokeballs"
      style={{ minHeight: '100dvh' }}
    >
      <div
        className="px-5 pb-3"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        <div className="h-5 w-12 bg-white/40 rounded animate-pulse" />
        <div className="h-8 w-32 bg-white/40 rounded animate-pulse mx-auto mt-2" />
      </div>
      <div className="px-4 pb-3">
        <div className="h-12 bg-white/70 rounded-2xl animate-pulse" />
      </div>
      <div className="px-4 grid grid-cols-3 gap-3">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="bg-white/70 rounded-2xl aspect-square animate-pulse" />
        ))}
      </div>
    </main>
  );
}
