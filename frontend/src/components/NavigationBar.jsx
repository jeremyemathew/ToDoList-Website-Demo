import { useState, useEffect } from 'react';
import XPBar from './XPBar.jsx';
import { getSocket, disconnectSocket } from '../utils/socket';

function NavigationBar() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleOnlineUsers = (count) => {
      setOnlineUsers(count);
    };

    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    disconnectSocket();
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand">ToDoFlow</div>
        <div className="online-users">👥 Online: {onlineUsers}</div>
      </div>

      <div className="nav-center">
        <a href="/home" className={`btn ghost ${currentPath === '/home' ? 'active' : ''}`}>
          Home
        </a>

        <a href="/edit" className={`btn ghost ${currentPath === '/edit' ? 'active' : ''}`}>
          Edit
        </a>

        <a href="/about" className={`btn ghost ${currentPath === '/about' ? 'active' : ''}`}>
          About
        </a>
      </div>

      <div className="nav-right">
        <XPBar />
        <button className="btn ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavigationBar;