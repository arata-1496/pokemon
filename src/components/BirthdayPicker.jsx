'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollPicker from './ScrollPicker';

const YEARS = Array.from({ length: 2025 - 1940 + 1 }, (_, i) => {
  const y = 1940 + i;
  return { value: y, label: String(y) };
});

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

function calcPokemonId(year, month, day) {
  const yearSuffix = year % 100;
  const dateNum = month * 100 + day;
  const raw = yearSuffix + dateNum;
  const id = raw > 1025 ? raw - 1025 : raw;
  return { id, yearSuffix, dateNum, raw };
}

export default function BirthdayPicker() {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(2);
  const [day, setDay] = useState(13);
  const router = useRouter();

  const handleStart = () => {
    const { id, yearSuffix, dateNum, raw } = calcPokemonId(year, month, day);
    router.push(`/result?id=${id}&ys=${yearSuffix}&dn=${dateNum}&raw=${raw}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 flex flex-col items-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight mb-2">
          ポケモン誕生日診断
        </h1>
        <p className="text-red-100 text-sm">
          生年月日からあなたのポケモンを見つけよう！
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <p className="text-center text-gray-400 text-xs tracking-widest mb-5">生 年 月 日 を 選 択</p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex flex-col items-center gap-1">
            <ScrollPicker items={YEARS} value={year} onChange={setYear} width={100} />
            <span className="text-xs font-semibold text-gray-400">年</span>
          </div>

          <span className="text-gray-200 text-2xl mb-6 select-none">·</span>

          <div className="flex flex-col items-center gap-1">
            <ScrollPicker items={MONTHS} value={month} onChange={setMonth} width={60} />
            <span className="text-xs font-semibold text-gray-400">月</span>
          </div>

          <span className="text-gray-200 text-2xl mb-6 select-none">·</span>

          <div className="flex flex-col items-center gap-1">
            <ScrollPicker items={DAYS} value={day} onChange={setDay} width={60} />
            <span className="text-xs font-semibold text-gray-400">日</span>
          </div>
        </div>

        <p className="text-center text-gray-600 font-bold text-lg mb-5">
          {year}年 {month}月 {day}日
        </p>

        <button
          onClick={handleStart}
          className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all duration-150"
        >
          スタート！
        </button>
      </div>
    </main>
  );
}
