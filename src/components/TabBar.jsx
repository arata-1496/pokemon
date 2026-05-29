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
      className="fixed left-0 right-0 bottom-0 z-50 flex items-stretch px-3 pt-2
                 rounded-t-[2.5rem] bg-white/50 backdrop-blur-2xl
                 border-t border-x border-white/60
                 shadow-[0_-8px_32px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 mx-0.5 rounded-3xl py-2.5 transition-all duration-200 active:scale-90 ${
              active
                ? 'bg-red-500 shadow-[0_4px_14px_rgba(239,68,68,0.45)]'
                : ''
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.9}
              className={`transition-colors ${active ? 'text-white' : 'text-gray-500'}`}
            />
            <span
              className={`text-[10px] font-bold tracking-wide transition-colors ${
                active ? 'text-white' : 'text-gray-500'
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
