import NavigationBar from '../components/NavigationBar.jsx';

function About() {
  const tiers = [
    { level: 1, minXP: 0, name: 'Starter', reward: 'Basic badge' },
    { level: 2, minXP: 100, name: 'Grinder', reward: 'Bronze badge' },
    { level: 3, minXP: 250, name: 'Focused', reward: 'Silver badge' },
    { level: 4, minXP: 500, name: 'Locked In', reward: 'Gold badge' },
    { level: 5, minXP: 1000, name: 'Elite', reward: 'Legend badge' }
  ];

  return (
    <>
      <NavigationBar />

      <main className="container" role="main">
        <section className="hero card">
          <h1>About ToDoFlow</h1>
          <p className="muted">
            ToDoFlow is a MERN task manager built to help users organize work, track progress, and stay motivated while completing tasks.
          </p>
        </section>

        <section className="edit-tools-grid" style={{ marginTop: '18px' }}>
          <div className="edit-column">
            <section className="card">
              <h2>Core Features</h2>
              <ul>
                <li>Create tasks with a title, description, status, due date, and XP value</li>
                <li>View your personal task list after logging in</li>
                <li>Search tasks by ID or by status</li>
                <li>Update tasks and change progress over time</li>
                <li>Delete tasks you no longer need</li>
              </ul>
            </section>

            <section className="card">
              <h2>Authentication</h2>
              <p className="muted">
                Each user signs up and logs in with their own account. After authentication, users only see and manage their own tasks.
              </p>
              <p className="muted">
                This makes the application more secure and more realistic than a shared task list.
              </p>
            </section>
          </div>

          <div className="edit-column">
            <section className="card">
              <h2>Real-Time Feature</h2>
              <p className="muted">
                ToDoFlow uses Socket.io to show the live number of users currently online.
              </p>
              <p className="muted">
                This means the application includes real-time communication between the server and connected clients. If multiple users open the app at the same time, the online count updates automatically.
              </p>
            </section>

            <section className="card">
              <h2>XP and Progress System</h2>
              <p className="muted">
                Tasks can include experience points (XP). When a task is marked as <strong>Done</strong>, the XP is added to your total and your progress bar updates.
              </p>

              <h3>Tier Levels & Rewards</h3>
              <ul>
                {tiers.map((t) => (
                  <li key={t.level}>
                    <strong>Level {t.level}</strong> — {t.name} (starts at {t.minXP} XP) — Reward: {t.reward}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        <section className="card" style={{ marginTop: '18px' }}>
          <h2>How to Use the App</h2>
          <ol>
            <li>Sign up for a new account or log in with an existing one</li>
            <li>Go to <strong>Home</strong> to view your tasks</li>
            <li>Go to <strong>Edit</strong> to create, search, update, or delete tasks</li>
            <li>Mark tasks as done to earn XP and level up</li>
            <li>Watch the live online user count update in the navigation bar</li>
          </ol>
        </section>
      </main>
    </>
  );
}

export default About;