import React from 'react';
import Sprite from './Sprite';
import { Stars } from './LevelSelect';
import { MAX_LEVEL } from '../game/constants';

const ResultModal = ({ result, level, onNext, onRetry, onMap, onCredits }) => {
  const win = result.win;
  const isFinal = win && level === MAX_LEVEL;

  return (
    <div className="modal-backdrop">
      <div className={`modal panel ${win ? 'win' : 'lose'}`}>
        <div className="panel-title">
          <span>{win ? 'BÁO CÁO: THÀNH CÔNG' : 'BÁO CÁO: THẤT BẠI'}</span>
          <span>NHIỆM VỤ {level}</span>
        </div>

        <div className="modal-body">
          <div className="modal-art">
            {win ? (
              <>
                <Sprite name="TANK_BRAWLER" size={64} />
                <Sprite name="TANK_ARTILLERY" size={64} />
              </>
            ) : (
              <Sprite name="ALIEN_LARGE" size={72} />
            )}
          </div>

          <h2 className="modal-headline">
            {isFinal ? 'TRÁI ĐẤT AN TOÀN!' : win ? 'CHIẾN THẮNG!' : 'RÚT LUI!'}
          </h2>

          {win && (
            <div className="modal-stars">
              <Stars n={result.stars} />
            </div>
          )}

          <div className="modal-stats">
            <div><span>Số lượt</span><b>{result.turns}</b></div>
            <div><span>Xe còn lại</span><b>{result.survivors}/{result.total}</b></div>
            <div><span>Địch bị đẩy lùi</span><b>{result.enemiesDown}</b></div>
          </div>

          <p className="modal-text">
            {isFinal
              ? 'Tàu mẹ Zorg đã cất cánh rời khỏi Trái Đất. Lữ đoàn Thép đã hoàn thành sứ mệnh. Cảm ơn Chỉ huy!'
              : win
                ? result.stars < 3
                  ? `Mẹo: thắng trong ≤ ${result.par} lượt và không mất xe nào để đạt 3 sao.`
                  : 'Chỉ huy xuất sắc! Hoàn hảo cả về tốc độ lẫn đội hình.'
                : 'Mẹo: giữ Pháo Kích phía sau, đứng trên Đồi/Rừng để giảm sát thương và tăng né.'}
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn btn-small" onClick={onMap}>Bản đồ</button>
          <button className="btn btn-small" onClick={onRetry}>Chơi lại</button>
          {isFinal ? (
            <button className="btn btn-primary" onClick={onCredits}>Ghi công ▸</button>
          ) : win ? (
            <button className="btn btn-primary" onClick={onNext}>Nhiệm vụ kế ▸</button>
          ) : (
            <button className="btn btn-primary" onClick={onRetry}>Thử lại ▸</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
