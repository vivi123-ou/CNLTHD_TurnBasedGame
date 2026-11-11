import React, { useState } from 'react';
import Sprite from './Sprite';
import { LEVELS } from '../game/levels';
import { MAX_LEVEL } from '../game/constants';

// Vị trí các cứ điểm trên bản đồ chiến dịch (% theo khung bản đồ)
const NODES = {
  1: { x: 12, y: 72 },
  2: { x: 31, y: 40 },
  3: { x: 52, y: 66 },
  4: { x: 70, y: 32 },
  5: { x: 88, y: 58 },
};

// Trang trí bản đồ
const DECOS = [
  { s: 'TREE', x: 18, y: 28 }, { s: 'TREE', x: 23, y: 33 }, { s: 'TREE', x: 14, y: 36 },
  { s: 'HILL', x: 8, y: 54 }, { s: 'HOUSE', x: 60, y: 78 }, { s: 'HOUSE', x: 45, y: 80 },
  { s: 'ROCK', x: 62, y: 46 }, { s: 'HILL', x: 76, y: 14 }, { s: 'HILL', x: 66, y: 16 },
  { s: 'TREE', x: 40, y: 18 }, { s: 'TREE', x: 92, y: 80 }, { s: 'SHIP', x: 90, y: 40, big: true },
];

const Stars = ({ n = 0 }) => (
  <span className="stars-row">
    {[1, 2, 3].map((i) => (
      <i key={i} className={i <= n ? 'on' : ''}>★</i>
    ))}
  </span>
);

const LevelSelect = ({ onSelectLevel, onBack, progress }) => {
  const { completed, stars } = progress;
  const firstOpen = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).find((l) => !completed.includes(l)) || MAX_LEVEL;
  const [focus, setFocus] = useState(firstOpen);
  const isLocked = (id) => id > 1 && !completed.includes(id - 1);
  const lv = LEVELS[focus];

  const path = Object.values(NODES)
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="screen campaign-screen">
      <div className="topbar">
        <button className="btn btn-small" onClick={onBack}>◂ Menu</button>
        <div className="topbar-title">BẢN ĐỒ CHIẾN DỊCH</div>
        <div className="topbar-right">
          ★ {Object.values(stars).reduce((a, b) => a + b, 0)}/{MAX_LEVEL * 3}
        </div>
      </div>

      <div className="campaign-body">
        <div className="map-paper">
          <div className="map-grid" />
          <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={path} />
          </svg>
          <div className="map-compass">B<br />✦<br />N</div>
          {DECOS.map((d, i) => (
            <Sprite
              key={i}
              name={d.s}
              className={`map-deco ${d.big ? 'big' : ''}`}
              style={{ left: `${d.x}%`, top: `${d.y}%`, position: 'absolute' }}
            />
          ))}
          {Object.entries(NODES).map(([id, p]) => {
            const n = Number(id);
            const locked = isLocked(n);
            const done = completed.includes(n);
            return (
              <button
                key={id}
                className={`map-node ${locked ? 'locked' : ''} ${done ? 'done' : ''} ${focus === n ? 'focus' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => setFocus(n)}
                onDoubleClick={() => !locked && onSelectLevel(n)}
              >
                <span className="flag">{locked ? '?' : n}</span>
                {done && <Stars n={stars[n]} />}
              </button>
            );
          })}
        </div>

        <div className="mission panel">
          <div className="panel-title">HỒ SƠ NHIỆM VỤ {focus}</div>
          <div className="mission-body">
            <div className="mission-icon">
              <Sprite name={lv.enemy.some((e) => e.type === 'ALIEN_LARGE') ? 'ALIEN_LARGE' : 'ALIEN_SMALL'} />
            </div>
            <h2>{lv.name}</h2>
            <div className="mission-region">{lv.region}</div>
            <div className={`diff diff-${focus}`}>Độ khó: {lv.difficulty}</div>
            <ul className="mission-facts">
              <li>Quân ta: {lv.player.length} xe tăng</li>
              <li>Quân địch: {lv.enemy.length} sinh vật</li>
              <li>3 sao: thắng trong ≤ {lv.par} lượt, không mất xe nào</li>
            </ul>
            {completed.includes(focus) && (
              <div className="mission-best">
                Kỷ lục: <Stars n={stars[focus]} />
              </div>
            )}
          </div>
          <button
            className="btn btn-primary btn-wide"
            disabled={isLocked(focus)}
            onClick={() => onSelectLevel(focus)}
          >
            {isLocked(focus) ? 'Chưa mở khoá' : 'Xuất kích ▸'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { Stars };
export default LevelSelect;
