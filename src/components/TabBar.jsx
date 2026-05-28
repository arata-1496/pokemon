'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: '診断', emoji: '🎂' },
  { href: '/pokedex', label: '図鑑', emoji: '📖' },
];

export default function TabBar() {
  const pathname = usePathname();

  function isActive(href) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/result');
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith('/pokemon');
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center pt-2 pb-1 text-xs font-semibold transition-colors ${
            isActive(href) ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <span className="text-2xl leading-none mb-0.5">{emoji}</span>
          {label}
        </Link>
      ))}
    </nav>
  );
}
