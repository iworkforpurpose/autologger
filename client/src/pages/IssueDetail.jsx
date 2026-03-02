import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addComment, getIssue, updateIssue } from '../api'

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed']

const statusBadgeClasses = {
  Open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-200',
  Resolved: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200',
  Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
}

const priorityBadgeClasses = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-200',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
}

function formatDate(dateText) {
  if (!dateText) return dateText
  // SQLite CURRENT_TIMESTAMP stores UTC without a timezone indicator.
  // Append 'Z' so JS Date treats it as UTC, then toLocaleString() converts to local time.
  const normalized = String(dateText).includes('Z') || String(dateText).includes('+')
    ? dateText
    : dateText + 'Z'
  const parsed = new Date(normalized)
  if (Number.isNaN(parsed.getTime())) return dateText
  return parsed.toLocaleString()
}

export default function IssueDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadIssue = async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await getIssue(id)
        if (!cancelled) {
          setIssue({
            ...data,
            comments: Array.isArray(data?.comments) ? data.comments : [],
          })
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Issue not found')
          } else {
            setError('Failed to load')
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadIssue()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleStatusChange = async (event) => {
    if (!issue) return

    const nextStatus = event.target.value
    const previousStatus = issue.status
    setStatusError('')
    setIssue((prev) => ({ ...prev, status: nextStatus }))
    setIsSavingStatus(true)

    try {
      const updated = await updateIssue(id, { status: nextStatus })
      setIssue((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          ...updated,
          comments: prev.comments,
        }
      })
    } catch (_err) {
      setIssue((prev) => ({ ...prev, status: previousStatus }))
      setStatusError('Could not update status. Please try again.')
    } finally {
      setIsSavingStatus(false)
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) {
      setCommentError('Comment is required.')
      return
    }

    setCommentError('')
    setIsSubmittingComment(true)

    try {
      const createdComment = await addComment(id, trimmed)
      setIssue((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [...prev.comments, createdComment],
        }
      })
      setCommentText('')
    } catch (err) {
      if (err?.response?.status === 404) {
        setCommentError('Issue not found.')
      } else {
        setCommentError('Failed to add comment. Please try again.')
      }
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-20 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
      </div>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Back to Dashboard
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      </section>
    )
  }

  if (!issue) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Issue Details</h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{issue.title}</h2>
        <p className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-400">{issue.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Project</p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{issue.project}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Priority</p>
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityBadgeClasses[issue.priority] ||
                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
                }`}
            >
              {issue.priority}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Assignee</p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{issue.assignee}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Created</p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{formatDate(issue.created_at)}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Updated</p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{formatDate(issue.updated_at)}</p>
          </div>

          <div>
            <label
              htmlFor="status"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Status
            </label>
            <div className="mt-1 flex items-center gap-2">
              <select
                id="status"
                value={issue.status}
                onChange={handleStatusChange}
                disabled={isSavingStatus}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[issue.status] ||
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
                  }`}
              >
                {issue.status}
              </span>
            </div>
            {statusError ? <p className="mt-1 text-sm text-red-600">{statusError}</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Comments</h3>

        <div className="mt-4 space-y-3">
          {issue.comments.length > 0 ? (
            issue.comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50"
              >
                <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">{comment.text}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDate(comment.created_at)}</p>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              No comments yet.
            </p>
          )}
        </div>

        <form onSubmit={handleAddComment} className="mt-5 space-y-3">
          <label htmlFor="new-comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            New Comment
          </label>
          <textarea
            id="new-comment"
            rows={4}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
            placeholder="Write a comment..."
          />
          {commentError ? <p className="text-sm text-red-600">{commentError}</p> : null}
          <button
            type="submit"
            disabled={isSubmittingComment}
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isSubmittingComment ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Adding...
              </>
            ) : (
              'Add Comment'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
