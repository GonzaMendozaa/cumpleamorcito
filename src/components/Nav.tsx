'use client'

type Section = 'carta' | 'regalo'

interface Props {
  activeSection: Section
  onSwitch: (section: Section) => void
}

export default function Nav({ activeSection, onSwitch }: Props) {
  return (
    <nav className="pixel-nav">
      <button
        className={`nav-btn${activeSection === 'carta' ? ' active' : ''}`}
        onClick={() => onSwitch('carta')}
      >
        💌 CARTA
      </button>
      <span className="nav-divider">♥</span>
      <button
        className={`nav-btn${activeSection === 'regalo' ? ' active' : ''}`}
        onClick={() => onSwitch('regalo')}
      >
        🎁 REGALO
      </button>
    </nav>
  )
}
