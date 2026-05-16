'use client'

const SECTIONS = [
  { stage: 'sobre',     icon: '💌', label: 'SOBRE',    desc: 'El mensaje' },
  { stage: 'carta',     icon: '📝', label: 'CARTA',    desc: 'Mi dedicatoria' },
  { stage: 'fotos',     icon: '📸', label: 'FOTOS',    desc: 'Nuestros momentos' },
  { stage: 'mixtape',   icon: '🎵', label: 'MIXTAPE',  desc: 'Nuestra cinta' },
  { stage: 'minijuego', icon: '🎮', label: 'JUEGO',    desc: 'Atrapá corazones' },
  { stage: 'sorpresa',  icon: '🎁', label: 'REGALO',   desc: 'Tu sorpresa' },
] as const

interface Props {
  onGoTo: (stage: string) => void
  onBack: () => void
}

export default function MenuPage({ onGoTo, onBack }: Props) {
  return (
    <div className="menu-page">
      <button className="page-back-btn" onClick={onBack}>◀ VOLVER</button>

      <div className="page-badge page-badge--purple">✦ MENÚ ✦</div>
      <p className="menu-subtitle">¿Qué querés volver a ver?</p>

      <div className="menu-grid">
        {SECTIONS.map(({ stage, icon, label, desc }) => (
          <button
            key={stage}
            className="menu-card"
            onClick={() => onGoTo(stage)}
          >
            <span className="menu-card-icon">{icon}</span>
            <span className="menu-card-label">{label}</span>
            <span className="menu-card-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
