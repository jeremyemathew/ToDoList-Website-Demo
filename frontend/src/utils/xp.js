const STORAGE_KEY = 'todoflow_xp';

export function getXPState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { xp: 0 };
    const parsed = JSON.parse(raw);
    if (typeof parsed.xp !== 'number') return { xp: 0 };
    return parsed;
  } catch {
    return { xp: 0 };
  }
}

export function setXPState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXP(amount) {
  const safeAmount = Number(amount) || 0;
  const current = getXPState();
  const next = { xp: Math.max(0, current.xp + safeAmount) };
  setXPState(next);
  return next;
}

export function getLevelInfo(totalXP) {
  const xp = Math.max(0, Number(totalXP) || 0);

  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;

  const currentLevelXP = xp % xpPerLevel;
  const progress = Math.min(100, Math.round((currentLevelXP / xpPerLevel) * 100));

  return {
    level,
    xp,
    xpPerLevel,
    currentLevelXP,
    progress
  };
}