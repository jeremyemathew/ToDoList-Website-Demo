import { useEffect, useState } from 'react';
import { addXP } from '../utils/xp.js';

function UpdateTask({ selectedTask, onTaskUpdated, authenticationToken, refreshTrigger }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [experiencePoints, setExperiencePoints] = useState('0');
  const [oldStatus, setOldStatus] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!selectedTask) return;

    setTitle(selectedTask.title || '');
    setDescription(selectedTask.description || '');
    setStatus(String(selectedTask.status || 'todo').toLowerCase());
    setDueDate(selectedTask.dueDate || '');
    setExperiencePoints(String(selectedTask.experiencePoints ?? 0));
    setOldStatus(String(selectedTask.status || '').toLowerCase());
  }, [selectedTask]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedTask) {
      setMessage('Please select a task first.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage({ success: false, text: 'Title and description are required.' });
      return;
    }

    try {
      const response = await fetch(`/api/to_do_items/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticationToken}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
          dueDate,
          experiencePoints: Number(experiencePoints) || 0
        })
      });

      const result = await response.json();

      if (response.status === 200) {
        const newStatus = String(result.status || '').toLowerCase();
        if (oldStatus !== 'done' && newStatus === 'done') {
          const earned = Number(result.experiencePoints) || 0;
          if (earned > 0) addXP(earned);
        }

        setMessage({ success: true, text: '✅ Task updated successfully.' });

        if (onTaskUpdated) onTaskUpdated({ success: true, message: 'Task updated successfully.' });
      } else {
        setMessage({ success: false, text: result.error || 'Failed to update task.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ success: false, text: 'Server error while updating task.' });
    }
  };

  return (
    <section className="card">
      <h2>Update Task</h2>
      <p className="muted">Edit the task below.</p>

      <form onSubmit={handleUpdate}>
        {/* Title */}
        <label>Title</label>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label>Description</label>
        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Status */}
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        {/* Due Date */}
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* XP */}
        <label>Experience Points</label>
        <select value={experiencePoints} onChange={(e) => setExperiencePoints(e.target.value)}>
          <option value="0">0 XP</option>
          <option value="5">5 XP</option>
          <option value="10">10 XP</option>
          <option value="25">25 XP</option>
          <option value="50">50 XP</option>
          <option value="100">100 XP</option>
        </select>

        <button type="submit" className="btn">
          Update Task
        </button>
      </form>

      {message && (
        <p
          className="toast show"
          style={{ color: message.success ? 'var(--success)' : 'var(--danger)' }}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}

export default UpdateTask;