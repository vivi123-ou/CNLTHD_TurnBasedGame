// ============================================
// BOARD
// ============================================
export const BOARD_SIZE = 8;

// ============================================
// TERRAIN
// ============================================
// cost: số điểm di chuyển cần để đi vào ô (Infinity = không đi được)
// defense: giảm % sát thương nhận vào khi đứng trên ô
// dodge: cộng thêm tỉ lệ né
// rangeBonus: cộng tầm bắn tối đa cho đơn vị bắn xa (minRange >= 2)
export const TERRAIN = {
  PLAIN: { key: 'PLAIN', name: 'Đồng cỏ', cost: 1, defense: 0, dodge: 0, rangeBonus: 0 },
  ROAD: { key: 'ROAD', name: 'Đường đất', cost: 1, defense: 0, dodge: 0, rangeBonus: 0 },
  FOREST: { key: 'FOREST', name: 'Rừng', cost: 2, defense: 0.1, dodge: 0.15, rangeBonus: 0 },
  HILL: { key: 'HILL', name: 'Đồi', cost: 2, defense: 0.2, dodge: 0, rangeBonus: 1 },
  ROCK: { key: 'ROCK', name: 'Đá tảng', cost: Infinity, defense: 0, dodge: 0, rangeBonus: 0 },
  WATER: { key: 'WATER', name: 'Hồ nước', cost: Infinity, defense: 0, dodge: 0, rangeBonus: 0 },
};

export const TERRAIN_CHARS = {
  '.': 'PLAIN',
  '=': 'ROAD',
  F: 'FOREST',
  H: 'HILL',
  R: 'ROCK',
  W: 'WATER',
};

// ============================================
// UNIT TYPES & TEAMS
// ============================================
export const UNIT_TYPES = {
  TANK_ARTILLERY: 'TANK_ARTILLERY',
  TANK_BRAWLER: 'TANK_BRAWLER',
  ALIEN_LARGE: 'ALIEN_LARGE',
  ALIEN_SMALL: 'ALIEN_SMALL',
};

export const TEAMS = {
  PLAYER: 'PLAYER',
  ENEMY: 'ENEMY',
};

// ============================================
// UNIT STATS
// armor: % giảm sát thương; dodgeRate: tỉ lệ né
// fireAfterMove: false = phải đứng yên mới bắn được (pháo binh)
// ============================================
export const UNIT_STATS = {
  [UNIT_TYPES.TANK_ARTILLERY]: {
    name: 'Pháo Kích',
    short: 'PHÁO',
    hp: 80,
    attack: 42,
    armor: 0.1,
    minRange: 2,
    maxRange: 4,
    moveRange: 2,
    dodgeRate: 0.1,
    fireAfterMove: false,
    team: TEAMS.PLAYER,
    desc: 'Bắn xa 2-4 ô. Không thể bắn trong lượt đã di chuyển.',
  },
  [UNIT_TYPES.TANK_BRAWLER]: {
    name: 'Xe Tăng Xung Kích',
    short: 'XUNG KÍCH',
    hp: 120,
    attack: 36,
    armor: 0.25,
    minRange: 1,
    maxRange: 2,
    moveRange: 3,
    dodgeRate: 0.1,
    fireAfterMove: true,
    team: TEAMS.PLAYER,
    desc: 'Giáp dày, cơ động. Vừa đi vừa bắn được.',
  },
  [UNIT_TYPES.ALIEN_LARGE]: {
    name: 'Quái Khổng Lồ',
    short: 'KHỔNG LỒ',
    hp: 110,
    attack: 30,
    armor: 0.2,
    minRange: 1,
    maxRange: 2,
    moveRange: 2,
    dodgeRate: 0.1,
    fireAfterMove: true,
    team: TEAMS.ENEMY,
    desc: 'Chậm chạp nhưng rất trâu.',
  },
  [UNIT_TYPES.ALIEN_SMALL]: {
    name: 'Bọ Do Thám',
    short: 'DO THÁM',
    hp: 60,
    attack: 22,
    armor: 0.05,
    minRange: 1,
    maxRange: 1,
    moveRange: 3,
    dodgeRate: 0.25,
    fireAfterMove: true,
    team: TEAMS.ENEMY,
    desc: 'Nhanh nhẹn, khó bắn trúng.',
  },
};

// ============================================
// ACTIONS
// ============================================
export const ACTIONS = {
  SELECT_UNIT: 'SELECT_UNIT',
  DESELECT: 'DESELECT',
  MOVE_UNIT: 'MOVE_UNIT',
  ATTACK_UNIT: 'ATTACK_UNIT',
  WAIT_UNIT: 'WAIT_UNIT',
  END_TURN: 'END_TURN',
  RESET_GAME: 'RESET_GAME',
  RESTORE_GAME: 'RESTORE_GAME',
};

export const GAME_STATUS = {
  PLAYING: 'PLAYING',
  PLAYER_WIN: 'PLAYER_WIN',
  ENEMY_WIN: 'ENEMY_WIN',
};

export const MAX_LEVEL = 5;
