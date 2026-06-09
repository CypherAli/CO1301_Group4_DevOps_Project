import { useState, useEffect } from 'react';
import './index.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://devops-backend-2o27.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Add error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary-foreground"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight">DevOps Todo</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              /* Sun icon */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              /* Moon icon */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Task Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {todos.length > 0
              ? `${completedCount} of ${todos.length} tasks completed`
              : 'No tasks yet — add one below!'}
          </p>
        </div>

        {/* Add Task Card */}
        <div className="rounded-lg border border-border bg-card p-5 mb-6 shadow-sm">
          <label
            htmlFor="new-todo"
            className="block text-sm font-medium text-foreground mb-2"
          >
            New Task
          </label>
          <div className="flex gap-2">
            <input
              id="new-todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done?"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow"
            />
            <button
              onClick={addTodo}
              disabled={loading || !newTodo.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Task List */}
        {todos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12h6M12 9v6" />
            </svg>
            <p className="text-sm text-muted-foreground">No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-accent/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status dot */}
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      todo.completed ? 'bg-green-500' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`text-sm truncate ${
                      todo.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      todo.completed
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {todo.completed ? 'Done' : 'Pending'}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Summary row */}
        {todos.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>{todos.length - completedCount} remaining</span>
            <span>{completedCount} completed</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="mx-auto max-w-2xl px-4 text-center text-xs text-muted-foreground">
          CO1301 Group 4 — DevOps Project
        </div>
      </footer>
    </div>
  );
}

export default App;
