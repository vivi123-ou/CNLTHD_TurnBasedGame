import { UNIT_TYPES, UNIT_STATS, TEAMS, BOARD_SIZE } from './constants';
import {
  getValidMoves,
  getTargetsFrom,
  estimateDamage,
  getHitChance,
  getTerrainAt,
  isAlive,
  isValidPosition,
} from './gameLogic';

// Khoảng cách đi bộ thực tế (tính địa hình, bỏ qua đơn vị) từ mọi ô tới `goal`
const distanceField = (goal, map) => {
  const dist = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Infinity));
  dist[goal.y][goal.x] = 0;
  const queue = [{ ...goal, d: 0 }];
  while (queue.length) {
    queue.sort((a, b) => a.d - b.d);
    const cur = queue.shift();
    if (cur.d > dist[cur.y][cur.x]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (!isValidPosition(nx, ny)) continue;
      // chi phí bước vào ô hiện tại (đi ngược từ goal)
      const step = getTerrainAt(map, cur.x, cur.y).cost;
      const nd = cur.d + (Number.isFinite(step) ? step : 99);
      if (!Number.isFinite(getTerrainAt(map, nx, ny).cost)) continue;
      if (nd < dist[ny][nx]) {
        dist[ny][nx] = nd;
        queue.push({ x: nx, y: ny, d: nd });
      }
    }
  }
  return dist;
};

const scoreAttack = (attacker, target, map) => {
  const dmg = estimateDamage(attacker, target, map);
  const hit = getHitChance(target, map);
  let score = dmg * hit;
  if (dmg >= target.hp) score += 40 * hit; // ưu tiên kết liễu
  if (target.type === UNIT_TYPES.TANK_ARTILLERY) score += 8; // pháo là mối đe doạ lớn
  score += (1 - target.hp / UNIT_STATS[target.type].hp) * 10; // nhắm con yếu
  return score;
};

// Trả về { move: {x,y} | null, targetId: string | null }
export const planUnitAction = (unit, units, map) => {
  const players = units.filter((u) => u.team !== unit.team && isAlive(u));
  if (!players.length) return null;

  const stats = UNIT_STATS[unit.type];
  const moves = getValidMoves(unit, units, map);
  const positions = [{ ...unit.position, stay: true }, ...moves];

  // 1) Tìm cặp (vị trí, mục tiêu) tốt nhất
  let best = null;
  for (const pos of positions) {
    if (!pos.stay && !stats.fireAfterMove) continue;
    const ghost = { ...unit, position: { x: pos.x, y: pos.y } };
    for (const target of getTargetsFrom(ghost, ghost.position, units, map)) {
      const terrain = getTerrainAt(map, pos.x, pos.y);
      const score = scoreAttack(unit, target, map) + terrain.defense * 10 + terrain.dodge * 10 + (pos.stay ? 0.5 : 0);
      if (!best || score > best.score) {
        best = { score, move: pos.stay ? null : { x: pos.x, y: pos.y }, targetId: target.id };
      }
    }
  }
  if (best) return { move: best.move, targetId: best.targetId };

  // 2) Không đánh được ai -> tiến về phía mục tiêu gần nhất (theo đường đi thật)
  let goal = null;
  let goalField = null;
  let goalDist = Infinity;
  for (const p of players) {
    const field = distanceField(p.position, map);
    const d = field[unit.position.y][unit.position.x];
    const weighted = d - (p.type === UNIT_TYPES.TANK_ARTILLERY && unit.type === UNIT_TYPES.ALIEN_LARGE ? 1.5 : 0);
    if (weighted < goalDist) {
      goalDist = weighted;
      goal = p;
      goalField = field;
    }
  }
  if (!goal || !moves.length) return { move: null, targetId: null };

  let bestMove = null;
  let bestScore = goalField[unit.position.y][unit.position.x];
  for (const m of moves) {
    const t = getTerrainAt(map, m.x, m.y);
    const score = goalField[m.y][m.x] - t.defense - t.dodge;
    if (score < bestScore) {
      bestScore = score;
      bestMove = { x: m.x, y: m.y };
    }
  }
  return { move: bestMove, targetId: null };
};

// Thứ tự hành động: con nào đang có mục tiêu đánh được thì đi trước
export const getAIOrder = (units) =>
  units
    .filter((u) => u.team === TEAMS.ENEMY && isAlive(u))
    .map((u) => u.id);
