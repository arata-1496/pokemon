'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({ label = '← 戻る', className = '' }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`text-white text-sm font-medium ${className}`}
      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
    >
      {label}
    </button>
  );
}
