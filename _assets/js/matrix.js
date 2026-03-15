// JSMatrix
// Inspired by https://github.com/abishekvashok/cmatrix

(function () {
  "use strict";
  
  const CONFIG = {
    TARGET_FPS: 30,
    FONT_SIZE: 16,
    ASYNCH: true,
    CHANGES: true,
    RAND_MIN: 0x21,
    RAND_MAX: 0x7A,
  };
 
  const canvas = document.getElementById("m");
  if (!canvas) return;
 
  const ctx = canvas.getContext("2d", { alpha: true });
  canvas.style.willChange = "contents";

  function cssVar(name) {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return v;
  }
 
  const C_BODY = cssVar("--primary-text-color");
  const C_HEAD = cssVar("--link-color-main");
 
  const FADE_STEPS = 8;

  function buildColorCache() {
    const cache = new Array(FADE_STEPS + 1);
    for (let i = 0; i < FADE_STEPS; i++) {
      const a = 0.03 + 0.20 * (i / (FADE_STEPS - 1));
      cache[i] = hexToRgba(C_BODY, a);
    }
    cache[FADE_STEPS] = hexToRgba(C_HEAD, 0.28);
    return cache;
  }
 
  function hexToRgba(hex, alpha) {
    hex = hex.trim();
    if (hex.startsWith("rgb")) {
      const nums = hex.match(/[\d.]+/g);
      return `rgba(${nums[0]},${nums[1]},${nums[2]},${alpha.toFixed(3)})`;
    }
    if (hex.startsWith("#")) {
      let h = hex.slice(1);
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      const r = parseInt(h.slice(0,2),16);
      const g = parseInt(h.slice(2,4),16);
      const b = parseInt(h.slice(4,6),16);
      return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
    }
    return `rgba(200,180,150,${alpha.toFixed(3)})`;
  }
 
  const COLOR_CACHE = buildColorCache();
  const COLOR_HEAD  = COLOR_CACHE[FADE_STEPS];
 
  const FS   = CONFIG.FONT_SIZE;
  const FONT = `bold ${FS}px "SFMono-Regular", Menlo, Consolas, monospace`;
 
  let CW, CH;
 
  function measureCell() {
    ctx.font = FONT;
    CW = Math.ceil(ctx.measureText("M").width);
    CH = FS + 2;
  }
 
  const RAND_MIN  = CONFIG.RAND_MIN;
  const RAND_MAX  = CONFIG.RAND_MAX;
  const RAND_NUM  = RAND_MAX - RAND_MIN;
  const GLYPH_CNT = RAND_NUM + 1;
 
  let bodyAtlases, headAtlas;
 
  function buildAtlas(color) {
    const w = CW * GLYPH_CNT;
    const h = CH;
    let ac;
    if (typeof OffscreenCanvas !== "undefined") {
      ac = new OffscreenCanvas(w, h);
    } else {
      ac = document.createElement("canvas");
      ac.width = w; ac.height = h;
    }
    const ax = ac.getContext("2d");
    ax.clearRect(0, 0, w, h);
    ax.font = FONT;
    ax.fillStyle = color;
    ax.textBaseline = "top";
    for (let i = 0; i < GLYPH_CNT; i++) {
      const ch = String.fromCodePoint(RAND_MIN + i);
      ax.fillText(ch, i * CW, 0);
    }
    return ac;
  }
 
  let COLS, LINES;
 
  let val, is_head, dirty;
  let length_arr, spaces_arr, updates_arr;
 
  function ri(row, col) { return row * COLS + col; }
 
  function varInit() {
    const size = (LINES + 1) * COLS;
    val      = new Int16Array(size);
    is_head  = new Uint8Array(size);
    dirty    = new Uint8Array(size);
 
    val.fill(-1);
    dirty.fill(1);
 
    length_arr  = new Int32Array(COLS);
    spaces_arr  = new Int32Array(COLS);
    updates_arr = new Int32Array(COLS);
 
    for (let j = 0; j < COLS; j += 2) {
      spaces_arr[j]  = (Math.random() * LINES + 1) | 0;
      length_arr[j]  = ((Math.random() * (LINES - 3)) + 3) | 0;
      val[ri(1, j)]  = 32;
      updates_arr[j] = (Math.random() * 3 + 1) | 0;
    }
  }

  function resize() {
    const W = canvas.offsetWidth  || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
 
    measureCell();
 
    COLS  = Math.floor(W / CW) + 1;
    LINES = Math.floor(H / CH);
 
    bodyAtlases = COLOR_CACHE.slice(0, FADE_STEPS).map(c => buildAtlas(c));
    headAtlas   = buildAtlas(COLOR_HEAD);
 
    varInit();
    ctx.font = FONT;
    ctx.textBaseline = "top";
  }
 
  let count = 0;
 
  function randGlyph() {
    return (Math.random() * RAND_NUM + RAND_MIN) | 0;
  }
 
  function tick() {
    count++;
    if (count > 4) count = 1;
 
    for (let j = 0; j < COLS; j += 2) {
      if (CONFIG.ASYNCH && count <= updates_arr[j]) continue;
 
      const idx0 = ri(0, j);
      const idx1 = ri(1, j);
 
      if (val[idx0] === -1 && val[idx1] === 32 && spaces_arr[j] > 0) {
        spaces_arr[j]--;
      } else if (val[idx0] === -1 && val[idx1] === 32) {
        length_arr[j] = ((Math.random() * (LINES - 3)) + 3) | 0;
        val[idx0] = randGlyph();
        dirty[idx0] = 1;
        spaces_arr[j] = (Math.random() * LINES + 1) | 0;
      }
 
      let i = 0, y = 0, z = 0;
      let firstcoldone = 0;
 
      while (i <= LINES) {
        while (i <= LINES) {
          const v = val[ri(i, j)];
          if (v !== 32 && v !== -1) break;
          i++;
        }
        if (i > LINES) break;
 
        z = i; y = 0;
        while (i <= LINES) {
          const v = val[ri(i, j)];
          if (v === 32 || v === -1) break;
          const idx = ri(i, j);
          if (is_head[idx]) { is_head[idx] = 0; dirty[idx] = 1; }
          if (CONFIG.CHANGES && ((Math.random() * 8) | 0) === 0) {
            val[idx] = randGlyph();
            dirty[idx] = 1;
          }
          i++;
          y++;
        }
 
        if (i > LINES) {
          const idxZ = ri(z, j);
          val[idxZ] = 32;
          dirty[idxZ] = 1;
          continue;
        }
 
        const idxI = ri(i, j);
        val[idxI] = randGlyph();
        is_head[idxI] = 1;
        dirty[idxI] = 1;
 
        if (y > length_arr[j] || firstcoldone) {
          const idxZ = ri(z, j);
          val[idxZ] = 32;
          dirty[idxZ] = 1;
          val[idx0] = -1;
          dirty[idx0] = 1;
        }
        firstcoldone = 1;
        i++;
      }
    }
  }

  function render() {
    for (let j = 0; j < COLS; j += 2) {
      let headRow = -1;
      for (let row = 1; row <= LINES; row++) {
        if (is_head[ri(row, j)]) { headRow = row; break; }
      }
 
      for (let row = 1; row <= LINES; row++) {
        const idx = ri(row, j);
        if (!dirty[idx]) continue;
        dirty[idx] = 0;
 
        const v = val[idx];
        const px = j * CW;
        const py = (row - 1) * CH;
 
        ctx.clearRect(px, py, CW, CH);
 
        if (v === 32 || v === -1) continue;
 
        const gi = Math.max(0, Math.min(v - RAND_MIN, GLYPH_CNT - 1));

        if (is_head[idx]) {
          ctx.globalAlpha = 1.0;
          ctx.drawImage(headAtlas, gi * CW, 0, CW, CH, px, py, CW, CH);
        } else {
          const dist = headRow > row ? headRow - row : 0;
          const fadeIdx = Math.max(0, FADE_STEPS - 1 - Math.min(dist, FADE_STEPS - 1));
          ctx.globalAlpha = 1.0;
          ctx.drawImage(bodyAtlases[fadeIdx], gi * CW, 0, CW, CH, px, py, CW, CH);
        }

        ctx.globalAlpha = 1.0;
      }
    }
  }

  const FRAME_MS = 1000 / CONFIG.TARGET_FPS;
  let lastTime = 0;
  let rafId = null;
 
  function loop(ts) {
    rafId = requestAnimationFrame(loop);
    const dt = ts - lastTime;
    if (dt < FRAME_MS - 1) return;
    lastTime = ts - (dt % FRAME_MS);  
 
    tick();
    render();
  }
 
  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      resize();
      rafId = requestAnimationFrame(loop);
    }, 120);
  }
 
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(onResize).observe(document.documentElement);
  } else {
    window.addEventListener("resize", onResize);
  }

  resize();
  rafId = requestAnimationFrame(loop);
 
})();