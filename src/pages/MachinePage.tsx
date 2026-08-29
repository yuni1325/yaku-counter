import { YakuCard } from '../components/YakuCard.tsx'
import type { Machine } from '../data/machines.ts'
import { getCounter, type MachineState } from '../storage.ts'

type Props = {
  machine: Machine
  state: MachineState
  onGames: (delta: number) => void
  onHits: (counterId: string, delta: number) => void
  onGlows: (counterId: string, delta: number) => void
  onReset: () => void
  onBack: () => void
}

const GAME_STEPS = [1, 10, 50, 100] as const

export function MachinePage({ machine, state, onGames, onHits, onGlows, onReset, onBack }: Props) {
  return (
    <div className="shell">
      <header className="topbar">
        <button type="button" className="back" onClick={onBack} aria-label="TOPへ戻る">
          ←
        </button>
        <div className="brand">
          <small>{machine.kicker}</small>
          <strong>{machine.name}</strong>
        </div>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (confirm(`${machine.name}のカウントをリセットしますか？`)) onReset()
          }}
        >
          リセット
        </button>
      </header>

      <p className="lede">
        {machine.subtitle}のカウントです。設定ごとの確率と、いまのサンプルでの期待回数を並べています。
      </p>

      <ul className="notes">
        {machine.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <section className="games">
        <div className="games-head">
          <span>総ゲーム数</span>
          <strong>
            {state.games}
            <small>G</small>
          </strong>
        </div>
        <div className="step-row">
          {GAME_STEPS.map((n) => (
            <button key={`-${n}`} type="button" className="step minus" onClick={() => onGames(-n)}>
              −{n}
            </button>
          ))}
          {GAME_STEPS.map((n) => (
            <button key={`+${n}`} type="button" className="step" onClick={() => onGames(n)}>
              +{n}
            </button>
          ))}
        </div>
      </section>

      {machine.counters.map((counter) => (
        <YakuCard
          key={counter.id}
          def={counter}
          games={state.games}
          state={getCounter(state, counter.id)}
          onHits={(delta) => onHits(counter.id, delta)}
          onGlows={(delta) => onGlows(counter.id, delta)}
        />
      ))}
    </div>
  )
}
