import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  fetchPokemon, fetchSpecies, fetchType, fetchMove, fetchEvolutionChain,
  getJaName, getFlavorText, getIdFromUrl, officialArtwork,
  calcTypeMatchup, addNamesToChain, collectChainIds, getEvoCondition,
  TYPE_COLORS, STAT_NAMES_JA, DAMAGE_CLASS_JA,
} from '@/lib/pokeapi';
import TypeBadge from '@/components/TypeBadge';
import BackButton from '@/components/BackButton';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [pokemon, species] = await Promise.all([
    fetchPokemon(Number(id)),
    fetchSpecies(Number(id)),
  ]);
  const jaName = getJaName(species?.names ?? []) || pokemon?.name || '';
  return { title: `${jaName} - ポケモン図鑑` };
}

export default async function PokemonDetailPage({ params }) {
  const { id } = await params;
  const numId = Number(id);
  if (!numId || numId < 1 || numId > 1025) notFound();

  const [pokemon, species] = await Promise.all([
    fetchPokemon(numId),
    fetchSpecies(numId),
  ]);
  if (!pokemon || !species) notFound();

  const jaName = getJaName(species.names);
  const flavorText = getFlavorText(species.flavor_text_entries);
  const paddedId = String(numId).padStart(4, '0');

  // タイプ相性
  const typeNames = pokemon.types.map((t) => t.type.name);
  const typeDataList = await Promise.all(typeNames.map((t) => fetchType(t)));
  const matchup = calcTypeMatchup(typeDataList.filter(Boolean));

  const weakx4  = Object.entries(matchup).filter(([, v]) => v === 4).map(([k]) => k);
  const weakx2  = Object.entries(matchup).filter(([, v]) => v === 2).map(([k]) => k);
  const resx05  = Object.entries(matchup).filter(([, v]) => v === 0.5).map(([k]) => k);
  const resx025 = Object.entries(matchup).filter(([, v]) => v === 0.25).map(([k]) => k);
  const immune  = Object.entries(matchup).filter(([, v]) => v === 0).map(([k]) => k);

  // 進化チェーン
  const evoData = await fetchEvolutionChain(species.evolution_chain.url);
  let evoTree = null;
  if (evoData) {
    const chainIds = collectChainIds(evoData.chain);
    const chainSpecies = await Promise.all(chainIds.map((cid) => fetchSpecies(cid)));
    const nameMap = Object.fromEntries(
      chainIds.map((cid, i) => [cid, getJaName(chainSpecies[i]?.names ?? [])])
    );
    evoTree = addNamesToChain(evoData.chain, nameMap);
  }

  // わざ（レベルアップ、最大25件）
  const levelUpMoves = pokemon.moves
    .filter((m) => m.version_group_details.some((v) => v.move_learn_method.name === 'level-up'))
    .map((m) => {
      const detail = m.version_group_details.find(
        (v) => v.move_learn_method.name === 'level-up'
      );
      return { url: m.move.url, level: detail?.level_learned_at ?? 0 };
    })
    .sort((a, b) => a.level - b.level)
    .slice(0, 25);

  const moveDetails = await Promise.all(levelUpMoves.map((m) => fetchMove(m.url)));
  const moves = levelUpMoves.map((m, i) => ({
    level: m.level,
    jaName: getJaName(moveDetails[i]?.names ?? []) || moveDetails[i]?.name || '',
    type: moveDetails[i]?.type?.name,
    damageClass: moveDetails[i]?.damage_class?.name,
    power: moveDetails[i]?.power,
    accuracy: moveDetails[i]?.accuracy,
  }));

  const prevId = numId > 1 ? numId - 1 : null;
  const nextId = numId < 1025 ? numId + 1 : null;

  return (
    <main
      className="flex flex-col bg-pokeballs"
      style={{ minHeight: '100dvh' }}
    >
      {/* ナビバー */}
      <div
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        <BackButton />
        <Link
          href="/pokedex"
          className="text-white text-sm font-medium"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
        >
          図鑑一覧
        </Link>
      </div>

      <div
        className="flex-1 px-4 space-y-4"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* ヘッダーカード */}
        <div className="bg-white rounded-3xl shadow-xl p-5 text-center">
          <p className="text-gray-400 font-mono text-sm">No.{paddedId}</p>
          <div
            className="relative mx-auto my-2"
            style={{ width: '100%', maxWidth: 220, aspectRatio: '1' }}
          >
            <Image
              src={officialArtwork(numId)}
              alt={jaName}
              fill
              className="object-contain drop-shadow-xl"
              unoptimized
            />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">{jaName}</h1>
          <div className="flex justify-center gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="md" />
            ))}
          </div>
          {flavorText && (
            <p className="text-gray-500 text-sm mt-3 leading-relaxed text-left">{flavorText}</p>
          )}
        </div>

        {/* 基本情報 */}
        <Section title="基本情報">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoBox label="たかさ" value={`${(pokemon.height / 10).toFixed(1)} m`} />
            <InfoBox label="おもさ" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
          </div>

          <p className="text-xs text-gray-400 mb-2">とくせい</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {pokemon.abilities.map((a) => (
              <span
                key={a.ability.name}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  a.is_hidden
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {a.ability.name}
                {a.is_hidden && <span className="text-xs ml-1 opacity-70">(かくれ)</span>}
              </span>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-2">基本ステータス</p>
          <div className="space-y-2">
            {pokemon.stats.map((s) => {
              const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
              const color =
                s.base_stat < 50 ? '#f87171'
                : s.base_stat < 80 ? '#fb923c'
                : s.base_stat < 110 ? '#4ade80'
                : '#34d399';
              return (
                <div key={s.stat.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16 text-right shrink-0">
                    {STAT_NAMES_JA[s.stat.name] ?? s.stat.name}
                  </span>
                  <span className="text-xs font-bold text-gray-700 w-7 text-right shrink-0">
                    {s.base_stat}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* タイプ相性 */}
        <Section title="タイプ相性">
          {weakx4.length > 0  && <MatchupRow label="×4 弱点" types={weakx4}  color="#dc2626" />}
          {weakx2.length > 0  && <MatchupRow label="×2 弱点" types={weakx2}  color="#f87171" />}
          {resx05.length > 0  && <MatchupRow label="×½ 耐性" types={resx05}  color="#60a5fa" />}
          {resx025.length > 0 && <MatchupRow label="×¼ 耐性" types={resx025} color="#2563eb" />}
          {immune.length > 0  && <MatchupRow label="×0 無効" types={immune}  color="#9ca3af" />}
          {weakx4.length === 0 && weakx2.length === 0 && immune.length === 0 && (
            <p className="text-sm text-gray-400">弱点なし</p>
          )}
        </Section>

        {/* 進化 */}
        {evoTree && (evoTree.evolvesTo.length > 0 || true) && (
          <Section title="進化">
            <div className="overflow-x-auto">
              <EvoChain node={evoTree} currentId={numId} />
            </div>
          </Section>
        )}

        {/* わざ */}
        {moves.length > 0 && (
          <Section title="わざ（レベルアップ）">
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs min-w-[300px]">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-left">
                    <th className="pb-2 pr-2 font-medium w-8">Lv</th>
                    <th className="pb-2 pr-2 font-medium">わざ名</th>
                    <th className="pb-2 pr-2 font-medium">タイプ</th>
                    <th className="pb-2 pr-2 font-medium text-center w-8">分類</th>
                    <th className="pb-2 pr-2 font-medium text-right w-8">威力</th>
                    <th className="pb-2 font-medium text-right w-8">命中</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 pr-2 text-gray-500">{m.level || '—'}</td>
                      <td className="py-1.5 pr-2 font-medium text-gray-800">{m.jaName}</td>
                      <td className="py-1.5 pr-2">
                        {m.type && <TypeBadge type={m.type} size="xs" />}
                      </td>
                      <td className="py-1.5 pr-2 text-center text-gray-500">
                        {DAMAGE_CLASS_JA[m.damageClass] ?? '—'}
                      </td>
                      <td className="py-1.5 pr-2 text-right text-gray-600">{m.power ?? '—'}</td>
                      <td className="py-1.5 text-right text-gray-600">{m.accuracy ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* 前後ナビゲーション */}
        <div className="flex gap-3 pb-2">
          {prevId ? (
            <Link
              href={`/pokemon/${prevId}`}
              className="flex-1 bg-white rounded-2xl py-3 text-center text-gray-600 font-bold shadow text-sm"
            >
              ← No.{String(prevId).padStart(4, '0')}
            </Link>
          ) : <div className="flex-1" />}
          {nextId ? (
            <Link
              href={`/pokemon/${nextId}`}
              className="flex-1 bg-white rounded-2xl py-3 text-center text-gray-600 font-bold shadow text-sm"
            >
              No.{String(nextId).padStart(4, '0')} →
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </main>
  );
}

// ─── 補助コンポーネント ───────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-5">
      <h2 className="text-sm font-black text-gray-600 tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-700">{value}</p>
    </div>
  );
}

function MatchupRow({ label, types, color }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <span className="text-xs font-bold w-14 shrink-0 mt-0.5" style={{ color }}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {types.map((t) => (
          <TypeBadge key={t} type={t} size="xs" />
        ))}
      </div>
    </div>
  );
}

// 進化チェーン（再帰コンポーネント）
function EvoChain({ node, currentId }) {
  const isCurrent = node.id === currentId;
  const condition = node.details?.[0] ? getEvoCondition(node.details[0]) : null;

  return (
    <div className="flex flex-col items-center">
      {/* 進化条件 */}
      {condition && (
        <div className="flex flex-col items-center my-1">
          <span className="text-gray-300 text-base">↓</span>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {condition}
          </span>
        </div>
      )}

      {/* Pokemon */}
      <Link href={`/pokemon/${node.id}`}>
        <div
          className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-colors ${
            isCurrent ? 'bg-red-50 ring-2 ring-red-300' : 'hover:bg-gray-50'
          }`}
        >
          <div className="relative w-16 h-16">
            <Image
              src={officialArtwork(node.id)}
              alt={node.jaName || node.name}
              fill
              className="object-contain drop-shadow"
              unoptimized
            />
          </div>
          <p className="text-xs font-bold text-gray-700 mt-1">
            {node.jaName || node.name}
          </p>
        </div>
      </Link>

      {/* 分岐進化 */}
      {node.evolvesTo.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {node.evolvesTo.map((child) => (
            <EvoChain key={child.id} node={child} currentId={currentId} />
          ))}
        </div>
      )}
    </div>
  );
}
