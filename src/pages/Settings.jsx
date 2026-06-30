import { useState, useRef } from 'react'
import { User, Moon, Sun, Download, Upload, Trash2, Database } from 'lucide-react'
import { importFromCSV, exportToCSV } from '../utils/export'

export default function SettingsPage({ finance, theme, onLoadDemo }) {
  const { settings, updateSettings, categories, addCategory, deleteCategory, transactions, setTransactions } = finance
  const currency = settings.currency || '₹'
  const [newCat, setNewCat] = useState({ name: '', icon: '📦', color: '#4F46E5', type: 'expense' })
  const fileRef = useRef()

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const imported = importFromCSV(ev.target.result)
      if (imported.length > 0) {
        setTransactions(prev => [...prev, ...imported])
        alert(`Imported ${imported.length} transactions`)
      } else {
        alert('No valid transactions found in file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExport = () => {
    const ok = exportToCSV(transactions, categories, currency)
    if (!ok) alert('No data to export')
  }

  const handleClear = () => {
    if (confirm('⚠️ Delete ALL data? This cannot be undone.')) {
      setTransactions([])
      alert('All data cleared')
    }
  }

  const handleAddCat = () => {
    if (!newCat.name.trim()) return
    addCategory({ name: newCat.name.trim(), icon: newCat.icon, color: newCat.color, type: newCat.type })
    setNewCat({ name: '', icon: '📦', color: '#4F46E5', type: 'expense' })
  }

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your account, categories & data</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>👤 Account</div>
          <div className="fgrid">
            <div className="frow full">
              <label className="flbl">Display Name</label>
              <input className="finp" value={settings.userName} onChange={e => updateSettings({ userName: e.target.value })} placeholder="Your name" />
            </div>
            <div className="frow full">
              <label className="flbl">Currency</label>
              <select className="finp" value={settings.currency} onChange={e => updateSettings({ currency: e.target.value })}>
                <option value="₹">₹ Indian Rupee</option>
                <option value="$">$ US Dollar</option>
                <option value="€">€ Euro</option>
                <option value="£">£ British Pound</option>
              </select>
            </div>
            <div className="frow full">
              <label className="flbl">Theme</label>
              <button className="btn-outline" onClick={theme.toggle} style={{ justifyContent: 'center' }}>
                {theme.isDark ? <Sun size={16} /> : <Moon size={16} />} {theme.isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>🏷️ Categories</div>
          <div className="fgrid">
            <div className="frow">
              <label className="flbl">Name</label>
              <input className="finp" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} placeholder="e.g. Travel" />
            </div>
            <div className="frow">
              <label className="flbl">Emoji</label>
              <input className="finp" value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} maxLength={2} placeholder="✈️" />
            </div>
            <div className="frow">
              <label className="flbl">Color</label>
              <input className="finp" type="color" value={newCat.color} onChange={e => setNewCat({ ...newCat, color: e.target.value })} style={{ padding: '4px', height: '42px' }} />
            </div>
            <div className="frow">
              <label className="flbl">Type</label>
              <select className="finp" value={newCat.type} onChange={e => setNewCat({ ...newCat, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <button className="btn-cta" style={{ marginTop: '10px', marginBottom: '18px' }} onClick={handleAddCat}>Add Category</button>
          <div className="cats-list">
            {categories.map(c => (
              <div key={c.id} className="cat-row">
                <div className="cat-row-ic" style={{ background: c.color + '20' }}>{c.icon}</div>
                <div className="cat-row-name">{c.name}</div>
                <span className="cat-row-type">{c.type}</span>
                <button className="remove-btn" onClick={() => deleteCategory(c.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title" style={{ marginBottom: '14px' }}>🗄️ Data Management</div>
        <div className="data-btns">
          <button className="btn-outline" onClick={handleExport}><Download size={16} /> Export CSV</button>
          <button className="btn-outline" onClick={() => fileRef.current.click()}><Upload size={16} /> Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
          <button className="btn-cta" onClick={onLoadDemo}><Database size={16} /> Load Demo Data</button>
          <button className="btn-danger" onClick={handleClear}><Trash2 size={16} /> Clear All Data</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title" style={{ marginBottom: '14px' }}>🔄 Recurring Transactions</div>
        <RecurringManager finance={finance} />
      </div>
    </div>
  )
}

function RecurringManager({ finance }) {
  const { recurring, categories, addRecurring, deleteRecurring, settings } = finance
  const currency = settings.currency || '₹'
  const [form, setForm] = useState({ title: '', amount: '', categoryId: '', type: 'expense', dayOfMonth: 1 })

  const handleAdd = () => {
    if (!form.title.trim() || !form.amount || parseFloat(form.amount) <= 0 || !form.categoryId) return
    addRecurring({
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      type: form.type,
      dayOfMonth: parseInt(form.dayOfMonth) || 1,
    })
    setForm({ title: '', amount: '', categoryId: '', type: 'expense', dayOfMonth: 1 })
  }

  return (
    <div>
      <div className="fgrid" style={{ marginBottom: '16px' }}>
        <div className="frow">
          <label className="flbl">Title</label>
          <input className="finp" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Rent" />
        </div>
        <div className="frow">
          <label className="flbl">Amount</label>
          <input className="finp" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
        </div>
        <div className="frow">
          <label className="flbl">Category</label>
          <select className="finp" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Select...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div className="frow">
          <label className="flbl">Day of Month</label>
          <input className="finp" type="number" min="1" max="28" value={form.dayOfMonth} onChange={e => setForm({ ...form, dayOfMonth: e.target.value })} />
        </div>
      </div>
      <button className="btn-cta" onClick={handleAdd} style={{ marginBottom: '16px' }}>Add Recurring</button>

      <div className="recurring-list">
        {recurring.map(r => {
          const cat = categories.find(c => c.id === r.categoryId)
          return (
            <div key={r.id} className="recurring-row">
              <div className="recurring-info">
                <strong>{r.title}</strong>
                <span>{fmtCurrency(r.amount, currency)} · {cat?.name || r.categoryId} · Day {r.dayOfMonth}</span>
              </div>
              <button className="remove-btn" onClick={() => deleteRecurring(r.id)}>Remove</button>
            </div>
          )
        })}
        {recurring.length === 0 && <p className="empty-text">No recurring transactions set up</p>}
      </div>
    </div>
  )
}

function fmtCurrency(amount, currency = '₹') {
  const abs = Math.abs(amount)
  if (abs >= 10000000) return `${currency}${(amount / 10000000).toFixed(1)}Cr`
  if (abs >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`
  if (abs >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`
  return `${currency}${Number(amount).toLocaleString('en-IN')}`
}
