import { machines } from '../data/machines.ts'

type Props = {
  onOpen: (id: string) => void
}

export function Home({ onOpen }: Props) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <small>Pachislot counter</small>
          <strong>小役カウンター</strong>
        </div>
      </header>
      <p className="lede">
        機種を選んで小役をカウントします。成立と発光、総ゲーム数はプラスマイナスで直しつつ、設定ごとの確率を横に置いて見比べられます。
      </p>
      <div className="machine-grid">
        {machines.map((machine) => (
          <button
            key={machine.id}
            type="button"
            className={`machine-card theme-${machine.theme}`}
            onClick={() => onOpen(machine.id)}
          >
            <span className="rail" />
            <span>
              <span className="kicker">{machine.kicker}</span>
              <span className="name">{machine.name}</span>
              <span className="sub">{machine.subtitle}</span>
            </span>
            <span className="go">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
