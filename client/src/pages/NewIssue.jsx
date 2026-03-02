import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../api'

const PROJECTS = ['Alpha', 'Beta', 'Gamma', 'Delta']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const ASSIGNEES = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee', 'Eva Martinez']
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']

const initialForm = {
  title: '',
  description: '',
  project: 'Alpha',
  priority: 'Medium',
  assignee: 'Alice Johnson',
  status: 'Open',
}

function validateForm(values) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required.'
  } else if (values.title.trim().length > 150) {
    errors.title = 'Title must be at most 150 characters.'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (!PROJECTS.includes(values.project)) {
    errors.project = 'Project must be one of Alpha, Beta, Gamma, or Delta.'
  }

  if (!PRIORITIES.includes(values.priority)) {
    errors.priority = 'Priority must be one of Low, Medium, High, or Critical.'
  }

  if (!ASSIGNEES.includes(values.assignee)) {
    errors.assignee =
      'Assignee must be one of Alice Johnson, Bob Smith, Carol White, David Lee, or Eva Martinez.'
  }

  if (!STATUSES.includes(values.status)) {
    errors.status = 'Status must be one of Open, In Progress, Resolved, or Closed.'
  }

  return errors
}

export default function NewIssue() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setFormError('')

    try {
      await createIssue({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      })
      navigate('/')
    } catch (error) {
      const serverErrors = error?.responseData?.errors
      if (serverErrors && typeof serverErrors === 'object') {
        setErrors(serverErrors)
      } else {
        setFormError('Could not create issue. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Create New Issue</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Provide issue details and assign ownership before submission.
        </p>

        {formError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            {formError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
            />
            {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
            />
            {errors.description ? (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project
              </label>
              <select
                id="project"
                name="project"
                value={form.project}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
              >
                {PROJECTS.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {errors.project ? <p className="mt-1 text-sm text-red-600">{errors.project}</p> : null}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              {errors.priority ? (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Assignee
              </label>
              <select
                id="assignee"
                name="assignee"
                value={form.assignee}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
              >
                {ASSIGNEES.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
              {errors.assignee ? (
                <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:ring-slate-500"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status ? <p className="mt-1 text-sm text-red-600">{errors.status}</p> : null}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : (
                'Create Issue'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
