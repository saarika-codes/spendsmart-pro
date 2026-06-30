import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, TrendingUp, Lightbulb, Settings, Menu, X } from 'lucide-react'
import { monthName } from '../utils/formatters'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/analytics', icon: PieChart, label: 'Analytics' },
  { to: '/budgets', icon: Target, label: 'Budgets' },
  { to: '/goals', icon: TrendingUp, label: 'Goals' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ finance }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { settings } = finance
  const name = settings.userName || 'Guest'
  const initial = name ? name[0].toUpperCase() : '?'

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-brand-icon">💰</div>
          <div>
            <div className="sb-brand-name">SpendSmart</div>
            <div className="sb-brand-tag">Pro</div>
          </div>
          <button className="sb-close" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>

        <nav className="sb-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} className="sb-link-ic" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sb-period-box">
          <div className="sb-period-lbl">Current Period</div>
          <div className="sb-period-val">{monthName(new Date().toISOString().slice(0, 7))}</div>
        </div>

        <div className="sb-user">
          <div className="sb-user-av">{initial}</div>
          <div className="sb-user-info">
            <div className="sb-user-name">{name}</div>
            <div className="sb-user-role">Personal Account</div>
          </div>
        </div>
      </aside>

      <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>
    </>
  )
}
