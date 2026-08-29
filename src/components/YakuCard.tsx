import type { CounterDef } from '../data/machines.ts'
import { closestSettings, formatDelta, formatOneIn, formatPercent } from '../lib/format.ts'
import type { CounterState } from '../storage.ts'

type Props = {
  def: CounterDef
  games: number
  state: CounterState
  onHits: (delta: number) => void
  onGlows: (delta: number) => void
}

export function YakuCard({ def, games, state, onHits, onGlows }: Props) {
  const observed =
    def.kind === 'glow'
      ? state.hits > 0
        ? state.glows / state.hits
        : null
      : games > 0 && state.hits > 0
        ? state.hits / games
        : null

  const closest = closestSettings(observed, def.probabilities)
  const guess =
    closest.length === 0
      ? null
      : closest.length === 1
        ? `設定${closest[0]}寄り`
        : `設定${closest.join('・')}寄り`

  const observedLabel =
    observed == null ? '—' : def.kind === 'glow' ? formatPercent(observed) : formatOneIn(observed)

  const trials = def.kind === 'glow' ? state.hits : games

  return (
    <article className="yaku-card">
      <div className="yaku-head">
        <h2>{def.name}</h2>
        {guess ? <span className="badge">{guess}</span> : <span className="badge">サンプル待ち</span>}
      </div>
      <p className="hint">{def.hint}</p>
      {def.appearance ? <p className="appearance">{def.appearance}</p> : null}

      <div className="pads">
        <div className="pad">
          <span className="label">{def.kind === 'glow' ? '成立' : '回数'}</span>
          <span className="value">{state.hits}</span>
          <div className="pm">
            <button type="button" className="minus" aria-label={`${def.name}をマイナス`} onClick={() => onHits(-1)}>
              −
            </button>
            <button type="button" className="plus" aria-label={`${def.name}をプラス`} onClick={() => onHits(1)}>
              ＋
            </button>
          </div>
        </div>

        {def.kind === 'glow' ? (
          <div className="pad">
            <span className="label">発光</span>
            <span className="value">{state.glows}</span>
            <div className="pm">
              <button type="button" className="minus" aria-label={`${def.name}の発光をマイナス`} onClick={() => onGlows(-1)}>
                −
              </button>
              <button type="button" className="plus" aria-label={`${def.name}の発光をプラス`} onClick={() => onGlows(1)}>
                ＋
              </button>
            </div>
          </div>
        ) : (
          <div className="pad">
            <span className="label">分母</span>
            <span className="value">{games}</span>
          </div>
        )}

        <div className="pad">
          <span className="label">{def.kind === 'glow' ? '発光率' : '出現率'}</span>
          <span className="value rate">{observedLabel}</span>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>設定</th>
              <th>確率</th>
              <th>期待</th>
              <th>差</th>
            </tr>
          </thead>
          <tbody>
            {def.probabilities.map((row) => {
              const expected = row.rate != null && trials > 0 ? row.rate * trials : null
              const actual = def.kind === 'glow' ? state.glows : state.hits
              const delta = expected != null ? actual - expected : null
              const isClosest = closest.includes(row.setting)
              return (
                <tr
                  key={row.setting}
                  className={row.rate == null ? 'unknown' : isClosest ? 'closest' : undefined}
                >
                  <td>設定{row.setting}</td>
                  <td>
                    {row.label}
                    {row.band ? `（${row.band}）` : ''}
                  </td>
                  <td>{expected == null ? '—' : expected.toFixed(1)}</td>
                  <td className={delta == null ? undefined : delta >= 0 ? 'pos' : 'neg'}>
                    {delta == null ? '—' : formatDelta(delta)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="source">{def.sourceNote}</p>
    </article>
  )
}
