/* Step-by-step: upload a drawing or photo and get a visual, staged guide to drawing it yourself.
   The stages mirror the course workflow: plan, light guides, big shapes, contours, 3 values, 5 values, details.
   Every stage image is computed in the browser; Claude (when available) rewrites the instructions for the specific image. */
(function () {
  const { $, $$, esc, icon, store, toast } = window.LD;
  const LD = window.LD;
  const VAL = window.Scenes.VAL.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const PAPER = [247, 246, 242];

  const STAGES = [
    { k: 'plan', title: 'Look and plan', pencil: 'No pencil yet', minutes: 3, grid: false,
      do: 'Study the whole image for a minute before drawing. Squint until the details blur. Find the focal point, where the strongest contrast is, and notice where the light comes from. Match your paper to the image’s shape.',
      watch: 'Starting to draw before you know what the picture is about.' },
    { k: 'setup', title: 'Frame, horizon and proportions', pencil: '2H', minutes: 3, grid: true,
      do: 'Draw a frame with the same proportions as the image. Lightly mark the horizon and a 4 × 4 grid, like the one shown. The grid lets you place every shape by comparing which square it sits in.',
      watch: 'Pressing hard. Every line at this stage should erase cleanly.' },
    { k: 'shapes', title: 'Block in the big shapes', pencil: '2H', minutes: 6, grid: true,
      do: 'Copy only the large masses shown here as simple outlines. Check each one against the grid: where it starts, where it ends, how tall it is. Ignore everything inside the shapes for now.',
      watch: 'Drawing small details before the big shapes are placed.' },
    { k: 'lines', title: 'Draw the main contours', pencil: 'HB', minutes: 10, grid: false,
      do: 'Refine the outlines inside each mass: ridges, tree edges, shorelines and the main internal lines shown here. Keep the pressure light. Press a little firmer only where one form overlaps another.',
      watch: 'Outlining everything with the same heavy line.' },
    { k: 'v3', title: 'Lay in three values', pencil: '2B', minutes: 10, grid: false,
      do: 'Leave the lights as clean paper. Lay one even middle tone everywhere the middle grey appears, then fill the dark shapes. Flat tone only: no blending, no detail.',
      watch: 'Shading areas that should stay paper white.' },
    { k: 'v5', title: 'Build the form with five values', pencil: '2B to 4B', minutes: 12, grid: false,
      do: 'Split each value group into lighter and darker steps so forms start to turn. Let your strokes follow each surface: along slopes, down trunks, across water.',
      watch: 'Smudging everything into one grey. Keep the groups distinct.' },
    { k: 'final', title: 'Details and accents', pencil: '4B to 6B, kneaded eraser', minutes: 10, grid: false,
      do: 'Add the details that matter, mostly near the focal point: sharp edges, texture and the darkest accents. Lift highlights with a kneaded eraser. Stop before you overwork the rest.',
      watch: 'Adding detail evenly everywhere, which flattens the focal point.' },
  ];

  let S = { src: null, name: '', isSample: true, canvases: null, ai: null, i: 0, grid: true, orig: false, busy: false, aiBusy: false };
  try { const saved = store.get('ld.steps.last', null); if (saved && saved.src) Object.assign(S, { src: saved.src, name: saved.name, isSample: false, ai: saved.ai || null }); } catch (e) { /* start fresh */ }

  /* ---------- image processing ---------- */
  const tick = () => new Promise((r) => setTimeout(r, 0));
  function loadCanvas(src, max = 960) {
    return LD.loadImage(src).then((img) => {
      const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      return c;
    });
  }
  function grayOf(c) {
    const { width: w, height: h } = c;
    const d = c.getContext('2d').getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
    return g;
  }
  function blur(src, w, h, r) {
    r = Math.max(0, Math.round(r));
    if (!r) return src.slice();
    let a = src.slice(), b = new Float32Array(src.length);
    for (let pass = 0; pass < 2; pass++) {
      for (let y = 0; y < h; y++) {
        let sum = 0; const row = y * w;
        for (let x = -r; x <= r; x++) sum += a[row + Math.min(w - 1, Math.max(0, x))];
        for (let x = 0; x < w; x++) {
          b[row + x] = sum / (2 * r + 1);
          sum += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
        }
      }
      for (let x = 0; x < w; x++) {
        let sum = 0;
        for (let y = -r; y <= r; y++) sum += b[Math.min(h - 1, Math.max(0, y)) * w + x];
        for (let y = 0; y < h; y++) {
          a[y * w + x] = sum / (2 * r + 1);
          sum += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
        }
      }
    }
    return a;
  }
  /* 1-D k-means on luminance: groups values the way the image actually distributes them,
     which matters for drawings that are mostly white paper. */
  function kmeans(g, k) {
    const step = Math.max(1, Math.floor(g.length / 40000));
    const s = []; for (let i = 0; i < g.length; i += step) s.push(g[i]);
    s.sort((a, b) => a - b);
    let c = Array.from({ length: k }, (_, i) => s[Math.floor(((i + 0.5) / k) * (s.length - 1))]);
    for (let it = 0; it < 14; it++) {
      const sum = new Array(k).fill(0), n = new Array(k).fill(0);
      for (const v of s) { let bi = 0, bd = 1e9; for (let j = 0; j < k; j++) { const d = Math.abs(v - c[j]); if (d < bd) { bd = d; bi = j; } } sum[bi] += v; n[bi]++; }
      c = c.map((v, j) => (n[j] ? sum[j] / n[j] : v));
    }
    c.sort((a, b) => a - b);
    // guard against collapsed clusters (for example a nearly blank page)
    for (let j = 1; j < k; j++) if (c[j] - c[j - 1] < 6) c[j] = c[j - 1] + 6;
    return c;
  }
  const nearest = (v, c) => { let bi = 0, bd = 1e9; for (let j = 0; j < c.length; j++) { const d = Math.abs(v - c[j]); if (d < bd) { bd = d; bi = j; } } return bi; };
  function blank(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); const im = x.createImageData(w, h); for (let i = 0; i < im.data.length; i += 4) { im.data[i] = PAPER[0]; im.data[i + 1] = PAPER[1]; im.data[i + 2] = PAPER[2]; im.data[i + 3] = 255; } return { c, x, im }; }
  const put = (d, i, rgb, a = 1) => { const j = i * 4; d[j] = d[j] * (1 - a) + rgb[0] * a; d[j + 1] = d[j + 1] * (1 - a) + rgb[1] * a; d[j + 2] = d[j + 2] * (1 - a) + rgb[2] * a; };

  async function buildStages(src) {
    const orig = await loadCanvas(src);
    const w = orig.width, h = orig.height;
    const g = grayOf(orig); await tick();
    // big shapes: squint (heavy blur) then split into two masses
    const big = blur(g, w, h, Math.max(6, w / 32));
    const c2 = kmeans(big, 2), cut = (c2[0] + c2[1]) / 2;
    const mask = new Uint8Array(w * h); for (let i = 0; i < mask.length; i++) mask[i] = big[i] < cut ? 1 : 0;
    const edge = new Uint8Array(w * h);
    const th = Math.max(1, Math.round(w / 480));
    for (let y = 0; y < h - 1; y++) for (let x = 0; x < w - 1; x++) { const i = y * w + x; if (mask[i] !== mask[i + 1] || mask[i] !== mask[i + w]) for (let t = 0; t < th; t++) { edge[Math.min(mask.length - 1, i + t)] = 1; edge[Math.min(mask.length - 1, i + t * w)] = 1; } }
    await tick();
    // stage: setup (faint shape positions only)
    const setup = blank(w, h); for (let i = 0; i < edge.length; i++) if (edge[i]) put(setup.im.data, i, VAL[2], 0.8); setup.x.putImageData(setup.im, 0, 0);
    // stage: big shapes
    const shapes = blank(w, h); for (let i = 0; i < mask.length; i++) { if (mask[i]) put(shapes.im.data, i, VAL[2], 0.55); if (edge[i]) put(shapes.im.data, i, VAL[5], 1); } shapes.x.putImageData(shapes.im, 0, 0);
    await tick();
    // stage: contours. Difference of blurs: a pixel is "line" when it is darker than its surroundings.
    // Unlike edge detection this gives one line per pencil stroke, and outlines dark masses in photos.
    const sm = blur(g, w, h, Math.max(1, w / 480));
    const bg = blur(g, w, h, Math.max(3, w / 150));
    const mag = new Float32Array(w * h);
    for (let i = 0; i < mag.length; i++) mag[i] = Math.max(0, bg[i] - sm[i]);
    const sample = []; for (let i = 0; i < mag.length; i += 7) sample.push(mag[i]); sample.sort((a, b) => a - b);
    const thr = Math.max(8, sample[Math.floor(sample.length * 0.88)]);
    const lines = blank(w, h);
    for (let i = 0; i < mag.length; i++) { if (mask[i]) put(lines.im.data, i, VAL[1], 0.35); if (edge[i]) put(lines.im.data, i, VAL[3], 0.8); if (mag[i] > thr) put(lines.im.data, i, VAL[6], Math.min(1, (mag[i] - thr) / (thr * 2) + 0.3)); }
    lines.x.putImageData(lines.im, 0, 0);
    await tick();
    // stages: three and five values
    const posterize = (r, k, pal) => { const b = blur(g, w, h, r); const c = kmeans(b, k); const o = blank(w, h); for (let i = 0; i < b.length; i++) put(o.im.data, i, VAL[pal[nearest(b[i], c)]], 1); o.x.putImageData(o.im, 0, 0); return o.c; };
    const v3 = posterize(Math.max(2, w / 110), 3, [8, 4, 0]);
    await tick();
    const v5 = posterize(Math.max(1, w / 260), 5, [8, 6, 4, 2, 0]);
    return { w, h, orig, setup: setup.c, shapes: shapes.c, lines: lines.c, v3, v5 };
  }
  const stageCanvas = (k) => { const C = S.canvases; return { plan: C.orig, setup: C.setup, shapes: C.shapes, lines: C.lines, v3: C.v3, v5: C.v5, final: C.orig }[k]; };

  /* ---------- AI: instructions written for this image ---------- */
  function prompt() {
    return `You are a patient drawing teacher. A student uploaded this image (a drawing or a photo) and wants a step-by-step guide to draw it themselves in graphite pencil.
The app already shows 7 visual stages generated from the image, in this order:
1 Look and plan · 2 Frame, horizon and proportions (a 4 x 4 grid is shown) · 3 Block in the big shapes · 4 Draw the main contours · 5 Lay in three values · 6 Build the form with five values · 7 Details and accents.
For EACH stage write the instruction for THIS image: name the actual things in it and where they are (use the 4 x 4 grid, for example "the peak sits in the second column, top row"), the order to draw them, simple proportions, and which pencil. 2 to 4 short sentences per stage. Plain, encouraging language.
Reply with only this JSON:
{"title": "short name for the scene", "summary": "one or two sentences on what makes this image work", "isDrawing": true, "difficulty": "beginner | intermediate | advanced", "horizon": {"yPercent": number or null, "note": "how to find it"}, "focalPoint": {"xPercent": number, "yPercent": number, "description": "what and why"}, "light": "where the light comes from", "bigShapes": ["3 to 5 largest masses"], "steps": [{"do": "...", "pencil": "...", "minutes": number, "watch": "one common mistake at this stage"}]}
The steps array must have exactly 7 items in the stage order. Percentages are measured from the image's left and top edges; use null for the horizon if there is no clear one.`;
  }
  async function runAI(render) {
    S.aiBusy = true; render();
    try {
      const c = S.canvases.orig;
      const blob = await LD.toBlob(LD.canvasTo(c, 1400), 0.88);
      const A = await LD.caps.sample.json(prompt(), { images: blob, modelTier: 'default' });
      if (!A || !Array.isArray(A.steps)) throw { code: 'bad_output' };
      S.ai = A;
      persist();
      toast('Steps written for your image');
    } catch (e) {
      const code = e && e.code;
      toast(code === 'rate_limited' ? 'Too many requests. Wait a minute and try again.' : code === 'not_granted' ? 'Personalised steps need your permission to ask Claude.' : 'Personalised steps could not be written this time.', 'alert');
    }
    S.aiBusy = false; render();
  }
  function persist() { store.set('ld.steps.last', S.isSample ? null : { src: S.src, name: S.name, ai: S.ai }); }

  /* ---------- view ---------- */
  function render(view, deps) {
    const aiOk = LD.caps.sample && LD.caps.imageOk;
    const A = S.ai;
    const steps = STAGES.map((st, i) => {
      const a = A && A.steps && A.steps[i];
      return Object.assign({}, st, a ? { do: a.do || st.do, pencil: a.pencil || st.pencil, minutes: a.minutes || st.minutes, watch: a.watch || st.watch } : {});
    });
    const total = steps.reduce((t, s) => t + (+s.minutes || 0), 0);
    view.innerHTML = `<header class="page-head"><h1>Step-by-step</h1><p>Upload a drawing or photo you want to learn from. The app breaks it into the stages you would use to draw it yourself, from the first light lines to the final accents.</p></header>
      <div class="ref-layout">
        <div class="ref-stage">
          <div class="ref-view" data-sv>${S.canvases ? '<canvas data-sc aria-live="polite"></canvas><svg class="ovl" data-sovl viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>' : `<div class="thinking" style="padding:var(--s6);aspect-ratio:8/5"><p class="small" style="color:#6E7278">${S.busy ? 'Preparing your steps…' : 'Loading…'}</p><div class="skeleton" style="width:80%"></div><div class="skeleton" style="width:55%"></div></div>`}</div>
          <div class="plate-bar"><span class="plate-no" data-sno>Step ${S.i + 1} of ${steps.length}</span><span class="spacer"></span>
            <button type="button" class="btn btn-sm" data-sprev ${S.i === 0 ? 'disabled' : ''}>${icon('left')}Back</button>
            <button type="button" class="btn btn-sm btn-primary" data-snext>${S.i === steps.length - 1 ? 'Start over' + icon('refresh') : 'Next step' + icon('right')}</button></div>
          <div class="step-now" data-snow aria-live="polite"></div>
          <div class="row"><button type="button" class="btn btn-sm btn-quiet" data-sgrid aria-pressed="${S.grid}">${icon('grid')}Grid</button><button type="button" class="btn btn-sm btn-quiet" data-sorig aria-pressed="${S.orig}">${icon('eye')}Show original</button></div>
          <section class="stack" style="gap:var(--s3);margin-top:var(--s4)" aria-labelledby="h-da"><h2 id="h-da" style="font-size:var(--t-22)">Draw along</h2><p class="small muted">Draw on paper beside the screen, or here. The Reference button shows the current step in the corner of the pad.</p><div data-spad></div></section>
        </div>
        <div class="stack" style="gap:var(--s5);min-width:0">
          <section class="panel stack" aria-labelledby="h-src">
            <div class="row" style="flex-wrap:nowrap;align-items:flex-start">${S.canvases ? `<img src="${esc(S.src)}" alt="Your source image" style="width:96px;border:1px solid var(--plate-edge);border-radius:var(--r-art);flex:none">` : ''}
              <div class="stack" style="gap:4px;min-width:0"><h3 id="h-src">${esc(A && A.title ? A.title : S.isSample ? 'Sample image' : S.name || 'Your image')}</h3><span class="small muted">${S.isSample ? 'A sample so you can see how it works. Upload your own drawing or photo.' : `${steps.length} steps · about ${total} minutes${A && A.difficulty ? ' · ' + esc(A.difficulty) : ''}`}</span></div></div>
            <div class="row"><label class="btn btn-sm btn-primary" style="cursor:pointer">${icon('upload')}Upload a drawing or photo<input type="file" accept="image/*" class="sr-only" data-sfile></label>
              ${aiOk && S.canvases ? `<button type="button" class="btn btn-sm ${S.aiBusy ? 'is-busy' : ''}" data-sai ${S.aiBusy ? 'disabled' : ''}>${icon('feedback')}${A ? 'Rewrite the steps' : 'Write steps for this image'}</button>` : ''}</div>
            ${aiOk ? (A ? '' : '<p class="tiny">The stage images are made on your device. Your teacher can also write each step specifically for this image: what to draw, where, and with which pencil.</p>') : '<p class="tiny">The stage images and instructions are made on your device. Nothing you upload leaves your browser.</p>'}
            ${A && A.summary ? `<p class="prose" style="font-size:var(--t-16)">${esc(A.summary)}</p><dl class="kv">${A.bigShapes ? `<dt>Big shapes</dt><dd>${esc(A.bigShapes.join(', '))}</dd>` : ''}${A.light ? `<dt>Light</dt><dd>${esc(A.light)}</dd>` : ''}${A.focalPoint ? `<dt>Focal point</dt><dd>${esc(A.focalPoint.description || '')}</dd>` : ''}${A.horizon && A.horizon.note ? `<dt>Horizon</dt><dd>${esc(A.horizon.note)}</dd>` : ''}</dl>` : ''}
          </section>
          <section aria-labelledby="h-steps"><h2 id="h-steps" class="sr-only">Steps</h2><div class="demo-steps" role="list">${steps.map((s, i) => `<button type="button" role="listitem" data-si="${i}" ${i === S.i ? 'aria-current="step"' : ''}><div><b>${esc(s.title)}</b><span>${esc(s.do)}</span><span class="tiny" style="margin-top:8px">${icon('pencil')} ${esc(s.pencil)} · about ${+s.minutes || 0} min</span><span class="tiny" style="color:var(--warn)">${icon('alert')} Watch for: ${esc(s.watch)}</span></div></button>`).join('')}</div></section>
          <section class="panel stack" aria-labelledby="h-sub"><h3 id="h-sub">Finished? Compare and get feedback</h3><div data-sub><div data-preview></div><div data-pick></div></div></section>
        </div>
      </div>`;

    const rerender = () => render(view, deps);
    const draw = () => {
      if (!S.canvases) return;
      const cv = $('[data-sc]', view); if (!cv) return;
      const st = steps[S.i];
      const src = S.orig ? S.canvases.orig : stageCanvas(st.k);
      cv.width = src.width; cv.height = src.height; cv.getContext('2d').drawImage(src, 0, 0);
      cv.parentElement.style.maxWidth = `min(100%, calc(72vh * ${(src.width / src.height).toFixed(3)}))`;
      let o = '';
      const B = '#3E8FC7';
      if (S.grid) for (const v of [25, 50, 75]) o += `<line x1="${v}" y1="0" x2="${v}" y2="100" stroke="${B}" stroke-width="1" stroke-opacity="${st.grid ? 0.85 : 0.4}" vector-effect="non-scaling-stroke"/><line x1="0" y1="${v}" x2="100" y2="${v}" stroke="${B}" stroke-width="1" stroke-opacity="${st.grid ? 0.85 : 0.4}" vector-effect="non-scaling-stroke"/>`;
      if (A && A.horizon && typeof A.horizon.yPercent === 'number' && (st.k === 'setup' || st.k === 'shapes' || st.k === 'plan')) o += `<line x1="0" y1="${A.horizon.yPercent}" x2="100" y2="${A.horizon.yPercent}" stroke="${B}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
      if (A && A.focalPoint && typeof A.focalPoint.xPercent === 'number' && (st.k === 'plan' || st.k === 'final')) o += `<ellipse cx="${A.focalPoint.xPercent}" cy="${A.focalPoint.yPercent}" rx="5" ry="${(5 * cv.width) / cv.height}" fill="none" stroke="${B}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`;
      $('[data-sovl]', view).innerHTML = o;
      cv.setAttribute('aria-label', 'Step ' + (S.i + 1) + ': ' + st.title);
      const now = $('[data-snow]', view); if (now) now.innerHTML = `<b>${esc(st.title)}</b><p>${esc(st.do)}</p><p class="tiny">${esc(st.pencil)} · about ${+st.minutes || 0} min. Watch for: ${esc(st.watch)}</p>`;
      const ref = $('[data-stepref]', view); if (ref) ref.src = cv.toDataURL('image/jpeg', 0.8);
    };
    const go = (i) => {
      S.i = (i + steps.length) % steps.length;
      $$('[data-si]', view).forEach((b) => { if (+b.dataset.si === S.i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      $('[data-sno]', view).textContent = 'Step ' + (S.i + 1) + ' of ' + steps.length;
      $('[data-sprev]', view).disabled = S.i === 0;
      $('[data-snext]', view).innerHTML = S.i === steps.length - 1 ? 'Start over' + icon('refresh') : 'Next step' + icon('right');
      draw();
    };
    $('[data-sprev]', view).addEventListener('click', () => go(S.i - 1));
    $('[data-snext]', view).addEventListener('click', () => go(S.i + 1));
    $$('[data-si]', view).forEach((b) => b.addEventListener('click', () => go(+b.dataset.si)));
    $('[data-sgrid]', view).addEventListener('click', (e) => { S.grid = !S.grid; e.currentTarget.setAttribute('aria-pressed', S.grid); draw(); });
    $('[data-sorig]', view).addEventListener('click', (e) => { S.orig = !S.orig; e.currentTarget.setAttribute('aria-pressed', S.orig); draw(); });
    if (view._stepsKey) view.removeEventListener('keydown', view._stepsKey);
    view._stepsKey = (e) => { if (location.hash.slice(1) !== 'steps' || e.target.closest('input,textarea,select,[data-spad],[role="slider"]')) return; if (e.key === 'ArrowRight') go(S.i + 1); if (e.key === 'ArrowLeft') go(S.i - 1); };
    view.addEventListener('keydown', view._stepsKey);
    $('[data-sfile]', view).addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      if (!f.type.startsWith('image/')) return toast('Choose an image file.', 'alert');
      try {
        const c = await LD.fileToCanvas(f, 1200);
        Object.assign(S, { src: c.toDataURL('image/jpeg', 0.88), name: f.name.replace(/\.[^.]+$/, ''), isSample: false, canvases: null, ai: null, i: 0 });
        persist(); prepare(view, deps);
      } catch (err) { toast('That image could not be opened. Export it as JPEG and try again.', 'alert'); }
    });
    const aiB = $('[data-sai]', view); if (aiB) aiB.addEventListener('click', () => runAI(rerender));
    if (S.canvases) {
      window.UI.pad($('[data-spad]', view), { key: 'steps', ref: '<img data-stepref alt="Current step" style="width:100%">' });
      draw();
      const ctx = { kind: 'drill', drillId: 'steps', title: 'Step-by-step: ' + (A && A.title ? A.title : S.isSample ? 'sample' : S.name || 'my image'), area: 'shapes', skill: 'Drawing from a source image',
        assignment: { title: 'Draw it step by step', brief: 'Draw the source image by following the stages: big shapes, contours, three values, five values, details.', do: steps.map((s) => s.title) },
        criteria: ['Big shapes and proportions match the source', 'Contours are placed accurately and drawn with varied weight', 'Clear value groups that match the source', 'Details are concentrated at the focal point'],
        refImg: S.src, padKeys: ['steps'] };
      deps.pickAndSaveDrill($('[data-sub]', view), ctx, { id: 'steps' });
    }
  }

  let token = 0;
  async function prepare(view, deps) {
    const tok = ++token;
    S.busy = true; S.canvases = null; render(view, deps);
    let built;
    try {
      if (!S.src) { const src = await deps.sampleSrc(); if (tok !== token) return; S.src = src; S.isSample = true; }
      built = await buildStages(S.src);
      if (tok !== token) return; // a newer image was chosen while this one was processing
      S.canvases = built;
    }
    catch (e) {
      if (tok !== token) return;
      S.busy = false;
      $('[data-sv]', view).innerHTML = `<div class="notice bad" style="margin:var(--s4)">${icon('alert')}<div>This image could not be processed. Try a JPEG or PNG under 20 MB.</div></div>`;
      return;
    }
    S.busy = false;
    if (location.hash.slice(1) === 'steps') render(view, deps);
  }

  window.StepsView = {
    show(view, deps) { if (S.canvases) render(view, deps); else prepare(view, deps); },
    useImage(src, name) { Object.assign(S, { src, name: name || 'Reference', isSample: false, canvases: null, ai: null, i: 0 }); persist(); },
  };
})();
