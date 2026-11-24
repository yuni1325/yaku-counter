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

/**
 * 海門の単独チャンス目（無名・生駒合算）発光率。2026/11/24 時点で公式解析は未公開。
 * 採用値: 今作の実戦値集計（スロタイガー氏・2026/10/19公開）と前作実戦値帯を総合した暫定値
 *   （けんスロ 発光率カウンター・判別ツール 2026/11/13）
 *   https://kenslo65536.com/tool/l-kabaneri-unato-czpoint-counter.html
 * 突き合わせた実戦値:
 *   DMMぱちタウン(3/19) 設定1 12.1%(7/58) / 設定5 8.7%(2/23) / 設定6 21.3%(16/75)
 *     https://p-town.dmm.com/specials/4895
 *   パチ7 設定6試打(3/1) 無名15.9%(14/88)・生駒13.9%(11/79) 合算15.0%(25/167)
 *     https://pachiseven.jp/articles/detail/25826
 * 低設定は各ソースが12%台で一致。高設定は少数サンプルで15〜21%と幅があるため band に表示。
 */
const KABANERI_GLOW: ProbRow[] = [
  { setting: 1, label: '12.6%', rate: 0.126, band: '実戦12.1%' },
  { setting: 2, label: '12.6%', rate: 0.126 },
  { setting: 3, label: '12.6%', rate: 0.126 },
  { setting: 4, label: '17.7%', rate: 0.177 },
  { setting: 5, label: '20.0%', rate: 0.2 },
  { setting: 6, label: '20.0%', rate: 0.2, band: '実戦15〜21%' },
]

const GLOW_SOURCE =
  '海門の実戦値集計（2026/10/19公開・設定判明台）と前作実戦値を総合した暫定値（2026/11時点、公式値は未公開）。設定1は別の実戦値でも約12%で一致。設定6は少数サンプルで15〜21%と幅がある。無名と生駒で発光率の差はないとして合算。'

export const machines: Machine[] = [
  {
    id: 'kabaneri',
    name: 'カバネリ 海門',
    kicker: 'スマスロ 甲鉄城のカバネリ',
    subtitle: 'チャンス目発光率',
    theme: 'kabaneri',
    notes: [
      '無名・生駒チャンス目をまとめて1つでカウント。どちらが出ても同じボタンでOK。',
      '対象は低確（カバネリ高確中でない）かつ他キャラ非発光中の単独チャンス目のみ。複合・オールスター目は数えない。',
      '発光がそのままCZ当選につながった回は、成立・発光どちらにも数えない（設定差がない当選経路のため）。',
      'カバネチャンス目は周期ポイント用で設定判別に使わないため対象外。',
    ],
    counters: [
      {
        id: 'mumei-ikoma',
        name: '無名・生駒チャンス目（合算）',
        kind: 'glow',
        hint: '無名（左リール）・生駒（右リール）の単独チャンス目が出たら成立＋、ランプが発光したら発光＋。',
        appearance: '出現 合算約1/20.8（無名1/38.9＋生駒1/44.5・全設定共通）',
        probabilities: KABANERI_GLOW,
        sourceNote: GLOW_SOURCE,
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
