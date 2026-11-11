import { BOARD_SIZE, UNIT_STATS, TEAMS, TERRAIN, GAME_STATUS } from './constants';

// ============================================
// HELPERS
// ============================================
export const getManhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const isValidPosition = (x, y) => x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

export const isAlive = (u) => u.hp > 0;

export const getTerrainAt = (map, x, y) => TERRAIN[map?.[y]?.[x]] || TERRAIN.PLAIN;

// Chỉ đơn vị còn sống mới chiếm ô (đơn vị bị hạ sẽ rời bàn cờ)
export const getUnitAtPosition = (x, y, units) =>
  units.find((u) => isAlive(u) && u.position.x === x && u.position.y === y);

export const isPositionOccupied = (x, y, units) => Boolean(getUnitAtPosition(x, y, units));

// ============================================
// MOVEMENT — tìm đường có tính chi phí địa hình
// Được đi xuyên qua đồng đội, không xuyên qua kẻ địch
// ============================================
export const getValidMoves = (unit, units, map) => {
  if (!unit || !isAlive(unit) || unit.hasMoved || unit.done) return [];
  const budget = UNIT_STATS[unit.type].moveRange;
  const start = unit.position;
  const best = new Map([[`${start.x},${start.y}`, 0]]);
  const queue = [{ x: start.x, y: start.y, cost: 0 }];
  const result = [];

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const cur = queue.shift();
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of dirs) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (!isValidPosition(nx, ny)) continue;
      const cost = cur.cost + getTerrainAt(map, nx, ny).cost;
      if (cost > budget) continue;
      const occupant = getUnitAtPosition(nx, ny, units);
      if (occupant && occupant.team !== unit.team) continue;
      const key = `${nx},${ny}`;
      if (best.has(key) && best.get(key) <= cost) continue;
      best.set(key, cost);
      queue.push({ x: nx, y: ny, cost });
    }
  }

  best.forEach((cost, key) => {
    const [x, y] = key.split(',').map(Number);
    if (x === start.x && y === start.y) return;
    if (isPositionOccupied(x, y, units)) return;
    result.push({ x, y, cost });
  });
  return result;
};

// ============================================
// ATTACK
// ============================================
export const getAttackRange = (unit, position, map) => {
  const stats = UNIT_STATS[unit.type];
  const terrain = getTerrainAt(map, position.x, position.y);
  const bonus = stats.minRange >= 2 ? terrain.rangeBonus : 0;
  return { min: stats.minRange, max: stats.maxRange + bonus };
};

export const canStillAttack = (unit) => {
  if (!unit || !isAlive(unit) || unit.done || unit.hasAttacked) return false;
  const stats = UNIT_STATS[unit.type];
  return stats.fireAfterMove || !unit.hasMoved;
};

// Mục tiêu nếu đơn vị đứng ở `position` (không kiểm tra trạng thái đã hành động)
export const getTargetsFrom = (unit, position, units, map) => {
  const { min, max } = getAttackRange(unit, position, map);
  return units.filter((u) => {
    if (!isAlive(u) || u.team === unit.team) return false;
    const d = getManhattanDistance(position, u.position);
    return d >= min && d <= max;
  });
};

export const getValidTargets = (unit, units, map) =>
  canStillAttack(unit) ? getTargetsFrom(unit, unit.position, units, map) : [];

// Ước lượng sát thương trung bình (dùng cho AI & hiển thị dự báo)
export const estimateDamage = (attacker, defender, map) => {
  const a = UNIT_STATS[attacker.type];
  const d = UNIT_STATS[defender.type];
  const t = getTerrainAt(map, defender.position.x, defender.position.y);
  return Math.max(1, Math.round(a.attack * (1 - d.armor) * (1 - t.defense)));
};

export const getHitChance = (defender, map) => {
  const d = UNIT_STATS[defender.type];
  const t = getTerrainAt(map, defender.position.x, defender.position.y);
  return Math.max(0, 1 - (d.dodgeRate + t.dodge));
};

export const calculateDamage = (attacker, defender, map, rng = Math.random) => {
  const a = UNIT_STATS[attacker.type];
  const d = UNIT_STATS[defender.type];
  const t = getTerrainAt(map, defender.position.x, defender.position.y);

  const rawDamage = Math.round(a.attack * (0.9 + rng() * 0.2));
  const reduced = Math.max(1, Math.round(rawDamage * (1 - d.armor) * (1 - t.defense)));
  const dodged = rng() < d.dodgeRate + t.dodge;

  return {
    rawDamage,
    finalDamage: dodged ? 0 : reduced,
    armorBlocked: dodged ? 0 : rawDamage - reduced,
    dodged,
  };
};

// ============================================
// GAME OVER
// ============================================
export const checkGameOver = (units) => {
  const playerAlive = units.some((u) => u.team === TEAMS.PLAYER && isAlive(u));
  const enemyAlive = units.some((u) => u.team === TEAMS.ENEMY && isAlive(u));
  if (!playerAlive) return GAME_STATUS.ENEMY_WIN;
  if (!enemyAlive) return GAME_STATUS.PLAYER_WIN;
  return GAME_STATUS.PLAYING;
};

// Đơn vị đã hết việc để làm trong lượt này chưa
export const isUnitExhausted = (unit, units, map) => {
  if (!isAlive(unit) || unit.done) return true;
  const canMove = !unit.hasMoved && getValidMoves(unit, units, map).length > 0;
  const canAttack = getValidTargets(unit, units, map).length > 0;
  return !canMove && !canAttack;
};
