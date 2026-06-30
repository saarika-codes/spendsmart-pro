import { useState, useMemo } from 'react'
import { Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { fmtCurrency } from '../utils/formatters'
import { getMonthKey } from '../data/models'

export default function Budgets({ finance }) {
  const { transactions, categories, budgets, setBudget, deleteBudget, settings } = finance
  const currency = settings.currency || '₹'
  const currentMonth = getMonthKey()

  const [selectedCat, setSelectedCat] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')

  const expenseCats = categories.filter(c => c.type === 'expense' || c.type === 'both')

  const monthBudgets = useMemo(() => budgets.filter(b => b.month === currentMonth), [budgets, currentMonth])
  const monthTxns = useMemo(() => transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)), [transactions, currentMonth])

  const handleSetBudget = () => {
    if (!selectedCat || !budgetAmount || parseFloat(budgetAmount) <= 0) return
    setBudget(selectedCat, parseFloat(budgetAmount), currentMonth)
    setSelectedCat('')
    setBudgetAmount('')
  }

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">Budget Goals</h1>
          <p className="page-sub">Set limits and monitor your monthly spending</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>💳 Set Budget</div>
          <div className="budget-set-row">
            <div className="frow" style={{ flex: 1 }}>
              <label className="flbl">Category</label>
              <select className="finp" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
                <option value="">Select category...</option>
                {expenseCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="frow" style={{ flex: 1 }}>
              <label className="flbl">Budget Amount ({currency})</label>
              <input className="finp" type="number" min="0" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} placeholder="e.g. 5000" />
            </div>
            <button className="btn-cta" style={{ alignSelf: 'flex-end', flexShrink: 0 }} onClick={handleSetBudget}>Set</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>📊 Overall Status</div>
          <div className="budget-summary">
            {monthBudgets.length === 0 ? (
              <p className="empty-text">No budgets set for this month</p>
            ) : (
              <div className="budget-stats">
                <div className="budget-stat">
                  <span>Total Budgeted</span>
                  <strong>{fmtCurrency(monthBudgets.reduce((s, b) => s + b.amount, 0), currency)}</strong>
                </div>
                <div className="budget-stat">
                  <span>Categories</span>
                  <strong>{monthBudgets.length}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title" style={{ marginBottom: '16px' }}>🏷️ Category Budgets</div>
        <div className="budget-grid">
          {monthBudgets.map(b => {
            const cat = categories.find(c => c.id === b.categoryId)
            const spent = monthTxns.filter(t => t.category === b.categoryId).reduce((s, t) => s + t.amount, 0)
            const pct = Math.min(100, Math.round((spent / b.amount) * 100))
            const remaining = b.amount - spent
            const isOver = spent > b.amount
            const isWarning = pct >= 90 && !isOver

            return (
              <div key={b.id} className="budget-item">
                <div className="budget-item-header">
                  <div className="budget-cat">
                    <span className="budget-cat-icon" style={{ background: cat?.color + '20' }}>{cat?.icon || '📦'}</span>
                    <span>{cat?.name || b.categoryId}</span>
                  </div>
                  <button className="remove-btn" onClick={() => deleteBudget(b.id)}>Remove</button>
                </div>
                <div className="budget-track-top">
                  <span>{fmtCurrency(spent, currency)} spent</span>
                  <span>{pct}% of {fmtCurrency(b.amount, currency)}</span>
                </div>
                <div className="b-track">
                  <div className={`b-fill ${isOver ? 'over' : isWarning ? 'warn' : 'ok'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="budget-item-footer">
                  {isOver ? (
                    <span className="budget-alert over"><AlertTriangle size={14} /> Over by {fmtCurrency(Math.abs(remaining), currency)}</span>
                  ) : isWarning ? (
                    <span className="budget-alert warn"><AlertTriangle size={14} /> {fmtCurrency(remaining, currency)} left</span>
                  ) : (
                    <span className="budget-alert ok"><CheckCircle size={14} /> {fmtCurrency(remaining, currency)} remaining</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
