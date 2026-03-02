import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './index.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const NewIssue = lazy(() => import('./pages/NewIssue'))
const IssueDetail = lazy(() => import('./pages/IssueDetail'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              Issue Tracker
            </Link>
            <Link
              to="/issues/new"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              New Issue
            </Link>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/issues/new" element={<NewIssue />} />
              <Route path="/issues/:id" element={<IssueDetail />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  </StrictMode>,
)
