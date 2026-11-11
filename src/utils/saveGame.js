// Lưu tiến trình bằng localStorage (chỉ trên trình duyệt của người chơi, không gửi đi đâu)
// Mọi thao tác đều bọc try/catch vì trong iframe có thể bị chặn lưu trữ.
const SAVE_KEY = 'steelBrigade_battle_v2';
const PROGRESS_KEY = 'steelBrigade_progress_v2';

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const saveGame = (state) =>
  write(SAVE_KEY, {
    version: 2,
    level: state.level,
    units: state.units,
    turnNumber: state.turnNumber,
    combatLog: state.combatLog.slice(-15),
  });

export const loadGame = () => {
  const data = read(SAVE_KEY);
  if (!data || data.version !== 2 || !Array.isArray(data.units)) return null;
  return data;
};

export const hasSavedGame = () => Boolean(loadGame());

export const deleteSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
};

// progress: { completed: number[], stars: { [level]: 1..3 } }
export const loadProgress = () => {
  const data = read(PROGRESS_KEY);
  return {
    completed: Array.isArray(data?.completed) ? data.completed : [],
    stars: data?.stars && typeof data.stars === 'object' ? data.stars : {},
  };
};

export const saveProgress = (progress) => write(PROGRESS_KEY, progress);

export const resetProgress = () => {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
};
