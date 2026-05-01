import { useEffect, useMemo, useRef, useState } from 'react';
import { getSocket } from '../utils/socket';

const STORAGE_KEY = 'todoflow_notifications';
const BELL_SIZE = 62;
const PADDING = 10;

function NotificationBell() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: Math.max(PADDING, window.innerWidth - BELL_SIZE - 24),
    y: Math.min(PADDING, window.innerHeight - BELL_SIZE - PADDING)
  });

  const wrapperRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const clampPosition = (x, y) => ({
    x: Math.max(PADDING, Math.min(x, window.innerWidth - BELL_SIZE - PADDING)),
    y: Math.max(PADDING, Math.min(y, window.innerHeight - BELL_SIZE - PADDING))
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTaskActivity = (activity) => {
      const newNotification = {
        id: `${activity.type}-${activity.taskId}-${activity.timestamp}-${Math.random()}`,
        ...activity,
        read: false
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
    };

    socket.on('taskActivity', handleTaskActivity);

    return () => {
      socket.off('taskActivity', handleTaskActivity);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (sec < 60) return 'Just now';
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    if (day < 7) return `${day}d ago`;
    return then.toLocaleDateString();
  };

  const startDrag = (clientX, clientY) => {
    dragRef.current.dragging = true;
    dragRef.current.moved = false;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.offsetX = clientX - position.x;
    dragRef.current.offsetY = clientY - position.y;
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragRef.current.dragging) return;

    const dx = Math.abs(clientX - dragRef.current.startX);
    const dy = Math.abs(clientY - dragRef.current.startY);

    if (dx > 4 || dy > 4) {
      dragRef.current.moved = true;
    }

    const next = clampPosition(
      clientX - dragRef.current.offsetX,
      clientY - dragRef.current.offsetY
    );

    setPosition(next);
  };

  const endDrag = () => {
    dragRef.current.dragging = false;
    setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent) => {
      moveDrag(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      const wasDragging = dragRef.current.moved;
      endDrag();

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (!wasDragging) {
        setIsOpen((prev) => {
          const next = !prev;
          if (!prev) {
            setNotifications((current) =>
              current.map((item) => ({ ...item, read: true }))
            );
          }
          return next;
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={wrapperRef}
      className="drag-notif-wrapper"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <button
        type="button"
        className="drag-notif-bell"
        onMouseDown={handleMouseDown}
        aria-label="Open notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="drag-notif-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="drag-notif-panel">
          <div className="drag-notif-header">
            <div>
              <h3>Notifications</h3>
              <p>{notifications.length} recent update{notifications.length === 1 ? '' : 's'}</p>
            </div>

            <div className="drag-notif-actions">
              <button type="button" onClick={markAllAsRead}>Mark all read</button>
              <button type="button" onClick={clearAll}>Clear</button>
            </div>
          </div>

          <div className="drag-notif-body">
            {notifications.length === 0 ? (
              <div className="drag-notif-empty">
                <div className="drag-notif-empty-icon">🔔</div>
                <p>No notifications yet.</p>
                <span>Create, update, or delete a task to see alerts here.</span>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  className={`drag-notif-card ${item.read ? '' : 'unread'}`}
                  key={item.id}
                >
                  <div className="drag-notif-avatar">
                    {item.username ? item.username.charAt(0).toUpperCase() : 'T'}
                  </div>

                  <div className="drag-notif-content">
                    <p className="drag-notif-message">{item.message}</p>
                    <p className="drag-notif-time">{timeAgo(item.timestamp)}</p>
                  </div>

                  {!item.read && <div className="drag-notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;