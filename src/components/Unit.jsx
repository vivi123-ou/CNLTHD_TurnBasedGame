import React, { memo } from 'react';
import Sprite from './Sprite';
import { UNIT_STATS, TEAMS } from '../game/constants';

const Unit = memo(({ unit, isSelected, isTarget, isActiveTeam, effects }) => {
  const stats = UNIT_STATS[unit.type];
  const isKO = unit.hp <= 0;
  const justKO = isKO && effects.some((fx) => fx.targetId === unit.id && fx.knockedOut);
  if (isKO && !justKO) return null;

  const hpPct = Math.max(0, (unit.hp / stats.hp) * 100);
  const hit = effects.some((fx) => fx.targetId === unit.id && !fx.dodged && !fx.knockedOut);
  const attacking = effects.some((fx) => fx.attackerId === unit.id);
  const isPlayer = unit.team === TEAMS.PLAYER;

  const cls = [
    'unit',
    isPlayer ? 'team-player' : 'team-enemy',
    isSelected && 'selected',
    isTarget && 'targetable',
    unit.done && isActiveTeam && 'spent',
    hit && 'hit',
    attacking && 'attacking',
    justKO && 'ko',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={{ '--x': unit.position.x, '--y': unit.position.y }}>
      <div className="unit-plate" />
      <div className="unit-body">
        <Sprite name={unit.type} />
      </div>
      <div className="unit-hp">
        <div
          className={`unit-hp-fill ${hpPct <= 30 ? 'low' : hpPct <= 60 ? 'mid' : ''}`}
          style={{ width: `${hpPct}%` }}
        />
      </div>
      <div className="unit-hp-num">{unit.hp}</div>
      {isTarget && <div className="target-reticle" />}
      {justKO && (
        <div className="ko-sparkles">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
});

Unit.displayName = 'Unit';

export default Unit;
