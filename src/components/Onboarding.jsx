import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

export default function Onboarding({ isOpen, onClose, onSave, settings }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', currency: '₹', salary: '' })

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setForm({ name: settings.userName || '', currency: settings.currency || '₹', salary: '' })
    }
  }, [isOpen, settings])

  if (!isOpen) return null

  const handleSave = () => {
    if (!form.name.trim()) return
    onSave({
      userName: form.name.trim(),
      currency: form.currency,
      salary: parseFloat(form.salary) || 0,
    })
    onClose()
  }

  const handleSkip = () => {
    onSave({ userName: '', currency: '₹', salary: 0 })
    onClose()
  }

  return (
    <div className="ob-backdrop">
      <div className="ob-modal">
        <div className="ob-blob ob-blob1" />
        <div className="ob-blob ob-blob2" />

        <div className="ob-top">
          <div className="ob-logo">
            <div className="ob-logo-icon">💰</div>
            <span className="ob-logo-name">SpendSmart Pro</span>
          </div>
          <button className="ob-close" onClick={handleSkip}><X size={18} /></button>
        </div>

        <div className="ob-body">
          {step === 1 && (
            <>
              <div className="ob-emoji-big">🎉</div>
              <h2 className="ob-heading">Welcome to SpendSmart Pro!</h2>
              <p className="ob-sub">Let's set up your personal finance dashboard in just a few steps.</p>
              <div className="ob-fields">
                <div className="ob-field">
                  <label className="ob-lbl">👤 Your Name</label>
                  <input className="ob-inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" autoFocus />
                </div>
              </div>
              <div className="ob-foot">
                <button className="ob-btn-skip" onClick={handleSkip}>Skip for now</button>
                <button className="ob-btn-save" onClick={() => setStep(2)}>Next →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="ob-emoji-big">💰</div>
              <h2 className="ob-heading">Choose Your Currency</h2>
              <p className="ob-sub">Select the currency you use for your transactions.</p>
              <div className="ob-fields">
                <div className="ob-field">
                  <label className="ob-lbl">Currency</label>
                  <select className="ob-inp" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    <option value="₹">₹ Indian Rupee</option>
                    <option value="$">$ US Dollar</option>
                    <option value="€">€ Euro</option>
                    <option value="£">£ British Pound</option>
                  </select>
                </div>
                <div className="ob-field">
                  <label className="ob-lbl">💼 Monthly Salary (optional)</label>
                  <input className="ob-inp" type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 50000" />
                </div>
              </div>
              <div className="ob-foot">
                <button className="ob-btn-skip" onClick={() => setStep(1)}>← Back</button>
                <button className="ob-btn-save" onClick={handleSave}><Sparkles size={16} /> Get Started</button>
              </div>
            </>
          )}
        </div>

        <div className="ob-steps">
          <div className={`ob-step ${step >= 1 ? 'active' : ''}`} />
          <div className={`ob-step ${step >= 2 ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  )
}
