'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({ label = '← 戻る', className = '' }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`bg-white/90 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm ${className}`}
    >
      {label}
    </button>
  );
}
