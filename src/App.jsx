import { HashRouter, Routes, Route } from 'react-router-dom'
import { useFinanceData } from './hooks/useFinanceData'
import { useTheme } from './hooks/useTheme'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Onboarding from './components/Onboarding'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Analytics from './pages/Analytics'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import { generateDemoData } from './utils/demoData'
import { LS_KEYS } from './data/models'

function App() {
  const finance = useFinanceData()
  const theme = useTheme()
  const [showOnboard, setShowOnboard] = useState(false)

  useEffect(() => {
    finance.processRecurring()
    const seen = localStorage.getItem(LS_KEYS.SETTINGS)
    if (!seen) {
      setShowOnboard(true)
    }
  }, [])

  const handleOnboardSave = ({ userName, currency, salary }) => {
    finance.updateSettings({ userName, currency })
    if (salary > 0) {
      finance.addTransaction({
        title: 'Monthly Salary',
        amount: salary,
        category: 'salary',
        type: 'income',
        date: new Date().toISOString().slice(0, 10),
        notes: 'Auto-generated from onboarding',
      })
    }
  }

  const handleLoadDemo = () => {
    if (confirm('This will replace all current data with demo data. Continue?')) {
      const demo = generateDemoData()
      finance.loadDemoData(demo)
    }
  }

  return (
    <>
      <HashRouter>
        <Routes>
          <Route element={<Layout finance={finance} theme={theme} />}>
            <Route index element={<Dashboard finance={finance} onLoadDemo={handleLoadDemo} />} />
            <Route path="transactions" element={<Transactions finance={finance} />} />
            <Route path="transactions/new" element={<AddTransaction finance={finance} />} />
            <Route path="transactions/edit/:id" element={<AddTransaction finance={finance} edit />} />
            <Route path="analytics" element={<Analytics finance={finance} />} />
            <Route path="budgets" element={<Budgets finance={finance} />} />
            <Route path="goals" element={<Goals finance={finance} />} />
            <Route path="insights" element={<Insights finance={finance} />} />
            <Route path="settings" element={<Settings finance={finance} theme={theme} onLoadDemo={handleLoadDemo} />} />
          </Route>
        </Routes>
      </HashRouter>

      <Onboarding
        isOpen={showOnboard}
        onClose={() => setShowOnboard(false)}
        onSave={handleOnboardSave}
        settings={finance.settings}
      />
    </>
  )
}

export default App
