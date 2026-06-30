import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { getTodayStr } from '../data/models'

export default function AddTransaction({ finance, edit = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { transactions, categories, addTransaction, updateTransaction } = finance

  const [form, setForm] = useState({
    title: '', amount: '', category: '', type: 'expense', date: getTodayStr(), notes: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (edit && id) {
      const t = transactions.find(x => x.id === id)
      if (t) {
        setForm({
          title: t.title, amount: t.amount.toString(),
          category: t.category, type: t.type,
          date: t.date, notes: t.notes || ''
        })
      }
    }
  }, [edit, id, transactions])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Invalid amount'
    if (!form.category) e.category = 'Select a category'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = {
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
      notes: form.notes.trim(),
    }
    if (edit && id) {
      updateTransaction(id, data)
    } else {
      addTransaction(data)
    }
    navigate('/transactions')
  }

  const expenseCats = categories.filter(c => c.type === 'expense' || c.type === 'both')
  const incomeCats = categories.filter(c => c.type === 'income' || c.type === 'both')
  const activeCats = form.type === 'expense' ? expenseCats : incomeCats

  return (
    <div className="page">
      <div className="page-hero">
        <button className="btn-outline" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
        <h1 className="page-title">{edit ? 'Edit' : 'Add'} Transaction</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="type-toggle">
          <button type="button" className={`tt-btn ${form.type === 'expense' ? 'active exp' : 'exp'}`} onClick={() => setForm({ ...form, type: 'expense', category: '' })}>💸 Expense</button>
          <button type="button" className={`tt-btn ${form.type === 'income' ? 'active inc' : 'inc'}`} onClick={() => setForm({ ...form, type: 'income', category: '' })}>💰 Income</button>
        </div>

        <div className="fgrid">
          <div className="frow full">
            <label className="flbl">Title</label>
            <input className={`finp ${errors.title ? 'error' : ''}`} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Lunch at cafe" />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
          <div className="frow">
            <label className="flbl">Amount</label>
            <input className={`finp ${errors.amount ? 'error' : ''}`} type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>
          <div className="frow">
            <label className="flbl">Category</label>
            <select className={`finp ${errors.category ? 'error' : ''}`} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select...</option>
              {activeCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>
          <div className="frow">
            <label className="flbl">Date</label>
            <input className={`finp ${errors.date ? 'error' : ''}`} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="frow full">
            <label className="flbl">Notes (optional)</label>
            <input className="finp" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." />
          </div>
        </div>

        <button type="submit" className="btn-submit"><Save size={16} /> {edit ? 'Save Changes' : 'Add Transaction'}</button>
      </form>
    </div>
  )
}
