'use client';
import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Check } from 'lucide-react';
import { officialArtwork } from '@/lib/pokeapi';
import GlassSelect from '@/components/GlassSelect';

const PAGE_SIZE = 60;

// ─── game dex whitelists (from PokeAPI data mirror) ───────────────────────────

const LGPE_SET = new Set([
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,
  29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,
  54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,
  79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,
  103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,
  122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,
  141,142,143,144,145,146,147,148,149,150,151,808,809,
]);

const HISUI_SET = new Set([
  25,26,35,36,37,38,41,42,46,47,54,55,58,59,63,64,65,66,67,68,72,73,74,75,76,
  77,78,81,82,92,93,94,95,100,101,108,111,112,113,114,122,123,125,126,129,130,
  133,134,135,136,137,143,155,156,157,169,172,173,175,176,185,190,193,196,197,
  198,200,201,207,208,211,212,214,215,216,217,220,221,223,224,226,233,234,239,
  240,242,265,266,267,268,269,280,281,282,299,315,339,340,355,356,358,361,362,
  363,364,365,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,
  403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,
  422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,
  441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,
  460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,
  479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,501,502,503,548,
  549,550,570,571,627,628,641,642,645,700,704,705,706,712,713,722,723,724,899,
  900,901,902,903,904,905,
]);

// Pokémon Legends: Z-A — Lumiose City dex (232 entries)
const ZA_SET = new Set([
  1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,23,24,25,26,35,36,63,64,65,66,67,68,69,
  70,71,79,80,92,93,94,95,115,120,121,123,127,129,130,133,134,135,136,142,147,
  148,149,150,152,153,154,158,159,160,167,168,172,173,179,180,181,196,197,199,
  208,212,214,225,227,228,229,246,247,248,280,281,282,302,303,304,305,306,307,
  308,309,310,315,318,319,322,323,333,334,353,354,359,361,362,371,372,373,374,
  375,376,406,407,427,428,443,444,445,447,448,449,450,459,460,470,471,475,478,
  498,499,500,504,505,511,512,513,514,515,516,529,530,531,543,544,545,551,552,
  553,559,560,568,569,582,583,584,587,602,603,604,607,608,609,618,650,651,652,
  653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,
  672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,
  691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,
  710,711,712,713,714,715,716,717,718,719,780,870,
]);

// ─── regions & games ──────────────────────────────────────────────────────────

const REGIONS = [
  { value: 'all',    label: 'すべて' },
  { value: 'kanto',  label: 'カントー地方', min: 1,   max: 151  },
  { value: 'johto',  label: 'ジョウト地方', min: 152, max: 251  },
  { value: 'hoenn',  label: 'ホウエン地方', min: 252, max: 386  },
  { value: 'sinnoh', label: 'シンオウ地方', min: 387, max: 493  },
  { value: 'unova',  label: 'イッシュ地方', min: 494, max: 649  },
  { value: 'kalos',  label: 'カロス地方',   min: 650, max: 721  },
  { value: 'alola',  label: 'アローラ地方', min: 722, max: 809  },
  { value: 'galar',  label: 'ガラル地方',   min: 810, max: 905  },
  { value: 'paldea', label: 'パルデア地方', min: 906, max: 1025 },
];

const GAMES = [
  { value: 'all',  label: 'すべて' },
  { value: 'rby',  label: '赤・緑・青',                                 min: 1,   max: 151  },
  { value: 'gsc',  label: '金・銀・クリスタル',                         min: 152, max: 251  },
  { value: 'rse',  label: 'ルビー・サファイア・エメラルド',             min: 252, max: 386  },
  { value: 'dppt', label: 'ダイヤモンド・パール・プラチナ',             min: 387, max: 493  },
  { value: 'hgss', label: 'ハートゴールド・ソウルシルバー',             min: 152, max: 251  },
  { value: 'bw',   label: 'ブラック・ホワイト',                         min: 494, max: 649  },
  { value: 'bw2',  label: 'ブラック2・ホワイト2',                       min: 494, max: 649  },
  { value: 'xy',   label: 'X・Y',                                       min: 650, max: 721  },
  { value: 'oras', label: 'オメガルビー・アルファサファイア',           min: 252, max: 386  },
  { value: 'sm',   label: 'サン・ムーン',                               min: 722, max: 809  },
  { value: 'usum', label: 'ウルトラサン・ウルトラムーン',               min: 722, max: 809  },
  { value: 'lgpe', label: "Let's Go! ピカチュウ/イーブイ",              set: LGPE_SET       },
  { value: 'ss',   label: 'ソード・シールド',                           min: 810, max: 905  },
  { value: 'bdsp', label: 'ブリリアントダイヤモンド/シャイニングパール', min: 1,   max: 493  },
  { value: 'pla',  label: 'レジェンズ アルセウス',                      set: HISUI_SET      },
  { value: 'sv',   label: 'スカーレット・バイオレット',                 min: 906, max: 1025 },
  { value: 'za',   label: 'レジェンズ Z-A',                             set: ZA_SET         },
];

