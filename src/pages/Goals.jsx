import { useState } from 'react'
import { Target, Plus, Trash2, TrendingUp } from 'lucide-react'
import { fmtCurrency } from '../utils/formatters'

export default function Goals({ finance }) {
  const { goals, addGoal, updateGoal, deleteGoal, settings } = finance
  const currency = settings.currency || '₹'

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '', color: '#4F46E5' })

  const handleAdd = () => {
    if (!form.title.trim() || !form.targetAmount || parseFloat(form.targetAmount) <= 0) return
    addGoal({
      title: form.title.trim(),
      targetAmount: parseFloat(form.targetAmount),
      deadline: form.deadline || null,
      color: form.color,
    })
    setForm({ title: '', targetAmount: '', deadline: '', color: '#4F46E5' })
    setShowForm(false)
  }

  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">Goal Tracker</h1>
          <p className="page-sub">Save towards what matters</p>
        </div>
        <button className="btn-cta" onClick={() => setShowForm(!showForm)}><Plus size={16} /> {showForm ? 'Cancel' : 'New Goal'}</button>
      </div>

      {showForm && (
        <div className="card form-card">
          <div className="fgrid">
            <div className="frow full">
              <label className="flbl">Goal Name</label>
              <input className="finp" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Laptop Fund" />
            </div>
            <div className="frow">
              <label className="flbl">Target Amount ({currency})</label>
              <input className="finp" type="number" min="0" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} placeholder="80000" />
            </div>
            <div className="frow">
              <label className="flbl">Deadline (optional)</label>
              <input className="finp" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="frow full">
              <label className="flbl">Color</label>
              <div className="color-picker">
                {colors.map(c => (
                  <button key={c} type="button" className={`color-dot ${form.color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                ))}
              </div>
            </div>
          </div>
          <button className="btn-submit" onClick={handleAdd}>Create Goal</button>
        </div>
      )}

      <div className="goals-grid">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
          return (
            <div key={goal.id} className="card goal-card">
              <div className="goal-header">
                <div className="goal-icon" style={{ background: goal.color + '20', color: goal.color }}><Target size={20} /></div>
                <div className="goal-title-wrap">
                  <div className="goal-title">{goal.title}</div>
                  {goal.deadline && <div className="goal-deadline">Due {goal.deadline}</div>}
                </div>
                <button className="ico-btn" onClick={() => { if (confirm('Delete this goal?')) deleteGoal(goal.id) }}><Trash2 size={14} /></button>
              </div>
              <div className="goal-amounts">
                <span className="goal-current">{fmtCurrency(goal.currentAmount, currency)}</span>
                <span className="goal-target">of {fmtCurrency(goal.targetAmount, currency)}</span>
              </div>
              <div className="goal-bar-wrap">
                <div className="goal-bar"><div className="goal-fill" style={{ width: `${pct}%`, background: goal.color }} /></div>
                <span className="goal-pct">{pct}%</span>
              </div>
              <div className="goal-actions">
                <button className="btn-outline" onClick={() => {
                  const amt = prompt(`Add to ${goal.title}. Current: ${fmtCurrency(goal.currentAmount, currency)}
Enter amount to add:`)
                  if (amt && !isNaN(amt)) updateGoal(goal.id, { currentAmount: goal.currentAmount + parseFloat(amt) })
                }}><TrendingUp size={14} /> Add Progress</button>
              </div>
            </div>
          )
        })}
        {goals.length === 0 && (
          <div className="empty-box">
            <div className="empty-ico">🎯</div>
            <div className="empty-title">No goals yet</div>
            <div className="empty-text">Create a goal to start tracking your savings targets</div>
          </div>
        )}
      </div>
    </div>
  )
}
