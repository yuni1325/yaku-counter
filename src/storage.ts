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

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function getCounter(machine: MachineState, id: string): CounterState {
  return machine.counters[id] ?? emptyCounter()
}
