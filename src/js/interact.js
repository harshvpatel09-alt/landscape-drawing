/* Interactive pieces: plates, demo player, exercises, sketch pad. */
(function () {
  const { $, $$, esc, icon, clamp, store } = window.LD;
  const S = window.Scenes;
  const REGION_COLORS = ['#3E8FC7', '#C27A2C', '#7A5BB0', '#2E8A6A', '#B04A6B'];

  /* ---------- plate rendering ---------- */
  function strokeSample(kind) {
    let s = '<rect width="800" height="500" fill="#F7F6F2"/>';
    const r = (n) => (Math.sin(n * 12.9898) * 43758.5453) % 1;
    for (let i = 0; i < 70; i++) {
      const x = 40 + Math.abs(r(i)) * 720, y = 40 + Math.abs(r(i + 99)) * 420, L = 40 + Math.abs(r(i + 7)) * 60;
      if (kind === 'v') s += `<line x1="${x}" y1="${y}" x2="${x + 2}" y2="${y + L}" stroke="#43423E" stroke-width="2" stroke-linecap="round"/>`;
      else if (kind === 'h') s += `<line x1="${x}" y1="${y}" x2="${x + L * 1.4}" y2="${y + 1}" stroke="#43423E" stroke-width="2" stroke-linecap="round"/>`;
      else s += `<line x1="${x}" y1="${y}" x2="${x + L * 0.7}" y2="${y + L * 0.7}" stroke="#43423E" stroke-width="1.6"/><line x1="${x + L * 0.7}" y1="${y}" x2="${x}" y2="${y + L * 0.7}" stroke="#43423E" stroke-width="1.6"/>`;
    }
    return `<svg class="scene" viewBox="0 0 800 500" role="img" aria-label="${kind === 'v' ? 'Vertical' : kind === 'h' ? 'Horizontal' : 'Cross-hatched'} strokes">${s}</svg>`;
  }
  function renderSpec(spec, extra = {}) {
    if (!spec) return '';
    if (spec.svg) {
      if (spec.svg === 'pencils') return S.pencils();
      if (spec.svg === 'lineWeights') return S.lineWeights();
      if (spec.svg === 'valueScale') return S.valueScale(spec.svgOpts || {});
      if (spec.svg.startsWith('strokes-')) return strokeSample(spec.svg.slice(8));
    }
    const o = Object.assign({ params: spec.params, mode: spec.mode, overlays: spec.overlays, show: spec.show, line: spec.line, title: spec.title || spec.cap }, extra);
    return S.render(spec.scene, o);
  }

  /* Plate with view toggles: the course's signature way of seeing one scene three ways. */
  function plate(spec, opts = {}) {
    const id = 'pl' + Math.random().toString(36).slice(2, 7);
    const canToggle = !spec.svg && opts.toggles !== false;
    const hasOv = spec.overlays && spec.overlays.length;
    return `<figure class="stack" style="gap:var(--s3);margin:0" data-plate="${id}">
      <div class="plate">${renderSpec(spec)}</div>
      ${canToggle || spec.cap ? `<figcaption class="plate-bar">
        ${canToggle ? `<div class="seg" role="group" aria-label="View">
          <button type="button" data-mode="tone" aria-pressed="${!spec.mode || spec.mode === 'tone'}">Tone</button>
          <button type="button" data-mode="line" aria-pressed="${spec.mode === 'line'}">Line</button>
          <button type="button" data-mode="notan" aria-pressed="${spec.mode === 'notan'}">3 values</button>
        </div>` : ''}
        ${canToggle && hasOv ? `<button type="button" class="btn btn-sm btn-quiet" data-ov aria-pressed="true">${icon('eye')}Construction</button>` : ''}
        ${spec.cap ? `<p class="plate-cap" style="flex-basis:100%">${esc(spec.cap)}</p>` : ''}
      </figcaption>` : ''}
    </figure>`;
  }
  function wirePlates(root) {
    $$('[data-plate]', root).forEach((fig) => {
      if (fig._wired) return; fig._wired = true;
      const spec = fig._spec; if (!spec) return;
      let mode = spec.mode || 'tone', ov = true;
      const draw = () => { $('.plate', fig).innerHTML = renderSpec(Object.assign({}, spec, { mode, overlays: ov ? spec.overlays : [] })); };
      $$('[data-mode]', fig).forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; $$('[data-mode]', fig).forEach((x) => x.setAttribute('aria-pressed', x === b)); draw(); }));
      const ob = $('[data-ov]', fig);
      if (ob) ob.addEventListener('click', () => { ov = !ov; ob.setAttribute('aria-pressed', ov); draw(); });
    });
  }
  // attach spec objects after innerHTML (plates are rendered in order)
  function bindPlates(root, specs) { $$('[data-plate]', root).forEach((f, i) => { if (!f._spec) f._spec = specs[i]; }); wirePlates(root); }

  /* ---------- demo player ---------- */
  function demo(container, d, onStep) {
    let i = 0;
    const base = { scene: d.scene, params: d.params };
    container.innerHTML = `<div class="plate" data-demo-plate></div>
      <div class="plate-bar"><span class="plate-no" data-demo-no></span><span class="spacer"></span>
      <button type="button" class="btn btn-sm" data-demo-prev>${icon('left')}Back</button>
      <button type="button" class="btn btn-sm btn-primary" data-demo-next>Next step${icon('right')}</button></div>`;
    const list = document.createElement('div');
    list.className = 'demo-steps';
    list.setAttribute('role', 'list');
    list.innerHTML = d.steps.map((s, k) => `<button type="button" role="listitem" data-k="${k}"><div><b>${esc(s.t)}</b><span>${esc(s.d)}</span></div></button>`).join('');
    function show(k, animate = true) {
      const prevShow = i === k ? [] : (d.steps[i].show || []);
      i = k;
      const s = d.steps[i];
      const fresh = (s.show || []).filter((x) => !prevShow.includes(x)).concat(['ov']);
      const svg = S.render(base.scene, { params: s.params !== undefined ? s.params : base.params, show: s.show === null ? null : s.show, line: s.line || [], mode: s.mode || 'tone', overlays: s.ov || [], anim: animate && !matchMedia('(prefers-reduced-motion: reduce)').matches, fresh, title: s.t });
      $('[data-demo-plate]', container).innerHTML = svg;
      // measure overlay lines for the draw-in effect
      $$('.drawin', container).forEach((el) => { try { const len = el.getTotalLength ? el.getTotalLength() : 1200; el.style.setProperty('--len', Math.ceil(len)); } catch (e) { /* ignore */ } });
      $('[data-demo-no]', container).textContent = 'Step ' + (i + 1) + ' of ' + d.steps.length;
      $$('button[data-k]', list).forEach((b) => { if (+b.dataset.k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      $('[data-demo-prev]', container).disabled = i === 0;
      const nb = $('[data-demo-next]', container);
      nb.innerHTML = i === d.steps.length - 1 ? 'Replay' + icon('refresh') : 'Next step' + icon('right');
      onStep && onStep(i, d.steps.length);
    }
    $('[data-demo-prev]', container).addEventListener('click', () => show(Math.max(0, i - 1)));
    $('[data-demo-next]', container).addEventListener('click', () => show(i === d.steps.length - 1 ? 0 : i + 1));
    list.addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (b) show(+b.dataset.k); });
    show(0, false);
    return list;
  }

  /* ---------- geometry ---------- */
  function svgPoint(svg, evt) {
    const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse()); return { x: p.x, y: p.y };
  }
  function inPoly(x, y, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  function area(poly) { let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]); return Math.abs(a / 2); }
  const dPath = (a) => 'M' + a.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';

  /* ---------- exercises ---------- */
  function resultBox(ok, title, text, extra = '') {
    requestAnimationFrame(() => { const r = document.querySelector('.ex-result:last-of-type'); if (r && r.getBoundingClientRect().bottom > innerHeight - 80) r.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    return `<div class="ex-result ${ok === null ? 'info' : ok ? 'good' : 'bad'}" role="status">
      <h4>${icon(ok === null ? 'info' : ok ? 'check' : 'x')}${esc(title)}</h4><p>${esc(text)}</p>${extra}</div>`;
  }

  function exercise(container, ex, done, inherit = {}) {
    const scene = ex.scene || inherit.scene;
    const params = ex.params || inherit.params;
    let first = true;
    const finish = (ok) => { done && done({ correct: ok, firstTry: first && ok, firstAttemptCorrect: first ? ok : undefined }); first = false; };
    const T = ex.type;

    if (T === 'line' || T === 'point') {
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p>
        <div class="ex"><div class="plate" data-stage></div></div>
        <div class="ex-bar"><span class="tiny">${T === 'line' ? 'Click or tap on the picture. Keyboard: arrow keys move the marker, Enter checks.' : 'Click or tap the spot. Keyboard: arrow keys move the marker, Enter checks.'}</span></div><div data-out></div>`;
      const stage = $('[data-stage]', container);
      let mark = null;
      const draw = (reveal) => {
        const ov = (reveal || []).slice();
        if (mark) ov.push(T === 'line' ? { t: 'line', pts: [[0, mark.y], [800, mark.y]], w: 3 } : { t: 'mark', x: mark.x, y: mark.y, label: 'Your answer' });
        stage.innerHTML = S.render(scene, { params, overlays: ov, title: ex.prompt });
        const svg = $('svg', stage);
        svg.setAttribute('tabindex', '0');
        svg.setAttribute('aria-label', ex.prompt + ' Use arrow keys to move the marker and Enter to check.');
        svg.addEventListener('click', (e) => { const p = svgPoint(svg, e); mark = { x: p.x, y: p.y }; check(); });
        svg.addEventListener('keydown', (e) => {
          const m = mark || { x: 400, y: 250 };
          const st = e.shiftKey ? 40 : 10;
          if (e.key === 'ArrowUp') m.y -= st; else if (e.key === 'ArrowDown') m.y += st; else if (e.key === 'ArrowLeft') m.x -= st; else if (e.key === 'ArrowRight') m.x += st; else if (e.key === 'Enter') { mark = m; check(); return; } else return;
          e.preventDefault(); mark = { x: clamp(m.x, 0, 800), y: clamp(m.y, 0, 500) }; draw(); $('svg', stage).focus();
        });
      };
      const check = () => {
        const ok = T === 'line' ? Math.abs(mark.y - ex.answer) <= ex.tol : Math.hypot(mark.x - ex.answer[0], mark.y - ex.answer[1]) <= ex.tol;
        draw(ex.reveal);
        $('[data-out]', container).innerHTML = resultBox(ok, ok ? 'Correct' : 'Not quite', ok ? ex.right : ex.wrong, ok ? '' : `<div class="row"><button type="button" class="btn btn-sm" data-retry>Try again</button><button type="button" class="btn btn-sm btn-quiet" data-show>Show me</button></div>`);
        const r = $('[data-retry]', container); if (r) r.addEventListener('click', () => { mark = null; draw(); $('[data-out]', container).innerHTML = ''; });
        const sh = $('[data-show]', container); if (sh) sh.addEventListener('click', () => { mark = null; draw(ex.reveal); $('[data-out]', container).innerHTML = resultBox(null, 'Here it is', ex.right); finish(false); });
        finish(ok);
      };
      draw();
      return;
    }

    if (T === 'regions') {
      const meta = S.meta(scene, params);
      const keys = Object.keys(ex.key);
      const assigned = {};
      let sel = ex.labels[0], checked = false;
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p>
        <div class="label-pick" role="group" aria-label="Labels">${ex.labels.map((l, i) => `<button type="button" data-l="${esc(l)}" aria-pressed="${i === 0}"><i style="background:${REGION_COLORS[i]}"></i>${esc(l)}</button>`).join('')}</div>
        <div class="ex"><div class="plate" data-stage></div></div>
        <div class="ex-bar"><span class="tiny" data-count></span><span class="spacer"></span><button type="button" class="btn btn-sm" data-reset>Clear</button><button type="button" class="btn btn-sm btn-primary" data-check disabled>Check labels</button></div>
        <details class="tiny"><summary>Keyboard alternative</summary><div class="stack" style="gap:6px;margin-top:8px">${keys.map((k) => `<label class="row small"><span style="min-width:140px">${esc(meta.regions[k].label)}</span><select data-kb="${k}"><option value="">Choose…</option>${ex.labels.map((l) => `<option>${esc(l)}</option>`).join('')}</select></label>`).join('')}</div></details>
        <div data-out></div>`;
      const stage = $('[data-stage]', container);
      const draw = () => {
        let extra = '';
        keys.forEach((k) => {
          const rg = meta.regions[k]; const lab = assigned[k];
          const hit = `<path d="${dPath(rg.poly)}" fill="transparent" data-r="${k}" style="cursor:pointer"/>`;
          if (lab) {
            const ci = ex.labels.indexOf(lab);
            const ok = ex.key[k] === lab;
            const col = checked ? (ok ? '#2E7650' : '#A63A2E') : REGION_COLORS[ci];
            const c = S.centroid(rg.poly);
            extra += `<path d="${dPath(rg.poly)}" fill="${col}" fill-opacity=".32" stroke="${col}" stroke-width="2.5" pointer-events="none"/>` +
              `<text x="${c[0].toFixed(0)}" y="${c[1].toFixed(0)}" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-size="17" font-weight="700" fill="${col}" stroke="#F7F6F2" stroke-width="4" paint-order="stroke" pointer-events="none">${esc(checked ? (ok ? '✓ ' : '✗ ') + lab : lab)}</text>`;
          }
          extra += hit;
        });
        stage.innerHTML = S.render(scene, { params, extra, title: ex.prompt });
        const n = Object.keys(assigned).length;
        $('[data-count]', container).textContent = n + ' of ' + keys.length + ' areas labelled';
        $('[data-check]', container).disabled = n < keys.length || checked;
      };
      const assign = (k, lab) => { if (checked) return; if (lab) assigned[k] = lab; else delete assigned[k]; draw(); const s = $(`[data-kb="${k}"]`, container); if (s) s.value = lab || ''; };
      stage.addEventListener('click', (e) => {
        const svg = $('svg', stage); const p = svgPoint(svg, e);
        const hits = keys.filter((k) => inPoly(p.x, p.y, meta.regions[k].poly)).sort((a, b) => area(meta.regions[a].poly) - area(meta.regions[b].poly));
        if (hits[0]) assign(hits[0], sel);
      });
      $$('[data-l]', container).forEach((b) => b.addEventListener('click', () => { sel = b.dataset.l; $$('[data-l]', container).forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
      $$('[data-kb]', container).forEach((s) => s.addEventListener('change', () => assign(s.dataset.kb, s.value)));
      $('[data-reset]', container).addEventListener('click', () => { checked = false; keys.forEach((k) => delete assigned[k]); $$('[data-kb]', container).forEach((s) => (s.value = '')); draw(); $('[data-out]', container).innerHTML = ''; });
      $('[data-check]', container).addEventListener('click', () => {
        checked = true;
        const right = keys.filter((k) => ex.key[k] === assigned[k]).length;
        const ok = right === keys.length;
        draw();
        $('[data-out]', container).innerHTML = resultBox(ok, ok ? 'All correct' : right + ' of ' + keys.length + ' correct', ex.explain, ok ? '' : '<div class="row"><button type="button" class="btn btn-sm" data-retry>Try again</button></div>');
        const r = $('[data-retry]', container); if (r) r.addEventListener('click', () => { checked = false; draw(); $('[data-out]', container).innerHTML = ''; });
        finish(ok);
      });
      draw();
      return;
    }

    if (T === 'choose') {
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p>
        <div class="options-grid" role="group" aria-label="Options">${ex.options.map((o, i) => `<button type="button" class="opt-card" data-i="${i}" aria-pressed="false">${renderSpec(o, { rough: false })}<span class="cap">${esc(o.cap)}</span></button>`).join('')}</div><div data-out></div>`;
      let locked = false;
      $$('.opt-card', container).forEach((b) => b.addEventListener('click', () => {
        if (locked) return;
        const i = +b.dataset.i; const ok = i === ex.answer;
        $$('.opt-card', container).forEach((x) => { x.setAttribute('aria-pressed', x === b); x.classList.remove('right', 'wrong'); });
        b.classList.add(ok ? 'right' : 'wrong');
        if (ok) { locked = true; }
        $('[data-out]', container).innerHTML = resultBox(ok, ok ? 'Correct' : 'Not this one', ok ? ex.explain : 'Look again. Think about the principle from this lesson, then choose another.', ok ? '' : '<div class="row"><button type="button" class="btn btn-sm btn-quiet" data-show>Show me</button></div>');
        const sh = $('[data-show]', container); if (sh) sh.addEventListener('click', () => { locked = true; $$('.opt-card', container)[ex.answer].classList.add('right'); $('[data-out]', container).innerHTML = resultBox(null, 'The answer is ' + ex.options[ex.answer].cap, ex.explain); finish(false); });
        finish(ok);
      }));
      return;
    }

    if (T === 'order') {
      let items = ex.items.slice();
      let checked = false;
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p><ol class="order-list" data-list></ol>
        <div class="ex-bar"><span class="spacer"></span><button type="button" class="btn btn-sm btn-primary" data-check>Check order</button></div><div data-out></div>`;
      const draw = () => {
        $('[data-list]', container).innerHTML = items.map((it, i) => `<li data-id="${it.id}"><span class="n">${i + 1}</span>${it.scene ? `<div>${renderSpec(it, { rough: false })}</div><span class="small">${esc(it.text || '')}</span>` : `<span></span><span>${esc(it.text)}</span>`}
          <span class="mv"><button type="button" data-up="${i}" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button><button type="button" data-dn="${i}" aria-label="Move down" ${i === items.length - 1 ? 'disabled' : ''}>${icon('down')}</button></span></li>`).join('');
        if (items[0] && !items[0].scene) $$('.order-list li', container).forEach((li) => (li.style.gridTemplateColumns = '28px 0 minmax(0,1fr) auto'));
      };
      $('[data-list]', container).addEventListener('click', (e) => {
        const u = e.target.closest('[data-up]'), d = e.target.closest('[data-dn]');
        if (checked) return;
        if (u) { const i = +u.dataset.up; [items[i - 1], items[i]] = [items[i], items[i - 1]]; draw(); $(`[data-up="${i - 1}"]`, container)?.focus(); }
        if (d) { const i = +d.dataset.dn; [items[i + 1], items[i]] = [items[i], items[i + 1]]; draw(); $(`[data-dn="${i + 1}"]`, container)?.focus(); }
      });
      $('[data-check]', container).addEventListener('click', () => {
        const ok = items.every((it, i) => it.id === ex.answer[i]);
        $('[data-out]', container).innerHTML = resultBox(ok, ok ? 'Correct order' : 'Not quite', ok ? ex.explain : 'Some items are out of place. Rearrange and check again.', ok ? '' : '<div class="row"><button type="button" class="btn btn-sm btn-quiet" data-show>Show me</button></div>');
        if (ok) checked = true;
        const sh = $('[data-show]', container); if (sh) sh.addEventListener('click', () => { items = ex.answer.map((id) => ex.items.find((x) => x.id === id)); checked = true; draw(); $('[data-out]', container).innerHTML = resultBox(null, 'The order', ex.explain); finish(false); });
        finish(ok);
      });
      draw();
      return;
    }

    if (T === 'values') {
      const meta = S.meta(scene, params);
      const probes = meta.probes || [];
      const pick = {};
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p>
        <div class="plate ex-fit">${S.render(scene, { params, overlays: [{ t: 'probe' }], title: 'Scene with marked spots' })}</div>
        <div class="stack" style="gap:var(--s3)">${probes.map((p, i) => `<div class="row" style="gap:var(--s3)"><b style="width:24px;font-family:var(--font-display);font-size:var(--t-22)">${String.fromCharCode(65 + i)}</b><span class="small muted" style="width:120px">${esc(p.label)}</span>
          <div class="swatches" role="group" aria-label="Value for ${String.fromCharCode(65 + i)}">${S.VAL.map((c, v) => `<button type="button" data-p="${i}" data-v="${v}" aria-pressed="false" aria-label="${v + 1}" style="background:${c};color:${v > 4 ? '#F7F6F2' : '#2A2926'}">${v + 1}</button>`).join('')}</div><span data-res="${i}" class="small"></span></div>`).join('')}</div>
        <div class="ex-bar"><span class="spacer"></span><button type="button" class="btn btn-sm btn-primary" data-check disabled>Check values</button></div><div data-out></div>`;
      container.addEventListener('click', (e) => {
        const b = e.target.closest('[data-p]'); if (!b) return;
        const i = +b.dataset.p; pick[i] = +b.dataset.v;
        $$(`[data-p="${i}"]`, container).forEach((x) => x.setAttribute('aria-pressed', x === b));
        $('[data-check]', container).disabled = Object.keys(pick).length < probes.length;
      });
      $('[data-check]', container).addEventListener('click', () => {
        let right = 0;
        probes.forEach((p, i) => { const ok = Math.abs(pick[i] - p.v) <= 1; if (ok) right++; $(`[data-res="${i}"]`, container).innerHTML = ok ? `<span style="color:var(--good)">✓ about ${p.v + 1}</span>` : `<span style="color:var(--bad)">✗ closer to ${p.v + 1}</span>`; });
        const ok = right >= probes.length - 1;
        $('[data-out]', container).innerHTML = resultBox(ok, right + ' of ' + probes.length + ' within one step', ex.explain);
        finish(ok);
      });
      return;
    }

    if (T === 'dial') {
      let ang = 90, set = false;
      container.innerHTML = `<p class="prose" style="font-size:var(--t-18)">${esc(ex.prompt)}</p>
        <div class="row" style="align-items:flex-start;gap:var(--s5)"><div class="plate ex-fit" style="flex:1 1 320px;min-width:0">${S.render(scene, { params, title: 'Scene' })}</div>
        <div class="stack" style="align-items:center;gap:var(--s2)"><svg class="dial" viewBox="0 0 180 180" tabindex="0" role="slider" aria-label="Light direction" aria-valuemin="0" aria-valuemax="359" aria-valuenow="90" data-dial></svg><span class="tiny">Drag, or use arrow keys</span>
        <button type="button" class="btn btn-sm btn-primary" data-check disabled>Check direction</button></div></div><div data-out></div>`;
      const dial = $('[data-dial]', container);
      const names = ['right', 'lower right', 'below', 'lower left', 'left', 'upper left', 'above', 'upper right'];
      const drawDial = () => {
        const r = (ang * Math.PI) / 180, x = 90 + Math.cos(r) * 62, y = 90 + Math.sin(r) * 62;
        dial.innerHTML = `<circle cx="90" cy="90" r="80" fill="var(--sheet)" stroke="var(--rule-strong)" stroke-width="1.5"/><circle cx="90" cy="90" r="4" fill="var(--ink)"/>
          ${set ? `<line x1="${x}" y1="${y}" x2="${90 + Math.cos(r) * 14}" y2="${90 + Math.sin(r) * 14}" stroke="var(--blue)" stroke-width="3" stroke-linecap="round"/><path d="M${90 + Math.cos(r) * 14} ${90 + Math.sin(r) * 14} l${Math.cos(r + 2.6) * 12} ${Math.sin(r + 2.6) * 12} M${90 + Math.cos(r) * 14} ${90 + Math.sin(r) * 14} l${Math.cos(r - 2.6) * 12} ${Math.sin(r - 2.6) * 12}" stroke="var(--blue)" stroke-width="3" stroke-linecap="round" fill="none"/>
          <circle cx="${x}" cy="${y}" r="11" fill="var(--sheet)" stroke="var(--blue)" stroke-width="2.5"/>` : '<text x="90" y="60" text-anchor="middle" font-size="12" fill="var(--ink-3)" font-family="Schibsted Grotesk, Arial">Set the sun</text>'}`;
        dial.setAttribute('aria-valuenow', Math.round(ang));
        dial.setAttribute('aria-valuetext', 'Light from the ' + names[Math.round(((ang % 360) + 360) % 360 / 45) % 8]);
        $('[data-check]', container).disabled = !set;
      };
      const setFrom = (e) => { const b = dial.getBoundingClientRect(); ang = (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI; ang = (ang + 360) % 360; set = true; drawDial(); };
      let drag = false;
      dial.addEventListener('pointerdown', (e) => { drag = true; dial.setPointerCapture(e.pointerId); setFrom(e); });
      dial.addEventListener('pointermove', (e) => drag && setFrom(e));
      dial.addEventListener('pointerup', () => (drag = false));
      dial.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ang = (ang + 15) % 360; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ang = (ang + 345) % 360; else return; e.preventDefault(); set = true; drawDial(); });
      $('[data-check]', container).addEventListener('click', () => {
        const diff = Math.abs(((ang - ex.answer + 540) % 360) - 180);
        const ok = diff <= ex.tol;
        $('[data-out]', container).innerHTML = resultBox(ok, ok ? 'Correct' : 'Not quite', ok ? ex.explain : 'Look at which sides of the forms are shaded and which way the cast shadows point. The light is on the opposite side.', ok ? '' : '<div class="row"><button type="button" class="btn btn-sm btn-quiet" data-show>Show me</button></div>');
        const sh = $('[data-show]', container); if (sh) sh.addEventListener('click', () => { ang = ex.answer; set = true; drawDial(); $('[data-out]', container).innerHTML = resultBox(null, 'Light from the ' + names[Math.round(ex.answer / 45) % 8], ex.explain); finish(false); });
        finish(ok);
      });
      drawDial();
      return;
    }

    if (T === 'breakdown') {
      let k = 0, allFirst = true;
      const results = [];
      container.innerHTML = `<div class="row" data-bd-steps style="gap:6px"></div><div data-bd></div><div class="ex-bar"><span class="spacer"></span><button type="button" class="btn btn-sm btn-primary" data-bd-next hidden>Next question${icon('right')}</button></div>`;
      const nextBtn = $('[data-bd-next]', container);
      const run = () => {
        $('[data-bd-steps]', container).innerHTML = ex.steps.map((s, i) => `<span class="chip ${i < k ? 'done' : i === k ? 'active' : ''}">${i < k ? icon('check') : ''}${['H', 'L', 'L', 'S', 'I'][i] ? esc(s.prompt.split(':')[0]) : i + 1}</span>`).join('');
        nextBtn.hidden = true;
        exercise($('[data-bd]', container), ex.steps[k], (r) => {
          if (r.firstAttemptCorrect === false) allFirst = false;
          if (r.correct !== undefined && results[k] === undefined) results[k] = r.correct;
          nextBtn.hidden = false;
          nextBtn.innerHTML = k === ex.steps.length - 1 ? 'Finish breakdown' + icon('check') : 'Next question' + icon('right');
        }, { scene, params });
      };
      nextBtn.addEventListener('click', () => {
        if (k < ex.steps.length - 1) { k++; run(); return; }
        const right = results.filter(Boolean).length;
        container.innerHTML = resultBox(right >= ex.steps.length - 1, 'Breakdown complete: ' + right + ' of ' + ex.steps.length + ' right first time', 'This is the analysis you will run on every new reference. Reference Mode does the same with your own photos.');
        done && done({ correct: right >= ex.steps.length - 1, firstTry: allFirst });
      });
      run();
    }
  }

  /* ---------- sketch pad ---------- */
  /* Graphite grain: strokes are painted with a speckled pattern so they pick up "paper tooth"
     like a real pencil instead of a flat digital line. */
  let grainCanvas = null;
  function grain(ctx) {
    try {
      if (!grainCanvas) {
        grainCanvas = document.createElement('canvas'); grainCanvas.width = grainCanvas.height = 96;
        const g = grainCanvas.getContext('2d'); const im = g.createImageData(96, 96);
        for (let i = 0; i < im.data.length; i += 4) { const n = Math.random(); im.data[i] = 42; im.data[i + 1] = 41; im.data[i + 2] = 38; im.data[i + 3] = n < 0.18 ? 60 : n < 0.4 ? 170 : 255; }
        g.putImageData(im, 0, 0);
      }
      return ctx.createPattern(grainCanvas, 'repeat');
    } catch (e) { return null; }
  }
  const GRADES = { '2H': { a: 0.28, w: 2.2 }, HB: { a: 0.55, w: 3 }, '4B': { a: 0.8, w: 4.6 }, '6B': { a: 0.95, w: 7 } };
  function pad(container, opts = {}) {
    const key = 'ld.pad.' + (opts.key || 'free');
    const Wc = 1600, Hc = 1000;
    let strokes = store.get(key, []) || [];
    let tool = 'HB', guides = { thirds: false, horizon: opts.horizon ?? null }, cur = null, showRef = false;
    container.innerHTML = `<div class="pad">
      <div class="pad-tools" role="toolbar" aria-label="Drawing tools">
        <div class="seg" role="group" aria-label="Pencil">${Object.keys(GRADES).map((g) => `<button type="button" data-tool="${g}" aria-pressed="${g === tool}">${g}</button>`).join('')}<button type="button" data-tool="eraser" aria-pressed="false" aria-label="Eraser">${icon('eraser')}</button></div>
        <button type="button" class="icon-btn" data-undo aria-label="Undo">${icon('undo')}</button>
        <button type="button" class="btn btn-sm btn-quiet" data-g="thirds" aria-pressed="false">${icon('grid')}Thirds</button>
        <button type="button" class="btn btn-sm btn-quiet" data-g="horizon" aria-pressed="${guides.horizon != null}">Horizon guide</button>
        ${opts.ref ? `<button type="button" class="btn btn-sm btn-quiet" data-ref aria-pressed="false">${icon('image')}Reference</button>` : ''}
        <span class="spacer"></span>
        <button type="button" class="btn btn-sm btn-quiet" data-clear aria-label="Clear the sketch">${icon('trash')}<span>Clear</span></button>
      </div>
      <div class="pad-surface" data-surface><canvas data-main width="${Wc}" height="${Hc}" aria-label="Drawing surface"></canvas><canvas data-live width="${Wc}" height="${Hc}" style="pointer-events:none"></canvas><canvas class="guides" data-guides width="${Wc}" height="${Hc}"></canvas>
        ${opts.ref ? `<div data-refbox hidden style="position:absolute;right:8px;top:8px;width:36%;border:1px solid var(--plate-edge);box-shadow:var(--lift-plate);background:var(--plate);pointer-events:none">${opts.ref}</div>` : ''}</div>
      <div class="row tiny" data-hz-row ${guides.horizon == null ? 'hidden' : ''}><label for="${key}-hz">Horizon height</label><input id="${key}-hz" type="range" min="10" max="90" value="${guides.horizon ?? 60}" data-hz style="flex:1;accent-color:var(--ink)"></div>
      <p class="tiny">Draws with a mouse, finger or stylus (pressure-sensitive where supported). Your sketch is kept on this device until you clear it.</p>
    </div>`;
    const main = $('[data-main]', container), live = $('[data-live]', container), gc = $('[data-guides]', container);
    const mx = main.getContext('2d'), lx = live.getContext('2d'), gx = gc.getContext('2d');
    const surface = $('[data-surface]', container);
    const pos = (e) => { const b = main.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * Wc, ((e.clientY - b.top) / b.height) * Hc, e.pressure && e.pointerType !== 'mouse' ? e.pressure : 0.5]; };
    function paintStroke(ctx, s, opaque) {
      const g = GRADES[s.tool] || GRADES.HB;
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (s.tool === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = '#000'; }
      else { ctx.strokeStyle = grain(ctx) || '#2A2926'; }
      for (let i = 1; i < s.pts.length; i++) {
        const [x0, y0, p0] = s.pts[i - 1], [x1, y1, p1] = s.pts[i];
        ctx.lineWidth = s.tool === 'eraser' ? 26 : g.w * (0.55 + (p0 + p1) * 0.6);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      if (s.pts.length === 1) { ctx.beginPath(); ctx.arc(s.pts[0][0], s.pts[0][1], (s.tool === 'eraser' ? 13 : g.w * 0.6), 0, 7); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); }
      ctx.restore();
    }
    function composite(s) {
      if (s.tool === 'eraser') { paintStroke(mx, s); return; }
      lx.clearRect(0, 0, Wc, Hc); paintStroke(lx, s);
      mx.save(); mx.globalAlpha = (GRADES[s.tool] || GRADES.HB).a; mx.drawImage(live, 0, 0); mx.restore();
      lx.clearRect(0, 0, Wc, Hc);
    }
    function redraw() { mx.clearRect(0, 0, Wc, Hc); strokes.forEach(composite); }
    function drawGuides() {
      gx.clearRect(0, 0, Wc, Hc);
      gx.strokeStyle = 'rgba(62,143,199,.7)'; gx.lineWidth = 2; gx.setLineDash([14, 10]);
      if (guides.thirds) { [Wc / 3, (2 * Wc) / 3].forEach((x) => { gx.beginPath(); gx.moveTo(x, 0); gx.lineTo(x, Hc); gx.stroke(); }); [Hc / 3, (2 * Hc) / 3].forEach((y) => { gx.beginPath(); gx.moveTo(0, y); gx.lineTo(Wc, y); gx.stroke(); }); }
      if (guides.horizon != null) { const y = (guides.horizon / 100) * Hc; gx.setLineDash([]); gx.lineWidth = 3; gx.beginPath(); gx.moveTo(0, y); gx.lineTo(Wc, y); gx.stroke(); }
    }
    let saveT;
    const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => { if (!store.set(key, strokes)) { /* storage full: keep in memory */ } }, 400); };
    main.addEventListener('pointerdown', (e) => {
      e.preventDefault(); main.setPointerCapture(e.pointerId);
      cur = { tool, pts: [pos(e)] };
      live.style.opacity = tool === 'eraser' ? 0 : (GRADES[tool] || GRADES.HB).a;
    });
    main.addEventListener('pointermove', (e) => {
      if (!cur) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      evs.forEach((ev) => cur.pts.push(pos(ev)));
      if (cur.tool === 'eraser') { redraw(); paintStroke(mx, cur); }
      else { lx.clearRect(0, 0, Wc, Hc); paintStroke(lx, cur); }
    });
    const end = () => {
      if (!cur) return;
      cur.pts = cur.pts.map((p) => [Math.round(p[0]), Math.round(p[1]), Math.round(p[2] * 100) / 100]);
      strokes.push(cur);
      if (cur.tool === 'eraser') redraw(); else composite(cur);
      live.style.opacity = 1; cur = null; persist(); opts.onChange && opts.onChange(strokes.length);
    };
    main.addEventListener('pointerup', end); main.addEventListener('pointercancel', end);
    container.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tool]');
      if (t) { tool = t.dataset.tool; $$('[data-tool]', container).forEach((x) => x.setAttribute('aria-pressed', x === t)); }
      if (e.target.closest('[data-undo]')) { strokes.pop(); redraw(); persist(); opts.onChange && opts.onChange(strokes.length); }
      const g = e.target.closest('[data-g]');
      if (g) {
        if (g.dataset.g === 'thirds') guides.thirds = !guides.thirds;
        else { guides.horizon = guides.horizon == null ? +$('[data-hz]', container).value : null; $('[data-hz-row]', container).hidden = guides.horizon == null; }
        g.setAttribute('aria-pressed', g.dataset.g === 'thirds' ? guides.thirds : guides.horizon != null);
        drawGuides();
      }
      const rb = e.target.closest('[data-ref]');
      if (rb) { showRef = !showRef; rb.setAttribute('aria-pressed', showRef); $('[data-refbox]', container).hidden = !showRef; }
      const cl = e.target.closest('[data-clear]');
      if (cl) {
        const lab = cl.querySelector('span');
        if (cl.dataset.confirm) { strokes = []; redraw(); persist(); lab.textContent = 'Clear'; delete cl.dataset.confirm; opts.onChange && opts.onChange(0); }
        else { cl.dataset.confirm = '1'; lab.textContent = 'Tap again to clear'; setTimeout(() => { if (cl.isConnected) { lab.textContent = 'Clear'; delete cl.dataset.confirm; } }, 3000); }
      }
    });
    $('[data-hz]', container).addEventListener('input', (e) => { guides.horizon = +e.target.value; drawGuides(); });
    container.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); strokes.pop(); redraw(); persist(); } });
    redraw(); drawGuides();
    return {
      count: () => strokes.length,
      toCanvas() { const c = document.createElement('canvas'); c.width = Wc; c.height = Hc; const x = c.getContext('2d'); x.fillStyle = '#F7F6F2'; x.fillRect(0, 0, Wc, Hc); x.drawImage(main, 0, 0); return c; },
    };
  }

  window.UI = { plate, bindPlates, wirePlates, renderSpec, demo, exercise, pad, resultBox, strokeSample };
})();
