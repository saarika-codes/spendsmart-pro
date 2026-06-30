import { useMemo } from 'react'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'
import { fmtCurrency } from '../utils/formatters'
import { getCategoryBreakdown, getMonthlyData } from '../utils/calculations'
import ExpenseCalendar from '../components/ExpenseCalendar'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

export default function Analytics({ finance }) {
  const { transactions, categories, settings } = finance
  const currency = settings.currency || '₹'

  const catData = useMemo(() => getCategoryBreakdown(transactions, categories, 'expense'), [transactions, categories])
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions])

  const pieData = {
    labels: catData.map(c => c.name),
    datasets: [{
      data: catData.map(c => c.amount),
      backgroundColor: catData.map(c => c.color),
      borderWidth: 0,
    }]
  }

  const barData = {
    labels: monthly.map(m => m.month),
    datasets: [
      { label: 'Income', data: monthly.map(m => m.income), backgroundColor: '#10B981', borderRadius: 6 },
      { label: 'Expense', data: monthly.map(m => m.expense), backgroundColor: '#EF4444', borderRadius: 6 },
    ]
  }

  const lineData = {
    labels: monthly.map(m => m.month),
    datasets: [{
      label: 'Savings',
      data: monthly.map(m => m.savings),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79,70,229,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#4F46E5',
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
  }

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">Reports & Insights</h1>
          <p className="page-sub">Visual overview of your financial habits</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card chart-card">
          <div className="card-title">Expenses by Category</div>
          <div className="chart-wrap">
            {catData.length > 0 ? <Pie data={pieData} options={chartOptions} /> : <p className="empty-text">No expense data</p>}
          </div>
        </div>
        <div className="card chart-card">
          <div className="card-title">Income vs Expenses</div>
          <div className="chart-wrap">
            <Bar data={barData} options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
      </div>

      <div className="card chart-card" style={{ marginTop: '16px' }}>
        <div className="card-title">Savings Trend</div>
        <div className="chart-wrap" style={{ height: '300px' }}>
          <Line data={lineData} options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>

      {/* Expense Calendar */}
      <div style={{ marginTop: '16px' }}>
        <ExpenseCalendar transactions={transactions} settings={settings} />
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title">🏆 Top Spending Categories</div>
        <div className="top-cats-list">
          {catData.map((c, i) => (
            <div key={c.id} className="tc-row">
              <div className="tc-rank">#{i + 1}</div>
              <div className="tc-ic" style={{ background: c.color + '20' }}>{categories.find(cat => cat.id === c.id)?.icon || '📦'}</div>
              <div className="tc-info">
                <div className="tc-name">{c.name}</div>
                <div className="tc-bar"><div className="tc-fill" style={{ width: `${catData[0].amount ? (c.amount / catData[0].amount * 100) : 0}%`, background: c.color }} /></div>
              </div>
              <div className="tc-amt">{fmtCurrency(c.amount, currency)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
