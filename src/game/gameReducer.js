import { ACTIONS, GAME_STATUS, TEAMS, UNIT_STATS, MAX_LEVEL } from './constants';
import { getLevel, parseMap } from './levels';
import {
  calculateDamage,
  checkGameOver,
  getValidMoves,
  getValidTargets,
  isUnitExhausted,
} from './gameLogic';

// ============================================
// SETUP
// ============================================
const makeUnit = (cfg, team, index) => {
  const stats = UNIT_STATS[cfg.type];
  return {
    id: cfg.id,
    type: cfg.type,
    team,
    label: `${stats.short} ${index + 1}`,
    position: { x: cfg.x, y: cfg.y },
    hp: stats.hp,
    hasMoved: false,
    hasAttacked: false,
    done: false,
  };
};

export const createInitialUnits = (level = 1) => {
  const cfg = getLevel(level);
  return [
    ...cfg.player.map((u, i) => makeUnit(u, TEAMS.PLAYER, i)),
    ...cfg.enemy.map((u, i) => makeUnit(u, TEAMS.ENEMY, i)),
  ];
};

export const createBattle = (level = 1, battleId = 0) => ({
  level,
  map: parseMap(getLevel(level).map),
  units: createInitialUnits(level),
  selectedId: null,
  currentTurn: TEAMS.PLAYER,
  turnNumber: 1,
  gameStatus: GAME_STATUS.PLAYING,
  combatLog: [],
  lastEvent: null,
  battleId,
});

export const initialState = createBattle(1);

const resetFlags = (u) => ({ ...u, hasMoved: false, hasAttacked: false, done: false });

// ============================================
// REDUCER
// ============================================
export const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_UNIT: {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;
      const unit = state.units.find((u) => u.id === action.unitId);
      if (!unit || unit.hp <= 0 || unit.team !== state.currentTurn || unit.done) return state;
      if (state.selectedId === unit.id && !action.force) return { ...state, selectedId: null };
      return { ...state, selectedId: unit.id };
    }

    case ACTIONS.DESELECT:
      return state.selectedId ? { ...state, selectedId: null } : state;

    case ACTIONS.MOVE_UNIT: {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;
      const unitId = action.unitId ?? state.selectedId;
      const unit = state.units.find((u) => u.id === unitId);
      if (!unit || unit.team !== state.currentTurn) return state;

      const legal = getValidMoves(unit, state.units, state.map).some(
        (m) => m.x === action.position.x && m.y === action.position.y,
      );
      if (!legal) return state;

      let units = state.units.map((u) =>
        u.id === unit.id ? { ...u, position: { ...action.position }, hasMoved: true } : u,
      );
      const moved = units.find((u) => u.id === unit.id);
      const exhausted = isUnitExhausted(moved, units, state.map);
      if (exhausted) {
        units = units.map((u) => (u.id === unit.id ? { ...u, done: true } : u));
      }

      return {
        ...state,
        units,
        selectedId: exhausted ? null : unit.id,
        lastEvent: { kind: 'move', unitId: unit.id, seq: (state.lastEvent?.seq || 0) + 1 },
      };
    }

    case ACTIONS.ATTACK_UNIT: {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;
      const attackerId = action.unitId ?? state.selectedId;
      const attacker = state.units.find((u) => u.id === attackerId);
      if (!attacker || attacker.team !== state.currentTurn) return state;

      const defender = getValidTargets(attacker, state.units, state.map).find(
        (t) => t.id === action.targetId,
      );
      if (!defender) return state;

      const rolls = action.rolls || [Math.random(), Math.random()];
      let i = 0;
      const result = calculateDamage(attacker, defender, state.map, () => rolls[i++ % rolls.length]);
      const newHp = Math.max(0, defender.hp - result.finalDamage);

      const units = state.units.map((u) => {
        if (u.id === defender.id) return { ...u, hp: newHp };
        if (u.id === attacker.id) return { ...u, hasAttacked: true, hasMoved: true, done: true };
        return u;
      });

      const seq = (state.lastEvent?.seq || 0) + 1;
      const entry = {
        seq,
        turn: state.turnNumber,
        team: attacker.team,
        attacker: attacker.label,
        defender: defender.label,
        ...result,
        remainingHp: newHp,
        knockedOut: newHp === 0,
      };

      return {
        ...state,
        units,
        selectedId: null,
        combatLog: [...state.combatLog, entry].slice(-40),
        gameStatus: checkGameOver(units),
        lastEvent: {
          kind: 'attack',
          seq,
          attackerId: attacker.id,
          targetId: defender.id,
          damage: result.finalDamage,
          dodged: result.dodged,
          knockedOut: newHp === 0,
          at: { ...defender.position },
        },
      };
    }

    case ACTIONS.WAIT_UNIT: {
      const unitId = action.unitId ?? state.selectedId;
      return {
        ...state,
        units: state.units.map((u) => (u.id === unitId ? { ...u, done: true } : u)),
        selectedId: null,
      };
    }

    case ACTIONS.END_TURN: {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return state;
      if (action.expectedTurn && action.expectedTurn !== state.currentTurn) return state;
      const nextTurn = state.currentTurn === TEAMS.PLAYER ? TEAMS.ENEMY : TEAMS.PLAYER;
      return {
        ...state,
        units: state.units.map(resetFlags),
        currentTurn: nextTurn,
        turnNumber: nextTurn === TEAMS.PLAYER ? state.turnNumber + 1 : state.turnNumber,
        selectedId: null,
      };
    }

    case ACTIONS.RESET_GAME: {
      const level = Math.min(MAX_LEVEL, Math.max(1, action.level || state.level || 1));
      return createBattle(level, state.battleId + 1);
    }

    case ACTIONS.RESTORE_GAME: {
      const saved = action.gameState;
      if (!saved || !Array.isArray(saved.units)) return state;
      const fresh = createBattle(saved.level || 1, state.battleId + 1);
      return {
        ...fresh,
        units: saved.units,
        currentTurn: TEAMS.PLAYER,
        turnNumber: saved.turnNumber || 1,
        combatLog: saved.combatLog || [],
      };
    }

    default:
      return state;
  }
};

export default gameReducer;
