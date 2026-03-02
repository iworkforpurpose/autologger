import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import './index.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const NewIssue = lazy(() => import('./pages/NewIssue'))
const IssueDetail = lazy(() => import('./pages/IssueDetail'))

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <p className="p-6 text-sm text-slate-500">Loading...</p>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues/new" element={<NewIssue />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
