import React, { useEffect, useState } from 'react';
import Sprite from './Sprite';
import Scenery from './Scenery';
import { getLevel } from '../game/levels';
import { sfx } from '../utils/soundEffects';

const ICONS = { BUG: 'ALIEN_SMALL', BIG: 'ALIEN_LARGE', TOWN: 'HOUSE', STORM: 'HILL', SHIP: 'SHIP' };

const StoryScreen = ({ levelId, onComplete, onBack }) => {
  const level = getLevel(levelId);
  const lines = level.story;
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  const current = lines[line] || '';
  const lineDone = chars >= current.length;
  const allDone = line >= lines.length - 1 && lineDone;

  useEffect(() => {
    setLine(0);
    setChars(0);
  }, [levelId]);

  useEffect(() => {
    if (lineDone) return undefined;
    const t = setTimeout(() => {
      setChars((c) => c + 1);
      if (chars % 3 === 0) sfx.typing();
    }, 28);
    return () => clearTimeout(t);
  }, [chars, lineDone]);

  const advance = () => {
    if (!lineDone) {
      setChars(current.length);
    } else if (!allDone) {
      setLine((l) => l + 1);
      setChars(0);
    }
  };

  return (
    <div className="screen story-screen" onClick={advance}>
      <Scenery ufo={levelId === 5} />
      <div className="dossier panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-title">
          <span>MẬT LỆNH · NHIỆM VỤ {levelId}</span>
          <span>{level.region.toUpperCase()}</span>
        </div>
        <div className="dossier-body" onClick={advance}>
          <div className="dossier-photo">
            <Sprite name={ICONS[level.icon] || 'ALIEN_SMALL'} />
            <div className="stamp">TUYỆT MẬT</div>
          </div>
          <div className="dossier-text">
            <h2>{level.name}</h2>
            {lines.slice(0, line).map((l, i) => (
              <p key={i}>{l}</p>
            ))}
            <p>
              {current.slice(0, chars)}
              {!allDone && <span className="caret">▌</span>}
            </p>
          </div>
        </div>
        <div className="dossier-actions">
          <button className="btn btn-small" onClick={onBack}>◂ Bản đồ</button>
          <span className="dossier-hint">{allDone ? '' : 'Nhấp chuột để đọc tiếp'}</span>
          {allDone ? (
            <button className="btn btn-primary pulse" onClick={onComplete}>Vào trận ▸</button>
          ) : (
            <button className="btn btn-small" onClick={onComplete}>Bỏ qua ▸▸</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryScreen;
