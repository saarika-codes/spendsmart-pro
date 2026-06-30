import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, TrendingUp, AlertTriangle, Database } from 'lucide-react'
import { fmtCurrency, greetWord } from '../utils/formatters'
import { calculateHealthScore, generateInsights, getCategoryBreakdown } from '../utils/calculations'
import StatCard from '../components/StatCard'

export default function Dashboard({ finance, onLoadDemo }) {
  const { transactions, categories, budgets, settings, income, expense, balance, savingsRate } = finance
  const currency = settings.currency || '₹'
  const name = settings.userName || 'Guest'

  const healthScore = useMemo(() => calculateHealthScore(income, expense, budgets, transactions), [income, expense, budgets, transactions])
  const insights = useMemo(() => generateInsights(transactions, categories, budgets), [transactions, categories, budgets])
  const topCategory = useMemo(() => {
    const cats = getCategoryBreakdown(transactions, categories, 'expense')
    return cats[0] || null
  }, [transactions, categories])

  const recentTxns = useMemo(() => [...transactions].reverse().slice(0, 8), [transactions])
  const hasData = transactions.length > 0

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">{greetWord()}, {name} 👋</h1>
          <p className="page-sub">Your financial overview for this month</p>
        </div>
        <Link to="/transactions/new" className="btn-cta">＋ Add Transaction</Link>
      </div>

      {!hasData && (
        <div className="card demo-banner">
          <div className="demo-banner-content">
            <div className="demo-banner-icon">🚀</div>
            <div>
              <div className="demo-banner-title">New to SpendSmart Pro?</div>
              <div className="demo-banner-text">Load demo data to explore all features with realistic transactions, budgets, and goals.</div>
            </div>
            <button className="btn-cta" onClick={onLoadDemo}><Database size={16} /> Load Demo Data</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard label="Total Balance" value={fmtCurrency(balance, currency)} icon={Wallet} color="indigo" sub={`${fmtCurrency(income, currency)} in · ${fmtCurrency(expense, currency)} out`} />
        <StatCard label="Monthly Income" value={fmtCurrency(income, currency)} icon={ArrowUpRight} color="green" sub="This month" />
        <StatCard label="Monthly Expenses" value={fmtCurrency(expense, currency)} icon={ArrowDownRight} color="rose" sub="This month" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} icon={PiggyBank} color="amber" sub={savingsRate >= 20 ? 'Great job!' : 'Try to save 20%'} />
      </div>

      {/* Health Score + Top Category */}
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
          <div className="card-title">🏆 Top Spending Category</div>
          {topCategory ? (
            <div className="top-cat-display">
              <div className="top-cat-ic" style={{ background: topCategory.color + '20', color: topCategory.color }}>
                {categories.find(c => c.id === topCategory.id)?.icon || '📦'}
              </div>
              <div className="top-cat-info">
                <div className="top-cat-name">{topCategory.name}</div>
                <div className="top-cat-amt">{fmtCurrency(topCategory.amount, currency)}</div>
                <div className="top-cat-bar"><div className="top-cat-fill" style={{ width: '100%', background: topCategory.color }} /></div>
              </div>
            </div>
          ) : (
            <p className="empty-text">No expense data yet</p>
          )}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="card">
          <div className="card-title">💡 Insights</div>
          <div className="insights-list">
            {insights.slice(0, 4).map((insight, i) => (
              <div key={i} className={`insight-item ${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-text">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Recent Transactions</div>
          <Link to="/transactions" className="btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>View All</Link>
        </div>
        <div className="txn-list">
          {recentTxns.length > 0 ? recentTxns.map(t => (
            <div key={t.id} className="txn-row">
              <div className="txn-ic" style={{ background: categories.find(c => c.id === t.category)?.color + '20' }}>
                {categories.find(c => c.id === t.category)?.icon || '📦'}
              </div>
              <div className="txn-info">
                <div className="txn-desc">{t.title}</div>
                <div className="txn-meta">{categories.find(c => c.id === t.category)?.name || t.category} · {t.date}</div>
              </div>
              <div className={`txn-amt ${t.type}`}>{t.type === 'income' ? '+' : '-'}{fmtCurrency(t.amount, currency)}</div>
            </div>
          )) : (
            <div className="empty-box">
              <div className="empty-ico">📭</div>
              <div className="empty-title">No transactions yet</div>
              <div className="empty-text">Add your first transaction or load demo data to get started</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
