import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

function throwWithResponseData(error) {
  error.responseData = error?.response?.data ?? null
  throw error
}

function getDownloadFilename(contentDisposition) {
  if (!contentDisposition) return 'issues.csv'

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/["']/g, ''))

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i)
  if (filenameMatch?.[1]) return filenameMatch[1]

  return 'issues.csv'
}

export async function getIssues(filters = {}) {
  try {
    const response = await api.get('/issues', { params: filters })
    return response.data
  } catch (error) {
    throwWithResponseData(error)
  }
}

export async function createIssue(data) {
  try {
    const response = await api.post('/issues', data)
    return response.data
  } catch (error) {
    throwWithResponseData(error)
  }
}

export async function getIssue(id) {
  try {
    const response = await api.get(`/issues/${id}`)
    return response.data
  } catch (error) {
    throwWithResponseData(error)
  }
}

export async function updateIssue(id, data) {
  try {
    const response = await api.patch(`/issues/${id}`, data)
    return response.data
  } catch (error) {
    throwWithResponseData(error)
  }
}

export async function addComment(issueId, text) {
  try {
    const response = await api.post(`/issues/${issueId}/comments`, { text })
    return response.data
  } catch (error) {
    throwWithResponseData(error)
  }
}

export async function exportCSV() {
  try {
    const response = await api.get('/issues/export/csv', {
      responseType: 'blob',
    })

    const blobUrl = window.URL.createObjectURL(response.data)
    const filename = getDownloadFilename(response.headers['content-disposition'])
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    throwWithResponseData(error)
  }
}
