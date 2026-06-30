export default function StatCard({ label, value, icon: Icon, color, sub }) {
  const colorMap = {
    green: { bg: 'var(--bg-green)', border: 'var(--bd-green)', text: 'var(--c-green)' },
    rose: { bg: 'var(--bg-rose)', border: 'var(--bd-rose)', text: 'var(--c-rose)' },
    amber: { bg: 'var(--bg-amber)', border: 'var(--bd-amber)', text: 'var(--c-amber)' },
    indigo: { bg: 'var(--bg-indigo)', border: 'var(--bd-indigo)', text: 'var(--c-indigo)' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <div className="stat-card" style={{ background: c.bg, borderColor: c.border }}>
      <div className="stat-top">
        <span className="stat-lbl">{label}</span>
        <Icon size={22} style={{ color: c.text }} />
      </div>
      <div className="stat-val" style={{ color: c.text }}>{value}</div>
      <div className="stat-sub">{sub}</div>
      <div className="stat-progress"><div className="stat-prog-fill" style={{ background: c.text, width: '60%' }} /></div>
    </div>
  )
}
