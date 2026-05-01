async function deleteTask({ task, authenticationToken }) {
  if (!window.confirm(`Are you sure you want to delete task "${task.title}"?`)) return null;

  try {
    const res = await fetch(`/api/to_do_items/${task.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authenticationToken}` },
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: `Task "${data.title}" deleted successfully.` };
    } else {
      return { success: false, message: data.error || `Failed to delete task "${task.title}".` };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: `Failed to delete task "${task.title}".` };
  }
}

export default deleteTask;