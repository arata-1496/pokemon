export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-12 text-center shadow-2xl w-full max-w-sm">
        <div className="w-14 h-14 border-4 border-red-100 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">ポケモンを探しています...</p>
      </div>
    </main>
  );
}
