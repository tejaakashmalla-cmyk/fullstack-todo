import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create or update task
  const handleSubmit = async (formData) => {
    if (editTask) {
      const { data } = await taskService.update(editTask._id, formData);
      setTasks((prev) => prev.map((t) => (t._id === editTask._id ? data : t)));
    } else {
      const { data } = await taskService.create(formData);
      setTasks((prev) => [data, ...prev]);
    }
    setEditTask(null);
  };

  // Toggle complete
  const handleToggle = async (id, completed) => {
    try {
      const { data } = await taskService.toggleComplete(id, completed);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch {
      setError('Failed to update task');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  // Open edit modal
  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // Open create modal
  const handleNewTask = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  // Filtered + searched tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);

    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Good {getTimeGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard-subtitle">Here's what's on your plate today.</p>
        </div>
        <button className="btn btn-primary" onClick={handleNewTask}>
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-number">{activeTasks}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card stat-done">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card stat-rate">
          <div className="stat-number">{completionRate}%</div>
          <div className="stat-label">Done Rate</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="task-controls">
        <div className="filter-tabs">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && totalTasks > 0 && (
                <span className="tab-count">{totalTasks}</span>
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} className="alert-close">✕</button>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {searchQuery ? '🔍' : filter === 'completed' ? '🏆' : '✦'}
            </div>
            <h3>
              {searchQuery
                ? 'No tasks match your search'
                : filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'No active tasks'
                : 'No tasks yet'}
            </h3>
            <p>
              {!searchQuery && filter === 'all' && 'Click "+ New Task" to get started!'}
            </p>
            {!searchQuery && filter === 'all' && (
              <button className="btn btn-primary" onClick={handleNewTask}>
                + Create your first task
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={handleSubmit}
        editTask={editTask}
      />
    </div>
  );
};

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default Dashboard;
