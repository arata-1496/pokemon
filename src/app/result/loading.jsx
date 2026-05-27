export default function Loading() {
  return (
    <main
      className="flex flex-col items-center justify-center bg-pokeballs"
      style={{ minHeight: '100dvh' }}
    >
      <div className="bg-white rounded-3xl p-12 text-center shadow-2xl mx-5 w-full max-w-sm">
        <div className="w-14 h-14 border-4 border-red-100 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">ポケモンを探しています...</p>
      </div>
    </main>
  );
}
