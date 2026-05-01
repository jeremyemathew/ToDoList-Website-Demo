import { useState } from 'react';

function SearchTaskID({ authenticationToken }) {
  const [taskId, setTaskId] = useState('');
  const [task, setTask] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = taskId.trim();
    if (!id) {
      alert('Please enter a task ID');
      return;
    }

    try {
      const response = await fetch(`/api/to_do_items/${id}`, 
        { method: 'GET',
          headers: {
          Authorization: `Bearer ${authenticationToken}`,
        }});
      const result = await response.json();

      if (response.status === 200) {
        setTask(result);
        setSearched(true);
      } else {
        alert(result.error || 'Task not found');
        setTask(null);
        setSearched(true);
      }
    } catch (error) {
      console.error('Error searching task:', error);
      alert(`An error occurred: ${error.message}`);
      setTask(null);
      setSearched(true);
    }
  };

  return (
    <>
      <main className="container">
        <section className="card">
          <h2>Search Task by ID</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Enter task ID"
              value={taskId}
              onChange={(e) => {
                setTaskId(e.target.value);
                setSearched(false);
              }}
            />
            <button type="submit" className="btn">Search</button>
          </form>

          {searched && (
            <>
              {task ? (
                <div className="card" style={{ marginTop: '16px' }}>
                  <h3>Task ID: {task.id}</h3>
                  <p><strong>Title:</strong> {task.title}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  {task.dueDate && <p><strong>Due Date:</strong> {task.dueDate}</p>}
                  {task.experiencePoints !== undefined && (
                    <p><strong>Experience Points:</strong> {task.experiencePoints}</p>
                  )}
                </div>
              ) : (
                <p style={{ marginTop: '16px' }}>No task found with ID "{taskId}".</p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default SearchTaskID;