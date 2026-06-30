import { useMemo } from 'react'
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { fmtCurrency } from '../utils/formatters'
import { calculateHealthScore, generateInsights, getMonthlyData } from '../utils/calculations'

export default function Insights({ finance }) {
  const { transactions, categories, budgets, settings, income, expense, balance } = finance
  const currency = settings.currency || '₹'

  const healthScore = useMemo(() => calculateHealthScore(income, expense, budgets, transactions), [income, expense, budgets, transactions])
  const insights = useMemo(() => generateInsights(transactions, categories, budgets), [transactions, categories, budgets])
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions])

  const avgIncome = monthly.length > 0 ? monthly.reduce((s, m) => s + m.income, 0) / monthly.length : 0
  const avgExpense = monthly.length > 0 ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length : 0
  const avgSavings = monthly.length > 0 ? monthly.reduce((s, m) => s + m.savings, 0) / monthly.length : 0

  const iconMap = {
    warning: AlertTriangle,
    danger: AlertTriangle,
    info: Info,
    success: CheckCircle,
  }

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">Spending Insights</h1>
          <p className="page-sub">Smart analysis of your financial habits</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card health-card">
          <div className="card-title">💚 Financial Health Score</div>
          <div className="health-score-wrap">
            <div className="health-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--track-color)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#F59E0B' : '#EF4444'} strokeWidth="10" strokeDasharray={`${healthScore * 3.14} ${314 - healthScore * 3.14}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
              </svg>
              <div className="health-val">{healthScore}<span>/100</span></div>
            </div>
            <div className="health-label">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
          <div className="health-breakdown">
            <div className="health-metric">
              <span>Savings Rate</span>
              <strong>{income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%</strong>
            </div>
            <div className="health-metric">
              <span>Budget Compliance</span>
              <strong>{healthScore >= 50 ? 'On Track' : 'At Risk'}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">📊 Monthly Averages</div>
          <div className="avg-metrics">
            <div className="avg-metric">
              <span className="avg-label">Avg Income</span>
              <span className="avg-value" style={{ color: 'var(--c-green)' }}>{fmtCurrency(avgIncome, currency)}</span>
            </div>
            <div className="avg-metric">
              <span className="avg-label">Avg Expense</span>
              <span className="avg-value" style={{ color: 'var(--c-rose)' }}>{fmtCurrency(avgExpense, currency)}</span>
            </div>
            <div className="avg-metric">
              <span className="avg-label">Avg Savings</span>
              <span className="avg-value" style={{ color: 'var(--c-indigo)' }}>{fmtCurrency(avgSavings, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title">💡 Insights & Alerts</div>
        <div className="insights-list">
          {insights.length > 0 ? insights.map((insight, i) => {
            const Icon = iconMap[insight.type] || Info
            return (
              <div key={i} className={`insight-item ${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-text">{insight.text}</span>
              </div>
            )
          }) : (
            <div className="empty-box">
              <div className="empty-ico">💡</div>
              <div className="empty-title">No insights yet</div>
              <div className="empty-text">Add more transactions to generate insights</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
