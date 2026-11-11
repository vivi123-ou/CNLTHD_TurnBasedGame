import React, { memo } from 'react';

// ============================================
// PIXEL-ART SPRITES (16x16) — vẽ tay, mỗi ký tự là 1 pixel, '.' = trong suốt
// ============================================
const SPRITES = {
  TANK_ARTILLERY: {
    palette: { k: '#1b2010', a: '#5f7233', b: '#8ea24e', d: '#3f4c22', t: '#33332d', w: '#8d8a78' },
    rows: [
      '................',
      '................',
      '................',
      '..............k.',
      '.............kbk',
      '............kbk.',
      '.....kkkkk.kbk..',
      '....kbbbbakbk...',
      '....kbaaaakk....',
      '..kkkkkkkkkkkk..',
      '.kbbbbbbbbbbbak.',
      '.kaaaaaaaaaaadk.',
      'kttttttttttttttk',
      'ktwtwtwtwtwtwttk',
      '.kttttttttttttk.',
      '..kkkkkkkkkkkk..',
    ],
  },
  TANK_BRAWLER: {
    palette: { k: '#10182a', a: '#3d6a9e', b: '#6f9fd1', d: '#264a73', t: '#2e2f33', w: '#8a8c94', s: '#d9b84a' },
    rows: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '.....kkkkkk.....',
      '....kbbbbbbk....',
      '....kbasaaakkkkk',
      '....kaaaaaakbbbk',
      '..kkkkkkkkkkkkk.',
      '.kbbbbbbbbbbbbk.',
      'kaaaaaaaaaaaaadk',
      'ktwtwtwtwtwtwttk',
      '.kttttttttttttk.',
      '..kkkkkkkkkkkk..',
    ],
  },
  ALIEN_LARGE: {
    palette: { k: '#2a0f2e', p: '#9b3fb5', q: '#c98ad9', d: '#64217a', e: '#f4f1e0', i: '#1a1a1a', g: '#8dffb8' },
    rows: [
      '................',
      '.....kkkkkk.....',
      '....kqqqqqqk....',
      '...kqqppppppk...',
      '..kqpppppppppk..',
      '..kpeepppppeepk.',
      '.kppeippppeipppk',
      '.kppeeppppeepppk',
      '.kpppppppppppppk',
      '.kppppkggkpppppk',
      '.kpppppkkppppppk',
      '.kdpppppppppppdk',
      '..kdddddddddddk.',
      '..kdk.kdk.kdk...',
      '..kk..kk..kk....',
      '................',
    ],
  },
  ALIEN_SMALL: {
    palette: { k: '#12301c', s: '#3fae5a', h: '#93e07d', d: '#277a3c', e: '#f4f1e0', i: '#1a1a1a', y: '#ffe066' },
    rows: [
      '................',
      '................',
      '................',
      '................',
      '....y......y....',
      '.....k....k.....',
      '......k..k......',
      '.....kkkkkk.....',
      '....khhhhhhk....',
      '...khseisseihk..',
      '...ksssssssssk..',
      '...ksssskssssk..',
      '....kdsssssdk...',
      '....k.k...k.k...',
      '...kk.kk.kk.kk..',
      '................',
    ],
  },
  TREE: {
    palette: { k: '#14290f', g: '#2c6326', l: '#4f9a3c', t: '#5b3a1e' },
    rows: [
      '................',
      '.......kk.......',
      '......klgk......',
      '.....klgggk.....',
      '....klgggggk....',
      '....kllggggk....',
      '...klgggggggk...',
      '..klgggggggggk..',
      '..kkkkkkkkkkkk..',
      '.......tt.......',
      '.......tt.......',
      '......kttk......',
    ],
  },
  HILL: {
    palette: { k: '#4a3420', h: '#a77b45', l: '#cfa86b', d: '#7d5a32' },
    rows: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '......kkkk......',
      '....kkllllkk....',
      '...kllllhhhhk...',
      '..klllhhhhhhdk..',
      '.klhhhhhhhhdddk.',
      'khhhhhhhhhhddddk',
      'kkkkkkkkkkkkkkkk',
    ],
  },
  ROCK: {
    palette: { k: '#2b2b2b', r: '#8d8d86', l: '#bcbcb1', d: '#5e5e58' },
    rows: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '......kkkk......',
      '....kkllllk.....',
      '...klllrrrrk....',
      '..kllrrrrrrdk...',
      '..klrrrrrrrddk..',
      '.klrrrrrrrrrddk.',
      '.krrrrrrrrrdddk.',
      'kdrrrrrrrrddddk.',
      '.kkkkkkkkkkkkkk.',
    ],
  },
  WAVES: {
    palette: { w: '#a9dcf5' },
    rows: [
      '................',
      '................',
      '................',
      '..www...........',
      '.w...w..........',
      '................',
      '................',
      '................',
      '.........www....',
      '........w...w...',
      '................',
      '................',
      '...www..........',
      '..w...w.........',
    ],
  },
  TUFT: {
    palette: { l: '#9cc95c', d: '#5f8a2f' },
    rows: [
      '................',
      '................',
      '................',
      '..l.l...........',
      '..dld...........',
      '................',
      '................',
      '................',
      '................',
      '..........l.l...',
      '..........dld...',
      '................',
    ],
  },
  HOUSE: {
    palette: { k: '#2a1a12', r: '#b0482f', w: '#e8d8b0', b: '#3a5a7a', d: '#6a4422' },
    rows: [
      '................',
      '................',
      '................',
      '.......kk.......',
      '......krrk......',
      '.....krrrrk.....',
      '....krrrrrrk....',
      '...krrrrrrrrk...',
      '..kkkkkkkkkkkk..',
      '...kwwwwwwwwk...',
      '...kwbbwwbbwk...',
      '...kwbbwwbbwk...',
      '...kwwwddwwwk...',
      '...kwwwddwwwk...',
      '..kkkkkkkkkkkk..',
    ],
  },
  SHIP: {
    palette: { k: '#151a24', c: '#9fe3ff', w: '#ffffff', m: '#8b93a6', d: '#5a6172', y: '#ffe066', g: '#8dffb8' },
    rows: [
      '................',
      '................',
      '................',
      '................',
      '......kkkk......',
      '.....kccwck.....',
      '....kccccwck....',
      '..kkkkkkkkkkkk..',
      '.kmmmmmmmmmmmmk.',
      'kmymmymmymmymmmk',
      '.kddddddddddddk.',
      '...kkkkkkkkkk...',
      '....g..g..g.....',
      '...g..g..g..g...',
    ],
  },
  BURST: {
    palette: { y: '#fff27a', o: '#ff9a2e', w: '#ffffff' },
    rows: [
      '................',
      '................',
      '.......y........',
      '...y...o...y....',
      '....o.yoy.o.....',
      '.....oyyyo......',
      '..yooyywyyooy...',
      '.....oyyyo......',
      '....o.yoy.o.....',
      '...y...o...y....',
      '.......y........',
    ],
  },
};

// Gộp các pixel cùng màu liền nhau thành 1 rect để SVG nhẹ hơn
const buildRects = (name) => {
  const { palette, rows } = SPRITES[name];
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.' || !palette[ch]) {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === ch) w++;
      rects.push({ x, y, w, fill: palette[ch] });
      x += w;
    }
  });
  return rects;
};

const cache = {};
const getRects = (name) => (cache[name] ||= buildRects(name));

const Sprite = memo(({ name, size = '100%', flip = false, className = '', style }) => {
  if (!SPRITES[name]) return null;
  return (
    <svg
      className={`sprite ${className}`}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      aria-hidden="true"
    >
      {getRects(name).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
});

Sprite.displayName = 'Sprite';

export default Sprite;
