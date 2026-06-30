import { generateId, getTodayStr, getMonthKey } from '../data/models'

export function generateDemoData() {
  const today = new Date()
  const txns = []
  const categories = [
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

  const expenseData = [
    { title: 'Swiggy Order', cat: 'food', amt: 450 },
    { title: 'Zomato Dinner', cat: 'food', amt: 680 },
    { title: 'Groceries - BigBasket', cat: 'food', amt: 1200 },
    { title: 'Uber Ride', cat: 'travel', amt: 320 },
    { title: 'Metro Recharge', cat: 'travel', amt: 500 },
    { title: 'Flight to Delhi', cat: 'travel', amt: 4500 },
    { title: 'Amazon Shopping', cat: 'shopping', amt: 2500 },
    { title: 'Myntra Sale', cat: 'shopping', amt: 1800 },
    { title: 'Electricity Bill', cat: 'bills', amt: 1200 },
    { title: 'Internet Bill', cat: 'bills', amt: 999 },
    { title: 'Mobile Recharge', cat: 'bills', amt: 499 },
    { title: 'Doctor Visit', cat: 'health', amt: 800 },
    { title: 'Medicines', cat: 'health', amt: 350 },
    { title: 'Gym Membership', cat: 'health', amt: 1500 },
    { title: 'Udemy Course', cat: 'education', amt: 800 },
    { title: 'Books', cat: 'education', amt: 600 },
    { title: 'Netflix Subscription', cat: 'entertainment', amt: 649 },
    { title: 'Movie Tickets', cat: 'entertainment', amt: 800 },
    { title: 'Spotify Premium', cat: 'entertainment', amt: 199 },
    { title: 'Coffee Shop', cat: 'food', amt: 180 },
    { title: 'Petrol', cat: 'travel', amt: 1500 },
    { title: 'Flipkart Order', cat: 'shopping', amt: 3200 },
    { title: 'Water Bill', cat: 'bills', amt: 450 },
    { title: 'Dental Checkup', cat: 'health', amt: 1200 },
    { title: 'Online Workshop', cat: 'education', amt: 1500 },
    { title: 'Concert Tickets', cat: 'entertainment', amt: 2500 },
  ]

  const incomeData = [
    { title: 'Monthly Salary', cat: 'salary', amt: 50000 },
    { title: 'Freelance Project', cat: 'freelance', amt: 15000 },
    { title: 'Stock Dividend', cat: 'investment', amt: 2500 },
    { title: 'Side Gig', cat: 'freelance', amt: 8000 },
    { title: 'FD Interest', cat: 'investment', amt: 1200 },
  ]

  // Generate for last 3 months
  for (let m = 2; m >= 0; m--) {
    const d = new Date(today.getFullYear(), today.getMonth() - m, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()

    // Add income (once per month)
    incomeData.forEach((inc, i) => {
      if (Math.random() > 0.3 || i === 0) {
        const day = Math.min(1 + i * 5, daysInMonth)
        txns.push({
          id: generateId(),
          title: inc.title,
          amount: Math.round(inc.amt * (0.9 + Math.random() * 0.2)),
          category: inc.cat,
          type: 'income',
          date: `${monthKey}-${String(day).padStart(2, '0')}`,
          notes: '',
          isRecurring: false,
          recurringId: null,
        })
      }
    })

    // Add expenses (scattered throughout month)
    expenseData.forEach((exp, i) => {
      if (Math.random() > 0.15) {
        const day = Math.min(1 + (i * 1.2) % daysInMonth, daysInMonth)
        txns.push({
          id: generateId(),
          title: exp.title,
          amount: Math.round(exp.amt * (0.8 + Math.random() * 0.4)),
          category: exp.cat,
          type: 'expense',
          date: `${monthKey}-${String(Math.floor(day)).padStart(2, '0')}`,
          notes: '',
          isRecurring: false,
          recurringId: null,
        })
      }
    })
  }

  // Budgets
  const budgets = [
    { id: generateId(), categoryId: 'food', amount: 5000, month: getMonthKey() },
    { id: generateId(), categoryId: 'travel', amount: 3000, month: getMonthKey() },
    { id: generateId(), categoryId: 'shopping', amount: 4000, month: getMonthKey() },
    { id: generateId(), categoryId: 'bills', amount: 3500, month: getMonthKey() },
    { id: generateId(), categoryId: 'entertainment', amount: 2000, month: getMonthKey() },
  ]

  // Goals
  const goals = [
    { id: generateId(), title: 'Laptop Fund', targetAmount: 80000, currentAmount: 32000, deadline: '2026-12-31', color: '#4F46E5' },
    { id: generateId(), title: 'Emergency Fund', targetAmount: 150000, currentAmount: 85000, deadline: '2027-03-31', color: '#10B981' },
    { id: generateId(), title: 'Vacation Trip', targetAmount: 50000, currentAmount: 12000, deadline: '2026-09-30', color: '#F59E0B' },
  ]

  // Recurring
  const recurring = [
    { id: generateId(), title: 'Rent', amount: 15000, categoryId: 'bills', type: 'expense', dayOfMonth: 1, lastGenerated: null },
    { id: generateId(), title: 'Netflix', amount: 649, categoryId: 'entertainment', type: 'expense', dayOfMonth: 5, lastGenerated: null },
    { id: generateId(), title: 'Gym', amount: 1500, categoryId: 'health', type: 'expense', dayOfMonth: 10, lastGenerated: null },
  ]

  return { transactions: txns, categories, budgets, goals, recurring }
}
