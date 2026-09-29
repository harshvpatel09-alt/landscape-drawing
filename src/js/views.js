/* Views, router and flows. */
(function () {
  const C = window.Course, S = window.Scenes, UI = window.UI;
  const { $, $$, esc, icon, toast, clamp } = window.LD;
  const LD = window.LD;
  const view = $('#view');

  const STAGES = [
    { k: 'overview', name: 'Overview' },
    { k: 'see', name: 'See it' },
    { k: 'demo', name: 'Demonstration' },
    { k: 'try', name: 'Try it' },
    { k: 'guided', name: 'Guided practice' },
    { k: 'turn', name: 'Your turn' },
    { k: 'submit', name: 'Submit drawing' },
    { k: 'feedback', name: 'Feedback' },
    { k: 'check', name: 'Checkpoint' },
    { k: 'next', name: 'Next step' },
  ];
  const LEVELS = ['', 'Beginner', 'Beginner+', 'Intermediate', 'Advanced', 'Master practice'];
  const unitOf = (l) => C.UNITS.find((u) => u.id === l.unit);
  const go = (h) => { if (location.hash.slice(1) === h) route(); else location.hash = h; };

  /* ---------- small shared pieces ---------- */
  const hatch = (pct, cls = '') => `<div class="hatch-bar ${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progress ${pct}%"><i style="--p:${pct}%"></i></div>`;
  const lvl = (n) => `<span class="lvl" title="${LEVELS[n]}" aria-label="Difficulty: ${LEVELS[n]}">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  function chip(st) {
    return {
      done: `<span class="chip done">${icon('check')}Complete</span>`,
      practice: `<span class="chip practice">${icon('refresh')}Practice recommended</span>`,
      active: `<span class="chip active">${icon('pencil')}In progress</span>`,
      open: `<span class="chip">Not started</span>`,
      locked: `<span class="chip locked">${icon('lock')}Locked</span>`,
    }[st];
  }
  const thumbSVG = (spec) => UI.renderSpec(spec, { rough: false, labels: false });
  const brandMark = `<svg class="brand-mark" viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="6" fill="#F7F6F2"/><path d="M3 26 12 14l5 6 6-10 10 16z" fill="#97958F"/><path d="M23 10l3.5 7-2 9H33z" fill="#43423E"/><path d="M12 14l2.2 3.2-1.4 8.8H3z" fill="#7A7873" opacity=".6"/><line x1="2" y1="26.2" x2="34" y2="26.2" stroke="#3E8FC7" stroke-width="1.6"/></svg>`;

  /* ---------- navigation ---------- */
  const NAV = [
    { g: 'Learn', items: [['home', 'Home', 'home'], ['course', 'Course', 'course'], ['skills', 'Skill map', 'tree']] },
    { g: 'Practice', items: [['practice', 'Practice', 'pencil'], ['steps', 'Step-by-step', 'layers'], ['reference', 'Reference mode', 'reference']] },
    { g: 'You', items: [['sketchbook', 'Sketchbook', 'book'], ['progress', 'Progress', 'chart']] },
  ];
  const TABS = [['home', 'Home', 'home'], ['course', 'Course', 'course'], ['practice', 'Practice', 'pencil'], ['reference', 'Reference', 'reference'], ['you', 'You', 'user']];
  function section(r) {
    if (r.startsWith('lesson')) return 'course';
    if (r.startsWith('drill')) return 'practice';
    return r;
  }
  function renderNav(r) {
    const cur = section(r);
    const o = LD.overall();
    $('#mat').innerHTML = `<a class="brand" href="#home">${brandMark}<span class="brand-name">Landscape Drawing<small>A course in graphite</small></span></a>
      <nav class="nav" aria-label="Main">${NAV.map((g) => `<div class="nav-group"><span>${g.g}</span>${g.items.map(([k, t, ic]) => `<a href="#${k}" ${cur === k ? 'aria-current="page"' : ''}>${icon(ic)}${t}${k === 'sketchbook' && LD.state.drawings.length ? `<span class="count num">${LD.state.drawings.length}</span>` : ''}</a>`).join('')}</div>`).join('')}</nav>
      <div class="mat-foot">
        <div class="mat-progress"><span>Course progress</span><b class="num">${o.pct}% · ${o.done} of ${o.n} lessons</b>${hatch(o.pct, 'thin on-mat')}</div>
        <nav class="nav" aria-label="Secondary"><a href="#settings" ${cur === 'settings' ? 'aria-current="page"' : ''}>${icon('settings')}Settings</a></nav>
        <span class="sync ${LD.caps.synced ? 'on' : ''}"><i></i>${LD.caps.synced ? 'Progress saved to your account' : 'Progress saved on this device'}</span>
      </div>`;
    const youSet = ['you', 'skills', 'sketchbook', 'progress', 'settings'];
    $('#tabbar').innerHTML = TABS.map(([k, t, ic]) => `<a href="#${k}" ${cur === k || (k === 'you' && youSet.includes(cur)) ? 'aria-current="page"' : ''}>${icon(ic)}${t}</a>`).join('');
  }

  /* ---------- router ---------- */
  function route() {
    const r = location.hash.slice(1) || 'home';
    document.body.classList.toggle('in-lesson', r.startsWith('lesson-'));
    view.className = r.startsWith('lesson-') ? 'lesson' : 'view';
    renderNav(r);
    window.scrollTo(0, 0);
    if (r.startsWith('lesson-')) {
      const [, id, st] = r.match(/^lesson-([a-z]+)(?:-(\d+))?$/) || [];
      if (id && C.byId[id]) renderLesson(C.byId[id], st != null ? +st : null);
      else renderCourse();
    } else if (r.startsWith('drill-')) renderDrill(r.slice(6));
    else if (r.startsWith('course')) renderCourse();
    else if (r === 'steps') window.StepsView.show(view, stepDeps);
    else ({ home: renderHome, course: renderCourse, practice: renderPractice, reference: renderReference, skills: renderSkills, sketchbook: renderSketchbook, progress: renderProgress, settings: renderSettings, you: renderYou }[r] || renderHome)();
    const h = $('h1', view) || $('h2', view);
    if (h && route.started) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    route.started = true;
  }

  /* ================= HOME ================= */
  function renderHome() {
    const o = LD.overall();
    const cur = LD.currentLesson();
    const u = unitOf(cur);
    const recs = LD.recommendations(3);
    const drawings = LD.state.drawings.slice(0, 4);
    const started = Object.keys(LD.state.lessons).length > 0;
    const heroSpec = cur.visual.svg ? { scene: 'mountainLake', mode: cur.area === 'value' ? 'notan' : 'tone' } : Object.assign({}, cur.visual, { overlays: [] });
    view.innerHTML = `
      <section class="home-hero" aria-labelledby="h-title">
        <div>
          <h1 id="h-title">Landscape Drawing</h1>
          <p class="lede">Learn to see, simplify, and draw the world around you.</p>
          <div class="actions">
            <a class="btn btn-primary btn-lg" href="#lesson-${cur.id}">${started ? 'Continue lesson' : 'Start the first lesson'}</a>
            <a class="btn btn-lg" href="#reference">${icon('reference')}Reference mode</a>
          </div>
          <dl class="now">
            <div><dt>Your progress</dt><dd class="num">${o.pct}%${hatch(o.pct, 'thin')}</dd></div>
            <div><dt>Current course</dt><dd>Unit ${u.n}: ${esc(u.title)}</dd></div>
            <div><dt>Current lesson</dt><dd>${cur.n}. ${esc(cur.title)}</dd></div>
          </dl>
        </div>
        <a class="hero-art" href="#lesson-${cur.id}" aria-label="Open lesson: ${esc(cur.title)}" style="display:block">
          <div class="plate">${UI.renderSpec(heroSpec)}</div>
          <p class="plate-cap" style="margin-top:var(--s3)"><span class="plate-no">Plate ${cur.n}.</span> ${esc(cur.skill)}. ${esc(cur.intro.split('. ')[0])}.</p>
        </a>
      </section>

      <div class="home-grid section">
        <section aria-labelledby="h-rec">
          <div class="section-head"><h2 id="h-rec">Recommended practice</h2><span class="spacer"></span><a href="#practice">All practice</a></div>
          <div class="panel">${recs.length ? recs.map(recRow).join('') : `<p class="muted small">Complete your first exercise and the app will start recommending practice based on how you do.</p>`}</div>
        </section>
        <section aria-labelledby="h-map">
          <div class="section-head"><h2 id="h-map">Skill map</h2><span class="spacer"></span><a href="#skills">Open</a></div>
          <div class="panel">${miniMap()}</div>
        </section>
      </div>

      <section class="section" aria-labelledby="h-draw">
        <div class="section-head"><h2 id="h-draw">Recent drawings</h2><span class="spacer"></span>${drawings.length ? '<a href="#sketchbook">Sketchbook</a>' : ''}</div>
        ${drawings.length ? `<div class="drawings">${drawings.map(drawingCard).join('')}</div>` : emptyDrawings()}
      </section>

      <section class="section" aria-labelledby="h-hills">
        <div class="section-head"><h2 id="h-hills">The HILLS method</h2><span class="muted small">Five questions for any landscape, in the order you draw them.</span></div>
        <div class="method">${C.HILLS.map((h) => `<div><b aria-hidden="true">${h.k}</b><h4>${esc(h.name)}</h4><p>${esc(h.q)}</p></div>`).join('')}</div>
      </section>

      <section class="section" aria-labelledby="h-units">
        <div class="section-head"><h2 id="h-units">Course sections</h2><span class="spacer"></span><a href="#course">Lesson library</a></div>
        <div class="units">${C.UNITS.map(unitCard).join('')}</div>
      </section>`;
    wireDrawingCards();
  }
  function recRow(r) {
    if (r.kind === 'drill') return `<div class="rec"><div class="thumb"><div class="plate">${thumbSVG(r.d.thumb)}</div></div><div class="rec-body"><b>${esc(r.d.title)}</b><span class="small muted">${esc(r.why)}</span><span class="tiny">${icon('clock', '')}${r.d.minutes} min · ${esc(C.AREAS[r.d.area])}</span><a class="btn btn-sm" href="#drill-${r.d.id}" style="align-self:flex-start;margin-top:4px">Start drill</a></div></div>`;
    return `<div class="rec"><div class="thumb"><div class="plate">${thumbSVG(r.l.thumb)}</div></div><div class="rec-body"><b>Revisit: ${esc(r.l.title)}</b><span class="small muted">${esc(r.why)}</span><a class="btn btn-sm" href="#lesson-${r.l.id}-3" style="align-self:flex-start;margin-top:4px">Redo the exercise</a></div></div>`;
  }
  function unitCard(u) {
    const ls = C.LESSONS.filter((l) => l.unit === u.id);
    const d = ls.filter((l) => LD.isComplete(l.id)).length;
    return `<a class="unit-card" href="#course-${u.id}" data-unit="${u.id}"><div class="plate">${thumbSVG(u.thumb)}</div><span class="t">${u.n}. ${esc(u.title)}</span><span class="m num">${d} of ${ls.length} lessons · ${esc(u.level)}</span>${hatch(Math.round((d / ls.length) * 100), 'thin')}</a>`;
  }
  function miniMap() {
    const glyph = (st) => ({ done: `<circle cx="8" cy="8" r="7" fill="var(--ink)"/><path d="m4.8 8.2 2.2 2.2 4.2-4.6" stroke="var(--on-ink)" stroke-width="1.6" fill="none"/>`, practice: `<circle cx="8" cy="8" r="7" fill="var(--ink)"/><circle cx="8" cy="8" r="2.4" fill="var(--warn)"/>`, active: `<circle cx="8" cy="8" r="6" fill="none" stroke="var(--blue)" stroke-width="2.5"/>`, open: `<circle cx="8" cy="8" r="6.2" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>`, locked: `<circle cx="8" cy="8" r="6.2" fill="none" stroke="var(--rule-strong)" stroke-width="1.2" stroke-dasharray="2 2"/>` }[st]);
    return `<div class="stack" style="gap:var(--s3)">${C.UNITS.map((u) => `<div class="row" style="gap:var(--s3);flex-wrap:nowrap"><span class="small" style="width:150px;flex:none">${u.n}. ${esc(u.title)}</span><span class="row" style="gap:6px;flex-wrap:nowrap">${C.LESSONS.filter((l) => l.unit === u.id).map((l) => `<svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="${esc(l.title)}: ${LD.status(l)}">${glyph(LD.status(l))}</svg>`).join('')}</span></div>`).join('')}
      <div class="legend" style="margin-top:0;font-size:var(--t-12)"><span><svg viewBox="0 0 16 16">${glyph('done')}</svg>Mastered</span><span><svg viewBox="0 0 16 16">${glyph('active')}</svg>Learning</span><span><svg viewBox="0 0 16 16">${glyph('open')}</svg>Not started</span><span><svg viewBox="0 0 16 16">${glyph('locked')}</svg>Locked</span></div></div>`;
  }
  function emptyDrawings() {
    return `<div class="empty"><svg viewBox="0 0 120 90" aria-hidden="true"><rect x="6" y="6" width="108" height="78" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="4 4"/><path d="M10 62 L40 36 L56 50 L74 28 L110 62" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><line x1="10" y1="62" x2="110" y2="62" stroke="#3E8FC7" stroke-width="1.5"/></svg>
      <div><h3>Your drawings will collect here</h3><p>Every lesson ends with a drawing. Photograph it or draw on the sketch pad, submit it, and get feedback. Each submission is saved with its feedback so you can see your progress.</p><a class="btn btn-sm" href="#lesson-${LD.currentLesson().id}">Go to your current lesson</a></div></div>`;
  }
  function drawingCard(d) {
    const src = LD.drawingSrc(d);
    const by = d.feedback ? 'Teacher feedback' : d.self ? 'Self-review' : 'No feedback yet';
    return `<button type="button" class="drawing" data-drawing="${d.id}"><div class="frame">${src ? `<img src="${esc(src)}" alt="Drawing for ${esc(d.title)}" loading="lazy">` : ''}</div><span class="t">${esc(d.title)}</span><span class="m">${new Date(d.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${by}</span></button>`;
  }
  function wireDrawingCards() {
    $$('[data-drawing]', view).forEach((b) => b.addEventListener('click', () => openDrawing(b.dataset.drawing)));
  }

  /* ================= COURSE LIBRARY ================= */
  function renderCourse() {
    const filt = renderCourse.filter || 'all';
    const r = location.hash.slice(1);
    view.innerHTML = `<header class="page-head"><h1>Course</h1><p>Thirty lessons in six sections, from your first horizon line to independent studies. Each lesson unlocks when the skills it builds on are complete.</p></header>
      <div class="filters seg" role="group" aria-label="Filter lessons">${[['all', 'All'], ['todo', 'To do'], ['practice', 'Practice recommended'], ['done', 'Complete']].map(([k, t]) => `<button type="button" data-f="${k}" aria-pressed="${filt === k}">${t}</button>`).join('')}</div>
      ${C.UNITS.map((u) => {
        const ls = C.LESSONS.filter((l) => l.unit === u.id).filter((l) => { const st = LD.status(l); return filt === 'all' || (filt === 'done' && (st === 'done' || st === 'practice')) || (filt === 'practice' && st === 'practice') || (filt === 'todo' && st !== 'done' && st !== 'practice'); });
        const all = C.LESSONS.filter((l) => l.unit === u.id);
        const d = all.filter((l) => LD.isComplete(l.id)).length;
        if (!ls.length) return '';
        return `<section class="unit-block" id="course-${u.id}" aria-labelledby="t-${u.id}"><div class="unit-top"><span class="n" aria-hidden="true">${u.n}</span><div><h2 id="t-${u.id}">${esc(u.title)}</h2><p>${esc(u.sub)}</p></div><div style="width:140px" class="stack tiny">${d} of ${all.length} complete${hatch(Math.round((d / all.length) * 100), 'thin')}</div></div>
          <div class="lessons">${ls.map(lessonRow).join('')}</div></section>`;
      }).join('')}`;
    $$('[data-f]', view).forEach((b) => b.addEventListener('click', () => { renderCourse.filter = b.dataset.f; renderCourse(); }));
    $$('.lesson-row.is-locked', view).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const l = C.byId[a.dataset.id]; toast('Complete ' + l.prereq.filter((p) => !LD.isComplete(p)).map((p) => C.byId[p].title).join(' and ') + ' to unlock this lesson.', 'lock'); }));
    const m = r.match(/^course-(u\d)$/);
    if (m) { const el = $('#course-' + m[1]); if (el) el.scrollIntoView(); }
  }
  function lessonRow(l) {
    const st = LD.status(l);
    return `<a class="lesson-row ${st === 'locked' ? 'is-locked' : ''}" href="#lesson-${l.id}" data-id="${l.id}" ${st === 'locked' ? 'aria-disabled="true"' : ''}>
      <div class="thumb"><div class="plate">${thumbSVG(l.thumb)}</div></div>
      <div style="min-width:0"><div class="t">${l.n}. ${esc(l.title)}</div><div class="m"><span>${esc(l.skill)}</span><span>${lvl(l.level)} ${LEVELS[l.level]}</span><span>${icon('clock')}${l.minutes} min</span></div></div>
      <span class="st">${chip(st)}</span></a>`;
  }

  /* ================= LESSON PLAYER ================= */
  function renderLesson(l, stageIdx) {
    if (!LD.isUnlocked(l) && !LD.isComplete(l.id)) {
      view.className = 'view';
      document.body.classList.remove('in-lesson');
      view.innerHTML = `<header class="page-head"><h1>${esc(l.title)}</h1><p>This lesson builds on skills you have not finished yet.</p></header>
        <div class="notice info">${icon('lock')}<div>Complete ${l.prereq.filter((p) => !LD.isComplete(p)).map((p) => `<a href="#lesson-${p}">${esc(C.byId[p].title)}</a>`).join(' and ')} first. Or turn on “Open all lessons” in <a href="#settings">Settings</a> if you already have experience.</div></div>`;
      return;
    }
    const s = LD.lessonState(l.id);
    if (stageIdx == null) stageIdx = s.stage || 0;
    stageIdx = clamp(stageIdx, 0, STAGES.length - 1);
    s.stage = stageIdx;
    if (STAGES[stageIdx].k === 'see' && !s.seen) s.seen = true;
    LD.state.last = l.id;
    LD.save({ quiet: true });
    const u = unitOf(l);
    const reqMap = { see: s.seen, try: s.tried, guided: s.guided.length >= l.guided.steps.length, submit: s.submitted, feedback: s.reviewed, check: s.passed, next: s.done };
    view.innerHTML = `
      <header class="lesson-head"><div class="lesson-head-in">
        <a class="icon-btn" href="#course-${u.id}" aria-label="Back to course">${icon('left')}</a>
        <div class="lesson-title"><div class="k">Unit ${u.n}, lesson ${l.n} of ${C.LESSONS.length}</div><div class="t">${esc(l.title)}</div>
          <div class="stepper" role="list" aria-label="Lesson stages">${STAGES.map((st, i) => `<button type="button" role="listitem" data-st="${i}" aria-label="${st.name}${reqMap[st.k] ? ' (done)' : ''}" title="${st.name}" class="${reqMap[st.k] ? 'done' : ''}" ${i === stageIdx ? 'aria-current="step"' : ''}></button>`).join('')}</div></div>
        <span class="chip ${s.done ? 'done' : 'active'}">${s.done ? icon('check') + 'Complete' : LD.reqs(l.id).filter((r) => r.ok).length + ' of 6 checks'}</span>
      </div></header>
      <div class="lesson-main"><div class="stage" data-stage-root></div></div>
      <footer class="lesson-foot"><div class="lesson-foot-in">
        <button type="button" class="btn" data-prev ${stageIdx === 0 ? 'disabled' : ''}>${icon('left')}Back</button>
        <span class="where">${stageIdx + 1} of ${STAGES.length}: ${STAGES[stageIdx].name}</span><span class="spacer"></span>
        <button type="button" class="btn btn-primary" data-next>${stageIdx === STAGES.length - 1 ? (s.done ? 'Next lesson' : 'Back to course') : 'Next: ' + STAGES[stageIdx + 1].name}${icon('right')}</button>
      </div></footer>`;
    $$('[data-st]', view).forEach((b) => b.addEventListener('click', () => go('lesson-' + l.id + '-' + b.dataset.st)));
    $('[data-prev]', view).addEventListener('click', () => go('lesson-' + l.id + '-' + (stageIdx - 1)));
    $('[data-next]', view).addEventListener('click', () => {
      if (stageIdx < STAGES.length - 1) return go('lesson-' + l.id + '-' + (stageIdx + 1));
      const nx = C.LESSONS[l.n];
      if (s.done && nx && LD.isUnlocked(nx)) go('lesson-' + nx.id); else go('course-' + l.unit);
    });
    STAGE_RENDER[STAGES[stageIdx].k](l, $('[data-stage-root]', view), s);
  }

  const kicker = () => '';
  const STAGE_RENDER = {
    overview(l, root, s) {
      const u = unitOf(l);
      const spec = Object.assign({}, l.visual, { overlays: [], cap: null });
      root.innerHTML = `<div class="stage-art">${UI.plate(spec, { toggles: false })}</div>
        <div class="stage-text">
          ${kicker(l, 'Overview')}
          <h2 style="font-size:clamp(var(--t-36),3.4vw,var(--t-48))">${esc(l.title)}</h2>
          <p class="prose">${esc(l.intro)}</p>
          <div class="stack" style="gap:var(--s2)"><h3 style="font-size:var(--t-18);font-family:var(--font-ui);font-weight:700">What you’re learning</h3><p class="prose">${esc(l.what)}</p></div>
          <div class="stack" style="gap:var(--s2)"><h3 style="font-size:var(--t-18);font-family:var(--font-ui);font-weight:700">Why it matters</h3><p class="prose">${esc(l.why)}</p></div>
          <dl class="kv"><dt>Skill</dt><dd>${esc(l.skill)} (${esc(C.AREAS[l.area])})</dd><dt>Difficulty</dt><dd>${lvl(l.level)} ${LEVELS[l.level]}</dd><dt>Time</dt><dd>About ${l.minutes} minutes, plus your drawing</dd><dt>Builds on</dt><dd>${l.prereq.length ? l.prereq.map((p) => `<a href="#lesson-${p}">${esc(C.byId[p].title)}</a>`).join(', ') : 'Nothing. Start here.'}</dd><dt>You’ll need</dt><dd>Paper, a hard pencil (2H or HB), a soft pencil (2B–6B), a kneaded eraser</dd></dl>
        </div>`;
      UI.bindPlates(root, [spec]);
    },
    see(l, root) {
      const spec = Object.assign({}, l.visual);
      root.innerHTML = `<div class="stage-art">${UI.plate(spec)}</div>
        <div class="stage-text">${kicker(l, 'See it')}<h2>Look before you draw</h2>
          ${l.visual.svg ? `<p class="prose" style="font-size:var(--t-16)">${esc(l.visual.cap || '')}</p>` : '<p class="muted small">Switch between Tone, Line and 3 values under the plate. Seeing one scene several ways is how you train your eye.</p>'}
          <ul class="callouts">${(l.visual.callouts || []).map(([k, t]) => `<li><b>${esc(k)}</b><span>${esc(t)}</span></li>`).join('')}</ul>
          ${watchCard(l)}
        </div>`;
      UI.bindPlates(root, [spec]);
    },
    demo(l, root) {
      root.innerHTML = `<div class="stage-art" data-demo></div><div class="stage-text">${kicker(l, 'Demonstration')}<h2>Watch it built step by step</h2><p class="muted small">Each step adds one decision, in the order you will draw it.</p><div data-steps></div>${l.guided.tip ? `<div class="notice info">${icon('pencil')}<div><b>Tip.</b> ${esc(l.guided.tip)}</div></div>` : ''}</div>`;
      const list = UI.demo($('[data-demo]', root), l.demo);
      $('[data-steps]', root).appendChild(list);
    },
    try(l, root, s) {
      root.classList.add('single');
      root.innerHTML = `<div class="stage-text">${kicker(l, 'Try it')}<h2>Test your eye</h2><div data-ex></div></div>`;
      UI.exercise($('[data-ex]', root), l.exercise, (r) => {
        if (!s.tried) {
          s.tried = true; s.triedFirst = !!r.firstTry;
          LD.addEvidence(l.area, r.firstTry ? 1 : 0.35, 'exercise', l.id);
          LD.save({ quiet: true });
          refreshStepper(l);
        }
      });
    },
    guided(l, root, s) {
      const refSpec = Object.assign({}, l.visual, { overlays: [] });
      root.innerHTML = `<div class="stage-art" data-pad></div>
        <div class="stage-text">${kicker(l, 'Guided practice')}<h2>Draw along</h2>
          <p class="muted small">Work on paper or on the sketch pad. Tick each step as you finish it.</p>
          <div class="row">${timerBtn(l.guided.time)}</div>
          <ul class="checks">${l.guided.steps.map((t, i) => `<li><label><input type="checkbox" data-g="${i}" ${s.guided.includes(i) ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul>
          <div class="notice info">${icon('pencil')}<div><b>Tip.</b> ${esc(l.guided.tip)}</div></div>
          <div data-gdone></div>
        </div>`;
      UI.pad($('[data-pad]', root), { key: 'lesson-' + l.id + '-g', ref: UI.renderSpec(refSpec, { rough: false }), horizon: l.id === 'horizon' ? 66 : null });
      const upd = () => { $('[data-gdone]', root).innerHTML = s.guided.length >= l.guided.steps.length ? UI.resultBox(true, 'Guided practice complete', 'Next: an assignment you do on your own.') : ''; };
      $$('[data-g]', root).forEach((c) => c.addEventListener('change', () => {
        const i = +c.dataset.g;
        s.guided = c.checked ? Array.from(new Set(s.guided.concat(i))) : s.guided.filter((x) => x !== i);
        LD.save({ quiet: true }); upd(); refreshStepper(l);
      }));
      wireTimer(root); upd();
    },
    turn(l, root) {
      const refSpec = Object.assign({}, l.visual, { overlays: [] });
      const well = LD.performingWell(l.area);
      const t = l.yourTurn;
      root.innerHTML = `<div class="stage-art"><div class="seg" role="group" aria-label="Where you draw" style="align-self:flex-start"><button type="button" data-w="paper" aria-pressed="true">On paper</button><button type="button" data-w="pad" aria-pressed="false">On the sketch pad</button></div><div data-art></div></div>
        <div class="stage-text">${kicker(l, 'Your turn')}
          <article class="brief"><h3>${esc(t.title)}</h3><p class="prose" style="font-size:var(--t-16)">${esc(t.brief)}</p>
            <ul>${t.do.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
            <div class="meta"><span>${icon('clock')}About ${t.time} minutes</span><span>${icon('target')}${esc(l.skill)}</span></div>
            ${t.stretch ? `<div class="stretch">${well ? `<span class="chip active" style="margin-bottom:6px">${icon('up')}You’re doing well: try this</span><br>` : '<b>Stretch.</b> '}${esc(t.stretch)}</div>` : ''}
          </article>
          <div class="stack" style="gap:var(--s2)"><h3 style="font-size:var(--t-16);font-family:var(--font-ui);font-weight:700">What a strong drawing shows</h3><ul class="list-plain">${l.criteria.map((c) => `<li>${icon('check')}${esc(c)}</li>`).join('')}</ul></div>
          <div class="row">${timerBtn(t.time)}<a class="btn btn-primary" href="#lesson-${l.id}-6">I’ve finished my drawing</a></div>
        </div>`;
      const art = $('[data-art]', root);
      const showPaper = () => { art.innerHTML = UI.plate(Object.assign({}, refSpec, { cap: 'Reference for this assignment. Use it, or any photo of your own.' })); UI.bindPlates(art, [refSpec]); };
      showPaper();
      $$('[data-w]', root).forEach((b) => b.addEventListener('click', () => {
        $$('[data-w]', root).forEach((x) => x.setAttribute('aria-pressed', x === b));
        if (b.dataset.w === 'pad') UI.pad(art, { key: 'lesson-' + l.id + '-t', ref: UI.renderSpec(refSpec, { rough: false }) }); else showPaper();
      }));
      wireTimer(root);
    },
    submit(l, root, s) {
      const ctx = lessonCtx(l);
      root.innerHTML = `<div class="stage-art" data-preview></div><div class="stage-text">${kicker(l, 'Submit drawing')}<h2>Show your drawing</h2><div data-pick></div></div>`;
      pickAndSave(root, ctx, (rec) => {
        s.submitted = true; s.reviewed = false; LD.save({ quiet: true });
        go('lesson-' + l.id + '-7');
      });
    },
    feedback(l, root, s) {
      const rec = LD.state.drawings.find((d) => d.lessonId === l.id);
      if (!rec) {
        root.classList.add('single');
        root.innerHTML = `<div class="stage-text">${kicker(l, 'Feedback')}<h2>No drawing yet</h2><div class="empty"><svg viewBox="0 0 120 90" aria-hidden="true"><rect x="10" y="8" width="100" height="74" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="4 4"/><path d="M60 58V30M48 42l12-12 12 12" stroke="currentColor" stroke-opacity=".5" stroke-width="2" fill="none"/></svg><div><h3>Submit a drawing to get feedback</h3><p>Feedback looks at your actual drawing and picks the one thing that will help most.</p><a class="btn btn-sm btn-primary" href="#lesson-${l.id}-6">Submit a drawing</a></div></div></div>`;
        return;
      }
      feedbackStage(root, rec, lessonCtx(l), () => { s.reviewed = true; LD.save({ quiet: true }); refreshStepper(l); });
    },
    check(l, root, s) {
      root.classList.add('single');
      root.innerHTML = `<div class="stage-text">${kicker(l, 'Checkpoint')}<h2>Check your understanding</h2><p class="muted">Answer all three. Two correct passes the checkpoint.</p><div data-quiz></div></div>`;
      quiz($('[data-quiz]', root), l, (score) => {
        s.cpScore = Math.max(s.cpScore || 0, score);
        LD.addEvidence(l.area, score / l.checkpoint.length, 'checkpoint', l.id);
        if (score >= 2) s.passed = true;
        LD.save({ quiet: true }); refreshStepper(l);
      });
    },
    next(l, root, s) {
      root.classList.add('single');
      const reqs = LD.reqs(l.id);
      const all = reqs.every((r) => r.ok);
      const stageOf = { seen: 1, tried: 3, guided: 4, submitted: 6, reviewed: 7, passed: 8 };
      const nx = C.LESSONS[l.n];
      const lvlA = LD.areaLevel(l.area);
      const weak = lvlA && lvlA.n >= 2 && lvlA.level < 0.6;
      const drills = C.DRILLS.filter((d) => d.area === l.area).slice(0, 2);
      root.innerHTML = `<div class="stage-text">${kicker(l, 'Next step')}<h2>${s.done ? 'Lesson complete' : all ? 'Ready to complete' : 'Almost there'}</h2>
        <div class="panel stack"><h3>${esc(l.title)}</h3><ul class="completion">${reqs.map((r) => `<li class="${r.ok ? 'ok' : ''}"><span class="box">${r.ok ? icon('check') : ''}</span><span>${esc(r.label)}</span>${r.ok ? '' : `<a class="small" href="#lesson-${l.id}-${stageOf[r.k]}" style="margin-left:auto">Go</a>`}</li>`).join('')}</ul>
          ${s.done ? `<div class="notice good">${icon('check')}<div><b>Complete.</b> ${nx ? 'The next lesson is unlocked when its other prerequisites are done.' : 'You have finished the course.'}</div></div>` : `<button type="button" class="btn btn-primary btn-lg" data-complete ${all ? '' : 'disabled'}>${all ? 'Complete lesson' : 'Finish the checks above to complete'}</button>`}
        </div>
        ${weak ? `<div class="notice warn">${icon('refresh')}<div><b>Before moving on:</b> your recent results in ${esc(C.AREAS[l.area].toLowerCase())} are below where they should be. Mastery beats speed: do one of these first.</div></div>` : ''}
        <p class="prose">${esc(l.next)}</p>
        ${nx ? `<a class="rec" href="#lesson-${nx.id}" style="text-decoration:none;color:inherit"><div class="thumb" style="width:160px"><div class="plate">${thumbSVG(nx.thumb)}</div></div><div class="rec-body"><span class="tiny">Next lesson</span><b style="font-family:var(--font-display);font-size:var(--t-22);font-weight:500">${nx.n}. ${esc(nx.title)}</b><span class="small muted">${esc(nx.skill)} · ${nx.minutes} min</span>${chip(LD.status(nx))}</div></a>` : ''}
        <div class="stack" style="gap:var(--s2)"><h3 style="font-size:var(--t-16);font-family:var(--font-ui);font-weight:700">Practice this skill</h3>${drills.map((d) => `<a class="row" href="#drill-${d.id}" style="text-decoration:none;color:inherit;border-bottom:1px solid var(--rule);padding:var(--s2) 0">${icon('pencil')}<span style="flex:1">${esc(d.title)}</span><span class="tiny">${d.minutes} min</span></a>`).join('')}</div>
      </div>`;
      const cb = $('[data-complete]', root);
      if (cb) cb.addEventListener('click', () => {
        s.done = true; s.doneAt = Date.now(); LD.save();
        const unlocked = C.LESSONS.filter((x) => x.prereq.includes(l.id) && LD.isUnlocked(x));
        toast(unlocked.length ? 'Lesson complete. Unlocked: ' + unlocked.map((x) => x.title).join(', ') : 'Lesson complete', 'check');
        renderLesson(l, 9);
      });
    },
  };
  function refreshStepper(l) {
    const s = LD.lessonState(l.id);
    const map = { see: s.seen, try: s.tried, guided: s.guided.length >= l.guided.steps.length, submit: s.submitted, feedback: s.reviewed, check: s.passed, next: s.done };
    $$('[data-st]', view).forEach((b) => { const k = STAGES[+b.dataset.st].k; b.classList.toggle('done', !!map[k]); });
    const c = $('.lesson-head .chip', view); if (c && !s.done) c.textContent = LD.reqs(l.id).filter((r) => r.ok).length + ' of 6 checks';
  }
  function watchCard(l) {
    if (!l.watch) return '';
    const v = C.VIDEOS[l.watch.v];
    const t = l.watch.t;
    return `<a class="panel row" href="https://www.youtube.com/watch?v=${v.id}${t ? '&t=' + t + 's' : ''}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;gap:var(--s4);flex-wrap:nowrap;align-items:flex-start">${icon('video')}<div class="stack" style="gap:4px;min-width:0"><b class="small">Watch it in the source demo</b><span class="small muted">${esc(l.watch.note)}</span><span class="tiny">${esc(v.title)} · Cartooning Club Z${t ? ' · from ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0') : ''}</span></div>${icon('external')}</a>`;
  }
  function timerBtn(min) { return `<button type="button" class="btn btn-sm" data-timer="${min}">${icon('clock')}<span>Start ${min}-minute timer</span></button>`; }
  function wireTimer(root) {
    $$('[data-timer]', root).forEach((b) => {
      let t = null, left = +b.dataset.timer * 60;
      b.addEventListener('click', () => {
        if (t) { clearInterval(t); t = null; $('span', b).textContent = 'Resume timer (' + fmt(left) + ')'; return; }
        t = setInterval(() => {
          if (!b.isConnected) { clearInterval(t); return; }
          left--; $('span', b).textContent = fmt(left) + ' left · pause';
          if (left <= 0) { clearInterval(t); t = null; $('span', b).textContent = 'Time’s up'; toast('Time’s up. Put the pencil down and look at the whole drawing.', 'clock'); }
        }, 1000);
        $('span', b).textContent = fmt(left) + ' left · pause';
      });
    });
  }
  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  /* ---------- quiz ---------- */
  function quiz(el, l, onDone) {
    const qs = l.checkpoint.map((q, i) => ({ q, i }));
    let answered = 0, right = 0;
    el.innerHTML = `<div class="quiz">${qs.map(({ q }, qi) => `<div class="q" data-q="${qi}"><h4>${qi + 1}. ${esc(q.q)}</h4><div class="opts" role="group">${q.o.map((o, oi) => `<button type="button" data-o="${oi}"><span class="k">${String.fromCharCode(65 + oi)}</span><span>${esc(o)}</span></button>`).join('')}</div><div data-why></div></div>`).join('')}</div><div data-score style="margin-top:var(--s5)"></div>`;
    $$('.q', el).forEach((qEl) => {
      const q = qs[+qEl.dataset.q].q;
      $$('[data-o]', qEl).forEach((b) => b.addEventListener('click', () => {
        const oi = +b.dataset.o; const ok = oi === q.a;
        $$('[data-o]', qEl).forEach((x) => { x.disabled = true; if (+x.dataset.o === q.a) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        $('[data-why]', qEl).innerHTML = `<p class="why"><b>${ok ? 'Correct.' : 'Not quite.'}</b> ${esc(q.why)}</p>`;
        answered++; if (ok) right++;
        if (answered === qs.length) {
          const pass = right >= 2;
          $('[data-score]', el).innerHTML = UI.resultBox(pass, right + ' of ' + qs.length + ' correct', pass ? 'Checkpoint passed.' : 'Not passed yet. Review the See it and Demonstration stages, then try again.', `<div class="row">${pass ? `<a class="btn btn-sm btn-primary" href="#lesson-${l.id}-9">Next step${icon('right')}</a>` : `<a class="btn btn-sm" href="#lesson-${l.id}-1">Review the concept</a><button type="button" class="btn btn-sm btn-primary" data-retry>Try again</button>`}</div>`);
          const rt = $('[data-retry]', el); if (rt) rt.addEventListener('click', () => quiz(el, l, onDone));
          onDone(right);
        }
      }));
    });
  }

  /* ---------- submission ---------- */
  const refHTML = (ctx) => ctx.refImg ? `<img src="${esc(ctx.refImg)}" alt="Reference photo">` : `<div class="plate">${UI.renderSpec(ctx.refSpec, { rough: false })}</div>`;
  function lessonCtx(l) {
    return { kind: 'lesson', lessonId: l.id, title: l.title, area: l.area, skill: l.skill, assignment: l.yourTurn, criteria: l.criteria, refSpec: Object.assign({}, l.visual, { overlays: [] }), padKeys: ['lesson-' + l.id + '-t', 'lesson-' + l.id + '-g'] };
  }
  function pickAndSave(root, ctx, onSaved) {
    const pick = $('[data-pick]', root), prev = $('[data-preview]', root);
    const padKey = (ctx.padKeys || []).find((k) => (LD.store.get('ld.pad.' + k, []) || []).length);
    let canvas = null;
    pick.innerHTML = `<p class="muted">Photograph your drawing flat, in even daylight, filling the frame. Or send what you drew on the sketch pad.</p>
      <label class="drop" data-drop tabindex="0"><input type="file" accept="image/*" class="sr-only" data-file>${icon('upload')}<b>Upload a photo of your drawing</b><span class="tiny">Drop an image here or choose a file. JPEG, PNG or HEIC exported as JPEG.</span></label>
      ${padKey ? `<button type="button" class="btn" data-usepad>${icon('pencil')}Use my sketch pad drawing</button>` : `<p class="tiny">No sketch pad drawing for this ${ctx.kind === 'lesson' ? 'lesson' : 'drill'} yet.</p>`}
      <div data-err></div>
      <div class="row"><button type="button" class="btn btn-primary btn-lg" data-send disabled>Submit drawing</button></div>`;
    const showPrev = () => {
      prev.innerHTML = `<div class="preview"><figure><div data-c></div><figcaption>Your drawing</figcaption></figure><figure>${refHTML(ctx)}<figcaption>Reference</figcaption></figure></div>`;
      if (canvas) { const img = new Image(); img.src = canvas.toDataURL('image/jpeg', 0.8); img.alt = 'Your drawing'; $('[data-c]', prev).appendChild(img); }
      else $('[data-c]', prev).innerHTML = `<div class="plate" style="display:grid;place-items:center;aspect-ratio:4/3;color:var(--ink-3)"><span class="small" style="color:#6E7278">Your drawing will appear here</span></div>`;
    };
    showPrev();
    const setErr = (m) => { $('[data-err]', pick).innerHTML = m ? `<div class="notice bad">${icon('alert')}<div>${esc(m)}</div></div>` : ''; };
    const take = async (file) => {
      setErr('');
      if (!file || !file.type.startsWith('image/')) return setErr('That file is not an image. Choose a JPEG or PNG photo of your drawing.');
      if (file.size > 20 * 1024 * 1024) return setErr('That image is over 20 MB. Export a smaller version and try again.');
      try { canvas = await LD.fileToCanvas(file, 1600); showPrev(); $('[data-send]', pick).disabled = false; } catch (e) { setErr('The image could not be opened. If it is a HEIC photo, export it as JPEG first.'); }
    };
    const drop = $('[data-drop]', pick);
    $('[data-file]', pick).addEventListener('change', (e) => take(e.target.files[0]));
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('[data-file]', pick).click(); } });
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('drag'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
    drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('drag'); take(e.dataTransfer.files[0]); });
    const up = $('[data-usepad]', pick);
    if (up) up.addEventListener('click', () => {
      const tmp = document.createElement('div'); tmp.hidden = true; document.body.appendChild(tmp);
      const p = UI.pad(tmp, { key: padKey }); canvas = p.toCanvas(); tmp.remove();
      showPrev(); $('[data-send]', pick).disabled = false;
    });
    $('[data-send]', pick).addEventListener('click', async (e) => {
      const b = e.currentTarget; b.classList.add('is-busy'); b.disabled = true;
      try {
        const { rec, blob } = await LD.saveDrawing(canvas, { title: ctx.title, kind: ctx.kind, lessonId: ctx.lessonId || null, drillId: ctx.drillId || null, area: ctx.area });
        pendingBlobs[rec.id] = blob;
        toast('Drawing submitted');
        onSaved(rec);
      } catch (err) { setErr('The drawing could not be saved. Try again.'); b.classList.remove('is-busy'); b.disabled = false; }
    });
  }
  const pendingBlobs = {};

  /* ---------- feedback ---------- */
  function feedbackStage(root, rec, ctx, onReviewed) {
    const src = LD.drawingSrc(rec);
    root.innerHTML = `<div class="stage-art"><div class="preview"><figure><img src="${esc(src)}" alt="Your drawing"><figcaption>Your drawing, ${new Date(rec.at).toLocaleDateString()}</figcaption></figure><figure>${refHTML(ctx)}<figcaption>Reference</figcaption></figure></div></div>
      <div class="stage-text"><h2>How it went</h2><div data-fb></div></div>`;
    const box = $('[data-fb]', root);
    if (rec.feedback) return showFeedback(box, rec, ctx, onReviewed);
    if (rec.self) return showFeedback(box, rec, ctx, onReviewed);
    const ai = LD.caps.sample && LD.caps.imageOk;
    if (ai) {
      box.innerHTML = `<p class="muted">Your teacher will look at the drawing itself, point out what works, and pick the single most important thing to improve.</p>
        <div class="row"><button type="button" class="btn btn-primary" data-ai>${icon('feedback')}Get teacher feedback</button><button type="button" class="btn btn-quiet" data-self>Review it myself instead</button></div>`;
      $('[data-ai]', box).addEventListener('click', () => runAI(box, rec, ctx, onReviewed));
      $('[data-self]', box).addEventListener('click', () => selfReview(box, rec, ctx, onReviewed));
    } else {
      box.innerHTML = `<div class="notice info">${icon('info')}<div>Automatic teacher feedback isn’t available on this version of the course. Review your drawing against the lesson’s criteria, and the course will turn that into targeted feedback.</div></div>`;
      selfReview(box, rec, ctx, onReviewed, true);
    }
  }
  function aiPrompt(ctx) {
    const weak = LD.weaknesses().map((a) => C.AREAS[a]).join(', ') || 'none recorded yet';
    const strong = LD.strengths().map((a) => C.AREAS[a]).join(', ') || 'none recorded yet';
    const a = ctx.assignment || {};
    return `You are a warm, precise landscape-drawing teacher reviewing a student's graphite (pencil) drawing, photographed or drawn on a tablet.
The course method: draw a light horizon line first, block in 3-5 big shapes with light lines, build layers back to front (background light and simple, foreground dark and detailed), group values into light/middle/dark, keep one light direction, put the darkest dark next to the lightest light at a single focal point, and use atmospheric perspective. Strokes follow the form.

Lesson: "${ctx.title}" (skill: ${ctx.skill || ''}).
Assignment: ${a.title || ctx.title}. ${a.brief || ''}
Requirements: ${(a.do || []).join('; ')}
What a strong drawing shows: ${(ctx.criteria || []).join('; ')}
Student's weaker areas so far: ${weak}. Stronger areas: ${strong}.

Look closely at the image. Every point must cite something visible and say where it is (for example "the pines on the right", "along the upper third"). Evidence first, then the principle. Be encouraging and specific, never vague. Give ONE main improvement, not a list. If the image is not a drawing, or is too blurry or dark to judge, set "readable" to false and say what to reshoot in "summary".

Reply with only this JSON:
{"readable": true, "summary": "one sentence describing what you see", "strengths": ["1 to 3 specific strengths"], "mainImprovement": "the single most important thing affecting the drawing", "why": "the underlying drawing principle, 1-2 sentences", "howToFix": "a specific correction exercise, 1-3 sentences", "nextPractice": "a short 10-15 minute drill that reinforces the fix", "scores": {"shapes": 1-5 or null, "composition": 1-5 or null, "value": 1-5 or null, "depth": 1-5 or null, "perspective": 1-5 or null, "light": 1-5 or null, "line": 1-5 or null, "elements": 1-5 or null}, "criteria": [{"c": "criterion text", "met": "yes" | "partly" | "no"}], "readyToMoveOn": true}
Use null for scores that this drawing does not show.`;
  }
  async function runAI(box, rec, ctx, onReviewed) {
    const ac = new AbortController();
    box.innerHTML = `<div class="thinking" aria-live="polite"><p class="small muted">Looking at your drawing. This usually takes 10 to 40 seconds.</p><div class="skeleton" style="width:90%"></div><div class="skeleton" style="width:70%"></div><div class="skeleton" style="width:80%"></div></div><button type="button" class="btn btn-sm btn-quiet" data-cancel>Cancel</button>`;
    $('[data-cancel]', box).addEventListener('click', () => ac.abort());
    try {
      let blob = pendingBlobs[rec.id];
      if (!blob) { const img = await LD.loadImage(LD.drawingSrc(rec)); const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); blob = await LD.toBlob(c, 0.86); }
      const fb = await LD.caps.sample.json(aiPrompt(ctx), { images: blob, signal: ac.signal, modelTier: 'default' });
      if (!fb || typeof fb !== 'object') throw { code: 'bad_output' };
      rec.feedback = Object.assign({ by: 'ai', at: Date.now() }, fb);
      if (fb.readable !== false && fb.scores) {
        Object.entries(fb.scores).forEach(([a, v]) => { if (C.AREAS[a] && typeof v === 'number') LD.addEvidence(a, (v - 1) / 4, 'ai', rec.lessonId); });
      }
      LD.save({ quiet: true });
      showFeedback(box, rec, ctx, onReviewed);
    } catch (e) {
      const code = e && e.code;
      const msg = code === 'cancelled' ? 'Feedback cancelled.' : code === 'rate_limited' ? 'Too many requests right now. Wait a minute and try again.' : code === 'not_granted' ? 'Feedback needs your permission to ask Claude. You can review it yourself instead.' : code === 'image_rejected' ? 'That image could not be read. Try a clearer photo.' : 'Feedback could not be generated this time.';
      box.innerHTML = `<div class="notice bad">${icon('alert')}<div>${esc(msg)}</div></div><div class="row"><button type="button" class="btn btn-primary" data-ai>${icon('refresh')}Try again</button><button type="button" class="btn btn-quiet" data-self>Review it myself</button></div>`;
      $('[data-ai]', box).addEventListener('click', () => runAI(box, rec, ctx, onReviewed));
      $('[data-self]', box).addEventListener('click', () => selfReview(box, rec, ctx, onReviewed));
    }
  }
  function selfReview(box, rec, ctx, onReviewed, keepNotice) {
    const crit = ctx.criteria || [];
    const html = `<p class="muted">Prop your drawing up, step back two metres and squint. Rate each point honestly.</p>
      <div class="selfcheck">${crit.map((c, i) => `<div class="item"><span>${esc(c)}</span><div class="seg" role="group" aria-label="${esc(c)}">${['Not yet', 'Partly', 'Yes'].map((t, v) => `<button type="button" data-c="${i}" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>`).join('')}</div>
      <button type="button" class="btn btn-primary" data-go disabled>Get my feedback</button>`;
    if (keepNotice) box.insertAdjacentHTML('beforeend', html); else box.innerHTML = html;
    const r = {};
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b) return;
      r[b.dataset.c] = +b.dataset.v;
      $$(`[data-c="${b.dataset.c}"]`, box).forEach((x) => x.setAttribute('aria-pressed', x === b));
      $('[data-go]', box).disabled = Object.keys(r).length < crit.length;
    });
    $('[data-go]', box).addEventListener('click', () => {
      const vals = crit.map((_, i) => r[i]);
      const strong = crit.filter((_, i) => vals[i] === 2);
      const weakIdx = vals.indexOf(Math.min(...vals));
      const l = rec.lessonId ? C.byId[rec.lessonId] : null;
      const drill = C.DRILLS.find((d) => d.area === ctx.area) || C.DRILLS[0];
      const avg = vals.reduce((a, b) => a + b, 0) / (vals.length * 2);
      rec.self = {
        at: Date.now(), ratings: vals,
        strengths: strong.length ? strong.slice(0, 3) : ['You finished the drawing and assessed it honestly. That habit is how improvement happens.'],
        mainImprovement: vals[weakIdx] === 2 ? 'Everything is solid. Push the stretch version of this assignment.' : crit[weakIdx],
        why: l ? l.why : 'This principle is what makes the drawing read clearly at a glance.',
        howToFix: l ? l.guided.tip + ' Redo the guided steps focusing only on this point.' : 'Redo the drill focusing only on this point.',
        nextPractice: drill.title + ' (' + drill.minutes + ' min): ' + drill.goal,
      };
      LD.addEvidence(ctx.area, avg, 'self', rec.lessonId);
      LD.save({ quiet: true });
      showFeedback(box, rec, ctx, onReviewed);
    });
  }
  function feedbackHTML(rec) {
    const f = rec.feedback && rec.feedback.readable !== false ? rec.feedback : rec.self;
    if (rec.feedback && rec.feedback.readable === false) return `<div class="notice warn">${icon('alert')}<div><b>The photo was hard to read.</b> ${esc(rec.feedback.summary || '')}</div></div>`;
    if (!f) return '';
    const by = rec.feedback ? 'Teacher feedback' : 'Self-review';
    const scores = rec.feedback && rec.feedback.scores ? Object.entries(rec.feedback.scores).filter(([a, v]) => C.AREAS[a] && typeof v === 'number') : [];
    return `<div class="fb">
      ${f.summary ? `<section><h4>What I see</h4><p>${esc(f.summary)}</p></section>` : ''}
      <section><h4>What you did well</h4><ul>${(f.strengths || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></section>
      <section class="key"><h4>Most important improvement</h4><p>${esc(f.mainImprovement)}</p></section>
      <section><h4>Why</h4><p>${esc(f.why)}</p></section>
      <section><h4>How to fix it</h4><p>${esc(f.howToFix)}</p></section>
      <section><h4>Next practice</h4><p>${esc(f.nextPractice)}</p></section>
      ${scores.length ? `<section><h4>Skill read</h4><div class="scores">${scores.map(([a, v]) => `<div class="score"><span>${esc(C.AREAS[a])}</span>${hatch(v * 20, 'thin')}</div>`).join('')}</div></section>` : ''}
    </div><p class="tiny">${by}, ${new Date((rec.feedback || rec.self).at).toLocaleString()}</p>`;
  }
  function showFeedback(box, rec, ctx, onReviewed) {
    box.innerHTML = feedbackHTML(rec) + `<div class="row" style="margin-top:var(--s4)">${rec.feedback && rec.feedback.readable === false ? `<a class="btn btn-primary" href="${ctx.kind === 'lesson' ? '#lesson-' + rec.lessonId + '-6' : location.hash}">Submit a clearer photo</a>` : `<button type="button" class="btn btn-primary" data-ok>${icon('check')}I’ve read this feedback</button>`}${ctx.kind === 'lesson' ? `<a class="btn btn-quiet" href="#lesson-${rec.lessonId}-6">Submit a new version</a>` : ''}</div>`;
    const ok = $('[data-ok]', box);
    if (ok) ok.addEventListener('click', () => {
      onReviewed && onReviewed();
      if (ctx.kind === 'lesson') go('lesson-' + rec.lessonId + '-8'); else { ok.disabled = true; ok.innerHTML = icon('check') + 'Saved to your sketchbook'; }
    });
  }

  /* ================= PRACTICE ================= */
  function renderPractice() {
    const f = renderPractice.filter || 'all';
    const recs = LD.recommendations(3);
    const weak = LD.weaknesses();
    view.innerHTML = `<header class="page-head"><h1>Practice</h1><p>Short, focused drills. The app recommends them from your exercise, checkpoint and feedback results, so you practise what you actually need.</p></header>
      <section aria-labelledby="h-r"><div class="section-head"><h2 id="h-r">Recommended for you</h2>${weak.length ? `<span class="chip practice">${icon('target')}Focus: ${esc(weak.map((a) => C.AREAS[a]).join(', '))}</span>` : ''}</div>
        <div class="panel">${recs.length ? recs.map(recRow).join('') : '<p class="small muted">Recommendations appear once you have done a few exercises.</p>'}</div></section>
      <a class="panel rec section" href="#steps" style="text-decoration:none;color:inherit;align-items:center;margin-top:var(--s6)"><div class="thumb" style="width:150px"><div class="plate">${thumbSVG({ scene: 'mountainLake', mode: 'notan' })}</div></div><div class="rec-body"><b style="font-family:var(--font-display);font-size:var(--t-22);font-weight:500">Step-by-step from your own image</b><span class="small muted">Upload a drawing or photo you like. Get it broken into seven stages, from light guides to final accents, and draw along.</span><span class="btn btn-sm btn-primary" style="align-self:flex-start;margin-top:6px">${icon('layers')}Open Step-by-step</span></div></a>
      <section class="section" aria-labelledby="h-all"><div class="section-head"><h2 id="h-all">All drills</h2><span class="spacer"></span><a class="btn btn-sm" href="#drill-free">${icon('pencil')}Free sketch</a></div>
        <div class="filters seg" role="group" aria-label="Filter by skill"><button type="button" data-f="all" aria-pressed="${f === 'all'}">All</button>${Object.entries(C.AREAS).map(([k, t]) => `<button type="button" data-f="${k}" aria-pressed="${f === k}">${esc(t)}</button>`).join('')}</div>
        <div class="drill-grid">${C.DRILLS.filter((d) => f === 'all' || d.area === f).map((d) => `<a class="drill" href="#drill-${d.id}"><div class="plate">${thumbSVG(d.thumb)}</div><span class="t">${esc(d.title)}</span><span class="m"><span>${icon('clock')}${d.minutes} min</span><span>${esc(C.AREAS[d.area])}</span>${lvl(d.level)}${LD.state.drills[d.id] ? `<span class="chip done">${icon('check')}${LD.state.drills[d.id]}×</span>` : ''}</span></a>`).join('')}</div></section>`;
    $$('[data-f]', view).forEach((b) => b.addEventListener('click', () => { renderPractice.filter = b.dataset.f; renderPractice(); }));
  }

  let refStudy = null; // {src, title}
  function renderDrill(id) {
    let d = C.DRILLS.find((x) => x.id === id);
    if (id === 'free') d = { id: 'free', title: 'Free sketch', area: 'shapes', minutes: 15, level: 1, thumb: { scene: 'mountainLake' }, goal: 'Draw anything. Start with the horizon and the big shapes.', steps: ['Horizon line.', 'Three to five big shapes.', 'Layers back to front.', 'Three values.', 'One focal point.'] };
    if (id === 'ref' && refStudy) d = { id: 'ref', title: 'Reference study', area: 'composition', minutes: 30, level: 4, thumb: null, goal: 'Draw the reference you analysed, following your plan.', steps: (refStudy.plan || []).map((p) => p.title + ': ' + p.do) };
    if (!d) return renderPractice();
    const refSpec = d.thumb ? Object.assign({}, d.thumb, { overlays: [] }) : null;
    const refHTML = refSpec ? UI.renderSpec(refSpec, { rough: false }) : `<img src="${esc(refStudy.src)}" alt="Reference photo" style="width:100%">`;
    view.innerHTML = `<header class="page-head"><a class="small" href="#practice">${icon('left', '')} Practice</a><h1>${esc(d.title)}</h1><p>${esc(d.goal)}</p></header>
      <div class="stage"><div class="stage-art" data-pad></div>
      <div class="stage-text"><div class="row"><span class="chip">${icon('clock')}${d.minutes} min</span><span class="chip">${esc(C.AREAS[d.area])}</span></div>
        <div class="row">${timerBtn(d.minutes)}</div>
        <ol class="callouts">${d.steps.map((s, i) => `<li><b>${i + 1}</b><span>${esc(s)}</span></li>`).join('')}</ol>
        ${d.link === 'reference' ? `<a class="btn" href="#reference">${icon('reference')}Open Reference mode</a>` : ''}
        <div class="panel stack"><h3>Submit for feedback</h3><div data-sub><div data-preview></div><div data-pick></div></div></div>
      </div></div>`;
    UI.pad($('[data-pad]', view), { key: 'drill-' + d.id, ref: refHTML });
    wireTimer(view);
    const ctx = { kind: 'drill', drillId: d.id, title: d.title, area: d.area, skill: C.AREAS[d.area], assignment: { title: d.title, brief: d.goal, do: d.steps }, criteria: d.id === 'ref' ? ['Horizon and big shapes match the reference', 'Clear layers and value groups', 'Consistent light', 'A clear focal point with simplified details'] : [d.goal], refSpec, refImg: refSpec ? null : refStudy.src, padKeys: ['drill-' + d.id] };
    pickAndSaveDrill($('[data-sub]', view), ctx, d);
  }
  function pickAndSaveDrill(root, ctx, d) {
    pickAndSave(root, ctx, (rec) => {
      LD.state.drills[d.id] = (LD.state.drills[d.id] || 0) + 1; LD.save({ quiet: true });
      root.innerHTML = `<div data-fbwrap></div>`;
      const wrap = $('[data-fbwrap]', root);
      wrap.innerHTML = `<div class="stack"><div data-fb></div></div>`;
      const fakeRoot = document.createElement('div');
      feedbackStage(fakeRoot, rec, ctx, () => toast('Saved to your sketchbook'));
      wrap.replaceChildren(...$$('.stage-text > *:not(.stage-kicker):not(h2)', fakeRoot));
    });
  }

  const stepDeps = {
    pickAndSaveDrill: (root, ctx, d) => pickAndSaveDrill(root, ctx, d),
    sampleSrc: () => LD.loadImage(sampleRefURL()).then((img) => { const c = document.createElement('canvas'); c.width = 1200; c.height = 750; c.getContext('2d').drawImage(img, 0, 0, 1200, 750); return c.toDataURL('image/jpeg', 0.9); }),
  };

  /* ================= REFERENCE MODE ================= */
  let refState = { src: null, name: 'Sample reference', mode: 'photo', t1: 85, t2: 170, thirds: false, flip: false, horizon: null, analysis: null, notes: {}, planDone: [] };
  function sampleRefURL() {
    const svg = S.render('mountainLake', { rough: false }).replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" ');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function rasteriseSample() {
    LD.loadImage(sampleRefURL()).then((img) => {
      const c = document.createElement('canvas'); c.width = 1200; c.height = 750;
      c.getContext('2d').drawImage(img, 0, 0, 1200, 750);
      const url = c.toDataURL('image/jpeg', 0.9);
      if (refState.name === 'Sample reference') { refState.src = url; if ((location.hash.slice(1)) === 'reference') drawRef(); }
    }).catch(() => { /* keep the SVG source; value views may be unavailable */ });
  }
  function renderReference() {
    if (!refState.src) { refState.src = sampleRefURL(); refState.name = 'Sample reference'; rasteriseSample(); }
    const ai = LD.caps.sample && LD.caps.imageOk;
    const A = refState.analysis;
    const planSteps = defaultPlan(A);
    view.innerHTML = `<header class="page-head"><h1>Reference mode</h1><p>Bring any landscape photo. Analyse it with HILLS, see it in values, and leave with a step-by-step drawing plan.</p></header>
      <div class="ref-layout">
        <div class="ref-stage">
          <div class="ref-view" data-rv><canvas data-rc aria-label="Reference image, ${esc(refState.mode)} view"></canvas><svg class="ovl" data-ovl viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg></div>
          <div class="row"><span class="small muted" style="flex:1;min-width:0">${refState.name === 'Sample reference' ? 'Sample reference. Upload your own photo to analyse it.' : esc(refState.name)}</span>
            <label class="btn btn-sm btn-primary" style="cursor:pointer">${icon('upload')}Upload a photo<input type="file" accept="image/*" class="sr-only" data-rfile></label></div>
          <div class="seg" role="group" aria-label="View" style="align-self:flex-start;flex-wrap:wrap">${[['photo', 'Photo'], ['gray', 'Grayscale'], ['v3', '3 values'], ['v5', '5 values'], ['squint', 'Squint']].map(([k, t]) => `<button type="button" data-m="${k}" aria-pressed="${refState.mode === k}">${t}</button>`).join('')}</div>
          <div class="row"><button type="button" class="btn btn-sm btn-quiet" data-t="thirds" aria-pressed="${refState.thirds}">${icon('grid')}Thirds</button><button type="button" class="btn btn-sm btn-quiet" data-t="flip" aria-pressed="${refState.flip}">${icon('flip')}Mirror</button><button type="button" class="btn btn-sm btn-quiet" data-t="horizon" aria-pressed="${refState.horizon != null}">Horizon line</button></div>
          <div class="range" data-hzrow ${refState.horizon == null ? 'hidden' : ''}><label for="rhz">Horizon</label><input id="rhz" type="range" min="0" max="100" value="${refState.horizon ?? 50}" data-hz><span class="num" data-hzv>${refState.horizon ?? 50}%</span></div>
          <div data-thr ${refState.mode === 'v3' ? '' : 'hidden'} class="stack" style="gap:6px"><div class="range"><label for="rt1">Dark / middle</label><input id="rt1" type="range" min="10" max="240" value="${refState.t1}" data-t1><span class="num" data-t1v>${refState.t1}</span></div><div class="range"><label for="rt2">Middle / light</label><input id="rt2" type="range" min="15" max="250" value="${refState.t2}" data-t2><span class="num" data-t2v>${refState.t2}</span></div></div>
        </div>
        <div class="stack" style="gap:var(--s5);min-width:0">
          <section class="panel stack" aria-labelledby="h-an"><div class="row"><h3 id="h-an" style="flex:1">HILLS analysis</h3>${ai ? `<button type="button" class="btn btn-sm btn-primary" data-analyse>${icon('eye')}${A ? 'Analyse again' : 'Analyse with your teacher'}</button>` : ''}</div>
            ${ai ? '' : `<p class="tiny">Work through the five questions yourself. The tools on the left help with each one.</p>`}
            <div data-anout>${A && A.summary ? `<p class="prose" style="font-size:var(--t-16)">${esc(A.summary)}</p>` : ''}</div>
            <div class="stack" style="gap:var(--s3)">${C.HILLS.map((h, i) => `<div class="stack" style="gap:4px"><label for="hn${i}" class="label"><span style="font-family:var(--font-display);font-size:var(--t-22);color:var(--blue-ink);margin-right:6px">${h.k}</span>${esc(h.name)}: ${esc(h.q)}</label><textarea id="hn${i}" data-note="${i}" rows="2" style="width:100%;border:1px solid var(--rule-strong);border-radius:var(--r-ctl);background:var(--sheet);padding:8px;resize:vertical">${esc(refState.notes[i] || autoNote(A, i))}</textarea><span class="tiny">${esc(hint(i))}</span></div>`).join('')}</div>
          </section>
          ${A ? `<section class="panel stack"><h3>Details</h3><dl class="kv">${A.keep ? `<dt>Keep</dt><dd>${esc(A.keep.join(', '))}</dd>` : ''}${A.ignore ? `<dt>Simplify or leave out</dt><dd>${esc(A.ignore.join(', '))}</dd>` : ''}${A.atmosphere ? `<dt>Atmosphere</dt><dd>${esc(A.atmosphere)}</dd>` : ''}${A.pencils ? `<dt>Pencils</dt><dd>${esc(A.pencils)}</dd>` : ''}${A.difficulty ? `<dt>Difficulty</dt><dd>${esc(A.difficulty)}</dd>` : ''}</dl></section>` : ''}
          <section class="panel stack" aria-labelledby="h-plan"><h3 id="h-plan">Drawing plan</h3><ol class="plan">${planSteps.map((p, i) => `<li class="${refState.planDone.includes(i) ? 'done' : ''}"><div><b>${esc(p.title)}</b><p>${esc(p.do)}</p></div><input type="checkbox" aria-label="Done: ${esc(p.title)}" data-pd="${i}" ${refState.planDone.includes(i) ? 'checked' : ''}></li>`).join('')}</ol>
            <div class="row"><button type="button" class="btn btn-primary" data-drawref>${icon('pencil')}Draw from this reference</button><button type="button" class="btn" data-tosteps>${icon('layers')}Turn into a step-by-step</button></div></section>
        </div>
      </div>`;
    drawRef();
    const rerenderCanvas = () => drawRef();
    $$('[data-m]', view).forEach((b) => b.addEventListener('click', () => { refState.mode = b.dataset.m; $$('[data-m]', view).forEach((x) => x.setAttribute('aria-pressed', x === b)); $('[data-thr]', view).hidden = refState.mode !== 'v3'; rerenderCanvas(); }));
    $$('[data-t]', view).forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.t;
      if (k === 'horizon') { refState.horizon = refState.horizon == null ? 50 : null; $('[data-hzrow]', view).hidden = refState.horizon == null; b.setAttribute('aria-pressed', refState.horizon != null); }
      else { refState[k] = !refState[k]; b.setAttribute('aria-pressed', refState[k]); }
      rerenderCanvas();
    }));
    $('[data-hz]', view).addEventListener('input', (e) => { refState.horizon = +e.target.value; $('[data-hzv]', view).textContent = refState.horizon + '%'; drawOverlay(); });
    $('[data-t1]', view).addEventListener('input', (e) => { refState.t1 = Math.min(+e.target.value, refState.t2 - 5); $('[data-t1v]', view).textContent = refState.t1; rerenderCanvas(); });
    $('[data-t2]', view).addEventListener('input', (e) => { refState.t2 = Math.max(+e.target.value, refState.t1 + 5); $('[data-t2v]', view).textContent = refState.t2; rerenderCanvas(); });
    $$('[data-note]', view).forEach((t) => t.addEventListener('input', () => { refState.notes[t.dataset.note] = t.value; }));
    $$('[data-pd]', view).forEach((c) => c.addEventListener('change', () => { const i = +c.dataset.pd; refState.planDone = c.checked ? refState.planDone.concat(i) : refState.planDone.filter((x) => x !== i); c.closest('li').classList.toggle('done', c.checked); }));
    $('[data-rfile]', view).addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      if (!f.type.startsWith('image/')) return toast('Choose an image file.', 'alert');
      try { const c = await LD.fileToCanvas(f, 1400); refState = Object.assign({}, refState, { src: c.toDataURL('image/jpeg', 0.88), name: f.name, analysis: null, notes: {}, planDone: [], horizon: null }); renderReference(); }
      catch (err) { toast('That image could not be opened. Export it as JPEG and try again.', 'alert'); }
    });
    const an = $('[data-analyse]', view);
    if (an) an.addEventListener('click', () => analyseRef(an));
    $('[data-drawref]', view).addEventListener('click', () => { refStudy = { src: refState.src, plan: planSteps }; go('drill-ref'); });
    $('[data-tosteps]', view).addEventListener('click', () => { window.StepsView.useImage(refState.src, refState.name === 'Sample reference' ? 'Sample reference' : refState.name); go('steps'); });
  }
  function hint(i) { return ['Tool: turn on Horizon line and drag it to eye level.', 'Tool: Squint view merges details into big masses.', 'Tool: 5 values shows what is near (dark, detailed) and far (light, soft).', 'Tool: 3 values shows your light, middle and dark groups. Adjust the sliders.', 'Tool: Thirds grid helps you judge where the focal point sits.'][i]; }
  function autoNote(A, i) {
    if (!A) return '';
    return [
      A.horizon ? `About ${Math.round(A.horizon.yPercent)}% down. ${A.horizon.note || ''}${A.vanishingPoints && A.vanishingPoints.length ? ' Vanishing points: ' + A.vanishingPoints.map((v) => v.note || '').join('; ') : ''}` : '',
      (A.bigShapes || []).join('; '),
      A.layers ? `Foreground: ${A.layers.foreground}. Middle: ${A.layers.middleground}. Background: ${A.layers.background}.` : '',
      A.light ? `${A.light.direction}. Shadows: ${A.light.shadowShapes || ''} Darkest: ${A.light.darkest || ''}. Lightest: ${A.light.lightest || ''}.` : '',
      A.focalPoint ? `${A.focalPoint.description}. ${A.composition || ''}` : '',
    ][i] || '';
  }
  function defaultPlan(A) {
    const base = [
      ['Identify the composition', 'Decide the focal point and whether sky or land leads. Make one 2-minute thumbnail.'],
      ['Block in the largest shapes', 'Three to five masses in light 2H line. No detail.'],
      ['Establish the horizon and perspective', 'Light horizon line; vanishing points if anything is built or straight.'],
      ['Separate foreground, middle ground, background', 'Mark where each plane begins. Check overlaps.'],
      ['Establish the value groups', 'Squint. Lay one flat middle value, then the darks. Leave the lights as paper.'],
      ['Add the major landscape forms', 'Mountains as planes, trees as silhouettes on forms, rocks as blocks.'],
      ['Establish atmospheric depth', 'Lighten and soften the distance; keep the darkest darks in front.'],
      ['Add the important details', 'Only the details that tell the story, mostly near the focal point.'],
      ['Refine the focal point', 'Darkest dark beside lightest light; sharpest edges here.'],
      ['Finish the drawing', 'Clean edges, lift highlights, step back and check from a distance.'],
    ];
    if (A && Array.isArray(A.plan) && A.plan.length >= 5) return A.plan.slice(0, 10).map((p, i) => ({ title: p.title || base[i][0], do: p.do || p.instruction || base[i][1] }));
    return base.map(([title, d]) => ({ title, do: d }));
  }
  async function drawRef() {
    const cv = $('[data-rc]', view); if (!cv) return;
    let img;
    try { img = await LD.loadImage(refState.src); } catch (e) { return; }
    const Wm = 1200, s = Math.min(1, Wm / img.naturalWidth);
    const w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
    cv.width = w; cv.height = h;
    cv.parentElement.style.maxWidth = `min(100%, calc(72vh * ${(w / h).toFixed(3)}))`;
    const x = cv.getContext('2d');
    x.save(); if (refState.flip) { x.translate(w, 0); x.scale(-1, 1); }
    if (refState.mode === 'squint') {
      const t = document.createElement('canvas'); t.width = Math.max(8, Math.round(w / 24)); t.height = Math.max(5, Math.round(h / 24));
      const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(img, 0, 0, t.width, t.height);
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(t, 0, 0, w, h);
    } else x.drawImage(img, 0, 0, w, h);
    x.restore();
    if (refState.mode !== 'photo') {
      let d; try { d = x.getImageData(0, 0, w, h); } catch (e) { return drawOverlay(); }
      const p = d.data;
      const V = S.VAL.map((hx) => parseInt(hx.slice(1, 3), 16));
      for (let i = 0; i < p.length; i += 4) {
        let L = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        if (refState.mode === 'v3') L = L < refState.t1 ? V[8] : L < refState.t2 ? V[4] : V[0];
        else if (refState.mode === 'v5') L = V[[8, 6, 4, 2, 0][Math.min(4, Math.floor(L / 51.2))]];
        p[i] = p[i + 1] = p[i + 2] = L;
      }
      x.putImageData(d, 0, 0);
    }
    drawOverlay();
  }
  function drawOverlay() {
    const o = $('[data-ovl]', view); if (!o) return;
    const A = refState.analysis;
    const fx = (v) => (refState.flip ? 100 - v : v);
    let s = '';
    const B = '#3E8FC7';
    if (refState.thirds) [33.33, 66.67].forEach((v) => { s += `<line x1="${v}" y1="0" x2="${v}" y2="100" stroke="${B}" stroke-width=".3" stroke-dasharray="1.2 1" vector-effect="non-scaling-stroke"/><line x1="0" y1="${v}" x2="100" y2="${v}" stroke="${B}" stroke-width=".3" stroke-dasharray="1.2 1" vector-effect="non-scaling-stroke"/>`; });
    if (refState.horizon != null) s += `<line x1="0" y1="${refState.horizon}" x2="100" y2="${refState.horizon}" stroke="${B}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    if (A && A.focalPoint && A.focalPoint.xPercent != null) s += `<ellipse cx="${fx(A.focalPoint.xPercent)}" cy="${A.focalPoint.yPercent}" rx="5" ry="8" fill="none" stroke="${B}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`;
    if (A && A.vanishingPoints) A.vanishingPoints.forEach((v) => { if (v.xPercent >= 0 && v.xPercent <= 100) s += `<circle cx="${fx(v.xPercent)}" cy="${v.yPercent}" r="1.2" fill="${B}"/>`; });
    o.innerHTML = s;
  }
  async function analyseRef(btn) {
    btn.classList.add('is-busy'); btn.disabled = true;
    const out = $('[data-anout]', view);
    out.innerHTML = `<div class="thinking"><p class="small muted">Reading the reference. This usually takes 15 to 45 seconds.</p><div class="skeleton" style="width:85%"></div><div class="skeleton" style="width:60%"></div></div>`;
    try {
      const img = await LD.loadImage(refState.src);
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(img, 0, 0);
      const blob = await LD.toBlob(LD.canvasTo(c, 1400), 0.88);
      const prompt = `You are a landscape-drawing teacher. Analyse this landscape reference photo for a student who will draw it in graphite pencil, using the HILLS method: Horizon, bIg shapes, Layers, Light, Story. Teach them how to see it: what matters, what to simplify.
Reply with only this JSON (percentages are measured from the image's left and top edges):
{"summary": "2 sentences on what the scene is and what makes it work", "difficulty": "beginner | intermediate | advanced",
"horizon": {"yPercent": 0-100, "note": "how to find eye level here"},
"vanishingPoints": [{"xPercent": number, "yPercent": number, "note": "what converges there"}],
"bigShapes": ["3 to 5 largest masses, largest first"],
"layers": {"foreground": "...", "middleground": "...", "background": "..."},
"light": {"direction": "for example: from the upper left", "shadowShapes": "the main shadow shapes", "darkest": "where the darkest darks are", "lightest": "where the lightest lights are"},
"atmosphere": "how atmospheric perspective shows with distance",
"focalPoint": {"xPercent": number, "yPercent": number, "description": "what and why"},
"composition": "one sentence on the composition and any leading lines or framing",
"keep": ["details worth drawing"], "ignore": ["details to simplify or leave out"],
"pencils": "which grades for which areas",
"plan": [10 objects {"title": "...", "do": "specific instruction for THIS image"} in this order: identify the composition; block in the largest shapes; establish the horizon and perspective; separate foreground, middle ground and background; establish the value groups; add the major landscape forms; establish atmospheric depth; add the important details; refine the focal point; finish the drawing]}
Use an empty array for vanishingPoints if nothing built or straight recedes.`;
      const A = await LD.caps.sample.json(prompt, { images: blob, modelTier: 'default' });
      refState.analysis = A; refState.notes = {};
      if (A && A.horizon && typeof A.horizon.yPercent === 'number') refState.horizon = Math.round(A.horizon.yPercent);
      renderReference();
      toast('Analysis ready');
    } catch (e) {
      const code = e && e.code;
      out.innerHTML = `<div class="notice bad">${icon('alert')}<div>${code === 'rate_limited' ? 'Too many requests right now. Wait a minute and try again.' : code === 'not_granted' ? 'Analysis needs your permission to ask Claude.' : 'The analysis could not be completed. Try again, or work through the questions below yourself.'}</div></div>`;
      btn.classList.remove('is-busy'); btn.disabled = false;
    }
  }

  /* ================= SKILL MAP ================= */
  function renderSkills() {
    const Wd = 1120, colW = Wd / 6, top = 78, rowH = 104;
    const pos = {}, col = {};
    C.LESSONS.forEach((l) => { const ui = C.UNITS.findIndex((u) => u.id === l.unit); const k = C.LESSONS.filter((x) => x.unit === l.unit).indexOf(l); pos[l.id] = [colW * ui + colW / 2, top + k * rowH + 20]; col[l.id] = ui; });
    const maxRows = Math.max(...C.UNITS.map((u) => C.LESSONS.filter((l) => l.unit === u.id).length));
    const Hd = top + maxRows * rowH + 16;
    let edges = '', nodes = '';
    // a spine per unit: lessons inside a unit build on each other
    C.UNITS.forEach((u) => { const ls = C.LESSONS.filter((l) => l.unit === u.id); const a = pos[ls[0].id], b = pos[ls[ls.length - 1].id]; const d = ls.filter((l) => LD.isComplete(l.id)).length; edges += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="var(--rule-strong)" stroke-width="1.2"/>`; if (d) { const c = pos[ls[Math.min(d, ls.length - 1)].id]; edges += `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="var(--ink-3)" stroke-width="2"/>`; } });
    // cross-unit dependencies between neighbouring units
    C.LESSONS.forEach((l) => l.prereq.forEach((p) => {
      if (col[l.id] - col[p] !== 1) return;
      const [x1, y1] = pos[p], [x2, y2] = pos[l.id];
      const done = LD.isComplete(p);
      edges += `<path d="M${x1 + 20} ${y1} C ${x1 + colW * 0.55} ${y1}, ${x2 - colW * 0.55} ${y2}, ${x2 - 20} ${y2}" fill="none" stroke="${done ? 'var(--ink-3)' : 'var(--rule-strong)'}" stroke-width="${done ? 1.5 : 1}" ${done ? '' : 'stroke-dasharray="3 4"'}/>`;
    }));
    const wrap = (t) => { const w = t.split(' '); const lines = ['']; w.forEach((x) => { if ((lines[lines.length - 1] + ' ' + x).trim().length > 19) lines.push(x); else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + x).trim(); }); return lines.slice(0, 3); };
    C.LESSONS.forEach((l) => {
      const [x, y] = pos[l.id]; const st = LD.status(l);
      const g = {
        done: `<circle class="ring" cx="${x}" cy="${y}" r="18" fill="var(--ink)" stroke="var(--ink)"/><path d="M${x - 7} ${y} l5 5 l9 -10" stroke="var(--on-ink)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
        practice: `<circle class="ring" cx="${x}" cy="${y}" r="18" fill="var(--ink)" stroke="var(--warn)" stroke-width="3"/><path d="M${x - 7} ${y} l5 5 l9 -10" stroke="var(--on-ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
        active: `<circle class="ring" cx="${x}" cy="${y}" r="18" fill="var(--sheet)" stroke="var(--blue)" stroke-width="3.5"/><path d="M${x - 6} ${y} h11 m-4 -5 l5 5 -5 5" stroke="var(--blue)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
        open: `<circle class="ring" cx="${x}" cy="${y}" r="18" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="4" fill="var(--ink-3)"/>`,
        locked: `<circle class="ring" cx="${x}" cy="${y}" r="18" fill="var(--sheet-2)" stroke="var(--rule-strong)" stroke-width="1.4" stroke-dasharray="3 3"/><rect x="${x - 6}" y="${y - 1}" width="12" height="9" rx="1.5" fill="none" stroke="var(--ink-3)" stroke-width="1.6"/><path d="M${x - 3.5} ${y - 1} v-3 a3.5 3.5 0 0 1 7 0 v3" fill="none" stroke="var(--ink-3)" stroke-width="1.6"/>`,
      }[st];
      const lab = wrap(l.title);
      const stName = { done: 'mastered', practice: 'complete, practice recommended', active: 'currently learning', open: 'not started', locked: 'locked' }[st];
      nodes += `<a class="node" href="#lesson-${l.id}" data-id="${l.id}" data-st="${st}" aria-label="${esc(l.title)}: ${stName}">${g}${lab.map((t, i) => `<text paint-order="stroke" stroke="var(--sheet)" stroke-width="4" x="${x}" y="${y + 36 + i * 14}" text-anchor="middle" font-size="12.5" ${st === 'locked' ? 'fill="var(--ink-3)"' : ''} font-weight="${st === 'active' ? 700 : 500}">${esc(t)}</text>`).join('')}</a>`;
    });
    const heads = C.UNITS.map((u, i) => `<text class="tier" x="${colW * i + colW / 2}" y="28" text-anchor="middle">${u.n}. ${esc(u.title)}</text><text x="${colW * i + colW / 2}" y="46" text-anchor="middle" font-size="11" fill="var(--ink-3)">${esc(u.level)}</text>`).join('');
    const cur = LD.currentLesson();
    view.innerHTML = `<header class="page-head"><h1>Skill map</h1><p>Each skill unlocks when the skills it depends on are complete. Columns are course sections; curves show which skills feed the next section.</p></header>
      <div class="notice info" style="margin-bottom:var(--s5)">${icon('target')}<div>Currently learning: <a href="#lesson-${cur.id}"><b>${esc(cur.title)}</b></a> (${esc(cur.skill)})</div></div>
      <div class="tree-wrap"><svg class="tree" viewBox="0 0 ${Wd} ${Hd}" role="group" aria-label="Skill tree">${heads}${edges}${nodes}</svg></div>
      <div class="legend"><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="var(--ink)"/><path d="m7.5 12 3 3 6-6.5" stroke="var(--on-ink)" stroke-width="2" fill="none"/></svg>Mastered</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="var(--ink)" stroke="var(--warn)" stroke-width="2.5"/></svg>Complete, practice recommended</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--blue)" stroke-width="3"/></svg>Currently learning</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/></svg>Not started</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--rule-strong)" stroke-dasharray="3 3"/></svg>Locked</span></div>`;
    $$('.node[data-st="locked"]', view).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const l = C.byId[a.dataset.id]; toast('Complete ' + l.prereq.filter((p) => !LD.isComplete(p)).map((p) => C.byId[p].title).join(' and ') + ' to unlock.', 'lock'); }));
  }

  /* ================= SKETCHBOOK ================= */
  function renderSketchbook() {
    const f = renderSketchbook.filter || 'all';
    const ds = LD.state.drawings.filter((d) => f === 'all' || (f === 'lesson' && d.kind === 'lesson') || (f === 'drill' && d.kind === 'drill'));
    view.innerHTML = `<header class="page-head"><h1>Sketchbook</h1><p>Every drawing you submit, with the feedback it received. Look back every few weeks: the difference is the best motivation there is.</p></header>
      ${LD.state.drawings.length ? `<div class="filters seg" role="group" aria-label="Filter"><button type="button" data-f="all" aria-pressed="${f === 'all'}">All (${LD.state.drawings.length})</button><button type="button" data-f="lesson" aria-pressed="${f === 'lesson'}">Lessons</button><button type="button" data-f="drill" aria-pressed="${f === 'drill'}">Practice</button></div><div class="drawings">${ds.map(drawingCard).join('')}</div>${ds.length ? '' : '<p class="muted">Nothing in this filter yet.</p>'}` : emptyDrawings()}`;
    $$('[data-f]', view).forEach((b) => b.addEventListener('click', () => { renderSketchbook.filter = b.dataset.f; renderSketchbook(); }));
    wireDrawingCards();
  }
  function openDrawing(id) {
    const d = LD.state.drawings.find((x) => x.id === id); if (!d) return;
    const last = document.activeElement;
    const sc = document.createElement('div'); sc.className = 'scrim';
    sc.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="dlg-t"><button type="button" class="icon-btn close" aria-label="Close">${icon('x')}</button>
      <div class="stage" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)"><div class="stage-art" style="position:static"><div class="plate"><img src="${esc(LD.drawingSrc(d))}" alt="Drawing for ${esc(d.title)}" style="width:100%"></div></div>
      <div class="stage-text"><div class="stage-kicker"><b>${d.kind === 'lesson' ? 'Lesson drawing' : 'Practice drawing'}</b><span>·</span><span>${new Date(d.at).toLocaleDateString()}</span></div><h2 id="dlg-t">${esc(d.title)}</h2>
        ${d.feedback || d.self ? feedbackHTML(d) : `<p class="muted">No feedback yet.</p>${d.lessonId ? `<a class="btn btn-sm" href="#lesson-${d.lessonId}-7">Get feedback</a>` : ''}`}
        <div class="row">${d.lessonId ? `<a class="btn btn-sm" href="#lesson-${d.lessonId}">Open lesson</a>` : ''}<span class="spacer"></span><button type="button" class="btn btn-sm danger" data-del>${icon('trash')}Delete drawing</button></div></div></div></div>`;
    document.body.appendChild(sc);
    const close = () => { sc.remove(); document.removeEventListener('keydown', onKey); last && last.focus && last.focus(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    sc.addEventListener('click', (e) => { if (e.target === sc || e.target.closest('.close') || e.target.closest('a')) close(); });
    const del = $('[data-del]', sc);
    del.addEventListener('click', async () => {
      if (!del.dataset.confirm) { del.dataset.confirm = '1'; del.innerHTML = icon('trash') + 'Tap again to delete for good'; return; }
      await LD.deleteDrawing(id); close(); toast('Drawing deleted', 'trash'); route();
    });
    $('.close', sc).focus();
  }

  /* ================= PROGRESS ================= */
  function renderProgress() {
    const o = LD.overall();
    const st = LD.state;
    const tried = Object.values(st.lessons).filter((x) => x.tried).length + Object.values(st.drills).reduce((a, b) => a + b, 0);
    const fbN = st.drawings.filter((d) => d.feedback || d.self).length;
    const cur = LD.currentLesson();
    const strong = LD.strengths(), weak = LD.weaknesses();
    view.innerHTML = `<header class="page-head"><h1>Progress</h1><p>What you have completed, what you are strong in, and what to practise next.</p></header>
      <div class="stack" style="gap:var(--s3);max-width:720px"><div class="row"><b class="num" style="font-family:var(--font-display);font-size:var(--t-48);font-weight:400;line-height:1">${o.pct}%</b><span class="muted">of the course</span></div>${hatch(o.pct)}</div>
      <div class="stats section" style="margin-top:var(--s6)"><div><b>${o.done} / ${o.n}</b><span>Lessons complete</span></div><div><b>${tried}</b><span>Exercises and drills</span></div><div><b>${st.drawings.length}</b><span>Drawings submitted</span></div><div><b>${fbN}</b><span>Feedback received</span></div></div>
      <div class="two-col section">
        <section class="stack"><h2 style="font-size:var(--t-22)">Current skill</h2><a class="rec" href="#lesson-${cur.id}" style="text-decoration:none;color:inherit;border:0;padding:0"><div class="thumb" style="width:140px"><div class="plate">${thumbSVG(cur.thumb)}</div></div><div class="rec-body"><b style="font-family:var(--font-display);font-size:var(--t-22);font-weight:500">${esc(cur.skill)}</b><span class="small muted">Lesson ${cur.n}: ${esc(cur.title)}</span>${chip(LD.status(cur))}</div></a>
          <h3 style="font-size:var(--t-18);margin-top:var(--s4)">Strengths</h3>${strong.length ? `<ul class="list-plain">${strong.map((a) => `<li>${icon('check')}${esc(C.AREAS[a])}</li>`).join('')}</ul>` : '<p class="small muted">Strengths appear after a few consistent results in the same skill.</p>'}
          <h3 style="font-size:var(--t-18);margin-top:var(--s4)">Currently practising</h3>${weak.length ? `<ul class="list-plain">${weak.map((a) => `<li>${icon('right')}${esc(C.AREAS[a])} <a href="#practice" class="small" style="margin-left:auto">Drills</a></li>`).join('')}</ul>` : `<ul class="list-plain"><li>${icon('right')}${esc(cur.skill)}</li></ul>`}
        </section>
        <section class="stack"><h2 style="font-size:var(--t-22)">Skills</h2><div class="skillbars">${Object.entries(C.AREAS).map(([a, t]) => { const r = LD.areaLevel(a); return `<div class="skillbar"><span>${esc(t)}</span>${r ? hatch(Math.round(r.level * 100), 'thin') : '<span class="tiny">Not enough data yet</span>'}<span class="v">${r ? Math.round(r.level * 100) + '%' : ''}</span></div>`; }).join('')}</div>
          <p class="tiny">Skill levels combine your exercise answers, checkpoints and drawing feedback, weighted toward your most recent work.</p></section>
      </div>
      <section class="section"><div class="section-head"><h2>By section</h2><span class="spacer"></span><a href="#skills">Skill map</a></div>
        <div class="skillbars">${C.UNITS.map((u) => { const ls = C.LESSONS.filter((l) => l.unit === u.id); const d = ls.filter((l) => LD.isComplete(l.id)).length; return `<div class="skillbar"><span>${u.n}. ${esc(u.title)}</span>${hatch(Math.round((d / ls.length) * 100), 'thin')}<span class="v">${d}/${ls.length}</span></div>`; }).join('')}</div></section>
      <section class="section"><div class="section-head"><h2>Practice drawings</h2><span class="spacer"></span>${st.drawings.length ? '<a href="#sketchbook">Sketchbook</a>' : ''}</div>${st.drawings.length ? `<div class="drawings">${st.drawings.slice(0, 6).map(drawingCard).join('')}</div>` : emptyDrawings()}</section>`;
    wireDrawingCards();
  }

  /* ================= SETTINGS / YOU ================= */
  function renderSettings() {
    const st = LD.state.settings;
    const ai = LD.caps.sample && LD.caps.imageOk;
    view.innerHTML = `<header class="page-head"><h1>Settings</h1></header>
      <div style="max-width:720px">
        <div class="setting"><div><b>Theme</b><p>The drawing plates always stay paper-coloured so values read true.</p></div><div class="seg" role="group" aria-label="Theme">${[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([k, t]) => `<button type="button" data-th="${k}" aria-pressed="${st.theme === k}">${t}</button>`).join('')}</div></div>
        <div class="setting"><div><b>Open all lessons</b><p>For experienced artists: skip the prerequisites and open any lesson.</p></div><label class="switch"><input type="checkbox" id="s-open" ${st.openAll ? 'checked' : ''} aria-label="Open all lessons"><span></span></label></div>
        <div class="setting"><div><b>Teacher feedback</b><p>${ai ? 'Available. Drawings and references are sent to Claude only when you ask for feedback or analysis.' : LD.caps.checked ? 'Not available on this version. Self-review and all exercises still work.' : 'Checking…'}</p></div><span class="chip ${ai ? 'done' : ''}">${ai ? icon('check') + 'On' : 'Off'}</span></div>
        <div class="setting"><div><b>Where progress is saved</b><p>${LD.caps.synced ? 'Your account, private to you. It follows you to other devices.' : 'This browser only. Clearing site data removes it.'}</p></div></div>
        <div class="setting"><div><b>Reset progress</b><p>Clears lessons, exercises, drawings and feedback. This cannot be undone.</p></div><button type="button" class="btn btn-sm danger" data-reset>Reset</button></div>
        <section class="section stack" aria-labelledby="h-src"><h2 id="h-src" style="font-size:var(--t-22)">About this course</h2>
          <p class="prose" style="font-size:var(--t-16)">The teaching method is built on the “How To Draw Landscapes and Nature” playlist by Cartooning Club Z. The course was designed by studying each demonstration’s frame sequence, which shows how the drawing is built from blank page to finish. The narration was not available, so lesson text reflects what the drawings show rather than quotes from the videos. All lesson text and illustrations are original; watch the videos for the full demonstrations.</p>
          <ul class="list-plain">${Object.values(C.VIDEOS).map((v) => `<li>${icon('video')}<a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">${esc(v.title)}</a></li>`).join('')}</ul>
        </section>
      </div>`;
    $$('[data-th]', view).forEach((b) => b.addEventListener('click', () => { st.theme = b.dataset.th; LD.save(); LD.applyTheme(); renderSettings(); }));
    $('#s-open', view).addEventListener('change', (e) => { st.openAll = e.target.checked; LD.save(); toast(st.openAll ? 'All lessons are open' : 'Prerequisites are back on'); });
    const r = $('[data-reset]', view);
    r.addEventListener('click', () => { if (!r.dataset.confirm) { r.dataset.confirm = '1'; r.textContent = 'Tap again to erase everything'; return; } LD.state.drawings.slice().forEach((d) => LD.deleteDrawing(d.id)); LD.resetState(); toast('Progress reset'); go('home'); });
  }
  function renderYou() {
    const o = LD.overall();
    view.innerHTML = `<header class="page-head"><h1>You</h1><p class="num">${o.pct}% of the course · ${o.done} of ${o.n} lessons</p>${hatch(o.pct)}</header>
      <ul class="list-plain" style="max-width:640px">${[['skills', 'Skill map', 'tree', 'What you have mastered and what unlocks next'], ['sketchbook', 'Sketchbook', 'book', LD.state.drawings.length + ' drawings with feedback'], ['progress', 'Progress', 'chart', 'Strengths, weak areas and skill levels'], ['settings', 'Settings', 'settings', 'Theme, lesson access, reset']].map(([k, t, ic, d]) => `<li style="padding:0"><a href="#${k}" class="row" style="text-decoration:none;color:inherit;padding:var(--s4) 0;flex:1;flex-wrap:nowrap">${icon(ic)}<span class="stack" style="gap:2px;flex:1"><b>${t}</b><span class="small muted">${esc(d)}</span></span>${icon('right')}</a></li>`).join('')}</ul>`;
  }

  /* ---------- boot ---------- */
  function boot() {
    S.injectDefs();
    LD.applyTheme();
    window.addEventListener('hashchange', route);
    LD.onChange((why) => { const r = location.hash.slice(1) || 'home'; renderNav(r); if (why === 'caps') { if (['settings', 'reference', 'home', 'progress', 'steps'].includes(r) || /^lesson-[a-z]+-7$/.test(r)) route(); } });
    route();
    LD.initCaps();
  }
  boot();
})();
