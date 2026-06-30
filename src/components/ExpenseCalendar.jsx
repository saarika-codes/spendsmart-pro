import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fmtCurrency } from '../utils/formatters'
import { getCalendarData } from '../utils/calculations'

export default function ExpenseCalendar({ transactions, settings }) {
  const currency = settings.currency || '₹'
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const calendarData = useMemo(() => getCalendarData(transactions, year, month), [transactions, year, month])
  const monthTxns = useMemo(() => 
    transactions.filter(t => t.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)),
  [transactions, year, month])

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month - 1, 1).getDay()
  const monthName = new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  const totalSpent = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalIncome = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const avgDaily = totalSpent / daysInMonth

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeks = []
  let days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  const maxAmount = Math.max(...Object.values(calendarData), 1)

  return (
    <div className="card">
      <div className="calendar-header">
        <div>
          <div className="card-title">📅 Expense Calendar</div>
          <div className="calendar-sub">{monthName}</div>
        </div>
        <div className="calendar-nav">
          <button className="ico-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
          <span className="calendar-month">{monthName}</span>
          <button className="ico-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="calendar-summary">
        <div className="cal-stat">
          <span>Total Spent</span>
          <strong>{fmtCurrency(totalSpent, currency)}</strong>
        </div>
        <div className="cal-stat">
          <span>Total Income</span>
          <strong style={{ color: 'var(--c-green)' }}>{fmtCurrency(totalIncome, currency)}</strong>
        </div>
        <div className="cal-stat">
          <span>Avg/Day</span>
          <strong>{fmtCurrency(avgDaily, currency)}</strong>
        </div>
      </div>

      <div className="calendar-grid">
        {dayNames.map(d => <div key={d} className="cal-day-header">{d}</div>)}
        {weeks.map((week, wi) => (
          week.map((day, di) => {
            if (day === null) return <div key={`${wi}-${di}`} className="cal-day empty" />
            const amount = calendarData[day] || 0
            const intensity = amount > 0 ? Math.max(0.15, amount / maxAmount) : 0
            const isToday = new Date().toDateString() === new Date(year, month - 1, day).toDateString()
            return (
              <div key={`${wi}-${di}`} className={`cal-day ${isToday ? 'today' : ''}`}>
                <div className="cal-day-num">{day}</div>
                {amount > 0 && (
                  <div className="cal-day-amount" style={{ opacity: 0.5 + intensity * 0.5 }}>
                    {fmtCurrency(amount, currency)}
                  </div>
                )}
                <div className="cal-day-bar" style={{ height: `${intensity * 100}%`, opacity: intensity > 0 ? 0.3 + intensity * 0.7 : 0 }} />
              </div>
            )
          })
        ))}
      </div>

      {monthTxns.length > 0 && (
        <div className="calendar-txns">
          <div className="card-title" style={{ fontSize: '14px', marginBottom: '12px' }}>Transactions this month</div>
          <div className="cal-txn-list">
            {monthTxns.slice(0, 10).map(t => (
              <div key={t.id} className="cal-txn-row">
                <span className="cal-txn-date">{t.date.slice(8)}</span>
                <span className="cal-txn-title">{t.title}</span>
                <span className={`cal-txn-amt ${t.type}`}>{t.type === 'income' ? '+' : '-'}{fmtCurrency(t.amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
