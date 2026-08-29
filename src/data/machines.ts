export type SettingKey = 1 | 2 | 3 | 4 | 5 | 6

export type CounterKind = 'glow' | 'yaku'

export type ProbRow = {
  setting: SettingKey
  /** Human-readable rate, e.g. "約8.5%" or "1/38.15" */
  label: string
  /** Probability 0–1. Null when unpublished. */
  rate: number | null
  band?: string
}

export type CounterDef = {
  id: string
  name: string
  kind: CounterKind
  hint: string
  appearance?: string
  probabilities: ProbRow[]
  sourceNote: string
}

export type Machine = {
  id: string
  name: string
  kicker: string
  subtitle: string
  theme: 'kabaneri' | 'monkey'
  notes: string[]
  counters: CounterDef[]
}

/** 前作実戦値の中央値。海門の公式解析は未公開。 */
const KABANERI_GLOW: ProbRow[] = [
  { setting: 1, label: '約8.5%', rate: 0.085, band: '7〜10%' },
  { setting: 2, label: '約8.5%', rate: 0.085, band: '7〜10%' },
  { setting: 3, label: '約8.5%', rate: 0.085, band: '7〜10%' },
  { setting: 4, label: '約10.5%', rate: 0.105, band: '10〜11%' },
  { setting: 5, label: '約14%', rate: 0.14, band: '13〜15%' },
  { setting: 6, label: '約14%', rate: 0.14, band: '13〜15%' },
]

const GLOW_SOURCE =
  '発光率は前作『甲鉄城のカバネリ』の実戦値ベース（設定1〜3: 7〜10% / 設定4: 10〜11% / 設定5・6: 13〜15%）。海門の公式値は未解析。設定1約7%・設定6約15%という報告もある。'

export const machines: Machine[] = [
  {
    id: 'kabaneri',
    name: 'カバネリ 海門',
    kicker: 'スマスロ 甲鉄城のカバネリ',
    subtitle: 'チャンス目発光率',
    theme: 'kabaneri',
    notes: [
      '対象は低確かつ他キャラ非発光中の単独チャンス目のみ。複合・オールスター・高確中・CZ直撃発光は分母から除外するのが実戦の数え方。',
      '海門に美馬チャンス目はなく、前作の美馬位置はカバネチャンス目に置換。3枠目はカバネとしてカウントする。',
      '無名・生駒の発光率に設定差があるとされる。カバネは周期ポイント用で、発光の設定差は未確認。',
    ],
    counters: [
      {
        id: 'mumei',
        name: '無名チャンス目',
        kind: 'glow',
        hint: '左リール無名＋中右ハズレ。発光したらランプ点灯。',
        appearance: '出現 1/38.9（全設定共通）',
        probabilities: KABANERI_GLOW,
        sourceNote: GLOW_SOURCE,
      },
      {
        id: 'ikoma',
        name: '生駒チャンス目',
        kind: 'glow',
        hint: '右リール生駒＋左中ハズレ。発光したらランプ点灯。',
        appearance: '出現 1/44.5（全設定共通）',
        probabilities: KABANERI_GLOW,
        sourceNote: GLOW_SOURCE,
      },
      {
        id: 'kabaneri-mima',
        name: '美馬（カバネ）',
        kind: 'glow',
        hint: '海門では美馬チャンス目なし。カバネ目（中リール）を数える場合はここへ。',
        appearance: 'カバネ出現 1/77.7（全設定共通）',
        probabilities: KABANERI_GLOW,
        sourceNote:
          '美馬チャンス目は前作のみ。海門はカバネチャンス目（周期pt）が相当位置。発光率表は無名・生駒と同じ前作暫定値で、カバネへの適用は未確認。',
      },
    ],
  },
  {
    id: 'monkey',
    name: 'モンキーターンV',
    kicker: 'スマスロ',
    subtitle: '5枚役',
    theme: 'monkey',
    notes: [
      '通常時・AT中を通して総ゲーム数で数える。セグの払い出し「5」で確認するのが確実。',
      '出目の目安: 中段 リプ-ベル-ベル / リプ-リプ-ベル / リプ-リプ-チェリー（ボート）。',
      '設定3の解析値は公開されていない（この機種は設定3非搭載とされる）。サンプルは2000G前後から精度が上がる。',
    ],
    counters: [
      {
        id: 'five',
        name: '5枚役',
        kind: 'yaku',
        hint: '成立のたびに＋。総ゲーム数は上のカウンターで加算。',
        appearance: '通常時・AT中ともにカウント',
        probabilities: [
          { setting: 1, label: '1/38.15', rate: 1 / 38.15 },
          { setting: 2, label: '1/36.86', rate: 1 / 36.86 },
          { setting: 3, label: '—', rate: null },
          { setting: 4, label: '1/30.27', rate: 1 / 30.27 },
          { setting: 5, label: '1/24.51', rate: 1 / 24.51 },
          { setting: 6, label: '1/22.53', rate: 1 / 22.53 },
        ],
        sourceNote:
          '複数の設定判別記事で同一の数値が流通（設定1: 1/38.15 〜 設定6: 1/22.53）。メーカー公式の小役解析表ではない実践・解析流通値。設定3は未掲載。',
      },
    ],
  },
]

export function machineById(id: string): Machine | undefined {
  return machines.find((m) => m.id === id)
}
