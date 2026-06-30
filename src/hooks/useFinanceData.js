import { useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { LS_KEYS, DEFAULT_CATEGORIES, DEFAULT_SETTINGS, generateId, getTodayStr, getMonthKey } from '../data/models'

export function useFinanceData() {
  const [transactions, setTransactions] = useLocalStorage(LS_KEYS.TRANSACTIONS, [])
  const [categories, setCategories] = useLocalStorage(LS_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
  const [budgets, setBudgets] = useLocalStorage(LS_KEYS.BUDGETS, [])
  const [goals, setGoals] = useLocalStorage(LS_KEYS.GOALS, [])
  const [recurring, setRecurring] = useLocalStorage(LS_KEYS.RECURRING, [])
  const [settings, setSettings] = useLocalStorage(LS_KEYS.SETTINGS, DEFAULT_SETTINGS)

  // Generate recurring transactions
  const processRecurring = useCallback(() => {
    const today = getTodayStr()
    const currentMonth = getMonthKey()
    let added = false
    const newTxns = [...transactions]

    recurring.forEach((rec) => {
      if (!rec.lastGenerated || rec.lastGenerated.slice(0, 7) < currentMonth) {
        const day = Math.min(rec.dayOfMonth, 28)
        const date = `${currentMonth}-${String(day).padStart(2, '0')}`
        if (date <= today) {
          newTxns.push({
            id: generateId(),
            title: rec.title,
            amount: rec.amount,
            category: rec.categoryId,
            type: rec.type,
            date,
            notes: 'Auto-generated recurring',
            isRecurring: true,
            recurringId: rec.id,
          })
          added = true
        }
      }
    })

    if (added) {
      setTransactions(newTxns)
      const newRec = recurring.map(r => {
        const day = Math.min(r.dayOfMonth, 28)
        const date = `${currentMonth}-${String(day).padStart(2, '0')}`
        if (date <= today && (!r.lastGenerated || r.lastGenerated.slice(0, 7) < currentMonth)) {
          return { ...r, lastGenerated: date }
        }
        return r
      })
      setRecurring(newRec)
    }
  }, [transactions, recurring, setTransactions, setRecurring])

  // Transaction CRUD
  const addTransaction = useCallback((txn) => {
    const newTxn = { ...txn, id: generateId(), isRecurring: false, recurringId: null }
    setTransactions(prev => [...prev, newTxn])
    return newTxn.id
  }, [setTransactions])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [setTransactions])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [setTransactions])

  // Category CRUD
  const addCategory = useCallback((cat) => {
    const newCat = { ...cat, id: generateId() }
    setCategories(prev => [...prev, newCat])
  }, [setCategories])

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [setCategories])

  // Budget CRUD
  const setBudget = useCallback((categoryId, amount, month) => {
    setBudgets(prev => {
      const filtered = prev.filter(b => !(b.categoryId === categoryId && b.month === month))
      return [...filtered, { id: generateId(), categoryId, amount, month }]
    })
  }, [setBudgets])

  const deleteBudget = useCallback((id) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }, [setBudgets])

  // Goal CRUD
  const addGoal = useCallback((goal) => {
    const newGoal = { ...goal, id: generateId(), currentAmount: 0 }
    setGoals(prev => [...prev, newGoal])
  }, [setGoals])

  const updateGoal = useCallback((id, updates) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }, [setGoals])

  const deleteGoal = useCallback((id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [setGoals])

  // Recurring CRUD
  const addRecurring = useCallback((rec) => {
    const newRec = { ...rec, id: generateId(), lastGenerated: null }
    setRecurring(prev => [...prev, newRec])
  }, [setRecurring])

  const deleteRecurring = useCallback((id) => {
    setRecurring(prev => prev.filter(r => r.id !== id))
  }, [setRecurring])

  // Settings
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [setSettings])

  // Demo data loader
  const loadDemoData = useCallback((demo) => {
    if (demo.transactions) setTransactions(demo.transactions)
    if (demo.categories) setCategories(demo.categories)
    if (demo.budgets) setBudgets(demo.budgets)
    if (demo.goals) setGoals(demo.goals)
    if (demo.recurring) setRecurring(demo.recurring)
  }, [setTransactions, setCategories, setBudgets, setGoals, setRecurring])

  // Derived data
  const currentMonth = getMonthKey()
  const currentMonthTxns = useMemo(() => 
    transactions.filter(t => t.date.startsWith(currentMonth)),
  [transactions, currentMonth])

  const income = useMemo(() => 
    currentMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
  [currentMonthTxns])

  const expense = useMemo(() => 
    currentMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  [currentMonthTxns])

  const balance = income - expense
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0

  return {
    transactions, categories, budgets, goals, recurring, settings,
    currentMonthTxns, income, expense, balance, savingsRate,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, deleteCategory,
    setBudget, deleteBudget,
    addGoal, updateGoal, deleteGoal,
    addRecurring, deleteRecurring,
    updateSettings, processRecurring, loadDemoData,
    setTransactions, setCategories, setBudgets, setGoals, setRecurring,
  }
}
