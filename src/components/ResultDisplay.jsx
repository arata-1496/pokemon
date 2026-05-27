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
    grad.addColorStop(0.35, '#ffffff');
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
      const size = 300;
      ctx.drawImage(img, (W - size) / 2, 80, size, size);
    }

    // No.
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`No.${paddedId}`, W / 2, 55);

    // Pokemon name (auto-shrink for long names)
    ctx.fillStyle = '#111827';
    let fontSize = 60;
    ctx.font = `bold ${fontSize}px sans-serif`;
    while (ctx.measureText(jaName).width > W - 60 && fontSize > 24) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px sans-serif`;
    }
    ctx.fillText(jaName, W / 2, 460);

    // Watermark
    ctx.fillStyle = '#d1d5db';
    ctx.font = '15px sans-serif';
    ctx.fillText('ポケモン誕生日診断', W / 2, 620);

    // Download
    const link = document.createElement('a');
    link.download = `pokemon-${paddedId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-sm mb-4">
        <Link
          href="/"
          className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1"
        >
          ← 戻る
        </Link>
      </div>

      <p className="text-red-200 text-xs font-mono mb-4">
        {ys} + {dn} = {raw}
        {raw > 1025 && ` → ${raw} − 1025 = ${id}`}
      </p>

      {/* Result card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        {/* No. */}
        <p className="text-gray-400 font-mono font-bold text-lg mb-4">
          No.{paddedId}
        </p>

        {/* Pokemon image */}
        {sprite && (
          <div className="relative w-56 h-56 mx-auto mb-6">
            <Image
              src={sprite}
              alt={jaName}
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>
        )}

        {/* Japanese name */}
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">{jaName}</h1>
      </div>

      {/* Save button — outside the card, not included in canvas */}
      <button
        onClick={handleSave}
        className="mt-5 w-full max-w-sm bg-white hover:bg-gray-50 active:scale-95 text-gray-800 font-bold text-lg py-4 rounded-2xl shadow-lg transition-all duration-150"
      >
        画像を保存する
      </button>
    </main>
  );
}
