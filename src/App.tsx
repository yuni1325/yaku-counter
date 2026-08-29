import { useEffect, useMemo, useState } from 'react'
import { machineById } from './data/machines.ts'
import { Home } from './pages/Home.tsx'
import { MachinePage } from './pages/MachinePage.tsx'
import { emptyMachine, loadState, saveState, type AppState, type MachineState } from './storage.ts'

function clamp(n: number) {
  return Math.max(0, n)
}

function patchMachine(state: AppState, id: string, fn: (current: MachineState) => MachineState): AppState {
  const current = state[id] ?? emptyMachine()
  return { ...state, [id]: fn(current) }
}

function routeFromHash() {
  const raw = location.hash.replace(/^#/, '') || '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [store, setStore] = useState<AppState>(() => loadState())

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    saveState(store)
  }, [store])

  const machineId = route.replace(/^\//, '')
  const machine = useMemo(() => (machineId ? machineById(machineId) : undefined), [machineId])

  useEffect(() => {
    document.title = machine ? `${machine.name} | 小役カウンター` : '小役カウンター'
  }, [machine])

  const go = (path: string) => {
    location.hash = path
  }

  if (!machine) {
    return <Home onOpen={(id) => go(`/${id}`)} />
  }

  const state = store[machine.id] ?? emptyMachine()

  return (
    <MachinePage
      machine={machine}
      state={state}
      onBack={() => go('/')}
      onReset={() => setStore((s) => ({ ...s, [machine.id]: emptyMachine() }))}
      onGames={(delta) =>
        setStore((s) =>
          patchMachine(s, machine.id, (m) => ({ ...m, games: clamp(m.games + delta) })),
        )
      }
      onHits={(counterId, delta) =>
        setStore((s) =>
          patchMachine(s, machine.id, (m) => {
            const prev = m.counters[counterId] ?? { hits: 0, glows: 0 }
            const hits = clamp(prev.hits + delta)
            return {
              ...m,
              counters: {
                ...m.counters,
                [counterId]: { hits, glows: Math.min(prev.glows, hits) },
              },
            }
          }),
        )
      }
      onGlows={(counterId, delta) =>
        setStore((s) =>
          patchMachine(s, machine.id, (m) => {
            const prev = m.counters[counterId] ?? { hits: 0, glows: 0 }
            const glows = clamp(prev.glows + delta)
            return {
              ...m,
              counters: {
                ...m.counters,
                [counterId]: { hits: Math.max(prev.hits, glows), glows },
              },
            }
          }),
        )
      }
    />
  )
}
