/* Core: helpers, icons, state, persistence, capabilities, personalization. */
(function () {
  const C = window.Course;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const uidgen = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- icons (one stroke family: 1.75px, round joins) ---------- */
  const P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5.5h4V20"/>',
    course: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
    tree: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><circle cx="12" cy="12.5" r="2"/><path d="M12 7v3.5M10.6 14 7.3 17.4M13.4 14l3.3 3.4"/>',
    pencil: '<path d="M15.5 4.5 19.5 8.5 8.5 19.5H4.5v-4z"/><path d="M13 7l4 4"/>',
    reference: '<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="m3.5 16 5-5 4 4 2.5-2.5 5.5 5.5"/><circle cx="15.5" cy="9" r="1.5"/>',
    book: '<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/><path d="M9 8h5"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V16"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    play: '<path d="M7 5v14l12-7z"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    eraser: '<path d="m7 20-3.5-3.5a1.5 1.5 0 0 1 0-2.1L13.9 4a1.5 1.5 0 0 1 2.1 0L20 8a1.5 1.5 0 0 1 0 2.1L10.5 19.5"/><path d="M7 20h13M9 10.5l5 5"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    grid: '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.2"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.2h-4.2"/>',
    flip: '<path d="M12 3v18"/><path d="M8.5 7 4 12l4.5 5z"/><path d="M15.5 7 20 12l-4.5 5z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6"/>',
    layers: '<path d="m12 3.5 9 4.5-9 4.5L3 8z"/><path d="m3 12.5 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="1.5"/><path d="m16 10.5 5-3v9l-5-3"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5.5c0 .3-.2.5-.5.5h-13a.5.5 0 0 1-.5-.5v-13c0-.3.2-.5.5-.5H10"/>',
    feedback: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4h13c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5H10l-4.5 4v-4h0c-.8 0-1.5-.7-1.5-1.5z"/><path d="M8.5 9h7M8.5 12h4"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="m3.5 15.5 4.5-4.5 4 4 3-3 5.5 5.5"/>',
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- storage helpers (never throw) ---------- */
  const store = {
    get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  /* ---------- state ---------- */
  const KEY = 'ld.state.v1';
  const blank = () => ({ v: 1, updatedAt: 0, startedAt: Date.now(), lessons: {}, drawings: [], evidence: [], drills: {}, settings: { theme: 'system', openAll: false }, last: null });
  let state = Object.assign(blank(), store.get(KEY, {}) || {});
  state.settings = Object.assign(blank().settings, state.settings || {});

  const listeners = new Set();
  let dbRef = null, remoteTimer = null;
  const caps = { sample: null, db: null, user: null, assets: null, imageOk: false, uid: null, synced: false, checked: false };

  function lessonState(id) {
    if (!state.lessons[id]) state.lessons[id] = { seen: false, tried: false, triedFirst: null, guided: [], submitted: false, reviewed: false, passed: false, cpScore: null, stage: 0, done: false, doneAt: null };
    return state.lessons[id];
  }
  function save(opts = {}) {
    state.updatedAt = Date.now();
    store.set(KEY, state);
    if (!opts.quiet) listeners.forEach((fn) => fn());
    scheduleRemote();
  }
  function scheduleRemote() {
    if (!dbRef) return;
    clearTimeout(remoteTimer);
    remoteTimer = setTimeout(async () => {
      try { await dbRef.set({ state: JSON.stringify(state), updatedAt: state.updatedAt }); caps.synced = true; } catch (e) { caps.synced = false; }
      listeners.forEach((fn) => fn('sync'));
    }, 1200);
  }

  /* ---------- capabilities (all optional; the app works without them) ---------- */
  async function initCaps() {
    const cl = window.claude;
    if (!cl || typeof cl.use !== 'function') { caps.checked = true; listeners.forEach((fn) => fn('caps')); return; }
    const [sample, db, user, assets] = await Promise.all(['sample', 'db', 'user', 'assets'].map((n) => cl.use(n).catch(() => null)));
    Object.assign(caps, { sample, db, user, assets });
    if (sample) { try { const lim = await sample.limits(); caps.imageOk = !!(lim && lim.images); caps.imageLimits = lim && lim.images; } catch (e) { caps.imageOk = false; } }
    if (db && user) {
      try {
        const uid = await user.id();
        caps.uid = uid;
        if (uid) {
          dbRef = db.doc('data/users/' + uid + '/progress');
          const snap = await dbRef.get();
          if (snap.exists) {
            const d = snap.data();
            const remote = d && d.state ? JSON.parse(d.state) : null;
            if (remote && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
              state = Object.assign(blank(), remote);
              state.settings = Object.assign(blank().settings, state.settings || {});
              store.set(KEY, state);
            } else scheduleRemote();
          } else scheduleRemote();
          caps.synced = true;
        }
      } catch (e) { dbRef = null; }
    }
    caps.checked = true;
    listeners.forEach((fn) => fn('caps'));
  }

  /* ---------- images ---------- */
  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }
  async function fileToCanvas(file, max = 1600) {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      return c;
    } finally { URL.revokeObjectURL(url); }
  }
  function canvasTo(c, max, q = 0.82) {
    const s = Math.min(1, max / Math.max(c.width, c.height));
    const o = document.createElement('canvas'); o.width = Math.round(c.width * s); o.height = Math.round(c.height * s);
    const x = o.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, o.width, o.height); x.drawImage(c, 0, 0, o.width, o.height);
    return o;
  }
  const toBlob = (c, q = 0.85) => new Promise((res) => c.toBlob((b) => res(b), 'image/jpeg', q));

  /* Store a drawing: asset store when available, else a compact local copy. */
  async function saveDrawing(canvas, meta) {
    const id = uidgen();
    let src = null, assetId = null;
    const big = canvasTo(canvas, 1600);
    if (caps.assets) {
      try { const b = await toBlob(big, 0.86); const r = await caps.assets.upload(b); src = r.url; assetId = r.id; } catch (e) { src = null; }
    }
    if (!src) {
      const small = canvasTo(canvas, 720).toDataURL('image/jpeg', 0.72);
      if (store.set('ld.img.' + id, small)) src = 'local:' + id; else src = small; // last resort: keep in memory only
    }
    const rec = Object.assign({ id, at: Date.now(), src, assetId, feedback: null, self: null }, meta);
    state.drawings.unshift(rec);
    save();
    return { rec, blob: await toBlob(big, 0.86) };
  }
  function drawingSrc(d) {
    if (!d || !d.src) return '';
    if (d.src.startsWith('local:')) return store.get('ld.img.' + d.src.slice(6), '') || '';
    return d.src;
  }
  async function deleteDrawing(id) {
    const d = state.drawings.find((x) => x.id === id);
    if (!d) return;
    if (d.src && d.src.startsWith('local:')) store.del('ld.img.' + d.src.slice(6));
    if (d.assetId && caps.assets) { try { await caps.assets.delete(d.assetId); } catch (e) { /* keep going */ } }
    state.drawings = state.drawings.filter((x) => x.id !== id);
    save();
  }

  /* ---------- progress + personalization ---------- */
  function addEvidence(area, score, src, lessonId) {
    if (!area || score == null || isNaN(score)) return;
    state.evidence.push({ area, s: clamp(score, 0, 1), src, l: lessonId || null, t: Date.now() });
    if (state.evidence.length > 400) state.evidence = state.evidence.slice(-400);
  }
  function areaLevel(area) {
    const ev = state.evidence.filter((e) => e.area === area).slice(-8);
    if (!ev.length) return null;
    let w = 0, s = 0;
    ev.forEach((e, i) => { const wt = (i + 1) * (e.src === 'ai' ? 1.5 : e.src === 'self' ? 0.8 : 1); w += wt; s += e.s * wt; });
    return { level: s / w, n: ev.length };
  }
  function strengths() {
    return Object.keys(C.AREAS).map((a) => ({ a, r: areaLevel(a) })).filter((x) => x.r && x.r.n >= 2 && x.r.level >= 0.78).sort((x, y) => y.r.level - x.r.level).map((x) => x.a);
  }
  function weaknesses() {
    return Object.keys(C.AREAS).map((a) => ({ a, r: areaLevel(a) })).filter((x) => x.r && x.r.n >= 2 && x.r.level < 0.6).sort((x, y) => x.r.level - y.r.level).map((x) => x.a);
  }
  function isComplete(id) { return !!(state.lessons[id] && state.lessons[id].done); }
  function isUnlocked(l) { return state.settings.openAll || l.prereq.every(isComplete); }
  function status(l) {
    const s = state.lessons[l.id];
    if (s && s.done) {
      const r = areaLevel(l.area);
      return r && r.n >= 2 && r.level < 0.6 ? 'practice' : 'done';
    }
    if (!isUnlocked(l)) return 'locked';
    if (s && (s.stage > 0 || s.seen)) return 'active';
    return 'open';
  }
  function reqs(id) {
    const s = lessonState(id);
    const l = C.byId[id];
    return [
      { k: 'seen', label: 'Concept and visual viewed', ok: s.seen },
      { k: 'tried', label: 'Visual exercise completed', ok: s.tried },
      { k: 'guided', label: 'Guided drawing exercise completed', ok: s.guided.length >= (l.guided.steps.length) },
      { k: 'submitted', label: 'Drawing submitted', ok: s.submitted },
      { k: 'reviewed', label: 'Feedback reviewed', ok: s.reviewed },
      { k: 'passed', label: 'Checkpoint passed', ok: s.passed },
    ];
  }
  function overall() {
    const n = C.LESSONS.length;
    const done = C.LESSONS.filter((l) => isComplete(l.id)).length;
    // partial credit for in-progress lessons so the bar moves while you work
    let partial = 0;
    C.LESSONS.forEach((l) => { if (!isComplete(l.id) && state.lessons[l.id]) partial += reqs(l.id).filter((r) => r.ok).length / 6; });
    return { done, n, pct: Math.round(((done + partial * 0.9) / n) * 100) };
  }
  function currentLesson() {
    // last opened unfinished lesson, else first unlocked unfinished in course order
    if (state.last && C.byId[state.last] && !isComplete(state.last) && isUnlocked(C.byId[state.last])) return C.byId[state.last];
    return C.LESSONS.find((l) => !isComplete(l.id) && isUnlocked(l)) || C.LESSONS.find((l) => !isComplete(l.id)) || C.LESSONS[C.LESSONS.length - 1];
  }
  function recommendations(max = 3) {
    const out = [];
    const weak = weaknesses();
    weak.forEach((a) => {
      const d = C.DRILLS.filter((x) => x.area === a).sort((x, y) => (state.drills[x.id] || 0) - (state.drills[y.id] || 0))[0];
      if (d) out.push({ kind: 'drill', d, why: 'Extra practice: ' + C.AREAS[a].toLowerCase() + ' is below where it should be.' });
      const redo = C.LESSONS.filter((l) => l.area === a && isComplete(l.id)).slice(-1)[0];
      if (redo && out.length < max) out.push({ kind: 'lesson', l: redo, why: 'Revisit the exercise and checkpoint for ' + redo.title.toLowerCase() + '.' });
    });
    const cur = currentLesson();
    const strong = strengths();
    if (out.length < max && cur) {
      const d = C.DRILLS.filter((x) => (x.level || 1) <= (cur.level || 1) + 1 && !state.drills[x.id]).find((x) => x.area === cur.area) || C.DRILLS.find((x) => !state.drills[x.id] && (x.level || 1) <= (cur.level || 1));
      if (d) out.push({ kind: 'drill', d, why: 'Warm-up for your current lesson.' });
    }
    if (out.length < max && strong.length) {
      const hard = C.DRILLS.filter((x) => strong.includes(x.area) && (x.level || 1) >= 2 && !out.some((o) => o.d === x)).sort((a, b) => (b.level || 1) - (a.level || 1))[0];
      if (hard) out.push({ kind: 'drill', d: hard, why: 'You are strong in ' + C.AREAS[hard.area].toLowerCase() + '. Here is a harder one.' });
    }
    // first run / quiet periods: fill with the next unpractised drills at your level
    C.DRILLS.filter((x) => !state.drills[x.id] && (x.level || 1) <= (cur ? cur.level : 1) + 1).sort((a, b) => (a.level || 1) - (b.level || 1)).forEach((d) => { if (out.length < max && !out.some((o) => o.d === d)) out.push({ kind: 'drill', d, why: 'A short drill at your level: ' + d.goal.charAt(0).toLowerCase() + d.goal.slice(1) }); });
    const seen = new Set();
    return out.filter((o) => { const k = o.kind + (o.d ? o.d.id : o.l.id); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, max);
  }
  function performingWell(area) {
    const ev = state.evidence.filter((e) => e.area === area).slice(-3);
    return ev.length >= 3 && ev.every((e) => e.s >= 0.85);
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg, ic = 'check') {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.className = 'toast'; t.innerHTML = icon(ic) + '<span>' + esc(msg) + '</span>'; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3600);
  }

  /* ---------- theme ---------- */
  function applyTheme() {
    const t = state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }

  window.LD = {
    $, $$, esc, clamp, icon, store, uidgen, toast,
    get state() { return state; },
    resetState() { state = blank(); save(); },
    save, lessonState, reqs, status, isComplete, isUnlocked, overall, currentLesson,
    addEvidence, areaLevel, strengths, weaknesses, recommendations, performingWell,
    caps, initCaps, onChange: (fn) => listeners.add(fn),
    fileToCanvas, canvasTo, toBlob, loadImage, saveDrawing, drawingSrc, deleteDrawing, applyTheme,
  };
})();
