export function fmtCurrency(amount, currency = '₹') {
  const abs = Math.abs(amount)
  if (abs >= 10000000) return `${currency}${(amount / 10000000).toFixed(1)}Cr`
  if (abs >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`
  if (abs >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`
  return `${currency}${Number(amount).toLocaleString('en-IN')}`
}

export function fmtDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function monthName(dateStr) {
  const [y, m] = dateStr.split('-').map(Number)
  return new Date(y, m - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
}

export function greetWord() {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'
}
