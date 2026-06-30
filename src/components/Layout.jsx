import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ finance, theme }) {
  return (
    <div className="app">
      <Sidebar finance={finance} />
      <div className="app-wrap">
        <TopBar finance={finance} theme={theme} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
