/* Scene renderer: procedurally drawn graphite landscape plates.
   Every scene is a stack of named layers + metadata (horizon, vanishing points, focal point,
   light, regions) so lessons can build it up step by step, switch value modes and ask questions about it. */
(function () {
  const W = 800, H = 500;
  const VAL = ['#F7F6F2', '#E3E2DD', '#CDCBC5', '#B3B1AB', '#97958F', '#7A7873', '#5E5C58', '#43423E', '#2A2926'];
  const BLUE = '#3E8FC7';
  let uid = 0;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;
  const pts = (a) => a.map((p) => f(p[0]) + ',' + f(p[1])).join(' ');
  const dPath = (a, close = true) => 'M' + a.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + (close ? 'Z' : '');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* value mapping per render mode */
  function palette(mode) {
    if (mode === 'notan') return (v) => VAL[v <= 2 ? 0 : v <= 5 ? 4 : 8];
    if (mode === 'two') return (v) => VAL[v <= 4 ? 0 : 8];
    return (v) => VAL[Math.max(0, Math.min(8, Math.round(v)))];
  }

  /* ---------- primitives ---------- */
  const tone = (P, a, v, extra = '') => `<path class="tone" d="${dPath(a)}" fill="${P(v)}" ${extra}/>`;
  const shade = (P, a, v) => `<path class="tone shade" d="${dPath(a)}" fill="${P(v)}"/>`;
  let hr = rng(1); // seeded per scene build so plates are stable between renders
  const dOpen = (a) => 'M' + a.map((p) => f(p[0]) + ' ' + f(p[1])).join('L');
  /* Hatching made of short, slightly uneven pencil strokes clipped to the shape,
     instead of a perfectly repeating pattern. */
  const HATCH = { d: [-58, 5.2], b: [58, 5.2], h: [0, 6.2], v: [90, 4.4], x: [-45, 6.4] };
  function hatch(a, kind = 'd', op = 0.5) {
    if (!a || a.length < 3) return '';
    const id = 'cl' + (++uid);
    const passes = kind === 'x' ? [HATCH.x[0], 45] : [HATCH[kind] ? HATCH[kind][0] : -58];
    const sp = (HATCH[kind] || HATCH.d)[1];
    const buckets = ['', '', ''];
    passes.forEach((deg) => {
      const th = (deg * Math.PI) / 180, ux = Math.cos(th), uy = Math.sin(th), nx = -uy, ny = ux;
      let nmin = 1e9, nmax = -1e9, umin = 1e9, umax = -1e9;
      a.forEach(([x, y]) => { const n = x * nx + y * ny, u = x * ux + y * uy; nmin = Math.min(nmin, n); nmax = Math.max(nmax, n); umin = Math.min(umin, u); umax = Math.max(umax, u); });
      for (let t = nmin + hr() * sp; t < nmax; t += sp * (0.75 + hr() * 0.5)) {
        let pos = umin - 10 + hr() * 20;
        while (pos < umax) {
          const len = 16 + hr() * 46;
          const tj = (hr() - 0.5) * 1.6, bend = (hr() - 0.5) * 2.2;
          const x0 = nx * t + ux * pos, y0 = ny * t + uy * pos;
          const x1 = nx * (t + tj) + ux * (pos + len), y1 = ny * (t + tj) + uy * (pos + len);
          const mx = (x0 + x1) / 2 + nx * bend, my = (y0 + y1) / 2 + ny * bend;
          buckets[Math.floor(hr() * 3)] += `M${f(x0)} ${f(y0)}Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}`;
          pos += len + (hr() * 7 - 2.5);
        }
      }
    });
    return `<g class="hatch"><clipPath id="${id}"><path d="${dPath(a)}"/></clipPath><g clip-path="url(#${id})" fill="none" stroke="#2A2926" stroke-linecap="round">` +
      `<path d="${buckets[0]}" stroke-width=".75" opacity="${f(Math.min(1, op * 0.75) * 100) / 100}"/><path d="${buckets[1]}" stroke-width="1" opacity="${f(Math.min(1, op * 1.05) * 100) / 100}"/><path d="${buckets[2]}" stroke-width="1.3" opacity="${f(Math.min(1, op * 1.3) * 100) / 100}"/></g></g>`;
  }
  /* A contour restated twice with a slight offset, the way a pencil line gets re-drawn. */
  function sketch(a, c, w = 1, op = 0.6, close = false) {
    const d = close ? dPath(a) : dOpen(a);
    const dx = f(hr() * 1.8 - 0.9), dy = f(hr() * 1.4 - 0.5);
    return `<path class="ln sketch" d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>` +
      `<path class="ln sketch fx" d="${d}" transform="translate(${dx} ${dy})" fill="none" stroke="${c}" stroke-width="${f(w * 0.65)}" stroke-linecap="round" stroke-linejoin="round" opacity="${f(op * 0.45)}"/>`;
  }
  /* Light pencil tone in the upper sky, darker toward the top of the page. */
  const skyTone = (y) => hatch([[-5, -5], [W + 5, -5], [W + 5, y * 0.55], [-5, y * 0.48]], 'h', 0.13) + hatch([[-5, -5], [W + 5, -5], [W + 5, y * 0.24], [-5, y * 0.3]], 'h', 0.13);
  const stroke = (x1, y1, x2, y2, c, w = 1, cls = 'fx', extra = '') => `<line class="${cls}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

  function jag(a, amt, r, subdiv = 2) {
    const out = [];
    const idx = [];
    for (let i = 0; i < a.length - 1; i++) {
      const [x0, y0] = a[i], [x1, y1] = a[i + 1];
      idx.push(out.length);
      out.push([x0, y0]);
      const len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const n = Math.max(subdiv, Math.round(len / 15));
      const nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
      const k0 = amt * Math.min(1.5, 0.35 + len / 150);
      let drift = 0;
      for (let k = 1; k <= n; k++) {
        const t = k / (n + 1);
        drift = drift * 0.55 + (r() - 0.5) * k0; // correlated wobble reads as a natural edge, not noise
        const along = (r() - 0.5) * (len / n) * 0.35;
        out.push([x0 + (x1 - x0) * t + nx * drift + ((x1 - x0) / len) * along, y0 + (y1 - y0) * t + ny * drift + ((y1 - y0) / len) * along]);
      }
    }
    idx.push(out.length);
    out.push(a[a.length - 1]);
    out.idx = idx;
    return out;
  }

  /* mountain range with lit and shadow planes (light from left by default) */
  function range(P, r, o) {
    const { main, base, v, shade: shadeV = v + 2, snow = 0, light = 'left', hatchOp = 0.45 } = o;
    const shadeP = shade;
    const ridge = jag(main, o.jag ?? 10, r, 2);
    const body = ridge.concat([[W + 10, base], [-10, base]]);
    let s = tone(P, body, v) + (v >= 2 ? hatch(body, light === 'left' ? 'b' : 'd', Math.min(0.3, hatchOp * 0.45 + v * 0.02)) : '');
    const idx = ridge.idx;
    for (let i = 1; i < main.length - 1; i++) {
      const isPeak = main[i][1] < main[i - 1][1] && main[i][1] < main[i + 1][1];
      if (!isPeak) continue;
      const pk = main[i];
      const dir = light === 'left' ? 1 : -1;
      const j = i + dir;
      const seg = dir === 1 ? ridge.slice(idx[i], idx[j] + 1) : ridge.slice(idx[j], idx[i] + 1).reverse();
      const val = main[j];
      const footX = pk[0] + (val[0] - pk[0]) * 0.18;
      const mid1 = [pk[0] + (footX - pk[0]) * 0.35 + (r() - 0.5) * 12, pk[1] + (base - pk[1]) * 0.35];
      const mid2 = [pk[0] + (footX - pk[0]) * 0.7 + (r() - 0.5) * 12, pk[1] + (base - pk[1]) * 0.7];
      const poly = seg.concat([[val[0], base], [footX, base], mid2, mid1]);
      s += shadeP(P, poly, shadeV);
      s += hatch(poly, light === 'left' ? 'd' : 'b', hatchOp);
      if (snow && pk[1] < snow) {
        const sl = Math.min(60, (snow - pk[1]) * 0.9);
        const L = ridge[Math.max(0, idx[i] - 2)], R = ridge[Math.min(ridge.length - 1, idx[i] + 2)];
        const lx = pk[0] + (L[0] - pk[0]) * 0.55, ly = pk[1] + (L[1] - pk[1]) * 0.55;
        const rx = pk[0] + (R[0] - pk[0]) * 0.55, ry = pk[1] + (R[1] - pk[1]) * 0.55;
        const cap = [pk, [rx, ry], [pk[0] + (rx - pk[0]) * 0.5 + 4, pk[1] + sl * 0.7], [pk[0] + 2, pk[1] + sl * 0.45], [pk[0] - 6, pk[1] + sl * 0.8], [lx, ly]];
        s += shade(P, cap, light === 'left' ? 0 : 1);
      }
    }
    s += sketch(ridge, P(Math.min(8, v + 3)), 1.1, 0.55);
    return s;
  }

  function pine(P, r, x, by, h, v, opt = {}) {
    const w = (opt.w || 0.34) * h;
    const n = Math.max(4, Math.round(h / (opt.tier || 9)));
    const right = [], left = [];
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const y = by - h + h * t * 0.93;
      const hw = w * Math.pow(t, 0.85) * (0.85 + r() * 0.3);
      right.push([x + hw, y + (r() - 0.3) * 2]);
      if (k < n) right.push([x + hw * 0.42, y + h / n * 0.2]);
      left.unshift([x - hw * (0.9 + r() * 0.2), y + (r() - 0.3) * 2]);
      if (k < n) left.unshift([x - hw * 0.42, y + h / n * 0.2]);
    }
    const body = [[x, by - h]].concat(right, [[x + 2, by - h * 0.05], [x - 2, by - h * 0.05]], left);
    let s = tone(P, body, v);
    if (opt.shade !== false && h > 40) {
      const sh = [[x, by - h]].concat(right, [[x + 1, by - h * 0.05]]);
      s += tone(P, sh, Math.min(8, v + 1));
      if (h > 90) s += hatch(sh, 'v', 0.35);
    }
    s += `<rect class="tone" x="${f(x - h * 0.018 - 0.6)}" y="${f(by - h * 0.07)}" width="${f(h * 0.036 + 1.2)}" height="${f(h * 0.07)}" fill="${P(Math.min(8, v + 1))}"/>`;
    return s;
  }

  function treeline(P, r, x0, x1, by, hmin, hmax, v, step = 7) {
    let s = '';
    for (let x = x0; x < x1; x += step * (0.6 + r() * 0.8)) s += pine(P, r, x, by + r() * 2, hmin + r() * (hmax - hmin), v, { shade: false });
    return s;
  }

  function oak(P, r, x, by, h, v, opt = {}) {
    const tw = h * 0.07;
    const trunk = [[x - tw, by], [x - tw * 0.45, by - h * 0.5], [x - tw * 1.3, by - h * 0.66], [x - tw * 0.2, by - h * 0.58], [x + tw * 0.2, by - h * 0.7], [x + tw * 0.5, by - h * 0.55], [x + tw * 1.4, by - h * 0.63], [x + tw * 0.45, by - h * 0.48], [x + tw, by]];
    let s = tone(P, trunk, Math.min(8, v + 2));
    const cx = x + (opt.lean || 0), cy = by - h * 0.7;
    const blobs = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.4;
      const rr = h * (0.13 + r() * 0.09);
      blobs.push([cx + Math.cos(a) * h * 0.2, cy + Math.sin(a) * h * 0.13 - h * 0.03, rr]);
    }
    blobs.push([cx, cy - h * 0.06, h * 0.22]);
    s += blobs.map((b) => `<circle class="tone" cx="${f(b[0])}" cy="${f(b[1])}" r="${f(b[2])}" fill="${P(v)}"/>`).join('');
    // form shadow: lower-right (light from left)
    const sgn = opt.light === 'right' ? -1 : 1;
    s += blobs.filter((b) => (b[0] - cx) * sgn > -h * 0.02 && b[1] > cy - h * 0.1).map((b) => `<circle class="tone" cx="${f(b[0] + sgn * b[2] * 0.25)}" cy="${f(b[1] + b[2] * 0.25)}" r="${f(b[2] * 0.72)}" fill="${P(Math.min(8, v + 2))}"/>`).join('');
    s += blobs.filter((b) => (b[0] - cx) * sgn < 0 && b[1] < cy).map((b) => `<circle class="tone" cx="${f(b[0] - sgn * b[2] * 0.2)}" cy="${f(b[1] - b[2] * 0.2)}" r="${f(b[2] * 0.5)}" fill="${P(Math.max(0, v - 1))}"/>`).join('');
    return s;
  }

  function bareTree(P, r, x, by, h, v, w = 1.6) {
    let s = '';
    const c = P(v);
    function br(x0, y0, ang, len, wd, d) {
      const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
      s += stroke(x0, y0, x1, y1, c, wd, 'tone-l');
      if (d > 4 || len < 5) return;
      const k = 1 + (r() > 0.4 ? 1 : 0);
      for (let i = 0; i <= k; i++) br(x1, y1, ang + (r() - 0.5) * 1.1 + (i - k / 2) * 0.5, len * (0.62 + r() * 0.16), wd * 0.62, d + 1);
    }
    br(x, by, -Math.PI / 2 + (r() - 0.5) * 0.2, h * 0.34, w * h / 40, 0);
    return s;
  }

  function grass(P, r, x0, x1, y, h, v, n = 20) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), hh = h * (0.4 + r() * 0.8), lean = (r() - 0.5) * hh * 0.8;
      s += stroke(x, y + r() * 3, x + lean, y - hh, P(v), 0.9);
    }
    return s;
  }

  function cloud(P, r, x, y, w, v, flat = true) {
    const id = 'cl' + (++uid);
    const n = 5 + Math.floor(r() * 3);
    let c = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const rr = w * (0.13 + Math.sin(t * Math.PI) * 0.14 + r() * 0.05);
      c += `<circle cx="${f(x - w / 2 + t * w)}" cy="${f(y - rr * 0.55)}" r="${f(rr)}"/>`;
    }
    const top = y - w * 0.4;
    return `<g class="tone-g"><clipPath id="${id}"><rect x="${f(x - w)}" y="${f(top - w)}" width="${f(w * 2)}" height="${f(y - top + w)}"/></clipPath>` +
      `<g clip-path="url(#${id})" fill="${P(v)}" class="tone">${c}</g>` +
      `<g clip-path="url(#${id})" fill="${P(Math.min(8, v + 1))}" class="tone" transform="translate(0 ${f(w * 0.06)})" opacity=".85">${c.replace(/r="([\d.]+)"/g, (m, a) => `r="${f(a * 0.8)}"`)}</g>` +
      hatch([[x - w * 0.55, y - w * 0.12], [x + w * 0.55, y - w * 0.12], [x + w * 0.5, y], [x - w * 0.5, y]], 'h', 0.28) + `</g>`;
  }

  function rock(P, r, x, by, w, h, v, light = 'left') {
    const j = () => (r() - 0.5) * w * 0.08;
    const topL = [x - w * 0.46 + j(), by - h * 0.62], topR = [x + w * 0.36 + j(), by - h * 0.7];
    const peak = [x - w * 0.05 + j(), by - h];
    const back = [x + w * 0.2 + j(), by - h * 0.92];
    const top = [topL, peak, back, topR, [x + w * 0.05, by - h * 0.55]];
    const front = [topL, [x + w * 0.05, by - h * 0.55], [x + w * 0.1 + j(), by], [x - w * 0.5, by]];
    const side = [[x + w * 0.05, by - h * 0.55], topR, [x + w * 0.5, by - h * 0.25 + j()], [x + w * 0.46, by], [x + w * 0.1, by]];
    const L = light === 'left';
    let s = tone(P, top, Math.max(0, v - 2)) + tone(P, front, L ? v : v + 2) + tone(P, side, L ? v + 2 : v);
    s += hatch(L ? side : front, 'd', 0.5) + sketch([topL, peak, back, topR, [x + w * 0.5, by - h * 0.25], [x + w * 0.46, by]], P(Math.min(8, v + 3)), 1, 0.5) + sketch([topL, [x - w * 0.5, by]], P(Math.min(8, v + 3)), 1, 0.45);
    s += `<path class="tone" d="${dPath([[x - w * 0.6, by], [x + w * 0.62, by], [x + w * 0.5 + (L ? w * 0.4 : -w * 0.9), by + h * 0.12], [x - w * 0.3, by + h * 0.1]])}" fill="${P(Math.min(8, v + 1))}" opacity=".55"/>`;
    return { svg: s, top, front, side };
  }

  function water(P, r, y0, y1, v, n = 60, x0 = 0, x1 = W) {
    let s = `<rect class="tone" x="${x0}" y="${f(y0)}" width="${x1 - x0}" height="${f(y1 - y0)}" fill="${P(v)}"/>` + hatch([[x0, y0 + (y1 - y0) * 0.35], [x1, y0 + (y1 - y0) * 0.3], [x1, y1 + 5], [x0, y1 + 5]], 'h', 0.16);
    for (let i = 0; i < n; i++) {
      const y = y0 + 4 + Math.pow(r(), 0.8) * (y1 - y0 - 4);
      const len = 8 + ((y - y0) / (y1 - y0)) * 60 * r();
      const x = x0 + r() * (x1 - x0);
      s += stroke(x, y, x + len, y, P(Math.min(8, v + 2)), 0.6 + ((y - y0) / (y1 - y0)) * 0.9);
    }
    return s;
  }
  function reflect(inner, y, y0, y1, op = 0.38) {
    const id = 'rf' + (++uid);
    return `<g class="reflect"><clipPath id="${id}"><rect x="0" y="${f(y0)}" width="${W}" height="${f(y1 - y0)}"/></clipPath><g clip-path="url(#${id})" opacity="${op}"><g transform="matrix(1 0 0 -1 0 ${f(2 * y)})">${inner}</g></g></g>`;
  }
  function ripplesOver(P, r, y0, y1, n = 30) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const y = y0 + 3 + r() * (y1 - y0 - 3), x = r() * W;
      s += stroke(x, y, x + 20 + r() * 70, y, P(1), 1.1);
    }
    return s;
  }

  /* ---------- scenes ---------- */
  const S = {};

  /* Simple hills: beginner scene; parameterised for composition exercises. */
  S.hills = function (P, o) {
    const r = rng(o.seed || 11);
    const hy = o.h ?? 290, tx = o.tx ?? 560, ts = o.ts ?? 1;
    const sky = `<rect class="tone" width="${W}" height="${H}" fill="${P(o.muddy ? 3 : 0)}"/>` + skyTone(hy) + (o.clouds === false ? '' : cloud(P, r, 180, hy - 150 * (hy / 290), 150, o.muddy ? 4 : 1) + cloud(P, r, 640, hy - 190 * (hy / 290), 110, o.muddy ? 4 : 1));
    const far = [[-10, hy], [120, hy - 38], [260, hy - 14], [390, hy - 46], [520, hy - 10], [660, hy - 34], [810, hy - 8]];
    const farJ = jag(far, 6, r);
    const farS = tone(P, farJ.concat([[810, hy + 20], [-10, hy + 20]]), o.muddy ? 4 : 2) + sketch(farJ, P(4), 0.9, 0.45);
    const mid = [[-10, hy + 16], [140, hy - 6], [300, hy + 22], [470, hy + 4], [640, hy + 26], [810, hy + 2]];
    const midPoly = jag(mid, 4, r).concat([[810, hy + 70], [-10, hy + 70]]);
    const midS = tone(P, midPoly, o.muddy ? 4 : 4) + hatch(midPoly, 'h', 0.18) + sketch(midPoly.slice(0, -2), P(6), 1, 0.5);
    const near = [[-10, hy + 64], [180, hy + 44], [380, hy + 70], [590, hy + 50], [810, hy + 66]];
    const nearPoly = jag(near, 4, r).concat([[810, H + 5], [-10, H + 5]]);
    let nearS = tone(P, nearPoly, o.muddy ? 5 : 6) + hatch(nearPoly, 'd', 0.5) + sketch(nearPoly.slice(0, -2), P(7), 1.1, 0.5) + grass(P, r, 0, 800, H - 30, 14, o.muddy ? 6 : 7, 50);
    let tree = '';
    if (o.tree !== false) tree = oak(P, r, tx, hy + 60 + (ts - 1) * 30, 150 * ts, o.muddy ? 5 : 5);
    let path = '';
    if (o.path) {
      const pp = [[tx + 10, hy + 58], [tx - 30, hy + 90], [tx - 20, hy + 130], [tx - 120, hy + 170], [tx - 180, H + 5], [tx + 60, H + 5], [tx + 30, hy + 170], [tx + 50, hy + 128], [tx + 30, hy + 92], [tx + 24, hy + 58]];
      path = tone(P, pp, o.muddy ? 3 : 1) + stroke(tx - 180, H, tx - 30, hy + 90, P(5), 1, 'ln') ;
    }
    let frame = '';
    if (o.frame) frame = `<path class="tone" d="M-10 -10 L90 -10 C60 60 70 120 40 170 C80 150 110 150 150 120 C120 180 60 200 30 240 L28 ${H + 5} L-10 ${H + 5} Z" fill="${P(8)}"/>` + `<path class="tone" d="M-10 -10 L${W + 10} -10 L${W + 10} 40 C700 60 620 30 520 50 C600 20 660 0 700 -10 Z" fill="${P(8)}" opacity=".95"/>`;
    let tang = '';
    if (o.tangent) tang = oak(P, r, 400, hy + 58, hy + 58, 5); // tree top kisses the frame edge
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'far', label: 'Distant hills', svg: farS },
      { id: 'mid', label: 'Middle hills', svg: midS },
      { id: 'near', label: 'Foreground field', svg: nearS + path },
      { id: 'tree', label: 'Tree', svg: tree + tang },
      { id: 'frame', label: 'Frame', svg: frame },
    ];
    const meta = {
      horizon: hy,
      focal: o.tree === false ? null : [tx, hy - 20 + (ts - 1) * 30],
      light: 'left',
      planes: [{ label: 'Background', y0: hy - 50, y1: hy + 18 }, { label: 'Middle ground', y0: hy + 18, y1: hy + 62 }, { label: 'Foreground', y0: hy + 62, y1: H }],
      regions: {
        far: { label: 'Distant hills', poly: far.concat([[810, hy + 12], [-10, hy + 12]]) },
        mid: { label: 'Middle hills', poly: mid.concat([[810, hy + 52], [-10, hy + 52]]) },
        near: { label: 'Foreground field', poly: near.concat([[810, H], [-10, H]]) },
        sky: { label: 'Sky', poly: [[0, 0], [W, 0], [W, hy - 50], [0, hy - 50]] },
      },
      shapes: [
        { label: 'Sky', poly: [[0, 0], [W, 0], [W, hy - 10], [0, hy - 10]] },
        { label: 'Hills', poly: [[0, hy - 10], [W, hy - 10], [W, hy + 60], [0, hy + 60]] },
        { label: 'Field', poly: [[0, hy + 60], [W, hy + 60], [W, H], [0, H]] },
      ],
    };
    return { layers, meta };
  };

  /* Mountain lake — built in the order the source demos use: horizon, ridges, tree line, planes, framing pines, water. */
  S.mountainLake = function (P, o) {
    const r = rng(o.seed || 7);
    const hy = 318;
    const sky = `<rect class="tone" width="${W}" height="${hy}" fill="${P(0)}"/>` + skyTone(hy) + cloud(P, r, 610, 70, 150, 1) + cloud(P, r, 150, 96, 90, 1);
    const far = range(P, r, { main: [[-10, 210], [70, 176], [150, 214], [250, 150], [330, 206], [470, 170], [560, 210], [660, 162], [740, 196], [810, 180]], base: hy, v: o.flat ? 5 : 2, shade: o.flat ? 6 : 3, hatchOp: 0.25, jag: 8 });
    const near = range(P, r, { main: [[-10, 262], [90, 226], [190, 262], [330, 96], [430, 214], [520, 180], [610, 250], [700, 230], [810, 270]], base: hy, v: o.flat ? 5 : 4, shade: o.flat ? 6 : 6, snow: 170, hatchOp: 0.5, jag: 12 });
    const tl = treeline(P, r, -5, 805, hy + 2, 8, 20, o.flat ? 6 : 6, 6);
    const lake = water(P, r, hy + 2, H, 1, 50);
    const upper = far + near + tl;
    const refl = reflect(upper, hy + 2, hy + 2, H, 0.32) + ripplesOver(P, r, hy + 6, H, 26);
    let fg = '';
    fg += pine(P, r, 700, 470, 330, 7) + pine(P, r, 760, 480, 390, 8) + pine(P, r, 640, 468, 210, 7) + pine(P, r, 592, 462, 120, 7);
    const shore = [[520, 470], [600, 452], [700, 446], [810, 440], [810, H + 5], [470, H + 5]];
    const shoreJ = jag(shore, 6, r);
    fg += tone(P, shoreJ, 6) + hatch(shoreJ, 'd', 0.45) + sketch(shoreJ.slice(0, 5), P(8), 1.1, 0.5) + grass(P, r, 520, 800, 466, 16, 8, 40);
    fg += rock(P, r, 90, 492, 120, 46, 5).svg + rock(P, r, 190, 498, 70, 26, 5).svg;
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'far', label: 'Distant range', svg: far },
      { id: 'near', label: 'Main mountain', svg: near },
      { id: 'treeline', label: 'Tree line', svg: tl },
      { id: 'lake', label: 'Lake', svg: lake + refl },
      { id: 'fg', label: 'Foreground pines and shore', svg: fg },
    ];
    const meta = {
      horizon: hy, focal: [330, 110], light: 'left', sun: [70, 60],
      probes: [{ x: 250, y: 30, v: 0, label: 'Sky' }, { x: 505, y: 200, v: 2, label: 'Distant range' }, { x: 360, y: 190, v: 6, label: 'Mountain shadow' }, { x: 745, y: 300, v: 8, label: 'Near pine' }, { x: 300, y: 420, v: 1, label: 'Lake' }],
      regions: {
        far: { label: 'Distant range', poly: [[460, 176], [560, 210], [650, 166], [740, 196], [810, 180], [810, 260], [440, 230]] },
        near: { label: 'Main mountain', poly: [[200, 262], [330, 96], [430, 214], [520, 180], [610, 250], [610, 310], [200, 310]] },
        lake: { label: 'Lake', poly: [[0, 330], [560, 330], [500, 470], [240, 480], [0, 450]] },
        fg: { label: 'Foreground pines', poly: [[600, 130], [770, 90], [800, 90], [800, 500], [560, 500], [570, 400]] },
        sky: { label: 'Sky', poly: [[0, 0], [W, 0], [W, 80], [0, 80]] },
      },
      planes: [{ label: 'Background', y0: 90, y1: 318 }, { label: 'Middle ground', y0: 318, y1: 440 }, { label: 'Foreground', y0: 440, y1: 500 }],
      shapes: [
        { label: 'Sky', poly: [[0, 0], [W, 0], [W, 160], [0, 190]] },
        { label: 'Mountains', poly: [[0, 230], [330, 96], [660, 162], [W, 180], [W, 318], [0, 318]] },
        { label: 'Lake', poly: [[0, 318], [560, 318], [470, 500], [0, 500]] },
        { label: 'Pines', poly: [[560, 500], [590, 340], [760, 90], [W, 90], [W, 500]] },
      ],
    };
    return { layers, meta };
  };

  /* Forest path: trunks by distance, a path that narrows toward eye level. */
  S.forestPath = function (P, o) {
    const r = rng(o.seed || 5);
    const hy = 280, vp = [430, 282];
    const bg = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/>`;
    let far = '', mid = '', near = '';
    for (let i = 0; i < 26; i++) { const x = r() * W, w = 3 + r() * 3; far += `<rect class="tone" x="${f(x)}" y="0" width="${f(w)}" height="${f(hy + 6)}" fill="${P(o.flat ? 6 : 2)}"/>`; }
    const midXs = [120, 210, 300, 560, 640, 720];
    midXs.forEach((x) => { const w = 9 + r() * 5; mid += `<path class="tone" d="${dPath([[x - w / 2, 0], [x + w / 2, 0], [x + w * 0.7, hy + 30], [x - w * 0.7, hy + 30]])}" fill="${P(o.flat ? 6 : 4)}"/>` + grass(P, r, x - 16, x + 16, hy + 30, 8, 5, 8); });
    const nearT = [[40, 58], [175, 34], [690, 70], [775, 40]];
    nearT.forEach(([x, w]) => { const poly = [[x - w / 2, -5], [x + w / 2, -5], [x + w * 0.62, 470], [x + w * 1.1, 492], [x - w * 1.1, 492], [x - w * 0.62, 470]]; near += tone(P, poly, 7) + hatch(poly, 'v', 0.6) + grass(P, r, x - w * 1.3, x + w * 1.3, 494, 24, 8, 30); });
    const ground = `<rect class="tone" x="0" y="${hy}" width="${W}" height="${H - hy}" fill="${P(o.flat ? 4 : 3)}"/>` + grass(P, r, 0, 800, 330, 10, 4, 60) + grass(P, r, 0, 800, 420, 16, 5, 60);
    const pathPoly = [[vp[0] - 6, vp[1]], [vp[0] + 6, vp[1]], [470, 320], [440, 360], [520, 420], [610, H + 5], [250, H + 5], [360, 420], [330, 360], [400, 318]];
    const path = tone(P, pathPoly, 0) + stroke(250, H, 400, 318, P(5), 1, 'ln') + stroke(610, H, 470, 320, P(5), 1, 'ln');
    const layers = [
      { id: 'sky', label: 'Light behind the trees', svg: bg },
      { id: 'far', label: 'Distant trunks', svg: far },
      { id: 'ground', label: 'Forest floor', svg: ground },
      { id: 'path', label: 'Path', svg: path },
      { id: 'mid', label: 'Middle trunks', svg: mid },
      { id: 'near', label: 'Foreground trunks', svg: near },
    ];
    const meta = {
      horizon: hy, vps: [vp], focal: vp, light: 'back',
      regions: {
        near: { label: 'Foreground trunks', poly: [[0, 0], [90, 0], [110, 500], [0, 500]] },
        mid: { label: 'Middle trunks', poly: [[520, 0], [760, 0], [760, 300], [520, 300]] },
        far: { label: 'Distant trees', poly: [[330, 60], [500, 60], [500, 270], [330, 270]] },
        path: { label: 'Path', poly: pathPoly },
      },
      planes: [{ label: 'Background', y0: 0, y1: 290 }, { label: 'Middle ground', y0: 290, y1: 400 }, { label: 'Foreground', y0: 400, y1: 500 }],
    };
    return { layers, meta };
  };

  /* Lakeside cabin in two-point perspective. */
  S.cabin = function (P, o) {
    const r = rng(o.seed || 3);
    const hy = 300, vl = [60, hy], vr = [1500, hy];
    const at = (from, to, x) => [x, from[1] + (to[1] - from[1]) * ((x - from[0]) / (to[0] - from[0]))];
    const cx = 540, top = 204, bot = 272;
    const L = 470, R = 640;
    const tl = at([cx, top], vl, L), bl = at([cx, bot], vl, L);
    const tr = at([cx, top], vr, R), br = at([cx, bot], vr, R);
    const midR = (cx + R) / 2, pkR = [midR, top - 58];
    const ridgeL = at(pkR, vl, L + (midR - cx) * 0.55);
    const sky = `<rect class="tone" width="${W}" height="${hy}" fill="${P(0)}"/>` + skyTone(hy);
    const mts = range(P, r, { main: [[-10, 250], [80, 200], [190, 244], [300, 150], [400, 230], [470, 196], [560, 250], [810, 260]], base: hy, v: 1, shade: 2, hatchOp: 0.25, snow: 170 });
    const bgTrees = treeline(P, r, 0, 330, hy + 2, 14, 46, 3, 10) + pine(P, r, 120, hy + 4, 96, 3, { shade: false }) + pine(P, r, 200, hy + 4, 76, 3, { shade: false });
    const island = [[380, 292], [440, 262], [520, 268], [600, 262], [700, 280], [740, 312], [360, 318]];
    const rk = tone(P, jag(island, 10, r), 5) + hatch(island, 'd', 0.5) + rock(P, r, 440, 318, 90, 40, 4).svg + rock(P, r, 690, 318, 100, 36, 4).svg;
    const front = [tl, [cx, top], [cx, bot], bl];
    const side = [[cx, top], tr, br, [cx, bot]];
    const gable = [[cx, top], pkR, tr];
    const roof = [ridgeL, pkR, [cx, top], [tl[0] - 8, tl[1] + 3]];
    let cabin = tone(P, front, 3) + tone(P, side, 6) + hatch(side, 'd', 0.5) + tone(P, gable, 5) + tone(P, roof, 2);
    for (let k = 1; k < 5; k++) { const a = at([cx, top + k * 14], vl, L); cabin += stroke(cx, top + k * 14, a[0], a[1], P(5), 0.8); }
    const win = [at([cx, 226], vl, 520), [cx - 12, 0]];
    const w1 = at([cx, 222], vl, 512), w2 = at([cx, 222], vl, 490), w3 = at([cx, 246], vl, 490), w4 = at([cx, 246], vl, 512);
    cabin += tone(P, [w1, w2, w3, w4], 7);
    const d1 = [576, 232 + (596 - 540) * 0], door = [[574, at([cx, 226], vr, 574)[1]], [596, at([cx, 226], vr, 596)[1]], [596, at([cx, bot], vr, 596)[1]], [574, at([cx, bot], vr, 574)[1]]];
    cabin += tone(P, door, 8);
    cabin += `<rect class="tone" x="${f(ridgeL[0] + 18)}" y="${f(ridgeL[1] - 34)}" width="12" height="30" fill="${P(6)}"/>`;
    const trees = pine(P, r, 700, 300, 250, 7) + pine(P, r, 752, 304, 190, 8) + pine(P, r, 650, 290, 130, 6);
    const wtr = water(P, r, hy + 18, H, 1, 40);
    const refl = reflect(mts + bgTrees + rk + cabin + trees, 318, 318, H, 0.3) + ripplesOver(P, r, 322, H, 30);
    const fg = grass(P, r, 0, 260, 496, 26, 7, 40) + tone(P, [[-10, 470], [120, 456], [240, 480], [280, H + 5], [-10, H + 5]], 6);
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'mts', label: 'Distant mountains', svg: mts },
      { id: 'bgtrees', label: 'Distant pines', svg: bgTrees },
      { id: 'water', label: 'Water and reflections', svg: wtr + refl },
      { id: 'rocks', label: 'Rocky island', svg: rk },
      { id: 'cabin', label: 'Cabin', svg: cabin },
      { id: 'trees', label: 'Pines behind the cabin', svg: trees },
      { id: 'fg', label: 'Foreground bank', svg: fg },
    ];
    const meta = {
      horizon: hy, vps: [vl], vpsAll: [vl, vr], focal: [560, 236], light: 'left',
      persp: { vl, vr, lines: [[cx, top], [cx, bot], tr, br, tl, bl] },
      regions: {
        cabin: { label: 'Cabin', poly: [tl, pkR, tr, br, bl] },
        mts: { label: 'Distant mountains', poly: [[0, 250], [300, 150], [470, 196], [560, 250], [560, 300], [0, 300]] },
        water: { label: 'Water', poly: [[0, 330], [800, 330], [800, 460], [0, 460]] },
        trees: { label: 'Pines', poly: [[620, 60], [790, 60], [790, 300], [620, 300]] },
      },
    };
    return { layers, meta };
  };

  /* Stone bridge: darkest dark sits under the arch, next to the lightest water. */
  S.bridge = function (P, o) {
    const r = rng(o.seed || 21);
    const hy = 250;
    const sky = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/>`;
    let bg = treeline(P, r, 0, 800, 262, 20, 60, o.flat ? 6 : 2, 12);
    bg += bareTree(P, r, 90, 300, 190, o.flat ? 7 : 5, 1.6) + bareTree(P, r, 720, 290, 170, o.flat ? 7 : 5, 1.4) + bareTree(P, r, 640, 280, 120, o.flat ? 6 : 3, 1.1);
    const banks = [[-10, 270], [210, 262], [260, 300], [180, 360], [-10, 380]];
    const banksR = [[810, 270], [590, 262], [540, 300], [620, 360], [810, 380]];
    let bank = tone(P, jag(banks, 8, r), 4) + tone(P, jag(banksR, 8, r), 4) + grass(P, r, 0, 200, 300, 12, 6, 30) + grass(P, r, 600, 800, 300, 12, 6, 30);
    const cxA = 400, deck = 190, spring = 318, span = 300, rise = 118;
    const outer = []; const inner = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, a = Math.PI * (1 - t);
      outer.push([cxA + Math.cos(a) * (span / 2 + 34), spring - Math.sin(a) * (rise + 30)]);
      inner.push([cxA + Math.cos(a) * span / 2, spring - Math.sin(a) * rise]);
    }
    // abutments splay into the banks instead of ending in hard vertical edges
    const bridgeBody = [...jag([[128, deck + 6], [260, deck - 1], [400, deck - 3], [540, deck], [672, deck + 5]], 3, r), [690, 300], [720, 334], ...inner.slice().reverse(), [80, 336], [112, 298]];
    const under = [...inner, [cxA + span / 2, spring + 10], [cxA - span / 2, spring + 10]];
    let br = tone(P, bridgeBody, 3) + hatch(bridgeBody, 'd', 0.3) + tone(P, under, o.flat ? 5 : 8) + hatch(under, 'x', 0.45);
    // stone courses: short, uneven block lines rather than a ruled grid
    let courses = '';
    for (let yy = deck + 16; yy < 318; yy += 14 + r() * 5) {
      for (let xx = 130 + r() * 20; xx < 690; xx += 28 + r() * 22) {
        const cx = xx - cxA, cy = yy - spring, inside = (cx * cx) / ((span / 2 + 30) ** 2) + (cy * cy) / ((rise + 26) ** 2) < 1 && yy > spring - rise - 26;
        if (inside) continue;
        const len = 14 + r() * 16;
        courses += `M${f(xx)} ${f(yy + (r() - 0.5) * 2)}L${f(xx + len)} ${f(yy + (r() - 0.5) * 2)}M${f(xx + len + 2)} ${f(yy - 2)}L${f(xx + len + 3)} ${f(yy - 11)}`;
      }
    }
    br += `<path class="fx" d="${courses}" fill="none" stroke="${P(6)}" stroke-width=".9" stroke-linecap="round" opacity=".55"/>` + sketch(bridgeBody.slice(0, 7), P(7), 1.2, 0.6);
    for (let i = 0; i < 24; i += 2) { const a = outer[i], b = inner[i]; br += stroke(a[0], a[1], b[0], b[1], P(6), 1.1, 'ln'); }
    br += `<polyline class="ln" points="${pts(outer)}" fill="none" stroke="${P(6)}" stroke-width="1.3"/>`;
    for (let x = 150; x < 650; x += 22) br += stroke(x, deck + 3, x + 14, deck + 3, P(6), 1, 'fx');
    br += tone(P, jag([[126, deck + 4], [400, deck - 5], [674, deck + 3], [674, deck - 8], [400, deck - 16], [126, deck - 7]], 2, r), 5) + sketch(jag([[126, deck - 7], [400, deck - 16], [674, deck - 8]], 2, r), P(8), 1.1, 0.6);
    const wtr = water(P, r, 318, H, 1, 40);
    const refl = reflect(br, 322, 322, H, 0.3) + ripplesOver(P, r, 326, H, 34);
    let rocks = '';
    [[60, 440, 120, 50], [180, 410, 90, 40], [640, 430, 130, 56], [740, 470, 110, 50], [300, 490, 80, 30]].forEach(([x, y, w, h]) => { rocks += rock(P, r, x, y, w, h, 4).svg; });
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'bg', label: 'Background trees', svg: bg },
      { id: 'banks', label: 'River banks', svg: bank },
      { id: 'water', label: 'River', svg: wtr + refl },
      { id: 'bridge', label: 'Stone arch', svg: br },
      { id: 'rocks', label: 'Foreground rocks', svg: rocks },
    ];
    const meta = {
      horizon: hy, focal: [400, 280], light: 'left',
      probes: [{ x: 400, y: 290, v: 8, label: 'Under the arch' }, { x: 420, y: 420, v: 1, label: 'River' }, { x: 520, y: 206, v: 3, label: 'Bridge stones' }, { x: 60, y: 60, v: 0, label: 'Sky' }],
      regions: {
        under: { label: 'Under the arch', poly: under },
        bridge: { label: 'Bridge face', poly: [[140, deck], [660, deck], [660, 230], [140, 230]] },
        water: { label: 'River', poly: [[200, 380], [600, 380], [600, 470], [200, 470]] },
        sky: { label: 'Sky', poly: [[0, 0], [800, 0], [800, 120], [0, 120]] },
      },
    };
    return { layers, meta };
  };

  /* Waterfall between stacked rock walls. */
  S.waterfall = function (P, o) {
    const r = rng(o.seed || 9);
    const sky = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/>`;
    const trees = treeline(P, r, 440, 800, 120, 30, 90, 2, 14) + treeline(P, r, 0, 160, 70, 20, 60, 2, 14);
    let back = tone(P, [[180, 120], [640, 110], [650, 330], [180, 340]], 4) + hatch([[180, 120], [640, 110], [650, 330], [180, 340]], 'v', 0.35);
    let falls = tone(P, [[330, 118], [470, 116], [480, 350], [320, 352]], 0);
    for (let i = 0; i < 26; i++) { const x = 332 + r() * 140; falls += stroke(x, 122 + r() * 40, x + (r() - 0.5) * 4, 250 + r() * 100, P(3), 0.8); }
    falls += tone(P, [[320, 110], [480, 108], [476, 128], [324, 130]], 5);
    let left = '', right = '';
    let y = 470;
    for (let i = 0; i < 8; i++) { const h = 38 + r() * 18, w = 170 - i * 8 + r() * 30; left += rock(P, r, 90 + (r() - 0.5) * 30 + i * 6, y, w, h, 3 + (i % 2)).svg; y -= h * 0.82; }
    y = 460;
    for (let i = 0; i < 7; i++) { const h = 40 + r() * 20, w = 180 - i * 6 + r() * 30; right += rock(P, r, 700 - i * 8 + (r() - 0.5) * 30, y, w, h, 3 + ((i + 1) % 2)).svg; y -= h * 0.8; }
    const pool = water(P, r, 352, H, 2, 50) + tone(P, [[300, 346], [500, 344], [520, 372], [280, 374]], 0, 'opacity=".9"');
    const fgRocks = rock(P, r, 360, 480, 160, 50, 5).svg + rock(P, r, 540, 494, 120, 40, 6).svg;
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'trees', label: 'Distant pines', svg: trees },
      { id: 'back', label: 'Back wall', svg: back },
      { id: 'falls', label: 'Falling water', svg: falls },
      { id: 'pool', label: 'Pool', svg: pool },
      { id: 'walls', label: 'Rock walls', svg: left + right },
      { id: 'fg', label: 'Foreground rocks', svg: fgRocks },
    ];
    const meta = { horizon: 330, focal: [400, 230], light: 'left', regions: { falls: { label: 'Waterfall', poly: [[330, 118], [470, 116], [480, 350], [320, 352]] }, back: { label: 'Back wall', poly: [[480, 120], [640, 110], [650, 330], [480, 330]] } } };
    return { layers, meta };
  };

  /* One-point road to the horizon: diminishing poles and clouds. */
  S.road = function (P, o) {
    const r = rng(o.seed || 17);
    const hy = o.h ?? 262, vp = [o.vx ?? 500, hy];
    const sky = `<rect class="tone" width="${W}" height="${hy}" fill="${P(0)}"/>` + skyTone(hy);
    let clouds = '';
    const rows = [[60, 190, 1], [140, 120, 1], [196, 70, 2], [226, 40, 2], [242, 24, 2]];
    rows.forEach(([y, w, v], i) => { for (let k = 0; k < 3; k++) { const x = 80 + k * 280 + r() * 80 + i * 20; clouds += cloud(P, r, x, y * (hy / 262), w * (0.8 + r() * 0.4), o.flatClouds ? 1 : v); } });
    const hills = tone(P, jag([[-10, hy], [160, hy - 18], [330, hy - 6], [460, hy - 22], [620, hy - 8], [810, hy - 16]], 5, r).concat([[810, hy + 1], [-10, hy + 1]]), 2);
    const field = `<rect class="tone" x="0" y="${hy}" width="${W}" height="${H - hy}" fill="${P(3)}"/>` + grass(P, r, 0, 800, H - 10, 18, 5, 60) + grass(P, r, 0, 800, hy + 60, 6, 4, 60);
    const road = [[vp[0] - 1, hy], [vp[0] + 1, hy], [vp[0] + 330, H + 5], [vp[0] - 390, H + 5]];
    let rd = tone(P, road, 5);
    for (let z = 1; z < 14; z++) { const t0 = 1 / z, t1 = 1 / (z + 0.5); const y0 = hy + (H - hy) * t0 * 0.95, y1 = hy + (H - hy) * t1 * 0.95; rd += `<path class="tone" d="${dPath([[vp[0] - 30 * t0, y0], [vp[0] - 30 * t1 + 0, y1], [vp[0] - 26 * t1, y1], [vp[0] - 24 * t0, y0]].map(([x, y]) => [x, y]))}" fill="${P(1)}"/>`; }
    let poles = '';
    const poleBase = [];
    for (let z = 1; z < 11; z++) {
      const t = 1 / (0.7 + z * 0.55);
      const x = vp[0] + 360 * t, yb = hy + (H - hy) * t * 0.9, h = 300 * t;
      poleBase.push([x, yb, h]);
      poles += stroke(x, yb, x, yb - h, P(7), Math.max(0.8, 5 * t), 'tone-l') + stroke(x - 30 * t, yb - h * 0.92, x + 30 * t, yb - h * 0.92, P(7), Math.max(0.6, 3 * t), 'tone-l');
    }
    for (let i = 0; i < poleBase.length - 1; i++) { const a = poleBase[i], b = poleBase[i + 1]; poles += `<path class="fx" d="M${f(a[0] - 28 * (a[2] / 300))} ${f(a[1] - a[2] * 0.92)} Q ${f((a[0] + b[0]) / 2)} ${f((a[1] - a[2] * 0.92 + b[1] - b[2] * 0.92) / 2 + 10 * (a[2] / 300))} ${f(b[0] - 28 * (b[2] / 300))} ${f(b[1] - b[2] * 0.92)}" fill="none" stroke="${P(6)}" stroke-width=".7"/>`; }
    const layers = [
      { id: 'sky', label: 'Sky', svg: sky },
      { id: 'clouds', label: 'Clouds', svg: clouds },
      { id: 'hills', label: 'Distant hills', svg: hills },
      { id: 'field', label: 'Fields', svg: field },
      { id: 'road', label: 'Road', svg: rd },
      { id: 'poles', label: 'Telephone poles', svg: poles },
    ];
    const meta = { horizon: hy, vps: [vp], focal: vp, light: 'left', persp: { vl: vp, lines: [[vp[0] + 330, H], [vp[0] - 390, H], ...poleBase.map((p) => [p[0], p[1] - p[2]])] }, poleBase };
    return { layers, meta };
  };

  /* Backlit coast: dramatic lighting, low-key, silhouettes. */
  S.coast = function (P, o) {
    const r = rng(o.seed || 31);
    const hy = 300, sun = [o.sx ?? 520, o.sy ?? 262];
    let sky = `<rect class="tone" width="${W}" height="${hy}" fill="${P(4)}"/>`;
    [[5, 3], [4, 2], [3, 1], [2, 0]].forEach(([k, v]) => { sky += `<ellipse class="tone" cx="${sun[0]}" cy="${sun[1]}" rx="${k * 52}" ry="${k * 20}" fill="${P(v)}"/>`; });
    sky += `<circle class="tone" cx="${sun[0]}" cy="${sun[1]}" r="18" fill="${P(0)}"/>`;
    sky += cloud(P, r, 200, 110, 200, 6) + cloud(P, r, 700, 80, 140, 6);
    const head = [[-10, 120], [60, 110], [150, 150], [230, 190], [300, 250], [360, 290], [380, 302], [-10, 302]];
    const headland = tone(P, jag(head, 8, r), 7) + treeline(P, r, 0, 200, 150, 10, 30, 7, 9);
    const far = tone(P, jag([[560, 300], [640, 286], [720, 290], [810, 280], [810, 302], [560, 302]], 4, r), 5);
    let sea = `<rect class="tone" x="0" y="${hy}" width="${W}" height="${H - hy}" fill="${P(5)}"/>`;
    for (let i = 0; i < 90; i++) { const y = hy + 3 + Math.pow(r(), 1.3) * (H - hy); const spread = 20 + (y - hy) * 0.9; const x = sun[0] + (r() - 0.5) * spread; sea += stroke(x - 6 - (y - hy) * 0.08, y, x + 6 + (y - hy) * 0.08, y, P(0), 1.2); }
    for (let i = 0; i < 40; i++) { const y = hy + 3 + r() * (H - hy), x = r() * W; sea += stroke(x, y, x + 30, y, P(6), 0.8); }
    const rocks = tone(P, [[-10, 420], [80, 380], [170, 400], [260, 440], [300, 470], [360, H + 5], [-10, H + 5]], 8) + tone(P, [[620, 470], [700, 430], [780, 440], [810, 450], [810, H + 5], [600, H + 5]], 8);
    const rim = `<polyline class="fx" points="${pts([[80, 380], [170, 400], [260, 440]])}" fill="none" stroke="${P(1)}" stroke-width="1.6"/><polyline class="fx" points="${pts([[700, 430], [780, 440]])}" fill="none" stroke="${P(1)}" stroke-width="1.4"/>`;
    const layers = [
      { id: 'sky', label: 'Sky and sun', svg: sky },
      { id: 'far', label: 'Far headland', svg: far },
      { id: 'headland', label: 'Headland silhouette', svg: headland },
      { id: 'sea', label: 'Sea and light path', svg: sea },
      { id: 'rocks', label: 'Foreground rocks', svg: rocks + rim },
    ];
    const meta = {
      horizon: hy, focal: sun, light: 'back', sun,
      regions: {
        sky: { label: 'Sky', poly: [[380, 0], [800, 0], [800, 200], [380, 200]] },
        headland: { label: 'Headland', poly: head },
        sea: { label: 'Sea', poly: [[330, 330], [800, 330], [800, 420], [330, 440]] },
        rocks: { label: 'Foreground rocks', poly: [[-10, 420], [80, 380], [170, 400], [260, 440], [300, 470], [360, 500], [-10, 500]] },
        path: { label: 'Light on the water', poly: [[500, 305], [540, 305], [600, 460], [440, 460]] },
      },
    };
    return { layers, meta };
  };

  /* Basic forms on a ground plane, light from one side. */
  S.forms = function (P, o) {
    const light = o.light || 'left';
    const L = light === 'left';
    const hy = 250;
    const bg = `<rect class="tone" width="${W}" height="${hy}" fill="${P(1)}"/><rect class="tone" x="0" y="${hy}" width="${W}" height="${H - hy}" fill="${P(3)}"/>`;
    const d = L ? 1 : -1;
    // sphere
    const sx = 150, sy = 330, sr = 62;
    let sp = `<ellipse class="tone" cx="${sx + d * 70}" cy="${sy + sr - 4}" rx="${sr + 30}" ry="16" fill="${P(6)}"/>`;
    const spId = 'cl' + (++uid);
    sp += `<clipPath id="${spId}"><circle cx="${sx}" cy="${sy}" r="${sr}"/></clipPath>`;
    sp += `<circle class="tone" cx="${sx}" cy="${sy}" r="${sr}" fill="${P(6)}"/>`;
    sp += `<g clip-path="url(#${spId})"><circle class="tone" cx="${sx - d * sr * 0.42}" cy="${sy - sr * 0.3}" r="${sr * 1.02}" fill="${P(3)}"/><circle class="tone" cx="${sx - d * sr * 0.5}" cy="${sy - sr * 0.38}" r="${sr * 0.62}" fill="${P(1)}"/><circle class="tone" cx="${sx - d * 24}" cy="${sy - 26}" r="12" fill="${P(0)}"/></g>`;
    // cube
    const cx = 330, cyb = 380;
    const cube = { top: [[cx - 60, cyb - 110], [cx, cyb - 136], [cx + 70, cyb - 116], [cx + 10, cyb - 90]], left: [[cx - 60, cyb - 110], [cx + 10, cyb - 90], [cx + 10, cyb], [cx - 60, cyb - 22]], right: [[cx + 10, cyb - 90], [cx + 70, cyb - 116], [cx + 70, cyb - 28], [cx + 10, cyb]] };
    let cb = tone(P, L ? [[cx + 70, cyb - 28], [cx + 10, cyb], [cx + 180, cyb + 10], [cx + 200, cyb - 30]] : [[cx - 60, cyb - 22], [cx + 10, cyb], [cx - 150, cyb + 14], [cx - 170, cyb - 20]], 6);
    cb += tone(P, cube.top, 0) + tone(P, cube.left, L ? 1 : 6) + tone(P, cube.right, L ? 6 : 1) + hatch(L ? cube.right : cube.left, 'd', 0.5);
    // cone (tree)
    const kx = 520, kb = 390;
    let cn = tone(P, L ? [[kx, kb], [kx + 60, kb + 4], [kx + 170, kb + 14], [kx + 40, kb - 6]] : [[kx, kb], [kx - 60, kb + 4], [kx - 170, kb + 14], [kx - 40, kb - 6]], 6);
    cn += tone(P, [[kx, kb - 200], [kx + 60, kb], [kx - 60, kb]], 2) + tone(P, L ? [[kx, kb - 200], [kx + 60, kb], [kx + 12, kb + 4]] : [[kx, kb - 200], [kx - 60, kb], [kx - 12, kb + 4]], 6) + hatch(L ? [[kx, kb - 200], [kx + 60, kb], [kx + 12, kb + 4]] : [[kx, kb - 200], [kx - 60, kb], [kx - 12, kb + 4]], 'd', 0.5);
    // cylinder (trunk)
    const yx = 690, yt = 220, yb = 400, yr = 34;
    let cy = tone(P, L ? [[yx, yb], [yx + 150, yb + 16], [yx + 160, yb - 4], [yx + yr, yb - 6]] : [[yx, yb], [yx - 150, yb + 16], [yx - 160, yb - 4], [yx - yr, yb - 6]], 6);
    cy += `<path class="tone" d="M${yx - yr} ${yt} L${yx - yr} ${yb} A ${yr} 10 0 0 0 ${yx + yr} ${yb} L${yx + yr} ${yt} Z" fill="${P(2)}"/>`;
    cy += `<path class="tone" d="M${yx + d * 6} ${yt + 9} L${yx + d * 6} ${yb + 9} A ${yr} 10 0 0 ${L ? 0 : 1} ${yx + d * yr} ${yb} L${yx + d * yr} ${yt} Z" fill="${P(6)}"/>`;
    cy += `<ellipse class="tone" cx="${yx}" cy="${yt}" rx="${yr}" ry="10" fill="${P(0)}"/>`;
    const layers = [
      { id: 'ground', label: 'Ground plane', svg: bg },
      { id: 'sphere', label: 'Sphere (bush, cloud)', svg: sp },
      { id: 'cube', label: 'Box (cabin, rock)', svg: cb },
      { id: 'cone', label: 'Cone (pine)', svg: cn },
      { id: 'cyl', label: 'Cylinder (trunk)', svg: cy },
    ];
    const meta = {
      horizon: hy, light, lightAngle: L ? 215 : 325,
      regions: {
        lit: { label: 'Light side', poly: L ? [[sx - sr + 4, sy - 40], [sx - 4, sy - 58], [sx - 4, sy + 50], [sx - sr + 8, sy + 30]] : [[sx + 4, sy - 58], [sx + sr - 4, sy - 40], [sx + sr - 8, sy + 30], [sx + 4, sy + 50]] },
        form: { label: 'Form shadow', poly: L ? [[sx + 14, sy - 56], [sx + sr - 2, sy - 20], [sx + sr - 4, sy + 24], [sx + 14, sy + 56]] : [[sx - 14, sy - 56], [sx - sr + 2, sy - 20], [sx - sr + 4, sy + 24], [sx - 14, sy + 56]] },
        cast: { label: 'Cast shadow', poly: L ? [[sx + 64, sy + 46], [sx + 170, sy + 50], [sx + 170, sy + 72], [sx + 64, sy + 74]] : [[sx - 170, sy + 46], [sx - 64, sy + 46], [sx - 64, sy + 74], [sx - 170, sy + 72]] },
      },
    };
    return { layers, meta };
  };

  /* Overlapping ranges for atmospheric perspective. mode: correct | reversed | flat */
  S.ranges = function (P, o) {
    const r = rng(o.seed || 41);
    const kind = o.kind || 'correct';
    const vals = kind === 'correct' ? [1, 3, 5, 8] : kind === 'reversed' ? [8, 5, 3, 1] : [5, 5, 5, 5];
    const sky = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/>`;
    const ys = [150, 230, 310, 390];
    const layers = [{ id: 'sky', label: 'Sky', svg: sky }];
    ys.forEach((y, i) => {
      const main = [[-10, y + 40]];
      for (let x = 60; x < 820; x += 110 + r() * 60) main.push([x, y - 20 - r() * (60 - i * 8)], [x + 55, y + 20 + r() * 20]);
      main.push([810, y + 30]);
      const detail = kind === 'correct' ? 0.2 + i * 0.25 : 0.5;
      layers.push({ id: 'r' + i, label: ['Farthest range', 'Far range', 'Near range', 'Nearest ridge'][i], svg: range(P, r, { main, base: H + 5, v: vals[i], shade: Math.min(8, vals[i] + (kind === 'correct' ? (i === 0 ? 0 : 1 + (i > 1 ? 1 : 0)) : 1)), hatchOp: detail, jag: 6 + i * 4 }) + (i === 3 ? treeline(P, r, 0, 800, 470, 20, 60, kind === 'correct' ? 8 : vals[3], 12) : '') });
    });
    return { layers, meta: { horizon: 140, regions: {} } };
  };

  /* Single mountain for plane-reading. */
  S.peak = function (P, o) {
    const r = rng(o.seed || 51);
    const light = o.light || 'left';
    const sky = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/>` + skyTone(300) + cloud(P, r, 640, 90, 140, 1);
    const main = [[-10, 420], [120, 330], [230, 380], [400, 90], [560, 330], [650, 300], [810, 400]];
    const mt = range(P, r, { main, base: H + 5, v: 2, shade: 6, snow: 230, light, jag: 14, hatchOp: 0.55 });
    const fg = treeline(P, r, 0, 800, 490, 24, 70, 7, 12);
    const L = light === 'left';
    return {
      layers: [{ id: 'sky', label: 'Sky', svg: sky }, { id: 'mt', label: 'Mountain', svg: mt }, { id: 'fg', label: 'Tree line', svg: fg }],
      meta: {
        horizon: 420, focal: [400, 90], light,
        regions: {
          lit: { label: 'Lit plane', poly: L ? [[300, 250], [390, 110], [400, 300], [300, 400]] : [[410, 110], [500, 250], [500, 400], [420, 300]] },
          shadow: { label: 'Shadow plane', poly: L ? [[410, 110], [520, 280], [500, 420], [430, 400]] : [[300, 250], [390, 110], [380, 400], [300, 400]] },
          sky: { label: 'Sky', poly: [[0, 0], [300, 0], [300, 200], [0, 200]] },
        },
      },
    };
  };

  /* Rock cluster for plane reading. */
  S.rocks = function (P, o) {
    const r = rng(o.seed || 61);
    const light = o.light || 'left';
    const bg = `<rect class="tone" width="${W}" height="${H}" fill="${P(1)}"/><rect class="tone" x="0" y="300" width="${W}" height="200" fill="${P(2)}"/>` + grass(P, r, 0, 800, 480, 14, 5, 60);
    const a = rock(P, r, 330, 400, 360, 220, 4, light);
    const b = rock(P, r, 610, 420, 190, 110, 4, light);
    const c = rock(P, r, 120, 440, 150, 70, 4, light);
    const L = light === 'left';
    return {
      layers: [{ id: 'bg', label: 'Ground', svg: bg }, { id: 'rocks', label: 'Rocks', svg: c.svg + b.svg + a.svg }],
      meta: {
        horizon: 300, light,
        regions: {
          top: { label: 'Top plane', poly: a.top },
          front: { label: L ? 'Front plane' : 'Front plane', poly: a.front },
          side: { label: 'Side plane', poly: a.side },
        },
      },
    };
  };

  /* Tree silhouettes gallery. */
  S.trees = function (P, o) {
    const r = rng(o.seed || 71);
    const bg = `<rect class="tone" width="${W}" height="${H}" fill="${P(0)}"/><rect class="tone" x="0" y="420" width="${W}" height="80" fill="${P(2)}"/>`;
    const t1 = pine(P, r, 110, 420, 300, 6);
    const t2 = oak(P, r, 290, 420, 280, 5);
    const t3 = bareTree(P, r, 470, 424, 300, 6, 1.8);
    let t4 = '';
    [[600, 420, 150], [640, 420, 120], [620, 420, 190]].forEach(([x, y, h]) => { t4 += pine(P, r, x, y, h, 6, { w: 0.2 }); });
    const t5 = oak(P, r, 730, 420, 170, 5, { lean: -8 });
    return {
      layers: [{ id: 'bg', label: 'Ground', svg: bg }, { id: 't1', label: 'Pine', svg: t1 }, { id: 't2', label: 'Oak', svg: t2 }, { id: 't3', label: 'Bare tree', svg: t3 }, { id: 't4', label: 'Cypress group', svg: t4 }, { id: 't5', label: 'Round tree', svg: t5 }],
      meta: { horizon: 420 },
    };
  };

  /* Sky study: cloud perspective (small near horizon). */
  S.sky = function (P, o) {
    const r = rng(o.seed || 81);
    const hy = 400;
    let s = `<rect class="tone" width="${W}" height="${hy}" fill="${P(0)}"/>` + skyTone(hy);
    const wrong = o.kind === 'wrong';
    const rows = wrong ? [[100, 90], [180, 110], [260, 100], [340, 120]] : [[70, 240], [170, 150], [250, 90], [310, 56], [350, 34], [376, 20]];
    let cl = '';
    rows.forEach(([y, w], i) => { const n = wrong ? 3 : Math.min(7, 2 + i); for (let k = 0; k < n; k++) cl += cloud(P, r, (k + 0.5 + (r() - 0.5) * 0.6) * (W / n), y, w * (0.8 + r() * 0.4), wrong ? 2 : Math.min(3, 1 + (i > 2 ? 1 : 0))); });
    const land = tone(P, jag([[-10, hy], [200, hy - 10], [420, hy + 2], [620, hy - 8], [810, hy]], 4, r).concat([[810, H + 5], [-10, H + 5]]), 5) + grass(P, r, 0, 800, 490, 14, 7, 60);
    return { layers: [{ id: 'sky', label: 'Sky', svg: s }, { id: 'clouds', label: 'Clouds', svg: cl }, { id: 'land', label: 'Land', svg: land }], meta: { horizon: hy } };
  };

  /* ---------- overlays (non-photo blue construction) ---------- */
  let noLabels = false;
  function halo(x, y, text, anchor = 'start', size = 15) {
    if (noLabels) return '';
    return `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="Schibsted Grotesk, Arial, sans-serif" font-size="${size}" font-weight="700" fill="${BLUE}" stroke="#F7F6F2" stroke-width="4" paint-order="stroke" letter-spacing=".2">${esc(text)}</text>`;
  }
  function overlay(ov, meta, anim) {
    const cls = 'ov' + (anim ? ' drawin' : '');
    const t = ov.t;
    if (t === 'horizon') {
      const y = ov.y ?? meta.horizon;
      return `<line class="${cls}" x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${BLUE}" stroke-width="2" stroke-dasharray="${anim ? '' : '10 6'}"/>` + halo(ov.x ?? 14, y - 9, ov.label ?? 'Horizon (eye level)');
    }
    if (t === 'thirds') {
      let s = '';
      [W / 3, (2 * W) / 3].forEach((x) => (s += `<line class="ov" x1="${f(x)}" y1="0" x2="${f(x)}" y2="${H}" stroke="${BLUE}" stroke-width="1.2" stroke-dasharray="4 5"/>`));
      [H / 3, (2 * H) / 3].forEach((y) => (s += `<line class="ov" x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}" stroke="${BLUE}" stroke-width="1.2" stroke-dasharray="4 5"/>`));
      return s;
    }
    if (t === 'vp') {
      const vps = ov.all ? meta.vpsAll : meta.vps || [];
      let s = '';
      const lines = ov.lines || (meta.persp && meta.persp.lines) || [];
      vps.forEach((vp) => {
        lines.forEach((p) => {
          const ext = ov.extend ? [p[0] + (p[0] - vp[0]) * 0.4, p[1] + (p[1] - vp[1]) * 0.4] : p;
          s += `<line class="${cls}" x1="${f(vp[0])}" y1="${f(vp[1])}" x2="${f(ext[0])}" y2="${f(ext[1])}" stroke="${BLUE}" stroke-width="1.3" opacity=".9"/>`;
        });
        if (vp[0] >= 0 && vp[0] <= W) s += `<circle class="ov" cx="${f(vp[0])}" cy="${f(vp[1])}" r="7" fill="none" stroke="${BLUE}" stroke-width="2.5"/><circle cx="${f(vp[0])}" cy="${f(vp[1])}" r="2.5" fill="${BLUE}"/>` + halo(vp[0] + 12, vp[1] - 12, ov.label || 'Vanishing point');
      });
      return s;
    }
    if (t === 'planes') {
      return (meta.planes || []).map((p, i) => `<rect class="ov" x="0" y="${p.y0}" width="${W}" height="${p.y1 - p.y0}" fill="${BLUE}" opacity="${0.06 + i * 0.07}"/><line class="ov" x1="0" y1="${p.y0}" x2="${W}" y2="${p.y0}" stroke="${BLUE}" stroke-width="1.2" stroke-dasharray="6 5"/>` + halo(W - 14, p.y0 + 20, p.label, 'end')).join('');
    }
    if (t === 'shapes') {
      return (meta.shapes || []).map((s, i) => `<path class="${cls}" d="${dPath(s.poly)}" fill="${BLUE}" fill-opacity=".08" stroke="${BLUE}" stroke-width="2.2"/>` + halo(centroid(s.poly)[0], centroid(s.poly)[1], (i + 1) + '  ' + s.label, 'middle', 17)).join('');
    }
    if (t === 'region') {
      const rg = meta.regions[ov.id];
      if (!rg) return '';
      const c = ov.at || centroid(rg.poly);
      return `<path class="${cls}" d="${dPath(rg.poly)}" fill="${BLUE}" fill-opacity="${ov.fill ?? 0.12}" stroke="${BLUE}" stroke-width="2"/>` + (ov.label === false ? '' : halo(c[0], c[1], ov.label || rg.label, 'middle'));
    }
    if (t === 'focal') {
      const p = ov.at || meta.focal;
      if (!p) return '';
      return `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${ov.r || 34}" fill="none" stroke="${BLUE}" stroke-width="2.5"/>` + halo(p[0] + (ov.r || 34) + 8, p[1] + 5, ov.label || 'Focal point');
    }
    if (t === 'arrow') {
      const [a, b] = [ov.from, ov.to];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const h1 = [b[0] - 14 * Math.cos(ang - 0.4), b[1] - 14 * Math.sin(ang - 0.4)], h2 = [b[0] - 14 * Math.cos(ang + 0.4), b[1] - 14 * Math.sin(ang + 0.4)];
      return `<line class="${cls}" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${BLUE}" stroke-width="2.4"/><path class="ov" d="M${f(h1[0])} ${f(h1[1])} L${f(b[0])} ${f(b[1])} L${f(h2[0])} ${f(h2[1])}" fill="none" stroke="${BLUE}" stroke-width="2.4" stroke-linejoin="round"/>` + (ov.label ? halo(ov.lx ?? a[0], ov.ly ?? a[1] - 10, ov.label, ov.anchor || 'start') : '');
    }
    if (t === 'light') {
      const L = (meta.light || 'left') === 'left';
      const from = ov.from || (L ? [40, 40] : [760, 40]), to = ov.to || (L ? [130, 110] : [670, 110]);
      return `<circle class="ov" cx="${from[0]}" cy="${from[1]}" r="14" fill="none" stroke="${BLUE}" stroke-width="2"/>` + overlay({ t: 'arrow', from, to, label: ov.label || 'Light', lx: from[0] + (L ? 20 : -20), ly: from[1] + 5, anchor: L ? 'start' : 'end' }, meta, anim);
    }
    if (t === 'label') {
      let s = '';
      if (ov.to) s += `<line class="ov" x1="${f(ov.x)}" y1="${f(ov.y)}" x2="${f(ov.to[0])}" y2="${f(ov.to[1])}" stroke="${BLUE}" stroke-width="1.4"/><circle cx="${f(ov.to[0])}" cy="${f(ov.to[1])}" r="3.5" fill="${BLUE}"/>`;
      return s + halo(ov.x, ov.y + (ov.to && ov.to[1] < ov.y ? 14 : -6), ov.text, ov.anchor || 'start', ov.size || 15);
    }
    if (t === 'line') return `<polyline class="${cls}" points="${pts(ov.pts)}" fill="none" stroke="${BLUE}" stroke-width="${ov.w || 2}" ${ov.dash ? 'stroke-dasharray="7 5"' : ''}/>`;
    if (t === 'box') return `<rect class="${cls}" x="${ov.x}" y="${ov.y}" width="${ov.w}" height="${ov.h}" fill="none" stroke="${BLUE}" stroke-width="2"/>` + (ov.label ? halo(ov.x + 6, ov.y - 8, ov.label) : '');
    if (t === 'probe') return (meta.probes || []).map((p, i) => `<circle class="ov" cx="${p.x}" cy="${p.y}" r="13" fill="#F7F6F2" stroke="${BLUE}" stroke-width="2.5"/>` + `<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-size="14" font-weight="700" fill="${BLUE}">${String.fromCharCode(65 + i)}</text>`).join('');
    if (t === 'mark') return `<circle class="ov" cx="${f(ov.x)}" cy="${f(ov.y)}" r="9" fill="none" stroke="${ov.color || BLUE}" stroke-width="3"/><circle cx="${f(ov.x)}" cy="${f(ov.y)}" r="2.5" fill="${ov.color || BLUE}"/>` + (ov.label ? halo(ov.x + 14, ov.y + 5, ov.label) : '');
    return '';
  }
  function centroid(poly) {
    let x = 0, y = 0;
    poly.forEach((p) => { x += p[0]; y += p[1]; });
    return [x / poly.length, y / poly.length];
  }

  const cache = new Map();
  function build(key, opts = {}) {
    const mode = opts.mode || 'tone';
    const ck = key + '|' + JSON.stringify(opts.params || {}) + '|' + (mode === 'notan' || mode === 'two' ? mode : 'tone');
    if (cache.has(ck)) return cache.get(ck);
    uid = 0; // ids only need to be unique per svg; prefix below keeps them distinct across svgs
    hr = rng(key.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) ^ JSON.stringify(opts.params || {}).length);
    const P = palette(mode);
    const res = S[key](P, opts.params || {});
    const pre = 's' + (cache.size + 1) + '_';
    res.layers.forEach((l) => { l.svg = l.svg.replace(/id="(cl|rf)(\d+)"/g, `id="${pre}$1$2"`).replace(/url\(#(cl|rf)(\d+)\)/g, `url(#${pre}$1$2)`); });
    cache.set(ck, res);
    return res;
  }

  /* render: {mode:'tone'|'line'|'notan'|'two', show:[ids]|null, line:[ids], overlays:[...], rough, anim, title, cls} */
  function render(key, opts = {}) {
    const res = build(key, opts);
    const show = opts.show ? new Set(opts.show) : null;
    const lineSet = new Set(opts.line || []);
    const fresh = new Set(opts.fresh || []);
    let body = '';
    res.layers.forEach((l) => {
      if (show && !show.has(l.id)) return;
      const isLine = opts.mode === 'line' || lineSet.has(l.id);
      body += `<g data-layer="${l.id}" class="${isLine ? 'as-line' : ''} ${fresh.has(l.id) && opts.anim ? 'fadein' : ''}">${l.svg}</g>`;
    });
    noLabels = opts.labels === false;
    const ov = (opts.overlays || []).map((o) => overlay(o, res.meta, opts.anim && fresh.has('ov'))).join('');
    noLabels = false;
    const rough = opts.rough === false ? ' filter="url(#ld-lite)"' : ' filter="url(#ld-rough)"';
    const cls = ['scene', opts.mode ? 'mode-' + opts.mode : '', opts.cls || ''].join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(opts.title || key)}">${opts.standalone ? `<defs>${FILTERS}</defs>` : ''}<g${rough}>${body}</g><g class="ovs">${ov}</g>${opts.extra || ''}</svg>`;
    return svg;
  }
  // line-mode per layer via CSS: .as-line .tone
  function meta(key, params) { return build(key, { params }).meta; }
  function layers(key, params) { return build(key, { params }).layers.map((l) => ({ id: l.id, label: l.label })); }

  /* diagrams that are not landscapes */
  function valueScale(opts = {}) {
    const n = opts.steps || 9;
    const idx = n === 9 ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : n === 5 ? [0, 2, 4, 6, 8] : [0, 4, 8];
    const w = 800 / idx.length;
    let s = idx.map((v, i) => `<rect x="${f(i * w)}" y="0" width="${f(w + 0.5)}" height="140" fill="${VAL[v]}"/><text x="${f(i * w + w / 2)}" y="172" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-size="18" font-weight="700" fill="#43423E">${i + 1}</text>`).join('');
    if (opts.labels) s += opts.labels.map((l) => `<text x="${f(l[0] * w + w / 2)}" y="198" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-size="13" fill="#5E5C58">${esc(l[1])}</text>`).join('');
    return `<svg class="scene diagram" viewBox="0 0 800 ${opts.labels ? 210 : 185}" role="img" aria-label="Value scale from light to dark"><rect width="800" height="${opts.labels ? 210 : 185}" fill="#F7F6F2"/>${s}</svg>`;
  }
  function pencils() {
    const grades = ['4H', '2H', 'HB', '2B', '4B', '6B'];
    let s = '<rect width="800" height="360" fill="#F7F6F2"/>';
    grades.forEach((g, i) => {
      const y = 36 + i * 54, w = 0.6 + i * 0.75, c = VAL[Math.min(8, 2 + i + (i > 3 ? 1 : 0))];
      s += `<text x="24" y="${y + 6}" font-family="Schibsted Grotesk, Arial" font-size="17" font-weight="700" fill="#43423E">${g}</text>`;
      let d = `M90 ${y}`;
      for (let x = 90; x <= 520; x += 12) d += ` Q ${x + 6} ${y + (x % 24 ? -5 : 5)} ${x + 12} ${y}`;
      s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w + 0.6}" stroke-linecap="round"/>`;
      s += `<rect x="560" y="${y - 16}" width="200" height="32" fill="url(#ld-hatch-d)" opacity="${0.2 + i * 0.16}"/>`;
    });
    s += `<text x="560" y="350" font-family="Schibsted Grotesk, Arial" font-size="13" fill="#5E5C58">Same pressure, softer lead</text><text x="90" y="350" font-family="Schibsted Grotesk, Arial" font-size="13" fill="#5E5C58">Hard leads for construction, soft leads for darks</text>`;
    return `<svg class="scene diagram" viewBox="0 0 800 360" role="img" aria-label="Pencil grades from 4H to 6B">${s}</svg>`;
  }
  function lineWeights() {
    let s = '<rect width="800" height="300" fill="#F7F6F2"/>';
    const rows = [['Construction: light, fast, searching', 0.8, VAL[3], '6 4'], ['Contour: steady, varied weight', 2, VAL[6], ''], ['Accent: dark, only where forms overlap', 3.6, VAL[8], '']];
    rows.forEach(([t, w, c, dash], i) => {
      const y = 60 + i * 90;
      s += `<path d="M40 ${y} C 200 ${y - 40} 330 ${y + 40} 480 ${y} S 700 ${y - 20} 760 ${y}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
      s += `<text x="40" y="${y + 38}" font-family="Schibsted Grotesk, Arial" font-size="15" font-weight="600" fill="#43423E">${esc(t)}</text>`;
    });
    return `<svg class="scene diagram" viewBox="0 0 800 300" role="img" aria-label="Three kinds of line">${s}</svg>`;
  }
  function hills5() {
    // HILLS method diagram used on home + analysis lesson
    return render('mountainLake', { overlays: [{ t: 'horizon', label: 'H  Horizon' }, { t: 'shapes' }], rough: false });
  }

  /* The pencil filter: two scales of wobble so no edge is ruler-straight, then paper tooth
     showing through the graphite. The lite version (thumbnails) keeps only the wobble. */
  const FILTERS = `<filter id="ld-rough" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n1"/>
      <feDisplacementMap in="SourceGraphic" in2="n1" scale="7" xChannelSelector="R" yChannelSelector="G" result="d1"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="1" seed="11" result="n2"/>
      <feDisplacementMap in="d1" in2="n2" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d2"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.65 0.9" numOctaves="3" seed="5" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.895  0 0 0 0 0.88  0 0 0 -2.8 1.45" result="toothRaw"/>
      <feComponentTransfer in="toothRaw" result="tooth"><feFuncA type="linear" slope="0.42"/></feComponentTransfer>
      <feComposite in="tooth" in2="d2" operator="in" result="toothIn"/>
      <feComposite in="toothIn" in2="d2" operator="over"/>
    </filter>
    <filter id="ld-lite" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  function injectDefs() {
    if (document.getElementById('ld-defs')) return;
    const hatchP = (id, rot, sp = 5, w = 0.8, c = '#2A2926') => `<pattern id="${id}" width="${sp}" height="${sp}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><line x1="0" y1="0" x2="0" y2="${sp}" stroke="${c}" stroke-width="${w}"/></pattern>`;
    const div = document.createElement('div');
    div.innerHTML = `<svg id="ld-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
      ${FILTERS}
      ${hatchP('ld-hatch-d', 35)}${hatchP('ld-hatch-b', -35)}${hatchP('ld-hatch-h', 90, 6, 0.7)}${hatchP('ld-hatch-v', 0, 4, 0.7)}
      <pattern id="ld-hatch-x" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#2A2926" stroke-width=".9"/><line x1="0" y1="0" x2="6" y2="0" stroke="#2A2926" stroke-width=".9"/></pattern>
    </defs></svg>`;
    document.body.prepend(div.firstElementChild);
    // paper grain tile for plates
    try {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const x = c.getContext('2d'); const img = x.createImageData(160, 160);
      const r = rng(99);
      for (let i = 0; i < img.data.length; i += 4) { const v = 200 + r() * 55; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = r() < 0.5 ? 20 : 0; }
      x.putImageData(img, 0, 0);
      document.documentElement.style.setProperty('--grain', `url(${c.toDataURL()})`);
    } catch (e) { /* grain is decorative */ }
  }

  window.Scenes = { render, meta, layers, valueScale, pencils, lineWeights, hills5, injectDefs, VAL, W, H, centroid };
})();
