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
        <div className="h-8 w-40 bg-white/40 rounded animate-pulse mx-auto" />
      </div>
      <div className="flex-1 px-3" style={{ paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))' }}>
        <div className="flex justify-center mb-3">
          <div className="h-10 w-48 bg-white/70 rounded-xl animate-pulse" />
        </div>
        <div className="bg-white/70 rounded-2xl animate-pulse" style={{ height: '320px' }} />
        <div className="flex justify-center gap-4 mt-3">
          <div className="h-5 w-12 bg-white/40 rounded animate-pulse" />
          <div className="h-5 w-12 bg-white/40 rounded animate-pulse" />
          <div className="h-5 w-12 bg-white/40 rounded animate-pulse" />
          <div className="h-5 w-12 bg-white/40 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}
