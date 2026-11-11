import React from 'react';
import Sprite from './Sprite';
import { UNIT_STATS } from '../game/constants';

const UnitRow = ({ type }) => {
  const s = UNIT_STATS[type];
  return (
    <div className="tut-unit">
      <div className="portrait small"><Sprite name={type} /></div>
      <div>
        <b>{s.name}</b>
        <div className="tut-stats">
          HP {s.hp} · Công {s.attack} · Tầm {s.minRange}-{s.maxRange} · Đi {s.moveRange}
        </div>
        <div className="tut-desc">{s.desc}</div>
      </div>
    </div>
  );
};

const TerrainRow = ({ sprite, bg, name, text }) => (
  <div className="tut-terrain">
    <div className="tut-tile" style={{ background: bg }}>{sprite && <Sprite name={sprite} />}</div>
    <div><b>{name}</b><div className="tut-desc">{text}</div></div>
  </div>
);

const TutorialScreen = ({ onClose }) => (
  <div className="screen info-screen">
    <div className="topbar">
      <button className="btn btn-small" onClick={onClose}>◂ Menu</button>
      <div className="topbar-title">SỔ TAY CHỈ HUY</div>
      <div className="topbar-right" />
    </div>

    <div className="tut-grid">
      <section className="panel">
        <div className="panel-title">CÁCH CHƠI</div>
        <ol className="tut-steps">
          <li><b>Chọn</b> một xe tăng của bạn (khung vàng).</li>
          <li>Ô <span className="chip move">xanh</span> là nơi có thể <b>di chuyển</b>.</li>
          <li>Địch có <span className="chip atk">tâm ngắm đỏ</span> là mục tiêu <b>bắn được</b>.</li>
          <li>Mỗi xe: đi 1 lần + bắn 1 lần mỗi lượt. Pháo Kích <b>không bắn sau khi đi</b>.</li>
          <li>Rê chuột vào địch để xem <b>dự báo sát thương</b>.</li>
          <li>Bấm <b>Kết thúc lượt</b> khi xong. Đẩy lùi toàn bộ địch để thắng!</li>
        </ol>
        <div className="tut-keys">Phím tắt: <kbd>Esc</kbd>/chuột phải = bỏ chọn · <kbd>Space</kbd> = kết thúc lượt</div>
      </section>

      <section className="panel">
        <div className="panel-title">ĐƠN VỊ</div>
        <UnitRow type="TANK_ARTILLERY" />
        <UnitRow type="TANK_BRAWLER" />
        <UnitRow type="ALIEN_LARGE" />
        <UnitRow type="ALIEN_SMALL" />
      </section>

      <section className="panel">
        <div className="panel-title">ĐỊA HÌNH</div>
        <TerrainRow bg="#5f8c35" sprite="TREE" name="Rừng" text="Tốn 2 bước. Giảm 10% sát thương, +15% né." />
        <TerrainRow bg="#7d9a44" sprite="HILL" name="Đồi" text="Tốn 2 bước. Giảm 20% sát thương, pháo +1 tầm." />
        <TerrainRow bg="#6f8a3f" sprite="ROCK" name="Đá tảng" text="Không đi qua được." />
        <TerrainRow bg="#3d78b4" sprite="WAVES" name="Hồ nước" text="Không đi qua được, nhưng bắn qua được." />
      </section>
    </div>
  </div>
);

export default TutorialScreen;
