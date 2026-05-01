import { useState } from 'react';
import NavigationBar from '../components/NavigationBar.jsx';
import DisplayTasks from '../components/DisplayTasks.jsx';
import SearchTaskID from '../components/SearchTaskID.jsx';
import NewTask from '../components/NewTask.jsx';
import UpdateTask from '../components/UpdateTask.jsx';
import deleteTask from '../components/DeleteTask.jsx';

function Edit({ authenticationToken }) {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [taskResult, setTaskResult] = useState(null);

  const handleRefresh = () => setRefreshTrigger(prev => !prev);

  const handleTaskAdded = (result) => {
    handleRefresh();
    setShowNewTask(false);
    setTaskResult(result);
  };

  const handleTaskUpdated = (result) => {
    handleRefresh();
    setTaskBeingEdited(null);
    setTaskResult(result);
  };

  const handleTaskDeleted = async (task) => {
  setTaskResult(null);
  setTaskBeingEdited(null);
  setShowNewTask(false);
  const result = await deleteTask({ task, authenticationToken });
  if (result) {
    handleRefresh();
    setTaskResult(result);
    }
  };

  const toggleNewTaskForm = () => {
    setTaskResult(null);
    setShowNewTask(prev => !prev);
    setTaskBeingEdited(null);
  };

  return (
    <>
      <NavigationBar />

      <main className="container">
        <section className="hero card" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h1>Task Manager</h1>
            <p className="muted">View, search, create, update, and delete your tasks in one place.</p>
          </div>

          <button
            onClick={toggleNewTaskForm}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,.2)',
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,.05)',
              color: 'white',
              fontSize: '32px',
              fontWeight: '300',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Create New Task"
          >
            {showNewTask ? '−' : '+'}
          </button>
        </section>

        <section className="edit-stack">
          {showNewTask && (
            <section className="card">
              <NewTask onTaskAdded={handleTaskAdded} authenticationToken={authenticationToken} />
            </section>
          )}

          {taskBeingEdited && (
            <section className="card">
              <UpdateTask
                selectedTask={taskBeingEdited}
                onTaskUpdated={handleTaskUpdated}
                authenticationToken={authenticationToken}
                refreshTrigger={refreshTrigger}
              />
            </section>
          )}

          {taskResult && (
            <section
              className="card"
              style={{
                padding: '20px',
                textAlign: 'center',
                fontWeight: 700,
                color: taskResult.success ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {taskResult.message}
            </section>
          )}

          <section className="card">
            <DisplayTasks
              refreshTrigger={refreshTrigger}
              authenticationToken={authenticationToken}
              onEditTask={(task) => {
                setTaskBeingEdited(task);
                setShowNewTask(false);
                setTaskResult(null);
              }}
              onDeleteTask={handleTaskDeleted}
            />
          </section>

          <section className="card">
            <SearchTaskID authenticationToken={authenticationToken} />
          </section>
        </section>
      </main>
    </>
  );
}

export default Edit;