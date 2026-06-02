import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  fetchPokemon, fetchSpecies, fetchType, fetchMove, fetchEvolutionChain, fetchAbility,
  getJaName, getJaAbilityEffect, getFlavorText, getIdFromUrl, officialArtwork,
  calcTypeMatchup, addNamesToChain, collectChainIds, collectEvoItemUrls, collectEvoMoveUrls, getEvoCondition,
  STAT_NAMES_JA, DAMAGE_CLASS_JA,
} from '@/lib/pokeapi';
import TypeBadge from '@/components/TypeBadge';
import BackButton from '@/components/BackButton';
import PokemonImage from '@/components/PokemonImage';
import AbilityChip from '@/components/AbilityChip';
import { getMegasForBase, getFormInfo } from '@/lib/forms';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const numId = Number(id);
  const formInfo = getFormInfo(numId);
  if (formInfo) return { title: `${formInfo.jaName} - ポケモン図鑑` };
  const [pokemon, species] = await Promise.all([fetchPokemon(numId), fetchSpecies(numId)]);
  const jaName = getJaName(species?.names ?? []) || pokemon?.name || '';
  return { title: `${jaName} - ポケモン図鑑` };
}

export default async function PokemonDetailPage({ params }) {
  const { id } = await params;
  const numId = Number(id);

  const formInfo = getFormInfo(numId);
  const isForm   = !!formInfo;
  const baseId   = isForm ? formInfo.baseId : numId;

  if (!isForm && (!numId || numId < 1 || numId > 1025)) notFound();

  const [pokemon, species] = await Promise.all([
    fetchPokemon(numId),
    fetchSpecies(baseId),
  ]);
  if (!pokemon || !species) notFound();

  const jaName     = isForm ? formInfo.jaName : getJaName(species.names);
  const flavorText = getFlavorText(species.flavor_text_entries);
  const paddedId   = String(baseId).padStart(4, '0');
  const prevId     = !isForm && baseId > 1    ? baseId - 1 : null;
  const nextId     = !isForm && baseId < 1025 ? baseId + 1 : null;
  const typeNames  = pokemon.types.map((t) => t.type.name);

  const formBadgeLabel = isForm
    ? formInfo.category === 'mega'   ? 'MEGA'
    : formInfo.category === 'gmax'   ? 'キョダイマックス'
    : formInfo.category === 'region' ? 'リージョンフォーム'
    : '別のすがた'
    : null;

  const formBadgeColor = isForm
    ? formInfo.category === 'mega'   ? 'bg-amber-400 text-white'
    : formInfo.category === 'gmax'   ? 'bg-indigo-500 text-white'
    : formInfo.category === 'region' ? 'bg-teal-500 text-white'
    : 'bg-violet-500 text-white'
    : null;

  return (
    <main className="flex flex-col bg-pokeballs" style={{ minHeight: '100dvh' }}>
      <div
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        <BackButton />
        <Link
          href="/pokedex"
          className="bg-white/90 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm"
        >
          図鑑一覧
        </Link>
      </div>

      <div
        className="flex-1 px-4 space-y-4"
        style={{ paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))' }}
      >
        {/* ヘッダーカード */}
        <div className="bg-white rounded-3xl shadow-xl p-5 text-center">
          <p className="text-gray-400 font-mono text-sm">No.{paddedId}</p>
          {isForm && (
            <div className="flex justify-center mt-1 mb-0.5">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${formBadgeColor}`}>
                {formBadgeLabel}
              </span>
            </div>
          )}
          <div className="my-2">
            <PokemonImage id={numId} alt={jaName} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">{jaName}</h1>
          <div className="flex justify-center gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="md" />
            ))}
          </div>
          {isForm && (
            <Link
              href={`/pokemon/${baseId}`}
              className="inline-block mt-3 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              ← ベースフォルムへ
            </Link>
          )}
          {!isForm && flavorText && (
            <p className="text-gray-500 text-sm mt-3 leading-relaxed text-left">{flavorText}</p>
          )}
        </div>

        {/* 基本情報・とくせい */}
        <Suspense fallback={<SectionSkeleton height="h-52" />}>
          <StatsSection pokemon={pokemon} />
        </Suspense>

        {/* タイプ相性 */}
        <Suspense fallback={<SectionSkeleton height="h-36" />}>
          <TypeMatchupSection typeNames={typeNames} />
        </Suspense>

        {/* 進化 */}
        <Suspense fallback={<SectionSkeleton height="h-36" />}>
          <EvoSection chainUrl={species.evolution_chain.url} currentId={baseId} />
        </Suspense>

        {/* わざ（ベースフォルムのみ表示） */}
        {!isForm && (
          <Suspense fallback={<SectionSkeleton height="h-44" />}>
            <MovesSection moves={pokemon.moves} />
          </Suspense>
        )}

        {/* 前後ナビゲーション */}
        {!isForm && (
          <div className="flex gap-3 pb-2">
            {prevId ? (
              <Link href={`/pokemon/${prevId}`} className="flex-1 bg-white rounded-2xl py-3 text-center text-gray-600 font-bold shadow text-sm">
                ← No.{String(prevId).padStart(4, '0')}
              </Link>
            ) : <div className="flex-1" />}
            {nextId ? (
              <Link href={`/pokemon/${nextId}`} className="flex-1 bg-white rounded-2xl py-3 text-center text-gray-600 font-bold shadow text-sm">
                No.{String(nextId).padStart(4, '0')} →
              </Link>
            ) : <div className="flex-1" />}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── スケルトン ──────────────────────────────────────────────

function SectionSkeleton({ height = 'h-36' }) {
  return <div className={`bg-white/70 rounded-3xl ${height} animate-pulse`} />;
}

// ─── 共通レイアウト ──────────────────────────────────────────

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
      <span className="text-xs font-bold w-14 shrink-0 mt-0.5" style={{ color }}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {types.map((t) => <TypeBadge key={t} type={t} size="xs" />)}
      </div>
    </div>
  );
}

// ─── 非同期セクション ────────────────────────────────────────

async function StatsSection({ pokemon }) {
  const abilityData = await Promise.all(
    pokemon.abilities.map((a) => fetchAbility(a.ability.name))
  );
  const abilities = pokemon.abilities.map((a, i) => ({
    name:     a.ability.name,
    isHidden: a.is_hidden,
    jaName:   getJaName(abilityData[i]?.names ?? []) || a.ability.name,
    jaEffect: getJaAbilityEffect(abilityData[i]),
  }));

  return (
    <Section title="基本情報">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <InfoBox label="たかさ" value={`${(pokemon.height / 10).toFixed(1)} m`} />
        <InfoBox label="おもさ" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
      </div>

      <p className="text-xs text-gray-400 mb-2">とくせい <span className="font-normal opacity-60">（タップで効果を表示）</span></p>
      <div className="flex flex-wrap gap-2 mb-4">
        {abilities.map((a) => (
          <AbilityChip
            key={a.name}
            jaName={a.jaName}
            jaEffect={a.jaEffect}
            isHidden={a.isHidden}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-2">基本ステータス</p>
      <div className="space-y-2">
        {pokemon.stats.map((s) => {
          const pct   = Math.min(100, Math.round((s.base_stat / 255) * 100));
          const color = s.base_stat < 50 ? '#f87171' : s.base_stat < 80 ? '#fb923c' : s.base_stat < 110 ? '#4ade80' : '#34d399';
          return (
            <div key={s.stat.name} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-16 text-right shrink-0">
                {STAT_NAMES_JA[s.stat.name] ?? s.stat.name}
              </span>
              <span className="text-xs font-bold text-gray-700 w-7 text-right shrink-0">{s.base_stat}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

async function TypeMatchupSection({ typeNames }) {
  const typeDataList = await Promise.all(typeNames.map((t) => fetchType(t)));
  const matchup = calcTypeMatchup(typeDataList.filter(Boolean));

  const weakx4  = Object.entries(matchup).filter(([, v]) => v === 4).map(([k]) => k);
  const weakx2  = Object.entries(matchup).filter(([, v]) => v === 2).map(([k]) => k);
  const resx05  = Object.entries(matchup).filter(([, v]) => v === 0.5).map(([k]) => k);
  const resx025 = Object.entries(matchup).filter(([, v]) => v === 0.25).map(([k]) => k);
  const immune  = Object.entries(matchup).filter(([, v]) => v === 0).map(([k]) => k);

  return (
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
  );
}

async function EvoSection({ chainUrl, currentId }) {
  const evoData = await fetchEvolutionChain(chainUrl);
  if (!evoData) return null;

  const chainIds     = collectChainIds(evoData.chain);
  const chainSpecies = await Promise.all(chainIds.map((cid) => fetchSpecies(cid)));
  const nameMap = Object.fromEntries(
    chainIds.map((cid, i) => [cid, getJaName(chainSpecies[i]?.names ?? [])])
  );
  const evoTree = addNamesToChain(evoData.chain, nameMap);

  let itemNameMap = {};
  const evoItemUrls = collectEvoItemUrls(evoData.chain);
  if (evoItemUrls.size > 0) {
    const entries  = [...evoItemUrls.entries()];
    const itemData = await Promise.all(entries.map(([, url]) => fetchMove(url)));
    itemNameMap = Object.fromEntries(
      entries.map(([name], i) => [name, getJaName(itemData[i]?.names ?? []) || name])
    );
  }

  let moveNameMap = {};
  const evoMoveUrls = collectEvoMoveUrls(evoData.chain);
  if (evoMoveUrls.size > 0) {
    const moveData = await Promise.all([...evoMoveUrls.values()].map(fetchMove));
    moveNameMap = Object.fromEntries(
      [...evoMoveUrls.keys()].map((n, i) => [n, getJaName(moveData[i]?.names ?? []) || n])
    );
  }

  return (
    <Section title="進化">
      <div className="overflow-x-auto py-1 px-1">
        <EvoChain node={evoTree} currentId={currentId} itemNameMap={itemNameMap} moveNameMap={moveNameMap} />
      </div>
    </Section>
  );
}

async function MovesSection({ moves }) {
  const levelUpMoves = moves
    .filter((m) => m.version_group_details.some((v) => v.move_learn_method.name === 'level-up'))
    .map((m) => {
      const detail = m.version_group_details.find((v) => v.move_learn_method.name === 'level-up');
      return { url: m.move.url, level: detail?.level_learned_at ?? 0 };
    })
    .sort((a, b) => a.level - b.level)
    .slice(0, 25);

  if (levelUpMoves.length === 0) return null;

  const moveDetails = await Promise.all(levelUpMoves.map((m) => fetchMove(m.url)));
  const movesData = levelUpMoves.map((m, i) => ({
    level:       m.level,
    jaName:      getJaName(moveDetails[i]?.names ?? []) || moveDetails[i]?.name || '',
    type:        moveDetails[i]?.type?.name,
    damageClass: moveDetails[i]?.damage_class?.name,
    power:       moveDetails[i]?.power,
    accuracy:    moveDetails[i]?.accuracy,
  }));

  return (
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
            {movesData.map((m, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-1.5 pr-2 text-gray-500">{m.level || '—'}</td>
                <td className="py-1.5 pr-2 font-medium text-gray-800">{m.jaName}</td>
                <td className="py-1.5 pr-2">{m.type && <TypeBadge type={m.type} size="xs" />}</td>
                <td className="py-1.5 pr-2 text-center text-gray-500">{DAMAGE_CLASS_JA[m.damageClass] ?? '—'}</td>
                <td className="py-1.5 pr-2 text-right text-gray-600">{m.power ?? '—'}</td>
                <td className="py-1.5 text-right text-gray-600">{m.accuracy ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── 進化チェーン（再帰コンポーネント）────────────────────────

function EvoChain({ node, currentId, itemNameMap, moveNameMap }) {
  const isCurrent = node.id === currentId;
  const condition = node.details?.[0] ? getEvoCondition(node.details[0], itemNameMap, moveNameMap) : null;
  const megas = getMegasForBase(node.id);

  return (
    <div className="flex flex-col items-center">
      {condition && (
        <div className="flex flex-col items-center my-1">
          <span className="text-gray-300 text-base">↓</span>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{condition}</span>
        </div>
      )}
      <Link href={`/pokemon/${node.id}`}>
        <div className={`flex flex-col items-center px-1 py-1 rounded-2xl transition-colors ${isCurrent ? 'bg-red-50 ring-2 ring-red-300' : 'hover:bg-gray-50'}`}>
          <div className="w-24 h-24 flex items-center justify-center overflow-visible">
            <Image src={officialArtwork(node.id)} alt={node.jaName || node.name} width={96} height={96} className="drop-shadow object-contain" unoptimized />
          </div>
          <p className="text-xs font-bold text-gray-700 mt-1">{node.jaName || node.name}</p>
        </div>
      </Link>
      {node.evolvesTo.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {node.evolvesTo.map((child) => (
            <EvoChain key={child.id} node={child} currentId={currentId} itemNameMap={itemNameMap} moveNameMap={moveNameMap} />
          ))}
        </div>
      )}
      {megas.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {megas.map((m) => (
            <MegaNode key={m.spriteId} spriteId={m.spriteId} jaName={m.jaName} />
          ))}
        </div>
      )}
    </div>
  );
}

function MegaNode({ spriteId, jaName }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center my-1">
        <span className="text-amber-300 text-base">↓</span>
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">メガシンカ</span>
      </div>
      <Link href={`/pokemon/${spriteId}`}>
        <div className="flex flex-col items-center px-1 py-1 rounded-2xl bg-amber-50/60 hover:bg-amber-100 transition-colors">
          <div className="w-24 h-24 flex items-center justify-center overflow-visible">
            <Image src={officialArtwork(spriteId)} alt={jaName} width={96} height={96} className="drop-shadow object-contain" unoptimized />
          </div>
          <p className="text-xs font-bold text-amber-700 mt-1">{jaName}</p>
        </div>
      </Link>
    </div>
  );
}
