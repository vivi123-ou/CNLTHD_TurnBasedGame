import React from 'react';
import Sprite from './Sprite';
import Scenery from './Scenery';

const MenuScreen = ({ onStartGame, onContinue, onTutorial, onCredits, soundEnabled, onToggleSound }) => (
  <div className="screen menu-screen">
    <Scenery />

    <div className="menu-center">
      <div className="title-plate">
        <div className="title-small">LỮ ĐOÀN THÉP</div>
        <h1 className="title-big">
          TANK <span>vs</span> ALIEN
        </h1>
        <div className="title-sub">Chiến thuật theo lượt</div>
      </div>

      <div className="menu-buttons panel">
        <button className="btn btn-primary btn-wide" onClick={onStartGame}>
          Chiến dịch
        </button>
        <button className="btn btn-wide" onClick={onContinue || undefined} disabled={!onContinue}>
          Tiếp tục trận
        </button>
        <button className="btn btn-wide" onClick={onTutorial}>
          Hướng dẫn
        </button>
        <button className="btn btn-wide" onClick={onCredits}>
          Ghi công
        </button>
      </div>
    </div>

    <div className="menu-units">
      <Sprite name="TANK_BRAWLER" size={72} />
      <Sprite name="TANK_ARTILLERY" size={72} />
    </div>
    <div className="menu-aliens">
      <Sprite name="ALIEN_SMALL" size={56} />
      <Sprite name="ALIEN_LARGE" size={72} />
    </div>

    <button className="btn btn-small sound-btn" onClick={onToggleSound}>
      Âm thanh: {soundEnabled ? 'BẬT' : 'TẮT'}
    </button>

    <div className="menu-footer">
      v1.0 · Trò chơi có sử dụng công cụ AI hỗ trợ lập trình &amp; thiết kế
    </div>
  </div>
);

export default MenuScreen;
