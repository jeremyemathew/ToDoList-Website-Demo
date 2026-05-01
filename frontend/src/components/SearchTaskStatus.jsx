import { useState } from 'react';

function SearchTaskStatus({ authenticationToken }) {
  const [status, setStatus] = useState('todo');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setTasks([]);

    try {
      const res = await fetch(`/api/to_do_items/status/${encodeURIComponent(status)}`, { method: 'GET',
          headers: {
          Authorization: `Bearer ${authenticationToken}`,
        }});
      const data = await res.json();

      if (res.ok) {
        setTasks(data);
        if (data.length === 0) setMessage(`No tasks found for "${status}".`);
      } else {
        setMessage(data.error || `No tasks found for "${status}".`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error while searching by status.');
    }
  };

  return (
    <section className="card">
      <h2>Search Tasks by Status</h2>

      <form onSubmit={handleSubmit}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <button type="submit" className="btn">Search</button>
      </form>

      {message && <p style={{ marginTop: '12px' }}>{message}</p>}

      {tasks.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3>Results</h3>
          {tasks.map((task) => (
            <div key={task.id} className="card item">
              <div className="item-info">
                <p className="item-title">{task.title}</p>
                <p className="item-id">ID: {task.id}</p>
                <p className="item-desc">{task.description}</p>
                <p className="muted">Status: {task.status}</p>
                {task.dueDate && <p className="muted">Due: {task.dueDate}</p>}
                {typeof task.experiencePoints === 'number' && (
                  <p className="muted">XP: {task.experiencePoints}</p>
                )}
              </div>

              <div className={`badge ${String(task.status).toLowerCase()}`}>
                {task.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchTaskStatus;