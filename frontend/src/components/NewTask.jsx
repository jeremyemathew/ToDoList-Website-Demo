import { useState } from 'react';
import { addXP } from '../utils/xp.js';

function NewTask({ onTaskAdded, authenticationToken }) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [experiencePoints, setExperiencePoints] = useState('');

  // UI state for local messages
  const [message, setMessage] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMessage('Title and description are required.');
      return;
    }

    const xpNum = Number(experiencePoints) || 0;

    try {
      const response = await fetch('/api/to_do_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authenticationToken}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
          dueDate,
          experiencePoints: xpNum
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Award XP immediately if task is DONE
        if (String(status).toLowerCase() === 'done' && xpNum > 0) {
          addXP(xpNum);
        }

        // Clear form only on success
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
        setExperiencePoints('');
        setMessage('✅ Task created successfully.');

        // Notify parent of success (so Edit.jsx can replace form with message)
        if (onTaskAdded) {
          onTaskAdded({ success: true, message: '✅ Task created successfully.' });
        }
      } else {
        const errorMsg = data.error || 'Failed to create task.';
        setMessage(errorMsg);

        if (onTaskAdded) {
          onTaskAdded({ success: false, message: errorMsg });
        }
      }
    } catch (err) {
      console.error('Error creating task:', err);
      const errorMsg = 'Server error while creating task.';
      setMessage(errorMsg);

      if (onTaskAdded) {
        onTaskAdded({ success: false, message: errorMsg });
      }
    }
  };

  return (
    <section className="card">
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label>Experience Points</label>
        <select
          value={experiencePoints}
          onChange={(e) => setExperiencePoints(e.target.value)}
        >
          <option value="">Select XP</option>
          <option value="0">0 XP</option>
          <option value="5">5 XP</option>
          <option value="10">10 XP</option>
          <option value="25">25 XP</option>
          <option value="50">50 XP</option>
          <option value="100">100 XP</option>
        </select>

        <button type="submit" className="btn">
          Create Task
        </button>
      </form>

      {/* Display local messages at bottom, including errors */}
      {message && <p style={{ marginTop: '12px' }}>{message}</p>}
    </section>
  );
}

export default NewTask;