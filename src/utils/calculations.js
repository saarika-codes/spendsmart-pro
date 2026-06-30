import { getMonthKey } from '../data/models'

export function calculateHealthScore(income, expense, budgets, transactions) {
  if (income === 0) return 0

  const savingsRate = Math.max(0, (income - expense) / income) * 100

  // Budget compliance
  const currentMonth = getMonthKey()
  const monthBudgets = budgets.filter(b => b.month === currentMonth)
  let complianceScore = 100
  if (monthBudgets.length > 0) {
    let overBudget = 0
    monthBudgets.forEach(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === b.categoryId && t.date.startsWith(currentMonth))
        .reduce((s, t) => s + t.amount, 0)
      if (spent > b.amount) overBudget++
    })
    complianceScore = ((monthBudgets.length - overBudget) / monthBudgets.length) * 100
  }

  // Consistency bonus (if savings rate > 20%)
  const consistencyBonus = savingsRate > 20 ? 10 : savingsRate > 10 ? 5 : 0

  const score = Math.round((savingsRate * 0.5) + (complianceScore * 0.3) + consistencyBonus)
  return Math.min(100, Math.max(0, score))
}

export function generateInsights(transactions, categories, budgets) {
  const insights = []
  const currentMonth = getMonthKey()
  const [cy, cm] = currentMonth.split('-').map(Number)
  const prevMonth = `${cy}-${String(cm - 1 || 12).padStart(2, '0')}`
  const prevYear = cm === 1 ? cy - 1 : cy
  const prevMonthKey = `${prevYear}-${String(cm - 1 || 12).padStart(2, '0')}`

  const currentTxns = transactions.filter(t => t.date.startsWith(currentMonth))
  const prevTxns = transactions.filter(t => t.date.startsWith(prevMonthKey))

  // Category spending comparison
  categories.forEach(cat => {
    if (cat.type !== 'expense') return
    const curr = currentTxns.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0)
    const prev = prevTxns.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0)

    if (prev > 0 && curr > prev * 1.25) {
      const pct = Math.round(((curr - prev) / prev) * 100)
      insights.push({
        type: 'warning',
        text: `You spent ${pct}% more on ${cat.name} this month compared to last month.`,
        icon: '⚠️',
      })
    }
  })

  // Budget alerts
  budgets.filter(b => b.month === currentMonth).forEach(b => {
    const spent = currentTxns.filter(t => t.type === 'expense' && t.category === b.categoryId).reduce((s, t) => s + t.amount, 0)
    const pct = (spent / b.amount) * 100
    if (pct >= 100) {
      insights.push({
        type: 'danger',
        text: `You have exceeded your ${categories.find(c => c.id === b.categoryId)?.name || 'category'} budget by ${fmtCurrency(spent - b.amount)}!`,
        icon: '🚨',
      })
    } else if (pct >= 90) {
      insights.push({
        type: 'warning',
        text: `90% of ${categories.find(c => c.id === b.categoryId)?.name || 'category'} budget used. Only ${fmtCurrency(b.amount - spent)} left.`,
        icon: '⚡',
      })
    } else if (pct >= 75) {
      insights.push({
        type: 'info',
        text: `75% of ${categories.find(c => c.id === b.categoryId)?.name || 'category'} budget used.`,
        icon: '💡',
      })
    }
  })

  // Savings insight
  const income = currentTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = currentTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  if (income > 0) {
    const rate = ((income - expense) / income) * 100
    if (rate >= 30) {
      insights.push({ type: 'success', text: `Excellent savings rate of ${Math.round(rate)}%! Keep it up.`, icon: '🎉' })
    } else if (rate < 10) {
      insights.push({ type: 'warning', text: `Your savings rate is only ${Math.round(rate)}%. Try to save at least 20%.`, icon: '💸' })
    }
  }

  return insights
}

export function getMonthlyData(transactions, months = 6) {
  const data = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthTxns = transactions.filter(t => t.date.startsWith(key))
    const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    data.push({
      month: d.toLocaleString('en-IN', { month: 'short' }),
      income,
      expense,
      savings: Math.max(0, income - expense),
    })
  }
  return data
}

export function getCategoryBreakdown(transactions, categories, type = 'expense') {
  const map = {}
  transactions.filter(t => t.type === type).forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount
  })
  return Object.entries(map)
    .map(([catId, amount]) => ({
      id: catId,
      name: categories.find(c => c.id === catId)?.name || 'Unknown',
      color: categories.find(c => c.id === catId)?.color || '#888',
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getCalendarData(transactions, year, month) {
  const key = `${year}-${String(month).padStart(2, '0')}`
  const days = new Date(year, month, 0).getDate()
  const data = {}
  for (let d = 1; d <= days; d++) {
    data[d] = 0
  }
  transactions.filter(t => t.date.startsWith(key)).forEach(t => {
    const day = parseInt(t.date.slice(8, 10))
    if (data[day] !== undefined) data[day] += t.amount
  })
  return data
}

function fmtCurrency(amount, currency = '₹') {
  const abs = Math.abs(amount)
  if (abs >= 10000000) return `${currency}${(amount / 10000000).toFixed(1)}Cr`
  if (abs >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`
  if (abs >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`
  return `${currency}${Number(amount).toLocaleString('en-IN')}`
}