// ─── Mega Evolution list (Gen 6 originals + Legends Z-A new megas) ────────────

const MEGA_LIST = [
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
].map((m) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName,
  jaName: m.jaName, isMega: true, isAlt: false,
  megaKey: `${m.baseId}-${m.spriteId}`,
}));

// ─── Alternate forms (verified sprites, regional variants + notable formes) ────

const ALT_FORM_LIST = [
  { baseId: 3,   spriteId: 10195, jaName: 'キョダイフシギバナ' },
  { baseId: 6,   spriteId: 10196, jaName: 'キョダイリザードン' },
  { baseId: 9,   spriteId: 10197, jaName: 'キョダイカメックス' },
  { baseId: 12,  spriteId: 10198, jaName: 'キョダイバタフリー' },
  { baseId: 19,  spriteId: 10091, jaName: 'アローラコラッタ' },
  { baseId: 20,  spriteId: 10092, jaName: 'アローララッタ' },
  { baseId: 25,  spriteId: 10199, jaName: 'キョダイピカチュウ' },
  { baseId: 26,  spriteId: 10100, jaName: 'アローラライチュウ' },
  { baseId: 27,  spriteId: 10101, jaName: 'アローラサンド' },
  { baseId: 28,  spriteId: 10102, jaName: 'アローラサンドパン' },
  { baseId: 37,  spriteId: 10103, jaName: 'アローラロコン' },
  { baseId: 38,  spriteId: 10104, jaName: 'アローラキュウコン' },
  { baseId: 50,  spriteId: 10105, jaName: 'アローラディグダ' },
  { baseId: 51,  spriteId: 10106, jaName: 'アローラダグトリオ' },
  { baseId: 52,  spriteId: 10107, jaName: 'アローラニャース' },
  { baseId: 52,  spriteId: 10161, jaName: 'ガラルニャース' },
  { baseId: 52,  spriteId: 10200, jaName: 'キョダイニャース' },
  { baseId: 53,  spriteId: 10108, jaName: 'アローラペルシアン' },
  { baseId: 58,  spriteId: 10229, jaName: 'ヒスイガーディ' },
  { baseId: 59,  spriteId: 10230, jaName: 'ヒスイウインディ' },
  { baseId: 68,  spriteId: 10201, jaName: 'キョダイカイリキー' },
  { baseId: 74,  spriteId: 10109, jaName: 'アローライシツブテ' },
  { baseId: 75,  spriteId: 10110, jaName: 'アローラゴローン' },
  { baseId: 76,  spriteId: 10111, jaName: 'アローラゴローニャ' },
  { baseId: 77,  spriteId: 10162, jaName: 'ガラルポニータ' },
  { baseId: 78,  spriteId: 10163, jaName: 'ガラルギャロップ' },
  { baseId: 79,  spriteId: 10164, jaName: 'ガラルヤドン' },
  { baseId: 80,  spriteId: 10165, jaName: 'ガラルヤドラン' },
  { baseId: 83,  spriteId: 10166, jaName: 'ガラルカモネギ' },
  { baseId: 88,  spriteId: 10112, jaName: 'アローラベトベター' },
  { baseId: 89,  spriteId: 10113, jaName: 'アローラベトベトン' },
  { baseId: 94,  spriteId: 10202, jaName: 'キョダイゲンガー' },
  { baseId: 99,  spriteId: 10203, jaName: 'キョダイキングラー' },
  { baseId: 100, spriteId: 10231, jaName: 'ヒスイビリリダマ' },
  { baseId: 101, spriteId: 10232, jaName: 'ヒスイマルマイン' },
  { baseId: 103, spriteId: 10114, jaName: 'アローラナッシー' },
  { baseId: 105, spriteId: 10115, jaName: 'アローラガラガラ' },
  { baseId: 110, spriteId: 10167, jaName: 'ガラルマタドガス' },
  { baseId: 122, spriteId: 10168, jaName: 'ガラルバリヤード' },
  { baseId: 128, spriteId: 10250, jaName: 'パルデアケンタロス（くれないのいかり）' },
  { baseId: 128, spriteId: 10251, jaName: 'パルデアケンタロス（もえるいかり）' },
  { baseId: 128, spriteId: 10252, jaName: 'パルデアケンタロス（うねりのいかり）' },
  { baseId: 131, spriteId: 10204, jaName: 'キョダイラプラス' },
  { baseId: 133, spriteId: 10205, jaName: 'キョダイイーブイ' },
  { baseId: 143, spriteId: 10206, jaName: 'キョダイカビゴン' },
  { baseId: 144, spriteId: 10169, jaName: 'ガラルフリーザー' },
  { baseId: 145, spriteId: 10170, jaName: 'ガラルサンダー' },
  { baseId: 146, spriteId: 10171, jaName: 'ガラルファイヤー' },
  { baseId: 157, spriteId: 10233, jaName: 'ヒスイバクフーン' },
  { baseId: 194, spriteId: 10253, jaName: 'パルデアウパー' },
  { baseId: 199, spriteId: 10172, jaName: 'ガラルヤドキング' },
  { baseId: 211, spriteId: 10234, jaName: 'ヒスイハリーセン' },
  { baseId: 215, spriteId: 10235, jaName: 'ヒスイニューラ' },
  { baseId: 222, spriteId: 10173, jaName: 'ガラルサニーゴ' },
  { baseId: 263, spriteId: 10174, jaName: 'ガラルジグザグマ' },
  { baseId: 264, spriteId: 10175, jaName: 'ガラルマッスグマ' },
  { baseId: 351, spriteId: 10013, jaName: 'ポワルン（にほんばれ）' },
  { baseId: 351, spriteId: 10014, jaName: 'ポワルン（あめ）' },
  { baseId: 351, spriteId: 10015, jaName: 'ポワルン（あられ）' },
  { baseId: 382, spriteId: 10077, jaName: 'ゲンシカイオーガ' },
  { baseId: 383, spriteId: 10078, jaName: 'ゲンシグラードン' },
  { baseId: 386, spriteId: 10001, jaName: 'デオキシス（アタックフォルム）' },
  { baseId: 386, spriteId: 10002, jaName: 'デオキシス（ディフェンスフォルム）' },
  { baseId: 386, spriteId: 10003, jaName: 'デオキシス（スピードフォルム）' },
  { baseId: 413, spriteId: 10004, jaName: 'ミノマダム（すなちのすがた）' },
  { baseId: 413, spriteId: 10005, jaName: 'ミノマダム（くずもののすがた）' },
  { baseId: 479, spriteId: 10008, jaName: 'ヒートロトム' },
  { baseId: 479, spriteId: 10009, jaName: 'ウォッシュロトム' },
  { baseId: 479, spriteId: 10010, jaName: 'フロストロトム' },
  { baseId: 479, spriteId: 10011, jaName: 'スピンロトム' },
  { baseId: 479, spriteId: 10012, jaName: 'カットロトム' },
  { baseId: 483, spriteId: 10245, jaName: 'ディアルガ（オリジンフォルム）' },
  { baseId: 484, spriteId: 10246, jaName: 'パルキア（オリジンフォルム）' },
  { baseId: 487, spriteId: 10007, jaName: 'ギラティナ（オリジンフォルム）' },
  { baseId: 492, spriteId: 10006, jaName: 'シェイミ（スカイフォルム）' },
  { baseId: 503, spriteId: 10236, jaName: 'ヒスイダイケンキ' },
  { baseId: 549, spriteId: 10237, jaName: 'ヒスイドレディア' },
  { baseId: 550, spriteId: 10016, jaName: 'バスラオ（あおすじ）' },
  { baseId: 550, spriteId: 10247, jaName: 'バスラオ（しろすじ）' },
  { baseId: 554, spriteId: 10176, jaName: 'ガラルダルマッカ' },
  { baseId: 555, spriteId: 10017, jaName: 'ヒヒダルマ（ダルマモード）' },
  { baseId: 555, spriteId: 10177, jaName: 'ガラルヒヒダルマ' },
  { baseId: 555, spriteId: 10178, jaName: 'ガラルヒヒダルマ（ダルマモード）' },
  { baseId: 562, spriteId: 10179, jaName: 'ガラルデスマス' },
  { baseId: 569, spriteId: 10207, jaName: 'キョダイダストダス' },
  { baseId: 570, spriteId: 10238, jaName: 'ヒスイゾロア' },
  { baseId: 571, spriteId: 10239, jaName: 'ヒスイゾロアーク' },
  { baseId: 618, spriteId: 10180, jaName: 'ガラルマッギョ' },
  { baseId: 628, spriteId: 10240, jaName: 'ヒスイウォーグル' },
  { baseId: 641, spriteId: 10019, jaName: 'トルネロス（れいじゅうフォルム）' },
  { baseId: 642, spriteId: 10020, jaName: 'ボルトロス（れいじゅうフォルム）' },
  { baseId: 645, spriteId: 10021, jaName: 'ランドロス（れいじゅうフォルム）' },
  { baseId: 646, spriteId: 10022, jaName: 'ブラックキュレム' },
  { baseId: 646, spriteId: 10023, jaName: 'ホワイトキュレム' },
  { baseId: 647, spriteId: 10024, jaName: 'ケルディオ（かくごのすがた）' },
  { baseId: 648, spriteId: 10018, jaName: 'メロエッタ（ステップフォルム）' },
  { baseId: 658, spriteId: 10116, jaName: 'きずなへんげゲッコウガ' },
  { baseId: 658, spriteId: 10117, jaName: 'サトシゲッコウガ' },
  { baseId: 670, spriteId: 10061, jaName: 'フラエッテ（えいえんのはな）' },
  { baseId: 678, spriteId: 10025, jaName: 'ニャオニクス（メス）' },
  { baseId: 681, spriteId: 10026, jaName: 'ギルガルド（ブレードフォルム）' },
  { baseId: 705, spriteId: 10241, jaName: 'ヒスイヌメイル' },
  { baseId: 706, spriteId: 10242, jaName: 'ヒスイヌメルゴン' },
  { baseId: 710, spriteId: 10027, jaName: 'バケッチャ（ちいさいサイズ）' },
  { baseId: 710, spriteId: 10028, jaName: 'バケッチャ（おおきいサイズ）' },
  { baseId: 710, spriteId: 10029, jaName: 'バケッチャ（とくだいサイズ）' },
  { baseId: 711, spriteId: 10030, jaName: 'パンプジン（ちいさいサイズ）' },
  { baseId: 711, spriteId: 10031, jaName: 'パンプジン（おおきいサイズ）' },
  { baseId: 711, spriteId: 10032, jaName: 'パンプジン（とくだいサイズ）' },
  { baseId: 713, spriteId: 10243, jaName: 'ヒスイクレベース' },
  { baseId: 718, spriteId: 10118, jaName: 'ジガルデ（10%フォルム）' },
  { baseId: 718, spriteId: 10119, jaName: 'ジガルデ（50%フォルム）' },
  { baseId: 718, spriteId: 10120, jaName: 'ジガルデ（パーフェクトフォルム）' },
  { baseId: 720, spriteId: 10086, jaName: 'フーパ（ときはなたれしフォルム）' },
  { baseId: 724, spriteId: 10244, jaName: 'ヒスイジュナイパー' },
  { baseId: 745, spriteId: 10126, jaName: 'ルガルガン（まよなかのすがた）' },
  { baseId: 745, spriteId: 10152, jaName: 'ルガルガン（たそがれのすがた）' },
  { baseId: 746, spriteId: 10127, jaName: 'ヨワシ（むれたすがた）' },
  { baseId: 774, spriteId: 10136, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10137, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10138, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10139, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10140, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10141, jaName: 'メテノ（コアのすがた）' },
  { baseId: 774, spriteId: 10142, jaName: 'メテノ（コアのすがた）' },
  { baseId: 800, spriteId: 10155, jaName: 'ネクロズマ（たそがれのすがた）' },
  { baseId: 800, spriteId: 10156, jaName: 'ネクロズマ（たそがれのたてがみ）' },
  { baseId: 800, spriteId: 10157, jaName: 'ウルトラネクロズマ' },
  { baseId: 801, spriteId: 10147, jaName: 'マギアナ（オリジナルカラー）' },
  { baseId: 809, spriteId: 10208, jaName: 'キョダイメルメタル' },
  { baseId: 812, spriteId: 10209, jaName: 'キョダイゴリランダー' },
  { baseId: 815, spriteId: 10210, jaName: 'キョダイエースバーン' },
  { baseId: 818, spriteId: 10211, jaName: 'キョダイインテレオン' },
  { baseId: 823, spriteId: 10212, jaName: 'キョダイアーマーガア' },
  { baseId: 826, spriteId: 10213, jaName: 'キョダイイオルブ' },
  { baseId: 834, spriteId: 10214, jaName: 'キョダイカジリガメ' },
  { baseId: 839, spriteId: 10215, jaName: 'キョダイセキタンザン' },
  { baseId: 841, spriteId: 10216, jaName: 'キョダイアップリュー' },
  { baseId: 842, spriteId: 10217, jaName: 'キョダイタルップル' },
  { baseId: 844, spriteId: 10218, jaName: 'キョダイサダイジャ' },
  { baseId: 845, spriteId: 10182, jaName: 'ウッウ（ほおばったすがた）' },
  { baseId: 845, spriteId: 10183, jaName: 'ウッウ（おおぐいのすがた）' },
  { baseId: 849, spriteId: 10184, jaName: 'ストリンダー（ローキーフォルム）' },
  { baseId: 851, spriteId: 10220, jaName: 'キョダイマルヤクデ' },
  { baseId: 858, spriteId: 10221, jaName: 'キョダイブリムオン' },
  { baseId: 861, spriteId: 10222, jaName: 'キョダイオーロンゲ' },
  { baseId: 869, spriteId: 10223, jaName: 'キョダイマホイップ' },
  { baseId: 875, spriteId: 10185, jaName: 'コオリッポ（もぐったすがた）' },
  { baseId: 876, spriteId: 10186, jaName: 'イエッサン（メス）' },
  { baseId: 877, spriteId: 10187, jaName: 'モルペコ（はらぺこのすがた）' },
  { baseId: 879, spriteId: 10224, jaName: 'キョダイダイオウドウ' },
  { baseId: 884, spriteId: 10225, jaName: 'キョダイジュラルドン' },
  { baseId: 888, spriteId: 10188, jaName: 'ザシアン（けんのおう）' },
  { baseId: 889, spriteId: 10189, jaName: 'ザマゼンタ（けんのおう）' },
  { baseId: 890, spriteId: 10190, jaName: 'エタムゲンダイナ' },
  { baseId: 892, spriteId: 10191, jaName: 'ウーラオス（れんげきのかた）' },
  { baseId: 893, spriteId: 10192, jaName: 'ザルード（ダダリン）' },
  { baseId: 898, spriteId: 10193, jaName: 'バドレックス（はくばのすがた）' },
  { baseId: 898, spriteId: 10194, jaName: 'バドレックス（こくばのすがた）' },
  { baseId: 901, spriteId: 10272, jaName: 'ガチグマ（ブラッドムーン）' },
  { baseId: 902, spriteId: 10248, jaName: 'イダイトウ（メス）' },
  { baseId: 905, spriteId: 10249, jaName: 'ラブトロス（れいじゅうフォルム）' },
  { baseId: 916, spriteId: 10254, jaName: 'パフュートン（メス）' },
  { baseId: 964, spriteId: 10256, jaName: 'イルカマン（ヒーローのすがた）' },
  { baseId: 978, spriteId: 10258, jaName: 'シャリタツ（うなだれたすがた）' },
  { baseId: 978, spriteId: 10259, jaName: 'シャリタツ（のびのびすがた）' },
  { baseId: 982, spriteId: 10255, jaName: 'ノココッチ（さんぶんぎ）' },
  { baseId: 999, spriteId: 10263, jaName: 'コレクレー（ほうろうのすがた）' },
  { baseId: 1017, spriteId: 10273, jaName: 'オーガポン（いどのめん）' },
  { baseId: 1017, spriteId: 10274, jaName: 'オーガポン（かまどのめん）' },
  { baseId: 1017, spriteId: 10275, jaName: 'オーガポン（いしずえのめん）' },
  { baseId: 1024, spriteId: 10276, jaName: 'テラパゴス（テラスタルのすがた）' },
  { baseId: 1024, spriteId: 10277, jaName: 'テラパゴス（ステラのすがた）' },
].map((m) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName,
  jaName: m.jaName, isMega: false, isAlt: true,
  altKey: `${m.baseId}-${m.spriteId}`,
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

function visiblePages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total]);
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) set.add(i);
  return [...set].sort((a, b) => a - b);
}

