import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import PredictPage from './pages/PredictPage'
import TrendsPage from './pages/TrendsPage'
import HistoryPage from './pages/HistoryPage'
import MetricsPage from './pages/MetricsPage'

export default function App() {
  const [history, setHistory] = useState([])
  const addPrediction = (entry) => setHistory(h => [entry, ...h].slice(0, 100))

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'36px 40px', overflowY:'auto', maxWidth:960 }}>
        <Routes>
          <Route path="/"        element={<DashboardPage />} />
          <Route path="/predict" element={<PredictPage onPrediction={addPrediction} />} />
          <Route path="/trends"  element={<TrendsPage />} />
          <Route path="/history" element={<HistoryPage history={history} />} />
          <Route path="/metrics" element={<MetricsPage />} />
        </Routes>
      </main>
    </div>
  )
}
