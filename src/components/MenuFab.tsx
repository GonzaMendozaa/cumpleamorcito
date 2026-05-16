'use client'

interface Props {
  onClick: () => void
}

export default function MenuFab({ onClick }: Props) {
  return (
    <button className="menu-fab" onClick={onClick} title="Ir al menú">
      <span className="menu-fab-icon">☰</span>
      <span className="menu-fab-label">MENÚ</span>
    </button>
  )
}
