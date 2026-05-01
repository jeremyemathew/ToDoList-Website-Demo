import { useState, useEffect } from 'react';

function DisplayTasks({ refreshTrigger, authenticationToken, onEditTask, onDeleteTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/to_do_items', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authenticationToken}`,
        }
      });
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const getStatusText = (status) => {
    const safe = String(status).toLowerCase();
    if (safe === 'todo') return 'To Do';
    if (safe === 'doing') return 'Doing';
    if (safe === 'done') return 'Done';
    return status;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { todo: 1, doing: 2, done: 3 };
    const aOrder = statusOrder[String(a.status).toLowerCase()] || 99;
    const bOrder = statusOrder[String(b.status).toLowerCase()] || 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.id - b.id;
  });

  return (
    <>
      <div className="section-header">
        <div>
          <h2 style={{ marginBottom: '4px' }}>Task List</h2>
          <p className="muted" style={{ margin: 0 }}>
            View all of your current tasks below.
          </p>
        </div>
      </div>

      {loading ? (
        <div id="tasks-display">
          <p className="muted">Loading tasks...</p>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div id="tasks-display">
          <p className="muted">No tasks found.</p>
        </div>
      ) : (
        <div id="tasks-display">
          {sortedTasks.map(task => (
            <div key={task.id} className="task-card-clean">
              <div className="task-card-top">
                <div>
                  <p className="item-title">{task.title}</p>
                  <p className="item-id">Task ID: {task.id}</p>
                </div>

                <div className={`badge ${String(task.status).toLowerCase()}`}>
                  {getStatusText(task.status)}
                </div>
              </div>

              <p className="item-desc">{task.description}</p>

              {/* XP and Edit/Delete row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="task-meta-pill">
                  XP: {typeof task.experiencePoints === 'number' ? task.experiencePoints : 0}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onEditTask(task)}
                    style={{
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      border: '1px solid rgba(255,255,255,.10)',
                      background: 'rgba(0,200,0,.16)', // green for edit
                      color: '#b3ffb3',
                      cursor: 'pointer'
                    }}
                  >
                    EDIT
                  </button>

                  <button
                    onClick={() => onDeleteTask(task)}
                    style={{
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      border: '1px solid rgba(255,255,255,.10)',
                      background: 'rgba(255,77,77,.16)', // red for delete
                      color: '#ffb3b3',
                      cursor: 'pointer'
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              {/* Due Date row */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span className="task-meta-pill">
                  Due: {task.dueDate ? task.dueDate : 'No due date'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default DisplayTasks;