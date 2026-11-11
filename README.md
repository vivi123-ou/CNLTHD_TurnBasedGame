# Tank vs Alien — Lữ Đoàn Thép

Game chiến thuật theo lượt chạy trên trình duyệt (React + Vite). Chỉ huy Lữ đoàn Thép đẩy lùi
đàn sinh vật Zorg qua 5 nhiệm vụ, trên bản đồ 8×8 có địa hình (rừng, đồi, đá, hồ nước).

## Presentation

[![Presentation Video](https://img.youtube.com/vi/n7w-u0xRtKU/maxresdefault.jpg)](https://youtu.be/n7w-u0xRtKU)

## Tính năng

- 5 nhiệm vụ, bản đồ chiến dịch, cốt truyện dạng hồ sơ mật lệnh
- 4 loại đơn vị: Pháo Kích, Xe Tăng Xung Kích, Quái Khổng Lồ, Bọ Do Thám
- Địa hình ảnh hưởng di chuyển, phòng thủ, tỉ lệ né và tầm bắn
- Dự báo sát thương khi rê chuột vào mục tiêu, nhật ký chiến trường
- AI đối thủ tính toán vị trí + mục tiêu tối ưu theo trạng thái mới nhất
- Xếp hạng 3 sao mỗi màn, tự lưu tiến trình (localStorage)
- Đồ hoạ pixel-art và âm thanh chiptune được tạo hoàn toàn bằng mã nguồn
- Khung hình 960×600 tự co giãn vừa mọi iframe

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & đưa lên itch.io

```bash
npm run build:itch # tạo release/tank-vs-alien-web.zip
```

1. Vào https://itch.io/game/new
2. **Kind of project**: `HTML`
3. Upload `release/tank-vs-alien-web.zip`, tick **"This file will be played in the browser"**
4. **Embed options**: Viewport `960 × 600`, tick **Mobile friendly** và **Fullscreen button**
5. **Visibility**: `Public` → Save
6. Link iframe để nộp cho Portal: `https://itch.io/embed-upload/<ID>` (lấy ở mục *Embed game* của trang game)

## Cấu trúc

```
src/
  game/        constants, levels (bản đồ), gameLogic, gameReducer, aiLogic
  components/  Board, Unit, Sprite (pixel-art), StatsPanel, các màn hình
  utils/       saveGame (localStorage), soundEffects (Web Audio)
```

## Thông báo sử dụng AI

Trò chơi có sử dụng công cụ trí tuệ nhân tạo (AI) hỗ trợ trong quá trình lập trình, thiết kế giao
diện và viết nội dung. Toàn bộ sản phẩm đã được tác giả kiểm duyệt.

## Bản quyền tài nguyên

- Đồ hoạ: pixel-art tự vẽ bằng mã nguồn (`src/components/Sprite.jsx`)
- Âm thanh: tổng hợp bằng Web Audio API, không dùng file âm thanh ngoài
- Phông chữ: Black Ops One, VT323 — SIL Open Font License 1.1 (đóng gói qua `@fontsource`)
