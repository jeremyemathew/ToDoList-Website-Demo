import { useEffect, useState } from 'react';
import { isTokenValid } from '../utils/auth';

function Login({ setAuthenticationToken, authenticationToken, setCurrentPath }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isTokenValid(authenticationToken);

      if (valid) {
        window.history.pushState({}, '', '/home');
        setCurrentPath('/home');
      }
    };

    checkAuth();
  }, [authenticationToken, setCurrentPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Login failed');
        return;
      }

      setAuthenticationToken(data.token);
      localStorage.setItem('token', data.token);
      window.history.pushState({}, '', '/home');
      setCurrentPath('/home');
    } catch (err) {
      console.error(err);
      setErrorMessage('Server error');
    }
  };

  const handleSignUp = async () => {
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Signup failed');
        return;
      }

      setErrorMessage('Signup successful. Now click Login.');
    } catch (err) {
      console.error(err);
      setErrorMessage('Server error');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" />

      <section className="auth-layout">
        <div className="auth-left">
          <div className="auth-eyebrow">Task Management Platform</div>
          <h1 className="auth-hero-title">Stay organized. Finish faster.</h1>
          <p className="auth-hero-text">
            ToDoFlow helps you manage tasks, track XP, and stay productive with a cleaner workflow.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <span>✓</span>
              <div>
                <strong>Track everything</strong>
                <p>Create, update, search, and manage tasks in one place.</p>
              </div>
            </div>

            <div className="auth-feature-card">
              <span>✓</span>
              <div>
                <strong>Real-time updates</strong>
                <p>See live activity and notifications while you work.</p>
              </div>
            </div>

            <div className="auth-feature-card">
              <span>✓</span>
              <div>
                <strong>Gamified progress</strong>
                <p>Earn XP as you complete tasks and level up over time.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-brand">ToDoFlow</div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">
              Sign in to continue managing your tasks.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  maxLength={32}
                  placeholder="Enter your username"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={32}
                  placeholder="Enter your password"
                />
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn auth-primary-btn">
                  Login
                </button>
                <button type="button" className="btn ghost auth-secondary-btn" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            </form>

            {errorMessage && (
              <div className="auth-message">
                {errorMessage}
              </div>
            )}

            <div className="auth-footer-note">
              New here? Create an account with Sign Up, then log in.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;