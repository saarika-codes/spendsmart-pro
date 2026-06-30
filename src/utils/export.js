export function exportToCSV(transactions, categories, currency = '₹') {
  if (!transactions.length) return false

  const headers = ['ID', 'Type', 'Category', 'Title', 'Amount', 'Date', 'Notes']
  const rows = transactions.map(t => [
    t.id,
    t.type,
    categories.find(c => c.id === t.category)?.name || t.category,
    `"${String(t.title).replace(/"/g, '""')}"`,
    t.amount,
    t.date,
    `"${String(t.notes || '').replace(/"/g, '""')}"`,
  ])

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: 'spendsmart_export.csv' })
  a.click()
  URL.revokeObjectURL(url)
  return true
}

export function importFromCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const transactions = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h.toLowerCase()] = values[idx]
    })

    if (obj.title && obj.amount && obj.date) {
      transactions.push({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5) + i,
        title: obj.title,
        amount: parseFloat(obj.amount) || 0,
        category: obj.category || 'Others',
        type: obj.type === 'income' ? 'income' : 'expense',
        date: obj.date,
        notes: obj.notes || '',
        isRecurring: false,
        recurringId: null,
      })
    }
  }
  return transactions
}
