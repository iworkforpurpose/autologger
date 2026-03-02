import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDot, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getIssues } from '../api';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    project: 'All',
    priority: 'All',
    status: 'All',
    assignee: 'All'
  });
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    loadIssues();
  }, [filters, debouncedSearch]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const apiFilters = {};

      if (filters.project !== 'All') apiFilters.project = filters.project;
      if (filters.priority !== 'All') apiFilters.priority = filters.priority;
      if (filters.status !== 'All') apiFilters.status = filters.status;
      if (filters.assignee !== 'All') apiFilters.assignee = filters.assignee;
      if (debouncedSearch) apiFilters.search = debouncedSearch;

      const data = await getIssues(apiFilters);
      setIssues(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-100';
    }
  };

  // Priority Colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-100';
      case 'Medium': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-200';
      case 'High': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-200';
      case 'Critical': return 'bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-100';
    }
  };

  const statusCounts = {
    Open: issues.filter((i) => i.status === 'Open').length,
    'In Progress': issues.filter((i) => i.status === 'In Progress').length,
    Resolved: issues.filter((i) => i.status === 'Resolved').length,
    Closed: issues.filter((i) => i.status === 'Closed').length,
  };

  const statusCards = [
    { label: 'Open', count: statusCounts.Open, icon: CircleDot, color: 'text-blue-500' },
    { label: 'In Progress', count: statusCounts['In Progress'], icon: Clock, color: 'text-amber-500' },
    { label: 'Resolved', count: statusCounts.Resolved, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Closed', count: statusCounts.Closed, icon: XCircle, color: 'text-slate-500' },
  ];

  const chartData = [
    { name: 'Alpha', count: issues.filter((i) => i.project === 'Alpha').length, color: '#3b82f6' },
    { name: 'Beta', count: issues.filter((i) => i.project === 'Beta').length, color: '#8b5cf6' },
    { name: 'Gamma', count: issues.filter((i) => i.project === 'Gamma').length, color: '#22c55e' },
    { name: 'Delta', count: issues.filter((i) => i.project === 'Delta').length, color: '#f59e0b' },
  ];

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridStroke = isDark ? '#334155' : '#e2e8f0';
  const tickFill = isDark ? '#94a3b8' : '#64748b';
  const tooltipCursor = isDark ? '#1e293b' : '#f1f5f9';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issues Dashboard</h1>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statusCards.map(({ label, count, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 dark:bg-slate-800 dark:border-slate-700"
          >
            <Icon className={`w-8 h-8 ${color}`} strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-slate-900 leading-none dark:text-white">{count}</span>
              <span className="text-sm font-medium text-slate-500 mt-1 dark:text-slate-400">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Issues by Project Chart */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm mb-8 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-900 mb-4 dark:text-white">Issues by Project</h2>
        <div className="h-64 w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickFill }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: tickFill }} dx={-10} />
              <Tooltip
                cursor={{ fill: tooltipCursor }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: tooltipBg,
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-center dark:bg-slate-800 dark:border-slate-700">
        <input
          type="text"
          name="search"
          value={searchInput}
          placeholder="Search issues..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 min-w-[200px] dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          name="project"
          value={filters.project}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
        >
          <option value="All">All Projects</option>
          <option value="Alpha">Alpha</option>
          <option value="Beta">Beta</option>
          <option value="Gamma">Gamma</option>
          <option value="Delta">Delta</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select
          name="assignee"
          value={filters.assignee}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
        >
          <option value="All">All Assignees</option>
          <option value="Alice Johnson">Alice Johnson</option>
          <option value="Bob Smith">Bob Smith</option>
          <option value="Carol White">Carol White</option>
          <option value="David Lee">David Lee</option>
          <option value="Eva Martinez">Eva Martinez</option>
        </select>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400">Loading issues...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">No issues found. Create one.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map(issue => (
            <li
              key={issue.id}
              onClick={() => navigate(`/issues/${issue.id}`)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-[280px] dark:bg-slate-800 dark:border-slate-700"
            >
              {/* Card Header (Badges) */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center dark:border-slate-700">
                <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md dark:bg-slate-700 dark:text-slate-300">
                  {issue.project}
                </span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              {/* Card Body (Title & Desc) */}
              <div className="p-4 flex-grow overflow-hidden flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 dark:text-white">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 dark:text-slate-400">
                  {issue.description}
                </p>
              </div>

              {/* Card Footer (Assignee & Date) */}
              <div className="px-4 py-3 bg-gray-50 mt-auto flex justify-between items-center border-t border-gray-100 dark:bg-slate-800/50 dark:border-slate-700">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{issue.assignee}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(issue.created_at + 'Z').toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
