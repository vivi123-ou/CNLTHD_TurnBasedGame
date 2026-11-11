import React from 'react';
import Scenery from './Scenery';

const Row = ({ title, children }) => (
  <div className="credit-row">
    <span>{title}</span>
    <b>{children}</b>
  </div>
);

const CreditsScreen = ({ onClose, onResetProgress }) => (
  <div className="screen credits-screen">
    <Scenery />
    <div className="credits panel">
      <div className="panel-title">CREDITS</div>
      <div className="credits-body">
        <h2>TANK vs ALIEN</h2>
        <Row title="Thiết kế & phát triển">Lê Quỳnh Minh Vân</Row>
        <Row title="Công nghệ">React + Vite</Row>
        <Row title="Đồ hoạ">Pixel-art tự vẽ bằng mã nguồn</Row>
        <Row title="Âm thanh">Tổng hợp bằng Web Audio API</Row>
        <Row title="Phông chữ">Black Ops One · VT323 (SIL Open Font License)</Row>

        <div className="ai-notice">
          <b>Thông báo sử dụng AI</b>
          Trò chơi có sử dụng công cụ trí tuệ nhân tạo (AI) hỗ trợ trong quá trình lập trình,
          thiết kế giao diện và viết nội dung. Toàn bộ sản phẩm đã được tác giả kiểm duyệt.
        </div>

        <div className="privacy-notice">
          Trò chơi không thu thập dữ liệu cá nhân, không yêu cầu đăng nhập và không truy cập
          camera/micro. Tiến trình chỉ được lưu trên trình duyệt của bạn.
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-small" onClick={onResetProgress}>Xoá tiến trình</button>
        <button className="btn btn-primary" onClick={onClose}>◂ Về menu</button>
      </div>
    </div>
  </div>
);

export default CreditsScreen;
