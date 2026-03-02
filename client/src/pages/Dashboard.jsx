import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getIssues } from '../api'

const PROJECT_OPTIONS = ['All', 'Alpha', 'Beta', 'Gamma', 'Delta']
const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Critical']
const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed']
const ASSIGNEE_OPTIONS = [
  'All',
  'Alice Johnson',
  'Bob Smith',
  'Carol White',
  'David Lee',
  'Eva Martinez',
]

const priorityBadgeClasses = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

const statusBadgeClasses = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-slate-100 text-slate-700',
}

function formatDate(dateText) {
  const parsed = new Date(dateText)
  if (Number.isNaN(parsed.getTime())) return dateText
  return parsed.toLocaleString()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState({
    project: 'All',
    priority: 'All',
    status: 'All',
    assignee: 'All',
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    const fetchIssues = async () => {
      setIsLoading(true)
      setError('')

      const queryFilters = {}
      if (filters.project !== 'All') queryFilters.project = filters.project
      if (filters.priority !== 'All') queryFilters.priority = filters.priority
      if (filters.status !== 'All') queryFilters.status = filters.status
      if (filters.assignee !== 'All') queryFilters.assignee = filters.assignee
      if (debouncedSearch) queryFilters.search = debouncedSearch

      try {
        const data = await getIssues(queryFilters)
        if (!cancelled) {
          setIssues(Array.isArray(data) ? data : [])
        }
      } catch (_err) {
        if (!cancelled) {
          setIssues([])
          setError('Could not connect to server. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchIssues()

    return () => {
      cancelled = true
    }
  }, [filters, debouncedSearch])

  const statusCounts = useMemo(() => {
    const counts = {
      Open: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
    }

    for (const issue of issues) {
      if (Object.prototype.hasOwnProperty.call(counts, issue.status)) {
        counts[issue.status] += 1
      }
    }
    return counts
  }, [issues])

  const statusChips = [
    { label: 'Open', count: statusCounts.Open, className: 'bg-blue-50 text-blue-700' },
    {
      label: 'In Progress',
      count: statusCounts['In Progress'],
      className: 'bg-yellow-50 text-yellow-700',
    },
    { label: 'Resolved', count: statusCounts.Resolved, className: 'bg-green-50 text-green-700' },
    { label: 'Closed', count: statusCounts.Closed, className: 'bg-slate-100 text-slate-700' },
  ]

  const onFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Track project issues across teams.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statusChips.map((chip) => (
          <div
            key={chip.label}
            className={`rounded-lg border border-slate-200 px-4 py-3 ${chip.className}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">{chip.label}</p>
            <p className="mt-1 text-2xl font-bold">{chip.count}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select
            value={filters.project}
            onChange={(event) => onFilterChange('project', event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          >
            {PROJECT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Project: {option}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(event) => onFilterChange('priority', event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Priority: {option}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) => onFilterChange('status', event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Status: {option}
              </option>
            ))}
          </select>

          <select
            value={filters.assignee}
            onChange={(event) => onFilterChange('assignee', event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          >
            {ASSIGNEE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Assignee: {option}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search title or description"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-red-700">{error}</div>
      ) : null}

      {!isLoading && !error && issues.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-slate-600">
          No issues found.{' '}
          <Link to="/issues/new" className="font-medium text-slate-900 underline">
            Create one →
          </Link>
        </div>
      ) : null}

      {!isLoading && !error && issues.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {issues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{issue.title}</td>
                    <td className="px-4 py-3 text-slate-600">{issue.project}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityBadgeClasses[issue.priority] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusBadgeClasses[issue.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{issue.assignee}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(issue.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {issues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="w-full rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50"
              >
                <h2 className="font-semibold text-slate-900">{issue.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{issue.project}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      priorityBadgeClasses[issue.priority] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {issue.priority}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusBadgeClasses[issue.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {issue.assignee} • {formatDate(issue.created_at)}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
