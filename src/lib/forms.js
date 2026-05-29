// Mega Evolution data shared between the search page and the detail page's
// evolution chain. Each entry maps a base Pokémon (baseId) to its Mega form's
// official-artwork sprite id and Japanese name.
//
// List: Gen 6 originals + Pokémon Legends Z-A new megas.

export const MEGA_RAW = [
  // ── Gen 6 megas ──
  { baseId: 3,   spriteId: 10033, jaName: 'メガフシギバナ' },
  { baseId: 6,   spriteId: 10034, jaName: 'メガリザードンX' },
  { baseId: 6,   spriteId: 10035, jaName: 'メガリザードンY' },
  { baseId: 9,   spriteId: 10036, jaName: 'メガカメックス' },
  { baseId: 15,  spriteId: 10090, jaName: 'メガスピアー' },
  { baseId: 18,  spriteId: 10073, jaName: 'メガピジョット' },
  { baseId: 65,  spriteId: 10037, jaName: 'メガフーディン' },
  { baseId: 80,  spriteId: 10071, jaName: 'メガヤドラン' },
  { baseId: 94,  spriteId: 10038, jaName: 'メガゲンガー' },
  { baseId: 115, spriteId: 10039, jaName: 'メガガルーラ' },
  { baseId: 127, spriteId: 10040, jaName: 'メガカイロス' },
  { baseId: 130, spriteId: 10041, jaName: 'メガギャラドス' },
  { baseId: 142, spriteId: 10042, jaName: 'メガプテラ' },
  { baseId: 150, spriteId: 10043, jaName: 'メガミュウツーX' },
  { baseId: 150, spriteId: 10044, jaName: 'メガミュウツーY' },
  { baseId: 181, spriteId: 10045, jaName: 'メガデンリュウ' },
  { baseId: 208, spriteId: 10072, jaName: 'メガハガネール' },
  { baseId: 212, spriteId: 10046, jaName: 'メガハッサム' },
  { baseId: 214, spriteId: 10047, jaName: 'メガヘラクロス' },
  { baseId: 229, spriteId: 10048, jaName: 'メガヘルガー' },
  { baseId: 248, spriteId: 10049, jaName: 'メガバンギラス' },
  { baseId: 254, spriteId: 10065, jaName: 'メガジュカイン' },
  { baseId: 257, spriteId: 10050, jaName: 'メガバシャーモ' },
  { baseId: 260, spriteId: 10064, jaName: 'メガラグラージ' },
  { baseId: 282, spriteId: 10051, jaName: 'メガサーナイト' },
  { baseId: 302, spriteId: 10066, jaName: 'メガヤミラミ' },
  { baseId: 303, spriteId: 10052, jaName: 'メガクチート' },
  { baseId: 306, spriteId: 10053, jaName: 'メガボスゴドラ' },
  { baseId: 308, spriteId: 10054, jaName: 'メガチャーレム' },
  { baseId: 310, spriteId: 10055, jaName: 'メガライボルト' },
  { baseId: 319, spriteId: 10070, jaName: 'メガサメハダー' },
  { baseId: 323, spriteId: 10087, jaName: 'メガバクーダ' },
  { baseId: 334, spriteId: 10067, jaName: 'メガチルタリス' },
  { baseId: 354, spriteId: 10056, jaName: 'メガジュペッタ' },
  { baseId: 359, spriteId: 10057, jaName: 'メガアブソル' },
  { baseId: 362, spriteId: 10074, jaName: 'メガオニゴーリ' },
  { baseId: 373, spriteId: 10089, jaName: 'メガボーマンダ' },
  { baseId: 376, spriteId: 10076, jaName: 'メガメタグロス' },
  { baseId: 380, spriteId: 10062, jaName: 'メガラティアス' },
  { baseId: 381, spriteId: 10063, jaName: 'メガラティオス' },
  { baseId: 384, spriteId: 10079, jaName: 'メガレックウザ' },
  { baseId: 428, spriteId: 10088, jaName: 'メガミミロップ' },
  { baseId: 445, spriteId: 10058, jaName: 'メガガブリアス' },
  { baseId: 448, spriteId: 10059, jaName: 'メガルカリオ' },
  { baseId: 460, spriteId: 10060, jaName: 'メガユキノオー' },
  { baseId: 475, spriteId: 10068, jaName: 'メガエルレイド' },
  { baseId: 531, spriteId: 10069, jaName: 'メガタブンネ' },
  { baseId: 719, spriteId: 10075, jaName: 'メガディアンシー' },
  // ── Legends Z-A new megas ──
  { baseId: 26,  spriteId: 10304, jaName: 'メガライチュウX' },
  { baseId: 26,  spriteId: 10305, jaName: 'メガライチュウY' },
  { baseId: 36,  spriteId: 10278, jaName: 'メガピクシー' },
  { baseId: 71,  spriteId: 10279, jaName: 'メガウツボット' },
  { baseId: 121, spriteId: 10280, jaName: 'メガスターミー' },
  { baseId: 149, spriteId: 10281, jaName: 'メガカイリュー' },
  { baseId: 154, spriteId: 10282, jaName: 'メガメガニウム' },
  { baseId: 160, spriteId: 10283, jaName: 'メガオーダイル' },
  { baseId: 227, spriteId: 10284, jaName: 'メガエアームド' },
  { baseId: 358, spriteId: 10306, jaName: 'メガチリーン' },
  { baseId: 398, spriteId: 10308, jaName: 'メガムクホーク' },
  { baseId: 478, spriteId: 10285, jaName: 'メガユキメノコ' },
  { baseId: 485, spriteId: 10311, jaName: 'メガヒードラン' },
  { baseId: 491, spriteId: 10312, jaName: 'メガダークライ' },
  { baseId: 500, spriteId: 10286, jaName: 'メガエンブオー' },
  { baseId: 530, spriteId: 10287, jaName: 'メガドリュウズ' },
  { baseId: 545, spriteId: 10288, jaName: 'メガペンドラー' },
  { baseId: 560, spriteId: 10289, jaName: 'メガズルズキン' },
  { baseId: 604, spriteId: 10290, jaName: 'メガシビルドン' },
  { baseId: 609, spriteId: 10291, jaName: 'メガシャンデラ' },
  { baseId: 623, spriteId: 10313, jaName: 'メガゴルーグ' },
  { baseId: 652, spriteId: 10292, jaName: 'メガブリガロン' },
  { baseId: 655, spriteId: 10293, jaName: 'メガマフォクシー' },
  { baseId: 658, spriteId: 10294, jaName: 'メガゲッコウガ' },
  { baseId: 668, spriteId: 10295, jaName: 'メガカエンジシ' },
  { baseId: 670, spriteId: 10296, jaName: 'メガフラエッテ' },
  { baseId: 678, spriteId: 10314, jaName: 'メガニャオニクス' },
  { baseId: 687, spriteId: 10297, jaName: 'メガカラマネロ' },
  { baseId: 689, spriteId: 10298, jaName: 'メガガメノデス' },
  { baseId: 691, spriteId: 10299, jaName: 'メガドラミドロ' },
  { baseId: 701, spriteId: 10300, jaName: 'メガルチャブル' },
  { baseId: 718, spriteId: 10301, jaName: 'メガジガルデ' },
  { baseId: 740, spriteId: 10315, jaName: 'メガケケンカニ' },
  { baseId: 768, spriteId: 10316, jaName: 'メガグソクムシャ' },
  { baseId: 780, spriteId: 10302, jaName: 'メガジジーロン' },
  { baseId: 801, spriteId: 10317, jaName: 'メガマギアナ' },
  { baseId: 807, spriteId: 10319, jaName: 'メガゼラオラ' },
  { baseId: 870, spriteId: 10303, jaName: 'メガタイレーツ' },
  { baseId: 949, spriteId: 10320, jaName: 'メガカプサイジ' },
  { baseId: 970, spriteId: 10321, jaName: 'メガグリムクロー' },
  { baseId: 978, spriteId: 10324, jaName: 'メガシャリタツ' },
  { baseId: 998, spriteId: 10325, jaName: 'メガバリコオル' },
];

// baseId → [{ spriteId, jaName }, ...]
const megasByBase = (() => {
  const m = new Map();
  for (const x of MEGA_RAW) {
    if (!m.has(x.baseId)) m.set(x.baseId, []);
    m.get(x.baseId).push(x);
  }
  return m;
})();

export function getMegasForBase(id) {
  return megasByBase.get(id) ?? [];
}
