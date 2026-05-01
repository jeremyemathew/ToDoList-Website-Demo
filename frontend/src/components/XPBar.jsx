import { useEffect, useState } from 'react';
import { getXPState, getLevelInfo } from '../utils/xp.js';

function XPBar() {
  const [xp, setXp] = useState(getXPState().xp);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'todoflow_xp') {
        setXp(getXPState().xp);
      }
    };

    window.addEventListener('storage', handleStorage);

    const interval = setInterval(() => {
      setXp(getXPState().xp);
    }, 600);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const info = getLevelInfo(xp);

  return (
    <div className="xp-wrap">
      <div className="xp-top">
        <span>Level {info.level}</span>
        <span className="muted">{info.currentLevelXP}/{info.xpPerLevel} XP</span>
      </div>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${info.progress}%` }}
        />
      </div>

      <div className="xp-sub">
        Total XP: {info.xp}
      </div>
    </div>
  );
}

export default XPBar;