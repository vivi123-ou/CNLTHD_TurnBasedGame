// ============================================
// SOUND — chiptune tổng hợp bằng Web Audio API (không dùng file âm thanh ngoài)
// Dùng MỘT AudioContext duy nhất, chỉ tạo sau thao tác đầu tiên của người chơi
// ============================================
const PREF_KEY = 'steelBrigade_sound';

class SoundManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.volume = 0.25;
    this.enabled = true;
    try {
      this.enabled = localStorage.getItem(PREF_KEY) !== 'off';
    } catch {
      /* storage bị chặn trong iframe — dùng mặc định */
    }
  }

  getCtx() {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  tone(freq, dur, { type = 'square', delay = 0, slide = 0, vol = 1 } = {}) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  noise(dur, { delay = 0, vol = 0.6, lowpass = 1200 } = {}) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem(PREF_KEY, this.enabled ? 'on' : 'off');
    } catch {
      /* ignore */
    }
    if (this.enabled) this.click();
    return this.enabled;
  }

  click() { this.tone(880, 0.05, { vol: 0.4 }); }
  select() { this.tone(660, 0.06, { vol: 0.5 }); this.tone(990, 0.06, { delay: 0.05, vol: 0.4 }); }
  move() { this.tone(160, 0.18, { type: 'triangle', slide: 60, vol: 0.8 }); }
  attack() { this.noise(0.25, { vol: 0.7, lowpass: 900 }); this.tone(220, 0.15, { slide: -150, vol: 0.5 }); }
  hit() { this.noise(0.18, { delay: 0.05, vol: 0.5, lowpass: 2000 }); }
  dodge() { this.tone(1200, 0.06, { type: 'triangle', vol: 0.4 }); this.tone(1600, 0.08, { type: 'triangle', delay: 0.07, vol: 0.4 }); }
  knockout() { this.tone(440, 0.12, { vol: 0.4 }); this.tone(330, 0.12, { delay: 0.1, vol: 0.4 }); this.tone(220, 0.25, { delay: 0.2, vol: 0.4 }); }
  turnStart() { this.tone(523, 0.08, { vol: 0.4 }); this.tone(784, 0.12, { delay: 0.08, vol: 0.4 }); }
  enemyTurn() { this.tone(330, 0.1, { vol: 0.4 }); this.tone(247, 0.16, { delay: 0.1, vol: 0.4 }); }
  victory() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.18, { delay: i * 0.13, vol: 0.5 })); }
  defeat() { [392, 349, 311, 262].forEach((f, i) => this.tone(f, 0.25, { type: 'triangle', delay: i * 0.18, vol: 0.6 })); }
  typing() { this.tone(1400 + Math.random() * 200, 0.015, { vol: 0.15 }); }
}

export const soundManager = new SoundManager();
export const sfx = soundManager;
export default soundManager;
