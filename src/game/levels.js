import { UNIT_TYPES, TERRAIN_CHARS, BOARD_SIZE } from './constants';

const { TANK_ARTILLERY: ART, TANK_BRAWLER: BRW, ALIEN_LARGE: BIG, ALIEN_SMALL: BUG } = UNIT_TYPES;

// Bản đồ 8x8 — mỗi chuỗi là một hàng (y), mỗi ký tự là một cột (x)
// .  đồng cỏ   =  đường   F  rừng   H  đồi   R  đá   W  nước
export const LEVELS = {
  1: {
    name: 'Huấn Luyện Cơ Bản',
    region: 'Doanh trại Đồi Thông',
    difficulty: 'Dễ',
    par: 5,
    map: [
      '..F.....',
      '........',
      '...H..F.',
      '========',
      '........',
      '.F...R..',
      '........',
      '....F...',
    ],
    player: [
      { id: 'tank1', type: ART, x: 0, y: 3 },
      { id: 'tank2', type: BRW, x: 1, y: 4 },
    ],
    enemy: [
      { id: 'alien1', type: BUG, x: 6, y: 2 },
      { id: 'alien2', type: BUG, x: 7, y: 4 },
    ],
    story: [
      'Năm 2145. Một đàn sinh vật lạ từ hành tinh Zorg vừa hạ cánh xuống Trái Đất.',
      'Chúng không hiểu tiếng người và đang phá nát mùa màng khắp nơi.',
      'Chỉ huy, ngài được giao Lữ đoàn Thép — đội xe tăng cuối cùng còn hoạt động.',
      'Nhiệm vụ: bắn vô hiệu hoá và đưa chúng về tàu mẹ. Bắt đầu huấn luyện!',
    ],
    icon: 'BUG',
  },
  2: {
    name: 'Chạm Trán Đầu Tiên',
    region: 'Cánh đồng Hồ Bạc',
    difficulty: 'Dễ',
    par: 6,
    map: [
      '..FF....',
      '..F..R..',
      '....H...',
      '========',
      '...W....',
      '.H.WW.F.',
      '......F.',
      '..F.....',
    ],
    player: [
      { id: 'tank1', type: ART, x: 0, y: 2 },
      { id: 'tank2', type: BRW, x: 1, y: 3 },
      { id: 'tank3', type: BRW, x: 1, y: 5 },
    ],
    enemy: [
      { id: 'alien1', type: BUG, x: 7, y: 1 },
      { id: 'alien2', type: BIG, x: 6, y: 3 },
      { id: 'alien3', type: BUG, x: 7, y: 6 },
    ],
    story: [
      'Làm tốt lắm, Chỉ huy!',
      'Radar phát hiện một con Quái Khổng Lồ cạnh hồ Bạc.',
      'Nó chậm nhưng rất trâu — hãy để Pháo Kích bắn từ xa.',
      'Mẹo: đứng trên Đồi giúp pháo bắn xa thêm 1 ô.',
    ],
    icon: 'BIG',
  },
  3: {
    name: 'Thị Trấn Bỏ Hoang',
    region: 'Thị trấn Gạch Đỏ',
    difficulty: 'Vừa',
    par: 8,
    map: [
      'R..R..R.',
      '..=====.',
      '.R=..R=.',
      '..=.H.=.',
      '..=.F.=.',
      '.R=..R=.',
      '..=====.',
      'R..R..R.',
    ],
    player: [
      { id: 'tank1', type: ART, x: 0, y: 4 },
      { id: 'tank2', type: BRW, x: 1, y: 3 },
      { id: 'tank3', type: BRW, x: 1, y: 6 },
    ],
    enemy: [
      { id: 'alien1', type: BIG, x: 7, y: 1 },
      { id: 'alien2', type: BUG, x: 7, y: 3 },
      { id: 'alien3', type: BIG, x: 6, y: 5 },
      { id: 'alien4', type: BUG, x: 7, y: 6 },
    ],
    story: [
      'Lũ sinh vật đã kéo vào thị trấn Gạch Đỏ.',
      'Người dân đã sơ tán an toàn — giờ chỉ còn chúng ta và chúng.',
      'Những đống đổ nát sẽ chặn đường đi. Hãy dùng chúng làm lá chắn.',
      'Giữ đội hình, đừng để Pháo Kích bị bao vây!',
    ],
    icon: 'TOWN',
  },
  4: {
    name: 'Bão Cát',
    region: 'Cao nguyên Đá Vàng',
    difficulty: 'Khó',
    par: 9,
    map: [
      '..H.....',
      '.....HF.',
      'H..R....',
      '===W====',
      '...WW...',
      '.F....H.',
      '....R...',
      '..H....F',
    ],
    player: [
      { id: 'tank1', type: ART, x: 0, y: 2 },
      { id: 'tank2', type: ART, x: 0, y: 5 },
      { id: 'tank3', type: BRW, x: 1, y: 3 },
      { id: 'tank4', type: BRW, x: 1, y: 6 },
    ],
    enemy: [
      { id: 'alien1', type: BIG, x: 7, y: 0 },
      { id: 'alien2', type: BUG, x: 6, y: 2 },
      { id: 'alien3', type: BIG, x: 7, y: 3 },
      { id: 'alien4', type: BUG, x: 6, y: 4 },
      { id: 'alien5', type: BIG, x: 7, y: 6 },
    ],
    story: [
      'Một cơn bão cát đang quét qua cao nguyên Đá Vàng.',
      'Trinh sát báo về: đây là đội quân lớn nhất từ trước tới nay.',
      'Chúng đã học cách nhắm vào pháo binh của ta.',
      'Hãy dùng Xe Tăng Xung Kích làm tường chắn phía trước!',
    ],
    icon: 'STORM',
  },
  5: {
    name: 'Trận Chiến Cuối Cùng',
    region: 'Bãi đáp Tàu Mẹ',
    difficulty: 'Rất khó',
    par: 10,
    map: [
      '...F....',
      '.H....R.',
      '...R....',
      '==.===.=',
      '......W.',
      '..H..WW.',
      '.F......',
      '....F..H',
    ],
    player: [
      { id: 'tank1', type: ART, x: 1, y: 1 },
      { id: 'tank2', type: ART, x: 2, y: 5 },
      { id: 'tank3', type: BRW, x: 0, y: 3 },
      { id: 'tank4', type: BRW, x: 1, y: 4 },
    ],
    enemy: [
      { id: 'alien1', type: BIG, x: 7, y: 0 },
      { id: 'alien2', type: BUG, x: 5, y: 1 },
      { id: 'alien3', type: BIG, x: 7, y: 2 },
      { id: 'alien4', type: BIG, x: 7, y: 3 },
      { id: 'alien5', type: BUG, x: 6, y: 6 },
      { id: 'alien6', type: BIG, x: 6, y: 7 },
    ],
    story: [
      'Đây rồi, Chỉ huy.',
      'Tàu mẹ của Zorg đã hạ cánh, toàn bộ đàn quái đang tập trung.',
      'Đẩy lùi được chúng, chúng sẽ phải rời khỏi Trái Đất mãi mãi.',
      'Cả thế giới đang dõi theo ngài. Lữ đoàn Thép — tiến lên!',
    ],
    icon: 'SHIP',
  },
};

export const getLevel = (level) => LEVELS[level] || LEVELS[1];

// Chuyển bản đồ chuỗi thành mảng 2D tên địa hình
export const parseMap = (rows) => {
  const grid = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      const ch = rows[y]?.[x] ?? '.';
      row.push(TERRAIN_CHARS[ch] || 'PLAIN');
    }
    grid.push(row);
  }
  return grid;
};
