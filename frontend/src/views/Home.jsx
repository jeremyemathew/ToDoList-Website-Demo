import { useEffect, useMemo, useState } from 'react';
import NavigationBar from '../components/NavigationBar.jsx';

function Home(authenticationToken) {
  const [tasks, setTasks] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = authenticationToken.authenticationToken;

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/to_do_items', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const summary = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => String(task.status).toLowerCase() === 'todo').length;
    const doing = tasks.filter((task) => String(task.status).toLowerCase() === 'doing').length;
    const done = tasks.filter((task) => String(task.status).toLowerCase() === 'done').length;
    const totalXP = tasks.reduce((sum, task) => sum + (Number(task.experiencePoints) || 0), 0);

    return { total, todo, doing, done, totalXP };
  }, [tasks]);

  const goToEdit = () => {
    window.history.pushState({}, '', '/edit');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <NavigationBar />

      <main className="container" role="main">
        <section className="hero card">
          <h1>Welcome to ToDoFlow</h1>
          <p className="muted">
            Manage your tasks, track your progress, and stay organized in one place.
          </p>

          <div className="row" style={{ marginTop: '14px' }}>
            <button className="btn" type="button" onClick={goToEdit}>
              Open Task Manager
            </button>
            <button className="btn ghost" type="button" onClick={loadTasks}>
              Refresh Tasks
            </button>
            <a className="btn ghost" href="/about">
              Learn More
            </a>
          </div>
        </section>

        <section className="grid-2" style={{ marginTop: '18px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '10px' }}>Task Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-label">Total Tasks</div>
                <div className="summary-value">{summary.total}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">To Do</div>
                <div className="summary-value">{summary.todo}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Doing</div>
                <div className="summary-value">{summary.doing}</div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Done</div>
                <div className="summary-value">{summary.done}</div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }} className="muted">
              Total possible XP from your current tasks: <strong>{summary.totalXP}</strong>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '10px' }}>Quick Guide</h2>
            <ol style={{ margin: 0 }}>
              <li>Go to <strong>Edit</strong> to create a new task</li>
              <li>Use search tools to find tasks by ID or status</li>
              <li>Update tasks as your progress changes</li>
              <li>Mark tasks as <strong>Done</strong> to earn XP</li>
              <li>Delete tasks when they are no longer needed</li>
            </ol>
          </div>
        </section>
        
        <section className="card" style={{ marginTop: '18px' }}>
          <div className="row between" style={{ marginBottom: '10px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Your Tasks</h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Select a task card to jump to Edit and manage it.
              </p>
            </div>

            <button className="btn ghost" onClick={loadTasks} type="button">
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks found yet. Go to Edit to create one.</p>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => {
                const isHovered = hoveredId === task.id;
                const isPressed = pressedId === task.id;

                const cardStyle = {
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                  transform: isPressed ? 'translateY(2px)' : (isHovered ? 'translateY(-2px)' : 'translateY(0)'),
                  borderColor: isHovered ? 'rgba(255,255,255,.18)' : undefined,
                  background: isHovered ? 'rgba(0,0,0,.28)' : undefined
                };

                return (
                  <div
                    key={task.id}
                    className="card item"
                    style={cardStyle}
                    onMouseEnter={() => setHoveredId(task.id)}
                    onMouseLeave={() => {
                      setHoveredId(null);
                      setPressedId(null);
                    }}
                    onMouseDown={() => setPressedId(task.id)}
                    onMouseUp={() => setPressedId(null)}
                    onClick={goToEdit}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') goToEdit();
                    }}
                  >
                    <div className="item-info">
                      <p className="item-title">{task.title}</p>
                      <p className="item-id">ID: {task.id}</p>
                      <p className="item-desc">{task.description}</p>

                      {task.dueDate && <p className="muted">Due: {task.dueDate}</p>}
                      {typeof task.experiencePoints === 'number' && (
                        <p className="muted">XP: {task.experiencePoints}</p>
                      )}
                    </div>

                    <div className={`badge ${String(task.status).toLowerCase()}`}>
                      {task.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;