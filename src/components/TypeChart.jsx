'use client';
import { useState } from 'react';
import { getChartForEra, ERA_OPTIONS, TYPE_SHORT_JA } from '@/lib/typedata';

function cellStyle(v) {
  if (v === 2)   return 'bg-green-400 text-white';
  if (v === 0.5) return 'bg-orange-300 text-white';
  if (v === 0)   return 'bg-gray-600 text-white';
  return 'bg-white text-gray-200';
}

function cellText(v) {
  if (v === 2)   return '2';
  if (v === 0.5) return '½';
  if (v === 0)   return '×';
  return '';
}

export default function TypeChart({ typeNamesJa }) {
  const [era, setEra] = useState('gen6');
  const { chart, types } = getChartForEra(era);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center">
        <select
          value={era}
          onChange={(e) => setEra(e.target.value)}
          className="bg-white rounded-xl px-3 py-2 text-sm shadow text-gray-700 outline-none"
        >
          {ERA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white/90 rounded-2xl shadow p-2 overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="min-w-[3.5rem] sticky left-0 z-20 bg-white/90 text-[9px] text-gray-400 font-bold text-right pr-1 pb-1">
                攻↓守→
              </th>
              {types.map((def) => (
                <th key={def} className="w-7 text-center text-[9px] text-gray-500 font-bold pb-1">
                  {TYPE_SHORT_JA[def]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((atk) => (
              <tr key={atk}>
                <td className="min-w-[3.5rem] bg-white/90 text-[10px] text-gray-600 font-bold pr-1 text-right sticky left-0 z-10">
                  {typeNamesJa[atk] ?? atk}
                </td>
                {types.map((def) => {
                  const v = chart[atk][def];
                  return (
                    <td key={def} className="p-0">
                      <div
                        className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold border border-gray-100 ${cellStyle(v)}`}
                      >
                        {cellText(v)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-green-400 flex items-center justify-center text-[10px] font-bold text-white">2</div>
          <span className="text-xs text-white/90">2倍</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-orange-300 flex items-center justify-center text-[10px] font-bold text-white">½</div>
          <span className="text-xs text-white/90">½倍</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-gray-600 flex items-center justify-center text-[10px] font-bold text-white">×</div>
          <span className="text-xs text-white/90">無効</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-white border border-gray-200"></div>
          <span className="text-xs text-white/90">等倍</span>
        </div>
      </div>
    </div>
  );
}
