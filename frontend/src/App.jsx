// App.jsx
import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import './todo.css';

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' },
];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params =
      filter === 'all' ? undefined : { done: filter === 'done' };
    fetchTodos(params)
      .then(data => { setTodos(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [filter]);

  const handleAdd = async (title) => {
    const newTodo = await createTodo(title);
    setTodos([newTodo, ...todos]);
  };

  const handleToggle = async (id, done) => {
    const updated = await updateTodo(id, { done: !done });
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const handleRename = async (id, title) => {
    const updated = await updateTodo(id, { title });
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const handleRemove = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="receipt-page">
      <div className="receipt">
        <header className="receipt-header">
          <span className="stamp">Tasks</span>
          <p className="receipt-date">{today}</p>
        </header>

        <nav className="todo-filters">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={filter === f.value ? 'active' : ''}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        <TodoForm onAdd={handleAdd} />
        <TodoList
          todos={todos}
          loading={loading}
          onToggle={handleToggle}
          onRename={handleRename}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}