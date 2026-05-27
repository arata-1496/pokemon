'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ResultDisplay({ sprite, name, jaName, id, ys, dn, raw }) {
  const paddedId = String(id).padStart(4, '0');

  const handleSave = async () => {
    const W = 600;
    const H = 660;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#fff1f1');
    grad.addColorStop(0.4, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Pokemon image
    if (sprite) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = sprite;
      });
      const size = 310;
      ctx.drawImage(img, (W - size) / 2, 75, size, size);
    }

    // No.
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`No.${paddedId}`, W / 2, 52);

    // Pokemon name（長い名前は自動縮小）
    ctx.fillStyle = '#111827';
    let fontSize = 62;
    ctx.font = `bold ${fontSize}px sans-serif`;
    while (ctx.measureText(jaName).width > W - 60 && fontSize > 24) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px sans-serif`;
    }
    ctx.fillText(jaName, W / 2, 460);

    // Watermark
    ctx.fillStyle = '#d1d5db';
    ctx.font = '15px sans-serif';
    ctx.fillText('ポケモン誕生日診断', W / 2, 625);

    const link = document.createElement('a');
    link.download = `pokemon-${paddedId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main
      className="flex flex-col bg-gradient-to-b from-red-500 to-red-700"
      style={{ minHeight: '100dvh' }}
    >
      {/* トップバー：ノッチ余白 + 戻るリンク + 計算式 */}
      <div
        className="px-5 pb-3"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/80 text-sm font-medium mb-3"
        >
          ← 戻る
        </Link>
        <p className="text-red-200 text-xs font-mono text-center">
          {ys} + {dn} = {raw}
          {raw > 1025 && ` → ${raw} − 1025 = ${id}`}
        </p>
      </div>

      {/* 結果カード：残りの高さを埋めて縦中央に */}
      <div className="flex-1 flex items-center px-5 py-2">
        <div className="w-full bg-white rounded-3xl shadow-xl p-6 text-center">
          {/* No. */}
          <p className="text-gray-400 font-mono font-bold text-base mb-3">
            No.{paddedId}
          </p>

          {/* ポケモン画像：カード幅いっぱいに大きく */}
          {sprite && (
            <div className="relative w-full aspect-square mx-auto mb-4" style={{ maxWidth: 300 }}>
              <Image
                src={sprite}
                alt={jaName}
                fill
                className="object-contain drop-shadow-2xl"
                unoptimized
              />
            </div>
          )}

          {/* 日本語名 */}
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">{jaName}</h1>
        </div>
      </div>

      {/* 保存ボタン：ホームバー余白 */}
      <div
        className="px-5 pt-4"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSave}
          className="w-full bg-white text-gray-800 font-bold text-lg py-5 rounded-2xl shadow-lg active:scale-95 transition-transform duration-100"
        >
          画像を保存する
        </button>
      </div>
    </main>
  );
}