function altBadge(jaName) {
  if (jaName.startsWith('アローラ'))  return 'アロ';
  if (jaName.startsWith('ガラル'))    return 'ガラル';
  if (jaName.startsWith('ヒスイ'))    return 'ヒスイ';
  if (jaName.startsWith('パルデア'))  return 'パルデア';
  if (jaName.startsWith('ゲンシ'))    return 'ゲンシ';
  if (jaName.startsWith('キョダイ'))  return 'キョダイ';
  if (jaName.startsWith('ウルトラ'))  return 'ウルトラ';
  if (jaName.startsWith('ブラック'))  return 'ブラック';
  if (jaName.startsWith('ホワイト'))  return 'ホワイト';
  return '別姿';
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

function FilterChip({ active, onClick, color, children }) {
  const on = {
    amber:  'bg-amber-400/80  border-amber-300/70  text-amber-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),inset_0_1px_0_rgba(255,255,255,0.7)]',
    violet: 'bg-violet-500/85 border-violet-300/70 text-white      shadow-[0_4px_16px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]',
  }[color];
  const dot = color === 'amber' ? 'bg-amber-600/80' : 'bg-violet-700/80';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold select-none backdrop-blur-xl border transition-all active:scale-95
        ${active ? on : 'bg-white/55 border-white/70 text-gray-600 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'}`}
    >
      <span className={`w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0 transition-colors ${active ? dot : 'border-2 border-gray-300 bg-white/40'}`}>
        {active && <Check size={11} strokeWidth={3} className="text-white" />}
      </span>
      {children}
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function SearchClient({ list }) {
  const [query,    setQuery]    = useState('');
  const [region,   setRegion]   = useState('all');
  const [game,     setGame]     = useState('all');
  const [megaOnly, setMegaOnly] = useState(false);
  const [altOnly,  setAltOnly]  = useState(false);
  const [page,     setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const regionFilter = REGIONS.find((r) => r.value === region);
    const gameFilter   = GAMES.find((g) => g.value === game);

    const inRange = (id) => {
      if (regionFilter?.value !== 'all') {
        if (id < regionFilter.min || id > regionFilter.max) return false;
      }
      if (gameFilter?.value !== 'all') {
        if (gameFilter.set) { if (!gameFilter.set.has(id)) return false; }
        else { if (id < gameFilter.min || id > gameFilter.max) return false; }
      }
      return true;
    };

    const matchQ = (jaName, name, id) =>
      !q || jaName.includes(q) || (name && name.includes(q)) || String(id).includes(q);

    const baseFiltered = list.filter((p) => matchQ(p.jaName, p.name, p.id) && inRange(p.id));
    const megaFiltered = MEGA_LIST.filter((p) => matchQ(p.jaName, '', p.id) && inRange(p.id));
    const altFiltered  = ALT_FORM_LIST.filter((p) => matchQ(p.jaName, '', p.id) && inRange(p.id));

    const combined = [...baseFiltered, ...megaFiltered, ...altFiltered].sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      if (!a.isMega && !a.isAlt && (b.isMega || b.isAlt)) return -1;
      if ((a.isMega || a.isAlt) && !b.isMega && !b.isAlt) return 1;
      if (a.isMega && !b.isMega) return -1;
      if (!a.isMega && b.isMega) return 1;
      return a.jaName.localeCompare(b.jaName, 'ja');
    });

    return combined.filter((p) => {
      if (megaOnly && altOnly) return p.isMega || p.isAlt;
      if (megaOnly) return p.isMega;
      if (altOnly)  return p.isAlt;
      return true;
    });
  }, [query, region, game, megaOnly, altOnly, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset      = () => setPage(1);
  const pages      = visiblePages(page, totalPages);

  return (
    <div>
      {/* 検索 */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="名前またはNoで検索…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); reset(); }}
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-gray-700 placeholder:text-gray-400
                       bg-white/55 backdrop-blur-xl border border-white/70
                       shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]
                       outline-none focus:bg-white/75 transition-colors"
          />
        </div>
      </div>

      {/* プルダウン */}
      <div className="px-4 pb-3 flex gap-3">
        <GlassSelect value={region} onChange={(v) => { setRegion(v); reset(); }} options={REGIONS} label="地方" />
        <GlassSelect value={game}   onChange={(v) => { setGame(v);   reset(); }} options={GAMES}   label="ゲーム" />
      </div>

      {/* 絞り込みチップ */}
      <div className="px-4 pb-4 flex gap-2 flex-wrap">
        <FilterChip color="amber"  active={megaOnly} onClick={() => { setMegaOnly(v => !v); reset(); }}>
          メガシンカのみ
        </FilterChip>
        <FilterChip color="violet" active={altOnly}  onClick={() => { setAltOnly(v => !v);  reset(); }}>
          別の姿のみ
        </FilterChip>
      </div>

      {/* グリッド */}
      <div className="px-4 grid grid-cols-3 gap-3">
        {paginated.map((p) => {
          const imgId = (p.isMega || p.isAlt) ? p.spriteId : p.id;
          const noStr = `No.${String(p.id).padStart(4, '0')}${p.isMega ? 'x' : ''}`;
          const badge = p.isMega ? { label: 'MEGA', bg: 'bg-amber-400' }
                      : p.isAlt  ? { label: altBadge(p.jaName), bg: 'bg-violet-400' }
                      : null;
          const card = p.isMega ? 'bg-amber-50/70 border-amber-200/70 shadow-[0_4px_16px_rgba(251,191,36,0.20),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     : p.isAlt  ? 'bg-violet-50/60 border-violet-200/60 shadow-[0_4px_16px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     : 'bg-white/55 border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]';
          const noColor = p.isMega ? 'text-amber-600' : p.isAlt ? 'text-violet-500' : 'text-gray-400';
          const key = p.isMega ? p.megaKey : p.isAlt ? p.altKey : p.id;
          return (
            <Link key={key} href={`/pokemon/${p.id}`}>
              <div className={`rounded-2xl p-2 text-center backdrop-blur-xl border active:scale-95 transition-transform duration-100 ${card}`}>
                <div className="relative w-full aspect-square">
                  <Image src={officialArtwork(imgId)} alt={p.jaName} fill className="object-contain drop-shadow" unoptimized />
                  {badge && (
                    <span className={`absolute top-0.5 right-0.5 text-[8px] font-black ${badge.bg} text-white px-1 py-0.5 rounded-full leading-none`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] font-mono mt-1 ${noColor}`}>{noStr}</p>
                <p className="text-xs font-bold text-gray-700 truncate">{p.jaName}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/80 text-sm py-10">該当なし</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 py-5 flex-wrap px-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform">←</button>

          {pages.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && pages[i - 1] !== n - 1 && <span className="text-white/80 text-sm w-5 text-center">…</span>}
              <button onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all active:scale-90 ${page === n ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.45)]' : 'bg-white/55 backdrop-blur-xl border border-white/70 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'}`}>
                {n}
              </button>
            </Fragment>
          ))}

          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform">→</button>
        </div>
      )}
    </div>
  );
}
