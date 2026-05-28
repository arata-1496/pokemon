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
      </div>
      <div className="flex-1 px-4 space-y-4 pb-6">
        <div className="bg-white/70 rounded-3xl h-72 animate-pulse" />
        <div className="bg-white/70 rounded-3xl h-52 animate-pulse" />
        <div className="bg-white/70 rounded-3xl h-36 animate-pulse" />
        <div className="bg-white/70 rounded-3xl h-44 animate-pulse" />
      </div>
    </main>
  );
}
