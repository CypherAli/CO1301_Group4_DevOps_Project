import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://devops-backend-2o27.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

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

    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE'
      });
      fetchTodos();
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '24px', 
          color: '#111827',
          textAlign: 'center'
        }}>
          DevOps Tasks
        </h1>
        <p style={{ 
          margin: '0 0 25px 0', 
          color: '#6b7280', 
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Synced with Render Cloud Database
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            style={{ 
              padding: '12px 16px', 
              flex: 1, 
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button 
            onClick={addTodo} 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
          >
            Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {todos.map(todo => (
            <div key={todo.id} style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'transform 0.1s'
            }}>
              <span style={{ 
                fontSize: '15px', 
                color: todo.completed ? '#9ca3af' : '#374151',
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
                {todo.title}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#ef4444', 
                  border: '1px solid #fee2e2', 
                  padding: '6px 12px', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#ef4444';
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', py: '20px' }}>
              No tasks yet. Add one above!
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
