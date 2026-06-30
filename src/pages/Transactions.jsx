import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Download, Plus, Edit2, Trash2 } from 'lucide-react'
import { fmtCurrency, fmtDate } from '../utils/formatters'
import { exportToCSV } from '../utils/export'

export default function Transactions({ finance }) {
  const { transactions, categories, settings, deleteTransaction } = finance
  const currency = settings.currency || '₹'
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCat, setFilterCat] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const filtered = useMemo(() => {
    let list = [...transactions].reverse()
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== 'all') list = list.filter(t => t.type === filterType)
    if (filterCat) list = list.filter(t => t.category === filterCat)
    if (filterDateFrom) list = list.filter(t => t.date >= filterDateFrom)
    if (filterDateTo) list = list.filter(t => t.date <= filterDateTo)
    return list
  }, [transactions, search, filterType, filterCat, filterDateFrom, filterDateTo])

  const handleExport = () => {
    const ok = exportToCSV(transactions, categories, currency)
    if (!ok) alert('No data to export')
  }

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">All Transactions</h1>
          <p className="page-sub">Your complete income & expense history</p>
        </div>
        <div className="hero-btns">
          <button className="btn-outline" onClick={handleExport}><Download size={16} /> Export CSV</button>
          <Link to="/transactions/new" className="btn-cta"><Plus size={16} /> Add</Link>
        </div>
      </div>

      <div className="card filter-card">
        <div className="filter-row">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input className="search-inp" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input type="date" className="filter-select" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
          <input type="date" className="filter-select" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="txn-scroll-full">
          {filtered.length > 0 ? filtered.map(t => (
            <div key={t.id} className="txn-row">
              <div className="txn-ic" style={{ background: categories.find(c => c.id === t.category)?.color + '20' }}>
                {categories.find(c => c.id === t.category)?.icon || '📦'}
              </div>
              <div className="txn-info">
                <div className="txn-desc">{t.title}</div>
                <div className="txn-meta">{categories.find(c => c.id === t.category)?.name || t.category} · {fmtDate(t.date)}</div>
              </div>
              <div className={`txn-amt ${t.type}`}>{t.type === 'income' ? '+' : '-'}{fmtCurrency(t.amount, currency)}</div>
              <div className="txn-acts">
                <Link to={`/transactions/edit/${t.id}`} className="ico-btn edit"><Edit2 size={14} /></Link>
                <button className="ico-btn" onClick={() => { if (confirm('Delete this transaction?')) deleteTransaction(t.id) }}><Trash2 size={14} /></button>
              </div>
            </div>
          )) : (
            <div className="empty-box">
              <div className="empty-ico">🔍</div>
              <div className="empty-title">No transactions found</div>
              <div className="empty-text">Try adjusting your filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
