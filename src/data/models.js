export const LS_KEYS = {
  TRANSACTIONS: 'ss_pro_transactions',
  CATEGORIES: 'ss_pro_categories',
  BUDGETS: 'ss_pro_budgets',
  GOALS: 'ss_pro_goals',
  RECURRING: 'ss_pro_recurring',
  SETTINGS: 'ss_pro_settings',
  THEME: 'ss_pro_theme',
}

export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍕', color: '#EF4444', type: 'expense' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#06B6D4', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6', type: 'expense' },
  { id: 'bills', name: 'Bills', icon: '💡', color: '#F59E0B', type: 'expense' },
  { id: 'health', name: 'Health', icon: '💊', color: '#10B981', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', color: '#3B82F6', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#EC4899', type: 'expense' },
  { id: 'salary', name: 'Salary', icon: '💼', color: '#059669', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#6366F1', type: 'income' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#14B8A6', type: 'income' },
]

export const DEFAULT_SETTINGS = {
  currency: '₹',
  darkMode: false,
  userName: '',
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}
