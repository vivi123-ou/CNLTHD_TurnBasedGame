import React, { useEffect, useRef } from 'react';
import Sprite from './Sprite';
import { UNIT_STATS, TEAMS, TERRAIN, GAME_STATUS } from '../game/constants';
import {
  getTerrainAt,
  getUnitAtPosition,
  getValidTargets,
  estimateDamage,
  getHitChance,
  getAttackRange,
} from '../game/gameLogic';

const Bar = ({ value, max }) => {
  const pct = Math.max(0, (value / max) * 100);
  return (
    <div className="bar">
      <div className={`bar-fill ${pct <= 30 ? 'low' : pct <= 60 ? 'mid' : ''}`} style={{ width: `${pct}%` }} />
      <span className="bar-text">
        {value}/{max}
      </span>
    </div>
  );
};

const UnitCard = ({ unit, map }) => {
  const s = UNIT_STATS[unit.type];
  const t = getTerrainAt(map, unit.position.x, unit.position.y);
  const range = getAttackRange(unit, unit.position, map);
  const isPlayer = unit.team === TEAMS.PLAYER;
  let status = 'Sẵn sàng';
  if (unit.done) status = 'Đã hành động';
  else if (unit.hasMoved) status = s.fireAfterMove ? 'Đã di chuyển — còn bắn được' : 'Đã di chuyển — pháo không bắn được';

  return (
    <div className={`unit-card ${isPlayer ? 'p' : 'e'}`}>
      <div className="portrait">
        <Sprite name={unit.type} />
      </div>
      <div className="unit-card-info">
        <div className="unit-card-name">{s.name}</div>
        <div className="unit-card-tag">{isPlayer ? 'LỮ ĐOÀN THÉP' : 'SINH VẬT ZORG'} · {unit.label}</div>
        <Bar value={unit.hp} max={s.hp} />
      </div>
      <div className="stat-grid">
        <span>Công</span><b>{s.attack}</b>
        <span>Giáp</span><b>{Math.round(s.armor * 100)}%</b>
        <span>Né</span><b>{Math.round((s.dodgeRate + t.dodge) * 100)}%</b>
        <span>Tầm</span><b>{range.min}-{range.max}</b>
        <span>Đi</span><b>{s.moveRange}</b>
        <span>Địa hình</span><b>{t.name}</b>
      </div>
      {isPlayer && <div className="unit-card-status">{status}</div>}
      <div className="unit-card-desc">{s.desc}</div>
    </div>
  );
};

const TerrainCard = ({ terrainKey }) => {
  const t = TERRAIN[terrainKey];
  const effects = [];
  if (!Number.isFinite(t.cost)) effects.push('Không đi qua được');
  else if (t.cost > 1) effects.push(`Tốn ${t.cost} điểm di chuyển`);
  if (t.defense) effects.push(`Giảm ${Math.round(t.defense * 100)}% sát thương`);
  if (t.dodge) effects.push(`+${Math.round(t.dodge * 100)}% né`);
  if (t.rangeBonus) effects.push(`Pháo +${t.rangeBonus} tầm bắn`);
  if (!effects.length) effects.push('Không có hiệu ứng');
  return (
    <div className="terrain-card">
      <b>{t.name}</b>
      <span>{effects.join(' · ')}</span>
    </div>
  );
};

const StatsPanel = ({ state, hoverCell, onWait, onEndTurn, canAct, aiThinking, allSpent }) => {
  const { units, map, selectedId, combatLog, currentTurn, gameStatus } = state;
  const selected = units.find((u) => u.id === selectedId);
  const hovered = hoverCell ? getUnitAtPosition(hoverCell.x, hoverCell.y, units) : null;
  const shown = hovered || selected;
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combatLog.length]);

  let forecast = null;
  if (selected && hovered && hovered.team !== selected.team) {
    const can = getValidTargets(selected, units, map).some((t) => t.id === hovered.id);
    if (can) {
      const dmg = estimateDamage(selected, hovered, map);
      const hit = Math.round(getHitChance(hovered, map) * 100);
      forecast = { dmg, hit, ko: dmg >= hovered.hp };
    }
  }

  const playersLeft = units.filter((u) => u.team === TEAMS.PLAYER && u.hp > 0).length;
  const enemiesLeft = units.filter((u) => u.team === TEAMS.ENEMY && u.hp > 0).length;
  const isPlayerTurn = currentTurn === TEAMS.PLAYER && gameStatus === GAME_STATUS.PLAYING;

  return (
    <aside className="side panel">
      <div className="panel-title">
        <span>BÁO CÁO CHIẾN TRƯỜNG</span>
        <span className="force-count">
          <i className="dot p" /> {playersLeft} &nbsp; <i className="dot e" /> {enemiesLeft}
        </span>
      </div>

      <div className="side-body">
        {shown ? (
          <UnitCard unit={shown} map={map} />
        ) : (
          <div className="hint-box">
            {gameStatus !== GAME_STATUS.PLAYING
              ? 'Trận đánh đã kết thúc.'
              : isPlayerTurn
                ? 'Chọn một xe tăng của bạn để ra lệnh. Rê chuột lên bất kỳ ô nào để xem thông tin.'
                : 'Quân Zorg đang hành động...'}
          </div>
        )}

        {forecast && (
          <div className={`forecast ${forecast.ko ? 'ko' : ''}`}>
            <span>DỰ BÁO</span>
            <b>-{forecast.dmg} HP</b>
            <span>Trúng {forecast.hit}%</span>
            {forecast.ko && <em>HẠ GỤC!</em>}
          </div>
        )}

        {hoverCell && <TerrainCard terrainKey={map[hoverCell.y][hoverCell.x]} />}
      </div>

      <div className="actions">
        <button
          className="btn btn-small"
          onClick={onWait}
          disabled={!canAct || !selected || selected.team !== TEAMS.PLAYER}
          title="Đơn vị đứng yên, kết thúc hành động"
        >
          Chờ lệnh
        </button>
        <button className={`btn btn-primary ${allSpent ? 'pulse' : ''}`} onClick={onEndTurn} disabled={!canAct}>
          {aiThinking ? 'Địch đang đi...' : 'Kết thúc lượt ▸'}
        </button>
      </div>

      <div className="log-title">NHẬT KÝ</div>
      <div className="log" ref={logRef}>
        {combatLog.length === 0 && <div className="log-empty">— Chưa có giao tranh —</div>}
        {combatLog.map((l) => (
          <div key={l.seq} className={`log-line ${l.team === TEAMS.PLAYER ? 'p' : 'e'}`}>
            <span className="log-turn">L{l.turn}</span> {l.attacker} ▸ {l.defender}:{' '}
            {l.dodged ? (
              <span className="miss">né được!</span>
            ) : (
              <>
                <span className="dmg">-{l.finalDamage}</span>
                {l.knockedOut && <span className="ko"> {l.team === TEAMS.PLAYER ? 'bị đẩy lùi!' : 'phải rút lui!'}</span>}
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default StatsPanel;
