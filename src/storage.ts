const KEY = 'yaku-counter:v1'

export type CounterState = {
  hits: number
  glows: number
}

export type MachineState = {
  games: number
  counters: Record<string, CounterState>
}

export type AppState = Record<string, MachineState>

function emptyCounter(): CounterState {
  return { hits: 0, glows: 0 }
}

export function emptyMachine(): MachineState {
  return { games: 0, counters: {} }
}

/**
 * カバネリは無名・生駒を別々に数えていた時期があるため、
 * 合算カウンターがまだなければ旧カウントを合算して引き継ぐ。
 */
function migrate(state: AppState): AppState {
  const kb = state.kabaneri
  if (!kb || kb.counters['mumei-ikoma']) return state
  const mumei = kb.counters.mumei
  const ikoma = kb.counters.ikoma
  if (!mumei && !ikoma) return state
  const hits = (mumei?.hits ?? 0) + (ikoma?.hits ?? 0)
  const glows = (mumei?.glows ?? 0) + (ikoma?.glows ?? 0)
  return {
    ...state,
    kabaneri: {
      ...kb,
      counters: { ...kb.counters, 'mumei-ikoma': { hits, glows: Math.min(glows, hits) } },
    },
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || typeof parsed !== 'object') return {}
    return migrate(parsed)
  } catch {
    return {}
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // プライベートモード等で保存できなくてもカウントは続けられる
  }
}

export function getCounter(machine: MachineState, id: string): CounterState {
  return machine.counters[id] ?? emptyCounter()
}
