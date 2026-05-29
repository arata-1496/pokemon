'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Search, BookOpen, Table2 } from 'lucide-react';

const TABS = [
  { href: '/',       label: '診断',   Icon: Sparkles },
  { href: '/search', label: '検索',   Icon: Search   },
  { href: '/pokedex',label: '図鑑',   Icon: BookOpen  },
  { href: '/types',  label: 'タイプ表', Icon: Table2   },
];

export default function TabBar() {
  const pathname = usePathname();

  function isActive(href) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/result');
    if (href === '/search') return pathname.startsWith('/search');
    if (href === '/pokedex') return pathname === '/pokedex' || pathname.startsWith('/pokemon');
    if (href === '/types') return pathname.startsWith('/types');
    return false;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-1px_12px_rgba(0,0,0,0.08)] flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 transition-colors"
          >
            <span
              className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${
                active ? 'bg-red-50' : ''
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={`transition-colors ${active ? 'text-red-500' : 'text-gray-400'}`}
              />
            </span>
            <span
              className={`text-[11px] font-semibold tracking-wide transition-colors ${
                active ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
