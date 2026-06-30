import { Moon, Sun, User } from 'lucide-react'

export default function TopBar({ finance, theme }) {
  const { settings } = finance
  const name = settings.userName || 'Guest'
  const initial = name ? name[0].toUpperCase() : '?'

  return (
    <header className="topbar">
      <div className="topbar-brand">💰 SpendSmart Pro</div>
      <div className="topbar-right">
        <button className="theme-btn" onClick={theme.toggle} title="Toggle theme">
          {theme.isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="topbar-profile" title={name}>
          {initial}
        </div>
      </div>
    </header>
  )
}
