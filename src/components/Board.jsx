import React, { useMemo } from 'react';
import Sprite from './Sprite';
import Unit from './Unit';
import { BOARD_SIZE, TEAMS } from '../game/constants';
import { getValidMoves, getValidTargets, getAttackRange, getManhattanDistance } from '../game/gameLogic';

const TILE_BASE = {
  PLAIN: ['#6f9a3e', '#77a344'],
  ROAD: ['#b48d54', '#ba9459'],
  FOREST: ['#5f8c35', '#66933a'],
  HILL: ['#7d9a44', '#83a049'],
  ROCK: ['#6f8a3f', '#76913f'],
  WATER: ['#3d78b4', '#4380bd'],
};

const DECOR = { FOREST: 'TREE', HILL: 'HILL', ROCK: 'ROCK', WATER: 'WAVES' };

// hash cố định theo toạ độ để trang trí ngẫu nhiên nhưng không đổi giữa các lần render
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

const Board = ({ state, hoverCell, onHover, onCellClick, interactive, effects }) => {
  const { units, map, selectedId, currentTurn } = state;
  const selected = units.find((u) => u.id === selectedId) || null;

  const { moveSet, targetIds, rangeSet } = useMemo(() => {
    const moveSet = new Set();
    const rangeSet = new Set();
    let targetIds = new Set();
    if (selected && selected.team === TEAMS.PLAYER) {
      getValidMoves(selected, units, map).forEach((m) => moveSet.add(`${m.x},${m.y}`));
      const targets = getValidTargets(selected, units, map);
      targetIds = new Set(targets.map((t) => t.id));
      if (targets.length || !selected.hasAttacked) {
        const { min, max } = getAttackRange(selected, selected.position, map);
        for (let y = 0; y < BOARD_SIZE; y++)
          for (let x = 0; x < BOARD_SIZE; x++) {
            const d = getManhattanDistance(selected.position, { x, y });
            if (d >= min && d <= max) rangeSet.add(`${x},${y}`);
          }
      }
    }
    return { moveSet, targetIds, rangeSet };
  }, [selected, units, map]);

  const tiles = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const terrain = map[y][x];
      const key = `${x},${y}`;
      const h = hash(x, y);
      const base = TILE_BASE[terrain][(x + y) % 2];
      const decor = DECOR[terrain] || (terrain === 'PLAIN' && h % 3 === 0 ? 'TUFT' : null);
      const canMove = moveSet.has(key);
      const inRange = rangeSet.has(key);
      const isHover = hoverCell && hoverCell.x === x && hoverCell.y === y;

      tiles.push(
        <div
          key={key}
          className={`tile tile-${terrain.toLowerCase()}`}
          style={{ background: base }}
          onClick={() => interactive && onCellClick(x, y)}
          onMouseEnter={() => onHover({ x, y })}
        >
          {terrain === 'ROAD' && <div className="road-ruts" />}
          {decor && (
            <Sprite
              name={decor}
              className="tile-decor"
              flip={terrain !== 'ROCK' && h % 2 === 0}
            />
          )}
          {inRange && !canMove && <div className="ov ov-range" />}
          {canMove && <div className="ov ov-move" />}
          {isHover && interactive && <div className="cursor-frame" />}
        </div>,
      );
    }
  }

  return (
    <div className="board-frame">
      <div className="board" onMouseLeave={() => onHover(null)}>
        {tiles}
        <div className="unit-layer">
          {units.map((u) => (
            <Unit
              key={u.id}
              unit={u}
              isSelected={u.id === selectedId}
              isTarget={targetIds.has(u.id)}
              isActiveTeam={u.team === currentTurn}
              effects={effects}
            />
          ))}
          {effects.map((fx) => (
            <div
              key={fx.seq}
              className="fx"
              style={{ '--x': fx.at.x, '--y': fx.at.y }}
            >
              {!fx.dodged && <Sprite name="BURST" className="fx-burst" />}
              <div className={`fx-num ${fx.dodged ? 'miss' : ''}`}>
                {fx.dodged ? 'NÉ!' : `-${fx.damage}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
