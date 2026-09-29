/* Course content. Method distilled from the five demonstrations in Cartooning Club Z's
   "How To Draw Landscapes and Nature" playlist (observed frame by frame): light horizon first,
   big shapes in light line, back-to-front layering, value last, darkest dark at the focal point.
   Lesson text and plates are original to this course. */
(function () {
  const VIDEOS = {
    cabin: { id: 'MI76P64vGSs', title: 'How To Draw a Lakeside Cabin Landscape' },
    bridge: { id: 'Y0hS5IImpW8', title: 'How To Draw a River Bridge Landscape' },
    waterfall: { id: '9jYSh9ibKz8', title: 'How To Draw Waterfall Landscape' },
    mountain: { id: 'OszDX5lBQmc', title: 'How To Draw a Mountain Landscape' },
    forest: { id: 'tNeYrGUreew', title: 'How To Draw a Forest Landscape' },
  };

  const AREAS = {
    shapes: 'Shape simplification',
    line: 'Line and mark-making',
    value: 'Value',
    composition: 'Composition',
    depth: 'Depth and atmosphere',
    perspective: 'Perspective',
    light: 'Light and shadow',
    elements: 'Landscape elements',
  };

  const UNITS = [
    { id: 'u1', n: 1, title: 'Seeing', sub: 'Horizon, big shapes, line, form and value: the five habits every drawing starts from.', level: 'Beginner', thumb: { scene: 'hills', mode: 'notan' } },
    { id: 'u2', n: 2, title: 'Composition', sub: 'Decide what the drawing is about before you draw it.', level: 'Beginner', thumb: { scene: 'hills', params: { path: true } } },
    { id: 'u3', n: 3, title: 'Depth', sub: 'Planes, overlap, scale, perspective and air.', level: 'Intermediate', thumb: { scene: 'road' } },
    { id: 'u4', n: 4, title: 'Light and value', sub: 'One light source, clear shadow shapes, three value groups.', level: 'Intermediate', thumb: { scene: 'forms' } },
    { id: 'u5', n: 5, title: 'Landscape elements', sub: 'Skies, mountains, trees, rocks, water and buildings as simple, repeatable forms.', level: 'Intermediate', thumb: { scene: 'trees' } },
    { id: 'u6', n: 6, title: 'Complete landscapes', sub: 'Analyse any reference with HILLS, then draw it your way.', level: 'Advanced', thumb: { scene: 'mountainLake' } },
  ];

  /* HILLS: the analysis system used across the course. */
  const HILLS = [
    { k: 'H', name: 'Horizon', q: 'Where is eye level? Where do parallel lines meet?', draw: 'Draw a light horizon line first. Mark vanishing points if there are built or straight-edged things.' },
    { k: 'I', name: 'Big shapes', q: 'What are the 3 to 5 biggest shapes?', draw: 'Block them in with light, loose lines. No detail yet.' },
    { k: 'L', name: 'Layers', q: 'What is foreground, middle ground, background? What overlaps what?', draw: 'Separate the planes. Far things smaller, lighter, simpler.' },
    { k: 'L', name: 'Light', q: 'Where is the light from? Where are the shadow shapes and the darkest darks?', draw: 'Group values into light, middle and dark. Shade planes turned away from the light.' },
    { k: 'S', name: 'Story', q: 'What is the focal point? Which details matter and which can go?', draw: 'Put the strongest contrast and sharpest detail at the focal point. Leave the rest quiet.' },
  ];

  const L = [];
  const add = (o) => L.push(o);

  /* ================= UNIT 1 — SEEING ================= */
  add({
    id: 'horizon', unit: 'u1', n: 1, title: 'The horizon line', skill: 'Finding eye level', area: 'perspective', level: 1, minutes: 20,
    prereq: [],
    thumb: { scene: 'mountainLake', overlays: [{ t: 'horizon', label: '' }] },
    intro: 'Every landscape demonstration in the source playlist starts the same way: one light horizontal line across the page. This lesson is about that line.',
    what: 'The horizon line is your eye level. It is where the sky meets flat ground or calm water, and it is where parallel lines in the scene appear to meet.',
    why: 'Everything else is measured against it. Mountains rise above it, lakes and fields spread below it, and anything built on the ground lines up with it. Place it first and the rest of the drawing has somewhere to stand.',
    visual: { scene: 'mountainLake', overlays: [{ t: 'horizon' }, { t: 'label', x: 520, y: 470, text: 'Water surface stays below eye level', to: [470, 360] }, { t: 'label', x: 120, y: 60, text: 'Peaks rise above it', to: [320, 110] }], cap: 'The lake edge is the horizon. Mountains break above it; the reflections and shore sit below it.',
      callouts: [['1', 'On flat land or water the horizon is visible. In hills or forests it is often hidden, but it still exists at your eye level.'], ['2', 'A low horizon gives you more sky. A high horizon gives you more ground.'], ['3', 'Draw it lightly. It is a guide, not a finished line.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Draw the horizon', d: 'One light line with a hard pencil. It sits a little below the middle here, so the mountains get room.', show: [], ov: [{ t: 'horizon' }] },
        { t: 'Hang the mountains on it', d: 'The ridgelines start from the horizon and climb. Their bases all touch the same line.', show: ['far', 'near'], line: ['far', 'near'], ov: [{ t: 'horizon' }] },
        { t: 'Add the far shore', d: 'The distant tree line sits right on the horizon. Small, even marks.', show: ['far', 'near', 'treeline'], line: ['far', 'near'], ov: [{ t: 'horizon' }] },
        { t: 'Below the line: water', d: 'Everything below eye level on a lake is water surface. The reflections hang directly under what they reflect.', show: ['sky', 'far', 'near', 'treeline', 'lake'], ov: [{ t: 'horizon' }] },
        { t: 'Foreground last', d: 'Big, dark pines overlap the horizon and frame the view.', show: null, ov: [] },
      ],
    },
    watch: { v: 'mountain', t: 85, note: 'Watch the first minutes: a single light horizontal line goes down before anything else.' },
    guided: { time: 8, steps: ['Draw a rectangle about 15 × 10 cm.', 'Draw a light horizon line one third up from the bottom.', 'In a second rectangle, draw it one third down from the top.', 'In each, add one simple mountain shape whose base touches the horizon.', 'Look at both. Which feels like a sky scene, which like a ground scene?'], tip: 'Use your hardest pencil (2H or HB) and barely press. You should be able to erase it without a trace.' },
    exercise: { type: 'line', scene: 'cabin', prompt: 'Click where the horizon line is in this scene.', answer: 300, tol: 22, reveal: [{ t: 'horizon' }], right: 'Yes. The water meets the far shore at eye level, and the cabin’s lines converge toward it.', wrong: 'Look for where calm water meets land in the distance. That edge is eye level.' },
    yourTurn: { title: 'Three horizons', brief: 'Draw the same simple lake scene three times, changing only the horizon height.', do: ['Horizon low (one third from the bottom)', 'Horizon in the middle', 'Horizon high (one third from the top)', 'Same mountain, same shore in all three', 'Light lines only; 5 minutes per sketch'], time: 15, stretch: 'Add a fourth sketch looking down from a hill: the horizon near the very top.' },
    criteria: ['A horizon line is clearly placed in each sketch', 'Mountain bases sit on the horizon', 'Heights differ clearly between sketches', 'Lines are light and controlled'],
    checkpoint: [
      { q: 'What does the horizon line represent?', o: ['The top edge of the ground', 'Your eye level', 'The middle of the page', 'Where the sky is darkest'], a: 1, why: 'The horizon is always at the viewer’s eye level, whether or not you can see it.' },
      { q: 'You want the sky to be the main subject. Where does the horizon go?', o: ['Low on the page', 'Exactly in the middle', 'High on the page', 'It does not matter'], a: 0, why: 'A low horizon leaves most of the page for sky.' },
      { q: 'You are standing in a dense forest and cannot see the horizon. Does it still exist?', o: ['No', 'Yes, at your eye level', 'Only if there is a path', 'Only at sunset'], a: 1, why: 'It is a property of where your eyes are, not of what is visible.' },
    ],
    next: 'Next you will reduce a whole landscape to three to five big shapes.',
  });

  add({
    id: 'bigshapes', unit: 'u1', n: 2, title: 'Big shapes first', skill: 'Shape simplification', area: 'shapes', level: 1, minutes: 25,
    prereq: ['horizon'],
    thumb: { scene: 'mountainLake', overlays: [{ t: 'shapes' }] },
    intro: 'Beginners draw leaves. Artists draw the tree. Before any detail, a landscape is a handful of large, simple shapes.',
    what: 'Shape simplification means seeing a scene as 3 to 5 large flat shapes: sky, mountain mass, water, a clump of trees. You draw those first, as outlines, before any texture.',
    why: 'Big shapes carry the composition. If they are wrong, no amount of detail fixes the drawing. If they are right, even a rough sketch reads clearly from across the room.',
    visual: { scene: 'mountainLake', overlays: [{ t: 'shapes' }], cap: 'Four shapes: sky, mountains, lake, pines. Everything else is detail inside them.',
      callouts: [['1', 'Squint. Details disappear and only large masses remain.'], ['2', 'Each shape should be clearly different in size. Avoid equal halves.'], ['3', 'Count them. More than five means you are still seeing detail.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Squint at the scene', d: 'Half-close your eyes until the pines become one dark mass and the mountains one silhouette.', show: null, mode: 'notan', ov: [] },
        { t: 'Outline the largest shape', d: 'The mountain mass: one continuous line along the ridge, touching the horizon at both ends.', show: [], ov: [{ t: 'horizon' }, { t: 'line', pts: [[0, 230], [90, 226], [190, 262], [330, 96], [430, 214], [520, 180], [610, 250], [660, 162], [740, 196], [800, 180]] }] },
        { t: 'Then the next largest', d: 'The pine mass on the right, as one shape. Not individual trees yet.', show: [], ov: [{ t: 'horizon' }, { t: 'shapes' }] },
        { t: 'Only now, the pieces', d: 'Inside each shape you can start separating ridges, trees and shoreline.', show: ['far', 'near', 'treeline', 'fg'], line: ['far', 'near', 'treeline', 'fg'], ov: [] },
        { t: 'Detail goes into the shapes', d: 'Value and texture are added last and never break the big shapes.', show: null, ov: [] },
      ],
    },
    watch: { v: 'waterfall', t: 290, note: 'The rock wall on the left is laid in as a stack of simple outlined masses before any shading.' },
    guided: { time: 10, steps: ['Pick any landscape photo on your phone.', 'Squint until you see only 3–5 masses.', 'Draw a 10 × 7 cm box.', 'Draw only the outlines of those masses. No details.', 'Label each shape with a number from largest to smallest.'], tip: 'If you are drawing individual leaves, rocks or waves, stop. Zoom out.' },
    exercise: { type: 'choose', prompt: 'Which sketch simplifies this scene into big shapes correctly?', options: [
      { scene: 'mountainLake', mode: 'notan', cap: 'A' },
      { scene: 'mountainLake', mode: 'line', cap: 'B' },
      { scene: 'mountainLake', overlays: [{ t: 'shapes' }], cap: 'C' },
    ], answer: 2, explain: 'C groups the scene into four large masses. A shows values, which comes later. B already draws every ridge and tree outline, which is detail.' },
    yourTurn: { title: 'A landscape in three shapes', brief: 'Draw a landscape using only three major shapes. Then add a fourth only if the drawing needs it.', do: ['Use any photo or the plate on this page', 'Outlines only, no shading', 'Make the three shapes clearly different sizes', '10 minutes'], time: 10, stretch: 'Do it again from a busier scene (a forest or a town) and still stop at five shapes.' },
    criteria: ['3–5 clear shapes', 'Shapes vary in size', 'No premature detail', 'Shapes read as a landscape at thumbnail size'],
    checkpoint: [
      { q: 'What should you draw first?', o: ['The most interesting detail', 'The largest shapes', 'The darkest shadows', 'Textures'], a: 1, why: 'Big shapes carry the composition; details go inside them later.' },
      { q: 'How many major shapes should a simple landscape have?', o: ['1–2', '3–5', '10–15', 'As many as you see'], a: 1, why: 'Three to five keeps the design readable.' },
      { q: 'Why squint at a reference?', o: ['To rest your eyes', 'To see colour better', 'To merge details into large masses', 'To find the horizon'], a: 2, why: 'Squinting blurs detail so the big shapes and value groups stand out.' },
    ],
    next: 'Next: controlling your line, so construction stays light and finished lines are deliberate.',
  });

  add({
    id: 'line', unit: 'u1', n: 3, title: 'Light lines, dark decisions', skill: 'Line control', area: 'line', level: 1, minutes: 20,
    prereq: ['horizon'],
    thumb: { svg: 'lineWeights' },
    intro: 'In every demonstration the first lines are faint enough to vanish on camera. Darkness comes later and only where it is earned.',
    what: 'Line control means choosing how light, dark, thick or thin a line is on purpose. Construction lines are light and searching. Contour lines are steady. Accent lines are dark and rare.',
    why: 'Light early lines can be corrected. Dark early lines become mistakes you have to draw around. Line weight also creates depth: thin and light recedes, thick and dark comes forward.',
    visual: { svg: 'pencils', cap: 'Harder leads (H) stay light and crisp. Softer leads (B) go darker and smudge. Build from hard to soft.',
      callouts: [['2H', 'Construction lines and the horizon.'], ['HB', 'Main contours and light shading.'], ['2B–4B', 'Shadow planes and middle darks.'], ['6B', 'Only the darkest darks, near the focal point.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Construction', d: 'Light, fast lines with the whole arm. It is fine to draw a ridge three times.', show: ['far', 'near'], line: ['far', 'near'], ov: [{ t: 'horizon' }] },
        { t: 'Contour', d: 'Commit to one of the searching lines with steady pressure. Lighten the rest with a kneaded eraser.', show: ['far', 'near', 'treeline', 'fg'], line: ['far', 'near', 'treeline', 'fg'], ov: [] },
        { t: 'Accents', d: 'Dark lines only where one form overlaps another near you: the base of the pines, the shore.', show: null, ov: [{ t: 'label', x: 430, y: 470, text: 'Accent: dark, only in the foreground', to: [560, 452] }] },
      ],
    },
    watch: { v: 'cabin', t: 120, note: 'Notice how faint the horizon and first perspective lines are; they almost disappear on camera.' },
    guided: { time: 10, steps: ['Fill one row with the lightest line you can draw, holding the pencil far from the tip.', 'Fill a second row with medium pressure.', 'Fill a third row pressing hard with a soft pencil.', 'Draw one mountain ridge three times in light line, then trace the best one in medium.', 'Erase the other two with a kneaded eraser.'], tip: 'Hold the pencil overhand (like a knife, not a pen) for construction. It keeps pressure light.' },
    exercise: { type: 'order', prompt: 'Put these pencil uses in the order you would use them in a drawing.', items: [
      { id: 'a', text: 'Light construction lines (2H)' },
      { id: 'b', text: 'Committed contours (HB)' },
      { id: 'c', text: 'Middle-value shading (2B)' },
      { id: 'd', text: 'Darkest accents at the focal point (6B)' },
    ], answer: ['a', 'b', 'c', 'd'], explain: 'Work light to dark and loose to precise. Every step can still be corrected until the darkest accents go in.' },
    yourTurn: { title: 'Line weight landscape', brief: 'Draw a simple lake with mountains using three line weights only.', do: ['Light: distant mountains', 'Medium: middle shore and tree line', 'Dark: one foreground element', 'No shading'], time: 15, stretch: 'Make the same drawing using only line weight to show depth, with no overlap.' },
    criteria: ['Three distinct line weights', 'Lightest lines are in the distance', 'Dark accents are few and deliberate', 'Construction lines are erased or faint'],
    checkpoint: [
      { q: 'Which pencil is best for construction lines?', o: ['6B', '4B', '2H', 'Charcoal'], a: 2, why: 'Hard leads make light lines that erase cleanly.' },
      { q: 'Thin, light lines tend to make an object feel…', o: ['Closer', 'Farther away', 'Larger', 'Darker'], a: 1, why: 'Line weight is a depth cue: light and thin recedes.' },
      { q: 'When should the darkest lines go in?', o: ['First', 'Anywhere', 'Last, where forms overlap near you', 'Along the horizon'], a: 2, why: 'Dark accents are hard to undo, so they come last and only where they help.' },
    ],
    next: 'Next: seeing nature as a few basic forms.',
  });

  add({
    id: 'forms', unit: 'u1', n: 4, title: 'Basic forms in nature', skill: 'Form', area: 'shapes', level: 1, minutes: 25,
    prereq: ['bigshapes'],
    thumb: { scene: 'forms' },
    intro: 'A pine is a cone. A bush is a sphere. A trunk is a cylinder. A cabin and most rocks are boxes.',
    what: 'Basic forms are the solid versions of shapes. Seeing a tree as a cone tells you where its light side and shadow side are before you draw a single branch.',
    why: 'Shapes are flat; forms have a lit side and a shadow side. Landscapes look three-dimensional only when you shade the form underneath the texture.',
    visual: { scene: 'forms', overlays: [{ t: 'light' }, { t: 'label', x: 60, y: 460, text: 'Sphere: bush, cloud', to: [150, 392] }, { t: 'label', x: 250, y: 460, text: 'Box: rock, cabin', to: [330, 380] }, { t: 'label', x: 470, y: 460, text: 'Cone: pine', to: [520, 390] }, { t: 'label', x: 640, y: 470, text: 'Cylinder: trunk', to: [690, 400] }], cap: 'Light from the upper left. Every form has a lit side, a shadow side and a cast shadow.',
      callouts: [['○', 'Sphere → bushes, tree crowns, cumulus clouds'], ['□', 'Box → rocks, cabins, cliffs'], ['△', 'Cone → pines, mountain peaks'], ['▭', 'Cylinder → trunks, waterfalls, towers']] },
    demo: {
      scene: 'trees',
      steps: [
        { t: 'Start with the form', d: 'A cone for the pine, a sphere on a cylinder for the round tree.', show: ['bg', 't1', 't5'], line: ['t1', 't5'], ov: [] },
        { t: 'Shade the form, not the leaves', d: 'The side away from the light gets one flat middle-dark tone.', show: ['bg', 't1', 't5'], ov: [{ t: 'arrow', from: [40, 40], to: [110, 100], label: 'Light' }] },
        { t: 'Texture follows', d: 'Branch edges and leaf clumps sit on top of the form, darker on the shadow side.', show: null, ov: [] },
      ],
    },
    guided: { time: 12, steps: ['Draw a sphere, box, cone and cylinder in a row.', 'Choose a light direction and draw a small arrow.', 'Shade the side of each form facing away from the light.', 'Under each, draw its landscape twin: bush, rock, pine, trunk.', 'Shade the twins exactly like their forms.'], tip: 'One flat tone for the shadow side is enough. Smooth blending can wait.' },
    exercise: { type: 'regions', scene: 'forms', prompt: 'Label the three parts of the sphere’s light pattern. Pick a label, then click the area.', labels: ['Light side', 'Form shadow', 'Cast shadow'], key: { lit: 'Light side', form: 'Form shadow', cast: 'Cast shadow' }, explain: 'The form shadow is on the object, turning away from the light. The cast shadow falls on the ground, on the opposite side from the light.' },
    yourTurn: { title: 'Forms become landscape', brief: 'Draw a small scene built from the four forms: a cone pine, a sphere bush, a box rock and a cylinder trunk, all lit from the same side.', do: ['One light direction, marked with an arrow', 'Each object shows a lit and a shadow side', 'Add cast shadows on the ground', '15 minutes'], time: 15, stretch: 'Redraw it lit from the other side.' },
    criteria: ['Each object reads as a simple form', 'Light direction is consistent', 'Shadow sides are on the correct side', 'Cast shadows point away from the light'],
    checkpoint: [
      { q: 'A pine tree is best simplified as a…', o: ['Sphere', 'Cone', 'Box', 'Cylinder'], a: 1, why: 'Wide base, pointed top: a cone.' },
      { q: 'The form shadow is…', o: ['The shadow on the ground', 'The side of the object facing away from light', 'The darkest spot in the sky', 'A reflection'], a: 1, why: 'Form shadow is on the object; cast shadow is on the surface it sits on.' },
      { q: 'Why shade the form before adding texture?', o: ['It is faster', 'Texture alone does not show 3D volume', 'Texture must be dark', 'It is not necessary'], a: 1, why: 'Volume comes from light and shadow on the form. Texture rides on top.' },
    ],
    next: 'Next: the value scale, the tool for every shading decision in this course.',
  });

  add({
    id: 'values', unit: 'u1', n: 5, title: 'The value scale', skill: 'Seeing value', area: 'value', level: 1, minutes: 25,
    prereq: ['bigshapes'],
    thumb: { svg: 'valueScale' },
    intro: 'Value is how light or dark something is, with colour ignored. Graphite drawing is nothing but value.',
    what: 'A value scale runs from the white of the paper (1) to your darkest pencil (9). Every area of a landscape can be matched to a step on that scale.',
    why: 'Value creates depth, light and focus. Drawings that look flat usually use only a narrow band of middle values. Seeing the full range is the first step to using it.',
    visual: { svg: 'valueScale', svgOpts: { labels: [[0, 'paper'], [4, 'middle'], [8, '6B']] }, cap: 'Nine steps from paper white to the darkest graphite. Most landscapes group into three: light (1–3), middle (4–6), dark (7–9).',
      callouts: [['1–3', 'Sky, distant mountains, light on water.'], ['4–6', 'Middle-distance land, shadow planes in the distance.'], ['7–9', 'Near trees, shadows close to you, the accent at the focal point.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'The scene in full value', d: 'Look for the lightest light and the darkest dark first.', show: null, ov: [] },
        { t: 'Mark reference points', d: 'Sky ≈ 1, distant range ≈ 3, mountain shadow ≈ 7, near pines ≈ 9, lake ≈ 2.', show: null, ov: [{ t: 'probe' }] },
        { t: 'Group into three', d: 'Reduce everything to light, middle and dark. The picture still reads.', show: null, mode: 'notan', ov: [] },
      ],
    },
    guided: { time: 12, steps: ['Draw nine boxes in a row.', 'Leave box 1 as paper. Press as hard as you can with a soft pencil in box 9.', 'Fill box 5 as a middle grey.', 'Fill 3 and 7, then the rest, until the steps are even.', 'Squint: every step should be distinct from its neighbours.'], tip: 'Build dark values in layers of light strokes rather than one hard press. It avoids shiny graphite.' },
    exercise: { type: 'values', scene: 'mountainLake', prompt: 'Match each marked spot to a value from 1 (light) to 9 (dark). Within one step counts as correct.', explain: 'The sky and lake are near white. The distant range is a light grey because of air. The shadow side of the main peak is a middle-dark. The foreground pines are the darkest thing in the picture.' },
    yourTurn: { title: 'Value scale and value study', brief: 'Make a nine-step value scale, then a small landscape study using only values 1, 5 and 9.', do: ['Even steps on the scale', 'Study: 8 × 5 cm, three values only', 'Put the darkest value in the foreground', '20 minutes'], time: 20, stretch: 'Make a five-step scale with a single HB pencil, using only pressure and layering.' },
    criteria: ['Scale steps are even and distinct', 'Study uses the full range from paper to dark', 'Only three values in the study', 'Dark is placed in the foreground'],
    checkpoint: [
      { q: 'Value means…', o: ['Colour', 'Lightness or darkness', 'Line thickness', 'How important something is'], a: 1, why: 'Value is lightness or darkness, independent of colour.' },
      { q: 'A drawing looks flat and grey. What is the most likely value problem?', o: ['Too much contrast', 'Only middle values are used', 'Too many lines', 'The horizon is low'], a: 1, why: 'Flat drawings usually lack true lights and true darks.' },
      { q: 'What is the best way to reach a very dark value?', o: ['One hard press with 2H', 'Layering soft pencil in several passes', 'Smudging with a finger', 'Outlining'], a: 1, why: 'Layered soft graphite gets dark without burnishing the paper.' },
    ],
    next: 'Unit 2: composition. First, where to put the horizon.',
  });

  /* ================= UNIT 2 — COMPOSITION ================= */
  add({
    id: 'placement', unit: 'u2', n: 6, title: 'Placing the horizon', skill: 'Dividing the picture', area: 'composition', level: 1, minutes: 20,
    prereq: ['horizon', 'bigshapes'],
    thumb: { scene: 'hills', params: { h: 330 }, overlays: [{ t: 'thirds' }] },
    intro: 'The first compositional decision is where the horizon cuts the page. It decides what your picture is about.',
    what: 'Dividing the picture means choosing unequal proportions for sky and land. A thirds grid is a simple guide: put the horizon near one of the horizontal thirds, not the middle.',
    why: 'A centred horizon splits the page into two equal halves that compete. Unequal areas give one part the lead: a big sky, or a big foreground.',
    visual: { scene: 'hills', params: { h: 330 }, overlays: [{ t: 'thirds' }, { t: 'horizon', y: 330 }], cap: 'Horizon on the lower third. The sky gets two thirds of the page and becomes the subject.',
      callouts: [['⅓', 'Low horizon: sky scenes, clouds, sunsets, mountains.'], ['⅔', 'High horizon: fields, paths, rivers, foreground detail.'], ['½', 'Avoid the middle unless calm symmetry is the point, like a still reflection.']] },
    demo: {
      scene: 'hills',
      steps: [
        { t: 'Draw a thirds grid', d: 'Two light lines across, two down. They are guides, not rules.', show: [], ov: [{ t: 'thirds' }] },
        { t: 'Decide the subject', d: 'Here the sky and the tree matter most, so the horizon drops to the lower third.', show: [], ov: [{ t: 'thirds' }, { t: 'horizon', y: 330 }] },
        { t: 'Build on it', d: 'The rest of the landscape hangs from that one decision.', show: null, params: { h: 330 }, ov: [{ t: 'thirds' }] },
      ],
      params: { h: 330 },
    },
    guided: { time: 8, steps: ['Draw three small boxes.', 'Horizon at the lower third, the middle and the upper third.', 'Add the same tree to each.', 'Circle the one where the sky feels most important.'], tip: 'Draw thumbnails the size of a matchbox. Small drawings make composition decisions faster.' },
    exercise: { type: 'choose', prompt: 'Which thumbnail makes the sky the main subject?', options: [
      { scene: 'hills', params: { h: 170, seed: 12 }, cap: 'A' },
      { scene: 'hills', params: { h: 250, seed: 12 }, cap: 'B' },
      { scene: 'hills', params: { h: 350, seed: 12 }, cap: 'C' },
    ], answer: 2, explain: 'C drops the horizon low so the sky takes most of the page. A gives the land the lead. B splits the page in two equal halves.' },
    yourTurn: { title: 'Sky scene, land scene', brief: 'Draw two versions of one landscape: one where the sky leads and one where the land leads.', do: ['Horizon at a third in each, never centred', 'Same elements in both', 'Light line and three values', '15 minutes each'], time: 30, stretch: 'Add a third version with the horizon above the top edge: looking down from a cliff.' },
    criteria: ['Horizon is not centred', 'The larger area clearly leads', 'Both versions use the same elements', 'Proportions feel intentional'],
    checkpoint: [
      { q: 'Why avoid a centred horizon in most landscapes?', o: ['It is harder to draw', 'Equal halves compete for attention', 'It breaks perspective', 'It makes the sky darker'], a: 1, why: 'Unequal areas let one part lead the picture.' },
      { q: 'You want to show a winding river in the foreground. Where does the horizon go?', o: ['Low', 'Middle', 'High', 'Off the page to the bottom'], a: 2, why: 'A high horizon gives the page to the land and the river.' },
      { q: 'The thirds grid is…', o: ['A strict rule', 'A starting guide for unequal divisions', 'Only for photography', 'For perspective'], a: 1, why: 'It is a quick way to avoid equal halves; you can break it on purpose.' },
    ],
    next: 'Next: choosing one focal point.',
  });

  add({
    id: 'focal', unit: 'u2', n: 7, title: 'The focal point', skill: 'Focal point and hierarchy', area: 'composition', level: 2, minutes: 25,
    prereq: ['placement'],
    thumb: { scene: 'bridge', overlays: [{ t: 'focal', r: 60, label: '' }] },
    intro: 'A landscape with no focal point is a map. Decide where the eye lands first, then make everything else support it.',
    what: 'The focal point is the one area with the most attention: the strongest contrast, the sharpest edges, the most detail. Everything else is quieter.',
    why: 'If everything is equally detailed, nothing stands out and the eye wanders off the page. One clear focal point makes a drawing feel finished even when most of it is loose.',
    visual: { scene: 'bridge', overlays: [{ t: 'focal', r: 70, label: 'Darkest dark beside lightest light' }], cap: 'The dark opening under the arch sits right next to bright water. That contrast pulls the eye before anything else.',
      callouts: [['1', 'Highest contrast: darkest dark next to lightest light.'], ['2', 'Most detail and the sharpest edges.'], ['3', 'Off-centre, often near a thirds intersection.'], ['4', 'Only one. Secondary interest must be quieter.']] },
    demo: {
      scene: 'bridge',
      steps: [
        { t: 'Choose it before drawing', d: 'Here: the arch opening. Mark it with a small circle in the thumbnail.', show: ['bridge', 'banks'], line: ['bridge', 'banks'], ov: [{ t: 'focal', r: 60, label: 'Chosen first' }] },
        { t: 'Keep the surroundings light', d: 'Background trees stay pale and simple so they do not compete.', show: ['sky', 'bg', 'banks', 'bridge', 'water'], line: ['bridge'], ov: [] },
        { t: 'Put the darkest dark there', d: 'Fill the underside of the arch last, with the softest pencil in the drawing.', show: null, ov: [{ t: 'focal', r: 60, label: '6B here' }] },
      ],
    },
    watch: { v: 'bridge', t: 580, note: 'Around the ten-minute mark the underside of the arch goes very dark, and the whole drawing snaps into focus.' },
    guided: { time: 10, steps: ['Pick any landscape photo.', 'Draw a small thumbnail and mark one focal point with a circle.', 'Shade the focal area with the full range: paper white next to your darkest dark.', 'Keep everything else between values 2 and 6.'], tip: 'Ask: if someone glanced at this for one second, what would they remember? That is your focal point.' },
    exercise: { type: 'point', scene: 'hills', params: { tx: 540, ts: 1.1 }, prompt: 'Click the focal point of this scene.', answer: [540, 250], tol: 80, reveal: [{ t: 'focal', at: [540, 250], r: 70 }], right: 'Right. The tree is the only vertical, the darkest shape against the sky, and it sits near a thirds intersection.', wrong: 'Look for the one element with the strongest contrast against its surroundings.' },
    yourTurn: { title: 'One focal point', brief: 'Draw a simple landscape where one element is clearly the focal point.', do: ['Mark the focal point in a thumbnail first', 'Place it off-centre', 'Darkest dark and lightest light only at the focal point', 'Keep the rest simpler and softer', '20 minutes'], time: 20, stretch: 'Draw the same scene twice with a different focal point each time.' },
    criteria: ['A single clear focal point', 'Highest contrast is at the focal point', 'Focal point is off-centre', 'Surroundings are simpler'],
    checkpoint: [
      { q: 'Which is the strongest way to create a focal point?', o: ['Draw it bigger than everything', 'Put the highest contrast there', 'Outline it heavily', 'Centre it exactly'], a: 1, why: 'The eye goes first to the strongest value contrast.' },
      { q: 'How many focal points should a simple landscape have?', o: ['One', 'Two, balanced', 'Three', 'None'], a: 0, why: 'One lead; everything else supports it.' },
      { q: 'Detail everywhere tends to…', o: ['Improve the drawing', 'Make the focal point stronger', 'Compete with the focal point', 'Fix bad composition'], a: 2, why: 'Detail attracts the eye, so it belongs at the focal point.' },
    ],
    next: 'Next: using lines in the landscape to lead the eye to the focal point.',
  });

  add({
    id: 'leading', unit: 'u2', n: 8, title: 'Leading lines', skill: 'Guiding the eye', area: 'composition', level: 2, minutes: 20,
    prereq: ['focal'],
    thumb: { scene: 'forestPath' },
    intro: 'Paths, rivers, fences, shorelines and ridges are arrows. Point them at your focal point.',
    what: 'A leading line is any edge or path in the scene that the eye follows. In landscapes, the strongest ones start in the foreground and travel into the distance.',
    why: 'They connect the viewer to the focal point and create depth at the same time, because they usually narrow as they recede.',
    visual: { scene: 'forestPath', overlays: [{ t: 'line', pts: [[260, 500], [360, 420], [330, 360], [410, 318], [430, 282]], w: 3 }, { t: 'line', pts: [[600, 500], [520, 420], [440, 360], [470, 320], [432, 282]], w: 3 }, { t: 'focal', at: [430, 282], r: 26, label: 'Path leads here' }], cap: 'The path starts wide at your feet and narrows to a point deep in the trees. The eye rides it in.',
      callouts: [['1', 'Start the line near a bottom corner or edge.'], ['2', 'S-curves are slower and gentler than straight lines.'], ['3', 'End the line at, or pointing to, the focal point. Never leading off the page.']] },
    demo: {
      scene: 'forestPath',
      steps: [
        { t: 'Eye level and the vanishing point', d: 'The path will disappear at eye level.', show: [], ov: [{ t: 'horizon' }, { t: 'mark', x: 430, y: 282, label: 'Path ends here' }] },
        { t: 'Draw the path wide to narrow', d: 'Two edges that curve and converge. They start off the bottom of the page.', show: ['sky', 'ground', 'path'], line: ['ground', 'path'], ov: [{ t: 'horizon' }] },
        { t: 'Trunks frame the path', d: 'The largest trunks stand in the foreground on both sides, the smallest near the vanishing point.', show: null, ov: [] },
      ],
    },
    watch: { v: 'forest', t: 100, note: 'The path is laid in right after the eye-level line, before any trunk.' },
    guided: { time: 10, steps: ['Draw a horizon line.', 'Mark a focal point on it, off-centre.', 'Draw an S-shaped path from the bottom edge to that point.', 'Make it at least five times wider at the bottom than at the top.'], tip: 'Width change is what makes it recede. Keep the far end very narrow.' },
    exercise: { type: 'point', scene: 'forestPath', prompt: 'Where does the leading line take your eye? Click that point.', answer: [430, 282], tol: 60, reveal: [{ t: 'line', pts: [[260, 500], [360, 420], [330, 360], [410, 318], [430, 282]], w: 3 }, { t: 'focal', at: [430, 282], r: 26, label: '' }], right: 'Yes. The path narrows toward the bright gap in the trees at eye level.', wrong: 'Follow the path from the bottom edge until it disappears.' },
    yourTurn: { title: 'River to focal point', brief: 'Draw a landscape where a river or path leads to a focal point.', do: ['The line starts at the bottom edge', 'It narrows strongly with distance', 'It ends at the focal point', '20 minutes'], time: 20, stretch: 'Use a secondary leading line (a fence, a ridge) that points to the same place.' },
    criteria: ['A clear leading line from the foreground', 'It narrows with distance', 'It ends at or points to the focal point', 'It does not lead off the page'],
    checkpoint: [
      { q: 'Which is a leading line?', o: ['A cloud', 'A winding path', 'A single rock', 'The paper edge'], a: 1, why: 'A path is a line the eye follows.' },
      { q: 'A river that leads the eye off the side of the page…', o: ['Adds energy', 'Takes the viewer out of the picture', 'Is required', 'Fixes the horizon'], a: 1, why: 'Leading lines should go into the picture, toward the focal point.' },
      { q: 'Why does a path look like it recedes?', o: ['It is darker', 'It narrows toward eye level', 'It is curved', 'It has texture'], a: 1, why: 'Parallel edges converge with distance.' },
    ],
    next: 'Next: framing and balance, and a common mistake called tangency.',
  });

  add({
    id: 'framing', unit: 'u2', n: 9, title: 'Framing and balance', skill: 'Framing, balance, tangents', area: 'composition', level: 2, minutes: 25,
    prereq: ['focal'],
    thumb: { scene: 'hills', params: { frame: true } },
    intro: 'A dark tree at the edge, an overhanging branch, a rock in the corner: framing pushes the eye back into the picture.',
    what: 'Framing uses foreground shapes near the edges to enclose the view. Balance is how visual weight (dark, large, detailed things) spreads across the page. A tangent is when two edges just touch, which flattens depth.',
    why: 'Frames create depth and focus. Balance keeps the picture from tipping. Avoiding tangents keeps forms clearly in front of or behind each other.',
    visual: { scene: 'mountainLake', overlays: [{ t: 'label', x: 440, y: 60, text: 'Pines frame the right edge', to: [700, 160] }, { t: 'label', x: 60, y: 420, text: 'Small rocks balance the left', to: [100, 470] }], cap: 'The heavy dark pines on the right are balanced by the tall peak left of centre and the small rocks bottom-left.',
      callouts: [['1', 'Frames are dark and simple; they are not the focal point.'], ['2', 'Balance a large mass with a smaller, darker or more detailed one on the other side.'], ['3', 'Tangents: overlap clearly or leave a clear gap. Never just touching.']] },
    demo: {
      scene: 'hills',
      params: { frame: true },
      steps: [
        { t: 'The open view', d: 'The scene without a frame: pleasant but open on all sides.', show: ['sky', 'far', 'mid', 'near', 'tree'], ov: [] },
        { t: 'Add a frame', d: 'A dark trunk on the left edge and a branch across the top. Keep them simple and dark.', show: null, ov: [] },
        { t: 'Check for tangents', d: 'The tree’s crown must not just touch the frame branch or the horizon. Overlap or separate.', show: null, ov: [{ t: 'thirds' }] },
      ],
    },
    watch: { v: 'mountain', t: 600, note: 'Late in the drawing, tall dark pines go in on the right edge and frame the lake.' },
    guided: { time: 10, steps: ['Draw a small open landscape.', 'Add a dark tree on one edge that runs off the page.', 'Add a small dark shape on the other side for balance.', 'Circle any place where two edges just touch and fix it.'], tip: 'Let frame shapes run off the page. A frame that stops inside the edge looks like an object, not a frame.' },
    exercise: { type: 'choose', prompt: 'Which thumbnail has an accidental tangent?', options: [
      { scene: 'hills', params: { tx: 560, seed: 14 }, cap: 'A' },
      { scene: 'hills', params: { tree: false, tangent: true, seed: 14 }, cap: 'B' },
      { scene: 'hills', params: { frame: true, seed: 14 }, cap: 'C' },
    ], answer: 1, explain: 'In B the tree’s crown just grazes the top edge of the picture. It pins the tree to the frame and flattens depth. Move it down so there is a clear gap, or let it run well off the page.' },
    yourTurn: { title: 'Frame the view', brief: 'Draw a landscape framed by foreground elements on at least two edges.', do: ['Frame shapes are dark and run off the page', 'The focal point sits inside the frame', 'No tangents', '20 minutes'], time: 20, stretch: 'Draw it again framed only by value: a dark foreground band and dark sky corners.' },
    criteria: ['Foreground frame on 2+ edges', 'Frame runs off the page', 'No accidental tangents', 'Visual weight feels balanced'],
    checkpoint: [
      { q: 'A tangent is…', o: ['A leading line', 'Two edges barely touching', 'A vanishing point', 'A frame'], a: 1, why: 'Barely touching edges confuse which form is in front.' },
      { q: 'A large dark mass on the right can be balanced by…', o: ['Another identical mass on the left', 'A smaller but darker or more detailed element on the left', 'Nothing', 'A lighter sky'], a: 1, why: 'Visual weight is size × contrast × detail, not size alone.' },
      { q: 'Framing elements should usually be…', o: ['The most detailed part', 'Dark, simple, and running off the edge', 'Light and delicate', 'Centred'], a: 1, why: 'They support the focal point without competing with it.' },
    ],
    next: 'Next: thumbnail studies, where all of this gets decided in two minutes.',
  });

  add({
    id: 'thumbnails', unit: 'u2', n: 10, title: 'Thumbnail studies', skill: 'Planning a drawing', area: 'composition', level: 2, minutes: 30,
    prereq: ['values', 'leading', 'framing'],
    thumb: { scene: 'mountainLake', mode: 'notan' },
    intro: 'Before a finished drawing, spend eight minutes on four tiny ones. It is the fastest way to find the best version.',
    what: 'A thumbnail is a small (matchbox-sized), quick value sketch with only big shapes and three values. You make several, compare them, and pick one.',
    why: 'Composition problems are cheap to fix at thumbnail size and expensive to fix in a finished drawing. A thumbnail that reads at small size will read at any size.',
    visual: { scene: 'mountainLake', mode: 'notan', cap: 'A good thumbnail: three values, four shapes, one focal point. It reads instantly even this small.',
      callouts: [['1', '5 × 3 cm, 2 minutes each.'], ['2', 'Three values only. No lines inside shapes.'], ['3', 'Change one thing per thumbnail: horizon, focal point position, or light.'], ['4', 'Pick the one that reads from arm’s length.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Box and horizon', d: 'A small box. A horizon at a third.', show: [], ov: [{ t: 'horizon', label: '' }] },
        { t: 'Big shapes', d: 'Four shapes in light line.', show: [], ov: [{ t: 'shapes' }] },
        { t: 'Three values', d: 'Leave lights as paper, fill middles, fill darks. Done.', show: null, mode: 'notan', ov: [] },
      ],
    },
    guided: { time: 10, steps: ['Draw four boxes, 5 × 3 cm each.', 'Thumbnail 1: horizon low, focal point left.', 'Thumbnail 2: horizon high, focal point right.', 'Thumbnail 3: framed by a dark tree.', 'Thumbnail 4: your favourite ideas combined. Two minutes each.'], tip: 'Set a timer. The time limit forces you to think in shapes.' },
    exercise: { type: 'choose', prompt: 'Which thumbnail will read best from across the room?', options: [
      { scene: 'hills', params: { muddy: true, seed: 22 }, mode: 'tone', cap: 'A' },
      { scene: 'mountainLake', mode: 'notan', cap: 'B' },
      { scene: 'mountainLake', mode: 'line', cap: 'C' },
    ], answer: 1, explain: 'B has three clear value groups and big shapes. A uses only middle values, so the shapes blur together. C is all line, so nothing separates the planes at a distance.' },
    yourTurn: { title: 'Four thumbnails, one drawing', brief: 'Create four thumbnails of one scene, choose the best, then draw it larger.', do: ['Four thumbnails, 2 minutes each', 'Three values per thumbnail', 'Circle the one you choose and say why', 'Final drawing: 20 minutes, same composition'], time: 30, stretch: 'Do eight thumbnails and include one that breaks a rule on purpose.' },
    criteria: ['Several distinct thumbnails', 'Each uses three values', 'The final follows the chosen thumbnail', 'The final reads at small size'],
    checkpoint: [
      { q: 'How long should a thumbnail take?', o: ['About 2 minutes', 'About 20 minutes', 'An hour', 'As long as needed'], a: 0, why: 'Speed forces big-shape thinking.' },
      { q: 'What goes into a thumbnail?', o: ['Details and texture', 'Big shapes and three values', 'Only outlines', 'Colour notes'], a: 1, why: 'Thumbnails test composition and value, nothing else.' },
      { q: 'Why make several?', o: ['Practice speed', 'Compare options before committing', 'They look nice together', 'To trace later'], a: 1, why: 'Comparison is where the good composition is found.' },
    ],
    next: 'Unit 3: depth. First, the three planes of every landscape.',
  });

  /* ================= UNIT 3 — DEPTH ================= */
  add({
    id: 'planes', unit: 'u3', n: 11, title: 'Foreground, middle ground, background', skill: 'Three planes', area: 'depth', level: 2, minutes: 25,
    prereq: ['bigshapes', 'placement'],
    thumb: { scene: 'hills', overlays: [{ t: 'planes' }] },
    intro: 'Every landscape demonstration in the playlist is built as three layers: something near, something in the middle, something far.',
    what: 'The foreground is near you: large, dark, detailed. The middle ground usually holds the subject. The background is far away: small, light, simple.',
    why: 'Separating planes is what turns a flat drawing into space you could walk into. Each plane gets its own size, value and amount of detail.',
    visual: { scene: 'hills', overlays: [{ t: 'planes' }], cap: 'Three bands of land, each with its own value. Near is darkest, far is lightest.',
      callouts: [['FG', 'Near: large marks, strongest darks, texture visible.'], ['MG', 'Middle: usually the focal point, medium values.'], ['BG', 'Far: light, low contrast, outlines only.']] },
    demo: {
      scene: 'hills',
      steps: [
        { t: 'Background first', d: 'The far hills, light, with a single soft outline.', show: ['sky', 'far'], ov: [{ t: 'horizon' }] },
        { t: 'Middle ground overlaps it', d: 'A slightly darker band in front. Its edge overlaps the background.', show: ['sky', 'far', 'mid'], ov: [] },
        { t: 'Foreground last', d: 'Darkest value, biggest marks, and the most texture (the grass).', show: null, ov: [{ t: 'planes' }] },
      ],
    },
    watch: { v: 'cabin', t: 460, note: 'Distant pines on the left go in light and small; the pines behind the cabin come later and darker.' },
    guided: { time: 10, steps: ['Draw a horizon and three wavy bands below it.', 'Shade the far band value 2, the middle value 4, the near value 7.', 'Add one tree in each band: tiny, medium, large.', 'Add grass texture only in the near band.'], tip: 'Work back to front, like the demos: overlap is easier when the back layer is already there.' },
    exercise: { type: 'regions', scene: 'hills', prompt: 'Label each band. Pick a label, then click the band.', labels: ['Foreground', 'Middle ground', 'Background'], key: { near: 'Foreground', mid: 'Middle ground', far: 'Background' }, explain: 'The darkest, lowest band is closest. Each band further up is lighter and has less detail, so it reads as farther away.' },
    yourTurn: { title: 'Three-plane landscape', brief: 'Draw a landscape with a clear foreground, middle ground and background.', do: ['Each plane has its own value', 'Foreground darkest, background lightest', 'Detail decreases with distance', 'Draw back to front', '20 minutes'], time: 20, stretch: 'Reverse it: a dark distant mountain behind a light misty foreground. Does it still read?' },
    criteria: ['Three distinct planes', 'Value changes with distance', 'Detail decreases with distance', 'Planes overlap clearly'],
    checkpoint: [
      { q: 'Which plane usually has the most detail?', o: ['Background', 'Middle ground', 'Foreground', 'The sky'], a: 2, why: 'Near things show texture; far things do not.' },
      { q: 'Why draw back to front?', o: ['It is traditional', 'Nearer shapes can overlap what is already drawn', 'Backgrounds are harder', 'To save pencil'], a: 1, why: 'Overlap reads naturally when the back layer exists first.' },
      { q: 'The focal point is most often in the…', o: ['Foreground', 'Middle ground', 'Background', 'Sky'], a: 1, why: 'The middle ground is where the subject usually sits, framed by the foreground.' },
    ],
    next: 'Next: overlap and scale, two depth cues that need no perspective at all.',
  });

  add({
    id: 'overlap', unit: 'u3', n: 12, title: 'Overlap and scale', skill: 'Overlap, diminishing size', area: 'depth', level: 2, minutes: 20,
    prereq: ['planes'],
    thumb: { scene: 'road' },
    intro: 'The simplest depth cues: nearer things cover farther things, and the same object looks smaller the farther away it is.',
    what: 'Overlap means one form cuts in front of another. Diminishing scale means identical objects shrink with distance, closer together and closer to the horizon.',
    why: 'Together they create strong depth with no measuring. They also keep you honest: if a far tree is as big as a near tree, the space collapses.',
    visual: { scene: 'road', overlays: [{ t: 'horizon' }, { t: 'label', x: 520, y: 470, text: 'Poles shrink and bunch up toward eye level', to: [694, 420] }], cap: 'Identical poles get smaller and closer together as they approach the horizon.',
      callouts: [['1', 'Nearer objects overlap farther ones. Show the overlap clearly.'], ['2', 'Size halves quickly at first, then slowly.'], ['3', 'Gaps between repeated objects shrink too.']] },
    demo: {
      scene: 'road',
      steps: [
        { t: 'Horizon and road', d: 'Two converging edges meet on the horizon.', show: ['sky', 'hills', 'field', 'road'], line: ['field', 'road'], ov: [{ t: 'horizon' }] },
        { t: 'First and last pole', d: 'Draw the nearest pole, then a tiny one near the horizon.', show: ['sky', 'hills', 'field', 'road', 'poles'], ov: [{ t: 'vp', lines: [[860, 220], [860, 500]] }] },
        { t: 'Fill between', d: 'The tops and bottoms of all poles sit on lines to the same vanishing point.', show: null, ov: [{ t: 'vp' }] },
      ],
    },
    guided: { time: 10, steps: ['Draw a horizon.', 'Draw a row of five identical trees receding toward it.', 'Make each one about two thirds of the size of the one before.', 'Overlap the nearest tree over the edge of a hill.'], tip: 'Draw guide lines from the top and bottom of the nearest tree to a point on the horizon. Every tree fits between them.' },
    exercise: { type: 'order', prompt: 'Order these ranges from nearest (1) to farthest (4).', items: [
      { id: 'r2', scene: 'ranges', show: ['sky', 'r2'] }, { id: 'r0', scene: 'ranges', show: ['sky', 'r0'] }, { id: 'r3', scene: 'ranges', show: ['sky', 'r3'] }, { id: 'r1', scene: 'ranges', show: ['sky', 'r1'] },
    ], answer: ['r3', 'r2', 'r1', 'r0'], explain: 'The nearest ridge is lowest on the page, darkest and most detailed (it has the tree line). Each farther range sits higher, lighter and simpler.' },
    yourTurn: { title: 'Receding row', brief: 'Draw a road, river or fence line with at least five repeated objects that shrink toward the horizon.', do: ['Guide lines to one vanishing point', 'Objects shrink and gaps shrink', 'At least one clear overlap', '15 minutes'], time: 15, stretch: 'Add a second row on the other side of the road.' },
    criteria: ['Consistent diminishing size', 'Spacing shrinks with distance', 'Clear overlaps', 'Objects align to the horizon'],
    checkpoint: [
      { q: 'Two identical trees; one is half the height of the other. The smaller one is…', o: ['Farther away', 'Closer', 'Younger', 'In shadow'], a: 0, why: 'Same object, smaller size: it is farther away.' },
      { q: 'Overlap tells the viewer…', o: ['Which object is lit', 'Which object is in front', 'The time of day', 'The horizon height'], a: 1, why: 'The overlapping form is nearer.' },
      { q: 'As repeated objects recede, the gaps between them…', o: ['Stay the same', 'Grow', 'Shrink', 'Disappear'], a: 2, why: 'Spacing diminishes along with size.' },
    ],
    next: 'Next: one-point perspective in nature.',
  });

  add({
    id: 'onepoint', unit: 'u3', n: 13, title: 'One-point perspective in nature', skill: 'Vanishing points', area: 'perspective', level: 2, minutes: 25,
    prereq: ['horizon', 'overlap'],
    thumb: { scene: 'road', overlays: [{ t: 'vp' }] },
    intro: 'Roads, rivers, rows of trees and paths share one rule: parallel lines going away from you meet at a single point on the horizon.',
    what: 'In one-point perspective, lines running straight away from you converge to one vanishing point (VP) on the horizon. Lines across your view stay horizontal; vertical lines stay vertical.',
    why: 'Even organic scenes contain parallel things: road edges, a row of poles, the banks of a canal. Getting them to converge correctly locks the space in place.',
    visual: { scene: 'road', overlays: [{ t: 'horizon' }, { t: 'vp' }], cap: 'The road edges, the pole tops and the pole bottoms all meet at one point on the horizon.',
      callouts: [['1', 'The vanishing point is always on the horizon.'], ['2', 'Only lines going away from you converge.'], ['3', 'Verticals stay vertical.']] },
    demo: {
      scene: 'road',
      steps: [
        { t: 'Horizon and VP', d: 'Put the vanishing point off-centre on the horizon.', show: [], ov: [{ t: 'horizon' }, { t: 'mark', x: 500, y: 262, label: 'VP' }] },
        { t: 'Converging guides', d: 'Fan light lines out from the VP. Road edges and pole tops use them.', show: [], ov: [{ t: 'horizon' }, { t: 'vp' }] },
        { t: 'Place objects on the guides', d: 'Every pole fits between the top and bottom guides.', show: ['sky', 'field', 'road', 'poles'], line: ['field', 'road', 'poles'], ov: [{ t: 'vp' }] },
        { t: 'Finish with value', d: 'Erase the guides and shade.', show: null, ov: [] },
      ],
    },
    guided: { time: 12, steps: ['Draw a horizon and a VP off-centre.', 'Draw two lines from the bottom edge to the VP for a road.', 'Draw a line from the VP out to the right for the tops of fence posts.', 'Draw five vertical posts between the ground line and the top line.'], tip: 'Use a ruler for guides only. Draw the actual road edges freehand over them.' },
    exercise: { type: 'point', scene: 'road', params: { vx: 540, seed: 19 }, prompt: 'Click the vanishing point.', answer: [540, 262], tol: 40, reveal: [{ t: 'vp' }, { t: 'horizon' }], right: 'Yes. Extend the road edges and the line of pole tops; they all meet here, on the horizon.', wrong: 'Extend the two road edges with your eye until they meet.' },
    yourTurn: { title: 'Road into the distance', brief: 'Draw a road, canal or path in one-point perspective with repeated objects along it.', do: ['VP on the horizon, off-centre', 'Road edges converge to the VP', 'At least five repeated objects', '20 minutes'], time: 20, stretch: 'Add a river that bends: each straight section gets its own VP on the horizon.' },
    criteria: ['VP on the horizon', 'Receding lines converge to it', 'Verticals stay vertical', 'Objects diminish correctly'],
    checkpoint: [
      { q: 'Where is the vanishing point in one-point perspective?', o: ['Anywhere', 'On the horizon', 'At the top of the page', 'In the foreground'], a: 1, why: 'Vanishing points for flat ground lie on the horizon.' },
      { q: 'Which lines converge?', o: ['All lines', 'Vertical lines', 'Lines going straight away from you', 'Lines across your view'], a: 2, why: 'Only receding parallels converge.' },
      { q: 'A winding path has…', o: ['No vanishing point', 'One VP for each straight section, all on the horizon', 'A VP in the sky', 'Two VPs off the page'], a: 1, why: 'Each direction of travel gets its own VP on eye level.' },
    ],
    next: 'Next: two-point perspective for buildings in a landscape.',
  });

  add({
    id: 'twopoint', unit: 'u3', n: 14, title: 'Two-point perspective for buildings', skill: 'Boxes in space', area: 'perspective', level: 3, minutes: 30,
    prereq: ['onepoint', 'forms'],
    thumb: { scene: 'cabin', overlays: [{ t: 'horizon', label: '' }, { t: 'vp', extend: true, label: '' }] },
    intro: 'The lakeside cabin demonstration begins with a horizon, a vertical corner line and perspective lines running out toward vanishing points. That is two-point perspective.',
    what: 'When you see a building corner-on, its two visible sides each recede to their own vanishing point, one left and one right, both on the horizon.',
    why: 'A cabin, barn or bridge in a landscape instantly looks wrong if its lines do not agree with the horizon. Two-point perspective makes built things sit in the land.',
    visual: { scene: 'cabin', overlays: [{ t: 'horizon' }, { t: 'vp', extend: true, label: 'Left VP' }], cap: 'The cabin’s left wall recedes to a vanishing point on the left, on the horizon. The right wall’s VP is far off the page.',
      callouts: [['1', 'Start with the nearest vertical corner.'], ['2', 'Top and bottom of each wall go to that wall’s VP.'], ['3', 'Keep VPs far apart, often off the page, to avoid distortion.'], ['4', 'Above eye level you see the underside of eaves; below it, the top of the ground.']] },
    demo: {
      scene: 'cabin',
      steps: [
        { t: 'Horizon and corner', d: 'The horizon, and one vertical line for the cabin’s nearest corner.', show: [], ov: [{ t: 'horizon' }, { t: 'line', pts: [[540, 204], [540, 272]], w: 3 }] },
        { t: 'Lines to the VPs', d: 'From the top and bottom of the corner, light lines out to the left VP and toward the right VP.', show: [], ov: [{ t: 'horizon' }, { t: 'vp', all: true, extend: true }] },
        { t: 'Close the box', d: 'Two more verticals end the walls. The roof sits on top as a triangle on the end wall.', show: ['cabin'], line: ['cabin'], ov: [{ t: 'horizon' }, { t: 'vp', extend: true }] },
        { t: 'Set it in the landscape', d: 'Rocks under it, pines behind it, reflections below it.', show: null, ov: [] },
      ],
    },
    watch: { v: 'cabin', t: 230, note: 'Around four minutes in, perspective lines are drawn out from the cabin to far-apart vanishing points before the walls are finished.' },
    guided: { time: 15, steps: ['Draw a horizon and two VPs near the edges of the page.', 'Draw a vertical line between them, crossing the horizon.', 'Connect its top and bottom to both VPs.', 'Add two verticals to close the walls.', 'Add a gable roof on one end.'], tip: 'If the box looks stretched, move the VPs farther apart, even off the paper onto the table.' },
    exercise: { type: 'point', scene: 'cabin', prompt: 'The cabin’s left wall recedes to a vanishing point inside this picture. Click it.', answer: [60, 300], tol: 45, reveal: [{ t: 'horizon' }, { t: 'vp', extend: true }], right: 'Yes. Extend the top and bottom edges of the left wall and they meet on the horizon here.', wrong: 'Follow the roof edge and the bottom of the left wall to the left until they meet. It will be on the horizon.' },
    yourTurn: { title: 'Cabin by the water', brief: 'Draw a simple cabin in two-point perspective, sitting on the ground of a landscape.', do: ['Horizon and two VPs first', 'Walls and roof lines agree with the VPs', 'Cabin sits on ground, rocks or a shore', 'Add one tree behind it', '30 minutes'], time: 30, stretch: 'Add a small dock that recedes to the same VPs and its reflection in the water.' },
    criteria: ['Two VPs on the horizon', 'Walls converge correctly', 'Verticals are vertical', 'Building sits convincingly on the ground'],
    checkpoint: [
      { q: 'In two-point perspective, where are both vanishing points?', o: ['One on the horizon, one above', 'Both on the horizon', 'Both at the page corners', 'Anywhere'], a: 1, why: 'Horizontal edges of a building on flat ground vanish at eye level.' },
      { q: 'The building looks stretched and distorted. The fix is to…', o: ['Move VPs closer together', 'Move VPs farther apart', 'Raise the horizon', 'Make it darker'], a: 1, why: 'VPs too close together distort boxes.' },
      { q: 'What do you draw first?', o: ['The roof', 'The nearest vertical corner', 'The windows', 'The door'], a: 1, why: 'The front corner anchors both walls.' },
    ],
    next: 'Next: atmospheric perspective, the most important depth cue in landscape.',
  });

  add({
    id: 'atmosphere', unit: 'u3', n: 15, title: 'Atmospheric perspective', skill: 'Depth through air', area: 'depth', level: 3, minutes: 30,
    prereq: ['values', 'planes'],
    thumb: { scene: 'ranges' },
    intro: 'Air is not perfectly clear. The farther away something is, the more air sits between you and it, and the lighter and softer it looks.',
    what: 'Atmospheric (aerial) perspective means distant forms are lighter, lower in contrast, softer-edged and less detailed. Near forms are darker, sharper and more detailed.',
    why: 'In landscapes it is the strongest depth cue you have. Mountains become layers of paler grey; the nearest ridge carries your darkest values and crisp texture.',
    visual: { scene: 'ranges', cap: 'Four ranges, each one step lighter and simpler than the one in front. No perspective lines needed.',
      callouts: [['1', 'Lighter with distance.'], ['2', 'Less contrast: shadows in the distance are only slightly darker than lights.'], ['3', 'Softer edges and less detail.'], ['4', 'The darkest darks and sharpest edges belong to the foreground.']] },
    demo: {
      scene: 'ranges',
      steps: [
        { t: 'Farthest range, lightest', d: 'Value 2, soft outline, barely any shadow shape.', show: ['sky', 'r0'], ov: [] },
        { t: 'Step darker', d: 'Each nearer range goes about two steps darker, with slightly more shadow.', show: ['sky', 'r0', 'r1'], ov: [] },
        { t: 'Step again', d: 'More contrast between lit and shadow planes.', show: ['sky', 'r0', 'r1', 'r2'], ov: [] },
        { t: 'Foreground: full contrast', d: 'Darkest values, crisp edges and tree texture.', show: null, ov: [] },
      ],
    },
    watch: { v: 'cabin', t: 870, note: 'Near the end, the distant mountains are added very lightly behind everything else.' },
    guided: { time: 15, steps: ['Draw four overlapping mountain ridgelines, one above the other.', 'Shade the farthest one value 2.', 'Each nearer range two steps darker.', 'Add a dark tree line along the nearest ridge only.'], tip: 'Use a kneaded eraser to lift the far ranges back if they get too dark.' },
    exercise: { type: 'choose', prompt: 'Which of these uses atmospheric perspective correctly?', options: [
      { scene: 'ranges', params: { kind: 'reversed' }, cap: 'A' },
      { scene: 'ranges', params: { kind: 'flat' }, cap: 'B' },
      { scene: 'ranges', params: { kind: 'correct' }, cap: 'C' },
    ], answer: 2, explain: 'In C each range gets lighter with distance. A is reversed: the far ranges are darkest, so they jump forward. B uses one value throughout, so the ranges flatten into a single wall.' },
    yourTurn: { title: 'Layers of distance', brief: 'Draw a landscape with at least four receding layers using atmospheric perspective.', do: ['Each layer lighter than the one in front', 'Less detail and contrast with distance', 'Darkest values only in the foreground', '25 minutes'], time: 25, stretch: 'Add mist in a valley between two layers by lifting graphite with an eraser.' },
    criteria: ['At least four layers', 'Value lightens with distance', 'Contrast and detail decrease with distance', 'Foreground carries the darkest darks'],
    checkpoint: [
      { q: 'Distant mountains appear…', o: ['Darker and sharper', 'Lighter and softer', 'The same as near ones', 'Bigger'], a: 1, why: 'More air between you and them lightens and softens them.' },
      { q: 'Where should the darkest darks usually be?', o: ['In the distance', 'In the foreground', 'In the sky', 'On the horizon'], a: 1, why: 'Full contrast belongs to what is near.' },
      { q: 'A distant range drawn as dark as the foreground will…', o: ['Look farther away', 'Jump forward and flatten depth', 'Look misty', 'Look taller'], a: 1, why: 'Value, not size, tells the eye where it is.' },
    ],
    next: 'Unit 4: light. First, deciding where the light comes from.',
  });

  /* ================= UNIT 4 — LIGHT AND VALUE ================= */
  add({
    id: 'lightdir', unit: 'u4', n: 16, title: 'Light direction', skill: 'One light source', area: 'light', level: 2, minutes: 20,
    prereq: ['forms', 'values'],
    thumb: { scene: 'forms', overlays: [{ t: 'light', label: '' }] },
    intro: 'Outdoors there is one sun. Decide where it is before you shade anything, and every shadow in the drawing will agree.',
    what: 'Light direction is where the main light comes from. Every lit plane faces it; every shadow plane and cast shadow falls away from it.',
    why: 'Inconsistent light is one of the most common beginner mistakes. One tree lit from the left and a rock lit from the right breaks the illusion instantly.',
    visual: { scene: 'forms', overlays: [{ t: 'light', label: 'Sun: upper left' }], cap: 'Light from the upper left: every form is lit on its left, shadowed on its right, and casts its shadow to the right.',
      callouts: [['1', 'Draw a small arrow in the corner of every drawing.'], ['2', 'Side light (morning, evening) makes long shadows and strong form.'], ['3', 'Overhead light (noon) flattens forms and hides shadows.'], ['4', 'Backlight turns forms into dark silhouettes with bright edges.']] },
    demo: {
      scene: 'forms',
      params: { light: 'right' },
      steps: [
        { t: 'Choose the light', d: 'Here the sun is upper right.', show: ['ground'], ov: [{ t: 'light', from: [760, 40], to: [670, 110], label: 'Sun' }] },
        { t: 'Shade the planes facing away', d: 'Left sides now fall into shadow.', show: null, ov: [{ t: 'light', from: [760, 40], to: [670, 110], label: 'Sun' }] },
        { t: 'Cast shadows go left', d: 'Every cast shadow points away from the light.', show: null, ov: [] },
      ],
    },
    guided: { time: 8, steps: ['Draw three simple rocks.', 'Draw an arrow for the light in the top corner.', 'Shade every plane that faces away from it.', 'Add cast shadows on the opposite side.'], tip: 'Rotate your paper so the arrow points at your hand. Shadows go on the side of the form away from the arrow’s tail.' },
    exercise: { type: 'dial', scene: 'forms', params: { light: 'right' }, prompt: 'Drag the dial to show where the light is coming from.', answer: 315, tol: 40, explain: 'The left sides of the forms are shaded and the cast shadows fall to the left, so the light comes from the upper right.' },
    yourTurn: { title: 'Same scene, two lights', brief: 'Draw a simple rock and tree scene twice: once lit from the left, once from the right.', do: ['Light arrow on each drawing', 'Every shadow agrees with its arrow', 'Cast shadows included', '15 minutes each'], time: 30, stretch: 'Add a third version lit from behind: dark silhouettes with a thin light edge.' },
    criteria: ['Light direction is marked', 'All shadows agree with it', 'Cast shadows fall away from the light', 'Difference between versions is clear'],
    checkpoint: [
      { q: 'Cast shadows fall…', o: ['Toward the light', 'Away from the light', 'Straight down always', 'Randomly'], a: 1, why: 'The object blocks light; its shadow lands on the far side.' },
      { q: 'Which light gives the strongest sense of form?', o: ['Noon, overhead', 'Side light, morning or evening', 'Flat overcast', 'No light'], a: 1, why: 'Side light divides every form into a lit and a shadow side.' },
      { q: 'A tree lit from the left and a rock lit from the right in the same drawing…', o: ['Adds interest', 'Breaks the illusion', 'Is normal', 'Shows depth'], a: 1, why: 'Outdoors there is one sun; all shadows must agree.' },
    ],
    next: 'Next: drawing shadow shapes as clear, designed shapes.',
  });

  add({
    id: 'shadows', unit: 'u4', n: 17, title: 'Shadow shapes', skill: 'Form and cast shadow', area: 'light', level: 2, minutes: 25,
    prereq: ['lightdir'],
    thumb: { scene: 'peak', overlays: [{ t: 'region', id: 'shadow', label: '' }] },
    intro: 'Shadows are shapes, not smudges. Draw their edges as carefully as you would draw a mountain’s silhouette.',
    what: 'A shadow shape is the area turned away from the light (form shadow) or blocked from it (cast shadow). On mountains and rocks it follows the planes of the form.',
    why: 'Clear shadow shapes describe form faster than any amount of texture. A mountain is mostly two shapes: its lit side and its shadow side.',
    visual: { scene: 'peak', overlays: [{ t: 'region', id: 'lit', label: 'Lit plane', fill: 0.05 }, { t: 'region', id: 'shadow', label: 'Shadow plane', fill: 0.1 }, { t: 'light' }], cap: 'The mountain divides along its ridge into a lit plane and a shadow plane. Snow stays paper-white only on the lit side.',
      callouts: [['1', 'Find the ridge or edge where light turns to shadow.'], ['2', 'Fill the shadow shape with one flat value first.'], ['3', 'Shadow edges on sharp forms (rocks, peaks) are hard; on round forms (trees, hills) they are soft.']] },
    demo: {
      scene: 'peak',
      steps: [
        { t: 'Silhouette', d: 'The outline of the mountain in light line.', show: ['sky', 'mt'], line: ['mt'], ov: [] },
        { t: 'Find the dividing ridge', d: 'A line from the peak down, where the planes turn.', show: ['sky', 'mt'], line: ['mt'], ov: [{ t: 'line', pts: [[400, 90], [425, 210], [430, 330], [445, 500]], w: 2.5 }] },
        { t: 'One flat shadow value', d: 'Fill the shadow shape with even strokes that follow the slope.', show: ['sky', 'mt'], ov: [{ t: 'light' }] },
        { t: 'Details stay inside', d: 'Gullies and snow sit inside the big light and shadow shapes.', show: null, ov: [] },
      ],
    },
    watch: { v: 'mountain', t: 450, note: 'The shadow sides of the peaks are hatched with strokes that follow the slope, while the lit sides stay almost white.' },
    guided: { time: 12, steps: ['Draw a single mountain silhouette.', 'Draw the dividing ridge from the peak downward.', 'Fill the shadow side with one even value, strokes following the slope.', 'Add two smaller gullies on the lit side as thin shadow shapes.'], tip: 'Resist blending. A crisp shadow edge reads as a sharp mountain.' },
    exercise: { type: 'regions', scene: 'peak', prompt: 'Label the lit plane and the shadow plane of the main peak.', labels: ['Lit plane', 'Shadow plane'], key: { lit: 'Lit plane', shadow: 'Shadow plane' }, explain: 'Light comes from the left, so the left-facing slope is lit and the right-facing slope is in shadow.' },
    yourTurn: { title: 'Mountains in light and shadow', brief: 'Draw a mountain range using only two values per mountain: lit and shadow.', do: ['One light direction', 'Clear dividing ridges', 'Shadow strokes follow the slope', '20 minutes'], time: 20, stretch: 'Add a third value for the cast shadow of one peak falling on the next.' },
    criteria: ['Clear lit and shadow planes', 'Shadows agree with the light', 'Shadow edges are crisp on sharp forms', 'Strokes follow the form'],
    checkpoint: [
      { q: 'Shadow shapes on a sharp mountain ridge should have…', o: ['Soft, blurred edges', 'Crisp edges', 'No edges', 'Outlines'], a: 1, why: 'Sharp forms produce sharp shadow edges.' },
      { q: 'What should you shade first?', o: ['Texture', 'Small cracks', 'The big shadow shape as one value', 'The sky'], a: 2, why: 'Big shadow shape first; details go inside it.' },
      { q: 'Hatching on a mountain’s shadow side should…', o: ['Run horizontally', 'Follow the slope of the form', 'Be random', 'Be vertical'], a: 1, why: 'Directional strokes describe the plane.' },
    ],
    next: 'Next: grouping a whole landscape into three values.',
  });

  add({
    id: 'notan', unit: 'u4', n: 18, title: 'Three value groups', skill: 'Value grouping', area: 'value', level: 3, minutes: 30,
    prereq: ['values', 'thumbnails'],
    thumb: { scene: 'coast', mode: 'notan' },
    intro: 'A landscape has hundreds of values. A strong drawing organises them into three: light, middle and dark.',
    what: 'Value grouping means assigning every area to one of three groups before you shade. Small variations happen inside a group, never across groups.',
    why: 'Grouped values give a drawing a clear, poster-like structure. It is the difference between a drawing that reads across a room and one that looks grey and busy.',
    visual: { scene: 'coast', mode: 'notan', cap: 'The backlit coast in three values: light sky and sun path, middle sea, dark headland and rocks.',
      callouts: [['L', 'Light: sky, sun, light on water.'], ['M', 'Middle: sea, distant land.'], ['D', 'Dark: silhouettes, near rocks.'], ['!', 'If two neighbouring areas are the same group, their edge will disappear. Use that on purpose.']] },
    demo: {
      scene: 'coast',
      steps: [
        { t: 'The full-value scene', d: 'Many greys.', show: null, ov: [] },
        { t: 'Squint and sort', d: 'Every area goes into light, middle or dark.', show: null, mode: 'notan', ov: [] },
        { t: 'Draw the three groups', d: 'Leave lights as paper, lay one flat middle, lay one flat dark. Then add variation inside each.', show: null, mode: 'notan', ov: [{ t: 'region', id: 'path', label: 'Light', fill: 0 }, { t: 'region', id: 'sea', label: 'Middle', fill: 0 }, { t: 'region', id: 'headland', label: 'Dark', fill: 0 }] },
      ],
    },
    guided: { time: 12, steps: ['Choose a photo and squint hard.', 'Draw a thumbnail with outlines of every area.', 'Write L, M or D in each area.', 'Shade: L = paper, M = one flat grey, D = dark.'], tip: 'When unsure, ask whether an area is closer to the lightest light or the darkest dark, and commit.' },
    exercise: { type: 'regions', scene: 'coast', prompt: 'Sort these areas into value groups. Pick a group, then click the area.', labels: ['Light', 'Middle', 'Dark'], key: { sky: 'Light', path: 'Light', sea: 'Middle', headland: 'Dark', rocks: 'Dark' }, explain: 'The sky near the sun and the sun’s path on the water are the lights. The open sea is middle. The backlit headland and foreground rocks are silhouettes, so they are dark.' },
    yourTurn: { title: 'Three-value landscape', brief: 'Create a landscape using only three value groups.', do: ['Squint and sort before shading', 'Flat, even tones', 'Lights stay paper white', 'One focal point where light meets dark', '25 minutes'], time: 25, stretch: 'Make a second version with only two values (light and dark). What had to change?' },
    criteria: ['Exactly three distinct value groups', 'Groups are flat and consistent', 'Big shapes read clearly', 'Strongest contrast at the focal point'],
    checkpoint: [
      { q: 'Why group values?', o: ['It saves pencil', 'It gives the drawing a clear, readable structure', 'Because photos do', 'It is only for beginners'], a: 1, why: 'Grouped values read instantly, at any size.' },
      { q: 'Within a value group, variations should be…', o: ['Large', 'Small, never crossing into another group', 'Avoided entirely', 'Random'], a: 1, why: 'Small shifts add life without breaking the structure.' },
      { q: 'A backlit headland against a bright sky is usually…', o: ['Light', 'Middle', 'Dark', 'Invisible'], a: 2, why: 'Backlit forms become silhouettes.' },
    ],
    next: 'Next: using contrast to control where the eye goes.',
  });

  add({
    id: 'contrast', unit: 'u4', n: 19, title: 'Contrast at the focal point', skill: 'Directing attention with value', area: 'light', level: 3, minutes: 25,
    prereq: ['notan', 'focal'],
    thumb: { scene: 'bridge', params: {}, overlays: [{ t: 'focal', r: 60, label: '' }] },
    intro: 'The darkest dark next to the lightest light is a magnet. Put it where you want the eye, and nowhere else.',
    what: 'Contrast is the difference in value between neighbouring areas. The highest contrast in the drawing should sit at the focal point; everywhere else contrast is lower.',
    why: 'In the bridge demonstration the drawing only comes alive when the space under the arch goes nearly black against the pale water. That is contrast doing the work.',
    visual: { scene: 'bridge', overlays: [{ t: 'probe' }], cap: 'A: under the arch ≈ 9. B: the river ≈ 1. They touch, so the eye lands there. Elsewhere, neighbours differ by only 2–3 steps.',
      callouts: [['1', 'Find the single darkest dark in the scene and put the lightest light beside it.'], ['2', 'Reduce contrast away from the focal point: lighten darks, darken lights.'], ['3', 'Sharp edges attract the eye too; soften edges far from the focal point.']] },
    demo: {
      scene: 'bridge',
      params: { flat: true },
      steps: [
        { t: 'Low contrast everywhere', d: 'Everything is middle grey. The eye has nowhere to land.', show: null, ov: [] },
        { t: 'Push one area', d: 'In the finished version, the arch opening goes to 9 against 1.', show: null, params: {}, ov: [{ t: 'focal', r: 60, label: 'Highest contrast' }] },
      ],
    },
    watch: { v: 'bridge', t: 580, note: 'Watch the underside of the arch go dark; it is the single darkest area in the drawing.' },
    guided: { time: 10, steps: ['Take your three-value drawing from the last lesson.', 'Pick the focal point.', 'Add a 6B accent at the focal point only.', 'Lift a highlight right next to it with an eraser.'], tip: 'Too many accents cancel each other. One darkest dark per drawing.' },
    exercise: { type: 'choose', prompt: 'Which version directs your eye to the bridge arch?', options: [
      { scene: 'bridge', params: { flat: true }, cap: 'A' },
      { scene: 'bridge', cap: 'B' },
    ], answer: 1, explain: 'In B the arch opening is the darkest value in the picture and it touches the lightest water. In A the background trees are as dark as the arch, so they compete.' },
    yourTurn: { title: 'One magnet', brief: 'Draw a landscape where the only full black-to-white contrast is at the focal point.', do: ['Thumbnail first, focal point marked', 'Everything outside the focal area stays within values 2–7', 'One 6B accent, one lifted highlight', '25 minutes'], time: 25, stretch: 'Soften every edge except those at the focal point.' },
    criteria: ['Strongest contrast at the focal point', 'Lower contrast elsewhere', 'Edges sharper at the focal point', 'The eye goes there first'],
    checkpoint: [
      { q: 'Where should the highest contrast be?', o: ['Everywhere', 'At the edges', 'At the focal point', 'In the sky'], a: 2, why: 'Contrast attracts the eye; spend it at the focal point.' },
      { q: 'A dark background tree competes with the focal point. The fix is to…', o: ['Darken the focal point more', 'Lighten the tree', 'Outline the focal point', 'Remove the horizon'], a: 1, why: 'Lower contrast away from the focal point.' },
      { q: 'Besides value, what else attracts the eye?', o: ['Sharp edges and detail', 'Blurry edges', 'Empty space', 'Hatching direction'], a: 0, why: 'Sharp edges and detail pull attention too.' },
    ],
    next: 'Next: making marks that describe form and texture.',
  });

  add({
    id: 'marks', unit: 'u4', n: 20, title: 'Directional marks and texture', skill: 'Mark-making', area: 'line', level: 3, minutes: 25,
    prereq: ['line', 'shadows'],
    thumb: { scene: 'waterfall' },
    intro: 'Every stroke points somewhere. In the source demos, strokes follow the form: down the rock face, along the slope, across the water.',
    what: 'Directional mark-making means choosing stroke direction, length and spacing to describe the surface: vertical for falling water and bark, horizontal for calm water, slope-following for mountains and rocks.',
    why: 'Good marks do double duty: they build value and describe the surface at the same time. Random scribbles flatten form.',
    visual: { scene: 'waterfall', overlays: [{ t: 'label', x: 520, y: 200, text: 'Vertical: falling water', to: [440, 220] }, { t: 'label', x: 520, y: 470, text: 'Horizontal: pool surface', to: [420, 430] }, { t: 'label', x: 40, y: 40, text: 'Along each rock plane', to: [120, 300] }], cap: 'Stroke direction tells you what each surface is doing before you read any detail.',
      callouts: [['|', 'Vertical: falling water, tree bark, rain.'], ['—', 'Horizontal: calm water, fields, distant plains.'], ['/', 'Along the slope: mountains, rocks, roofs.'], ['~', 'Clusters and scallops: foliage, clouds.']] },
    demo: {
      scene: 'waterfall',
      steps: [
        { t: 'Stack the rock shapes', d: 'Simple blocks, stacked and overlapping.', show: ['sky', 'walls'], line: ['walls'], ov: [] },
        { t: 'Falls: vertical strokes', d: 'Long pale strokes, top to bottom, leaving paper for the brightest water.', show: ['sky', 'back', 'falls', 'walls'], line: ['walls'], ov: [] },
        { t: 'Rocks: strokes along each plane', d: 'Top planes light, side planes hatched darker.', show: ['sky', 'back', 'falls', 'walls', 'pool'], ov: [] },
        { t: 'Finish', d: 'Distant pines light and small at the top; foreground rocks darkest.', show: null, ov: [] },
      ],
    },
    watch: { v: 'waterfall', t: 470, note: 'The falling water is built from long vertical strokes while the stacked rocks get short strokes along each plane.' },
    guided: { time: 12, steps: ['Draw four small boxes.', 'Fill one with vertical strokes (falling water).', 'One with horizontal strokes (calm water).', 'One with slope-following hatching (mountain).', 'One with scalloped clusters (foliage).'], tip: 'Lift the pencil at the end of each stroke so it tapers. Tapered strokes look lighter and more natural.' },
    exercise: { type: 'choose', prompt: 'Which stroke direction best describes a calm lake surface?', options: [
      { svg: 'strokes-v', cap: 'Vertical' }, { svg: 'strokes-h', cap: 'Horizontal' }, { svg: 'strokes-x', cap: 'Cross-hatched' },
    ], answer: 1, explain: 'A flat, calm water surface lies horizontal, so horizontal strokes describe it. Vertical marks belong to falling water and reflections.' },
    yourTurn: { title: 'Texture sampler landscape', brief: 'Draw a small waterfall or stream scene using at least four stroke directions, each matched to its surface.', do: ['Vertical for falling water', 'Horizontal for pools', 'Plane-following for rocks', 'Clusters for foliage', '25 minutes'], time: 25, stretch: 'Use only line (no smudging) to reach your darkest value.' },
    criteria: ['Stroke direction matches each surface', 'Marks build value and form together', 'No random scribbling', 'Texture strongest in the foreground'],
    checkpoint: [
      { q: 'Falling water is best described with…', o: ['Horizontal strokes', 'Vertical strokes', 'Circles', 'Dots'], a: 1, why: 'Strokes follow the direction the surface moves or faces.' },
      { q: 'Hatching on a rock’s side plane should…', o: ['Be random', 'Follow the plane', 'Always be vertical', 'Be smudged'], a: 1, why: 'Directional marks describe the plane.' },
      { q: 'Where should texture be strongest?', o: ['Background', 'Foreground', 'Sky', 'Evenly everywhere'], a: 1, why: 'Texture is a near-distance detail.' },
    ],
    next: 'Unit 5: landscape elements, starting with skies and clouds.',
  });

  /* ================= UNIT 5 — ELEMENTS ================= */
  add({
    id: 'skies', unit: 'u5', n: 21, title: 'Skies and clouds', skill: 'Clouds in perspective', area: 'elements', level: 3, minutes: 25,
    prereq: ['atmosphere', 'overlap'],
    thumb: { scene: 'sky' },
    intro: 'Clouds sit on an invisible ceiling. Like poles along a road, they get smaller, flatter and closer together toward the horizon.',
    what: 'Cumulus clouds are soft spheres with flat bottoms. Overhead they are large and show their undersides; near the horizon they shrink into thin, overlapping bands. The sky itself is usually darker at the top and lighter near the horizon.',
    why: 'A sky drawn with clouds of equal size looks like wallpaper. Cloud perspective adds depth above the landscape and matches the depth below it.',
    visual: { scene: 'sky', cap: 'Large clouds at the top, small flat ones near the horizon.',
      callouts: [['1', 'Flat bottoms, lumpy tops.'], ['2', 'Smaller and flatter toward the horizon.'], ['3', 'Shade clouds as spheres: light on top, a darker band underneath.'], ['4', 'Keep sky values light so the land stays in front.']] },
    demo: {
      scene: 'sky',
      steps: [
        { t: 'Horizon and a ceiling', d: 'Imagine a flat ceiling of cloud that recedes to the horizon.', show: ['sky', 'land'], ov: [{ t: 'horizon' }] },
        { t: 'Big clouds overhead', d: 'Large rounded tops with flat bases near the top of the page.', show: ['sky', 'land', 'clouds'], line: ['clouds'], ov: [{ t: 'horizon' }] },
        { t: 'Shade as spheres', d: 'Light on top, a middle value along the bottom.', show: null, ov: [] },
      ],
    },
    guided: { time: 10, steps: ['Draw a low horizon.', 'Draw three rows of clouds: large, medium, small toward the horizon.', 'Flatten each cloud base.', 'Shade the underside of each cloud one step darker than the sky.'], tip: 'Draw clouds with a light, circular motion and use the kneaded eraser to pull out the bright tops.' },
    exercise: { type: 'choose', prompt: 'Which sky has clouds in correct perspective?', options: [
      { scene: 'sky', params: { kind: 'wrong' }, cap: 'A' }, { scene: 'sky', cap: 'B' },
    ], answer: 1, explain: 'In B the clouds shrink and flatten toward the horizon, as if they sit on a receding ceiling. In A they stay the same size at every height, so the sky has no depth.' },
    yourTurn: { title: 'Big sky', brief: 'Draw a low-horizon landscape where the sky is the subject.', do: ['Horizon on the lower third or lower', 'At least three rows of receding clouds', 'Clouds shaded as soft forms', '20 minutes'], time: 20, stretch: 'Add a storm: a dark cloud mass with a light break near the horizon.' },
    criteria: ['Clouds recede in size toward the horizon', 'Flat bases, rounded tops', 'Clouds have light and shadow', 'Sky stays lighter than the land'],
    checkpoint: [
      { q: 'Near the horizon, clouds appear…', o: ['Larger', 'Smaller and flatter', 'Darker', 'The same'], a: 1, why: 'They recede like anything else on a plane.' },
      { q: 'Cumulus clouds are best simplified as…', o: ['Cubes', 'Soft spheres with flat bottoms', 'Cones', 'Lines'], a: 1, why: 'Rounded tops, flat bases.' },
      { q: 'A clear sky is usually…', o: ['Darkest at the horizon', 'Lightest near the horizon', 'Evenly grey', 'Black'], a: 1, why: 'More atmosphere near the horizon lightens the sky there.' },
    ],
    next: 'Next: mountains, built from planes.',
  });

  add({
    id: 'mountains', unit: 'u5', n: 22, title: 'Mountains', skill: 'Ridges and planes', area: 'elements', level: 3, minutes: 35,
    prereq: ['atmosphere', 'shadows'],
    thumb: { scene: 'peak' },
    intro: 'The mountain demonstration moves from a zigzag ridgeline, to a row of tiny trees at the base, to hatched shadow planes, and only then to the framing pines. You will follow the same order.',
    what: 'Mountains are big pyramids with facets. Draw the ridgeline as a varied zigzag, find the ridges that divide light and shadow, shade the planes, and let snow stay paper white on the lit side.',
    why: 'Mountains are often the largest shapes in a landscape. A lively ridgeline and clear planes make them believable; even, sawtooth peaks look fake.',
    visual: { scene: 'mountainLake', overlays: [{ t: 'line', pts: [[190, 262], [330, 96], [430, 214]], w: 3 }, { t: 'label', x: 40, y: 140, text: 'Vary peak heights and spacing', to: [250, 150] }, { t: 'label', x: 450, y: 60, text: 'Snow stays paper on the lit side', to: [335, 120] }], cap: 'A varied ridgeline: one dominant peak, smaller supporting peaks, uneven spacing.',
      callouts: [['1', 'One dominant peak. Avoid equal sawteeth.'], ['2', 'Vary the angle and length of each slope.'], ['3', 'Each ridge coming toward you divides a lit and a shadow plane.'], ['4', 'Farther ranges: lighter and simpler.']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Horizon', d: 'A light line across the page.', show: [], ov: [{ t: 'horizon' }] },
        { t: 'Ridgeline', d: 'One continuous zigzag with a clear main peak.', show: ['near'], line: ['near'], ov: [{ t: 'horizon' }] },
        { t: 'Distant range and tree line', d: 'A lighter range behind, and tiny tree marks along the base.', show: ['far', 'near', 'treeline'], line: ['far', 'near'], ov: [] },
        { t: 'Shade the planes', d: 'Hatch each shadow plane along the slope. Leave snow as paper.', show: ['sky', 'far', 'near', 'treeline'], ov: [{ t: 'light' }] },
        { t: 'Foreground and water', d: 'Dark framing pines, then reflections in the lake.', show: null, ov: [] },
      ],
    },
    watch: { v: 'mountain', t: 200, note: 'About three minutes in: the zigzag ridgeline, then the tiny tree line along its base, then hatching down the shadow planes.' },
    guided: { time: 15, steps: ['Draw a horizon.', 'Draw one mountain range with a dominant peak and 3–4 smaller ones.', 'From each peak, draw a dividing ridge downward.', 'Hatch the planes facing away from the light.', 'Draw a lighter range behind it.'], tip: 'Say out loud: tall, short, short, medium. Varying the rhythm is what makes ranges look natural.' },
    exercise: { type: 'regions', scene: 'peak', params: { light: 'right' }, prompt: 'The light has moved. Label the lit plane and the shadow plane.', labels: ['Lit plane', 'Shadow plane'], key: { lit: 'Lit plane', shadow: 'Shadow plane' }, explain: 'With light from the right, the right-facing slope is lit and the left-facing slope falls into shadow. The snow follows the light too.' },
    yourTurn: { title: 'Mountain lake', brief: 'Draw a mountain range above a lake, following the demo order.', do: ['Horizon → ridgeline → distant range → tree line → shadow planes', 'One dominant peak', 'Distant range lighter than near range', '35 minutes'], time: 35, stretch: 'Add the reflection of the mountains in the lake, lighter and broken by horizontal lines.' },
    criteria: ['Varied, lively ridgeline', 'Clear lit and shadow planes', 'Atmospheric layering of ranges', 'Consistent light direction'],
    checkpoint: [
      { q: 'A row of equal, evenly spaced peaks looks…', o: ['Natural', 'Artificial', 'Distant', 'Dramatic'], a: 1, why: 'Nature varies height, spacing and angle.' },
      { q: 'What divides a mountain’s lit and shadow planes?', o: ['The horizon', 'A ridge running down from the peak', 'The tree line', 'The sky'], a: 1, why: 'Ridges are where planes turn.' },
      { q: 'In the demo order, what comes right after the ridgeline?', o: ['Full shading', 'Framing trees', 'The distant range and tree line', 'Water reflections'], a: 2, why: 'Big structure and layers before value.' },
    ],
    next: 'Next: trees, from silhouette to structure.',
  });

  add({
    id: 'trees', unit: 'u5', n: 23, title: 'Trees', skill: 'Silhouette and structure', area: 'elements', level: 3, minutes: 35,
    prereq: ['forms', 'marks'],
    thumb: { scene: 'trees' },
    intro: 'Most beginner trees are lollipops or stacked zigzags. Real trees have a characteristic silhouette, a trunk that tapers into branches, and a shadow side.',
    what: 'Draw a tree in three passes: its overall silhouette (the shape you would see backlit), its structure (trunk and main branches, tapering), and its value (a light side and shadow side, with texture along the edges).',
    why: 'Trees appear in almost every landscape, at every distance. You need a quick version for the distance and a structured version for the foreground.',
    visual: { scene: 'trees', cap: 'Five silhouettes: pine, oak, bare tree, cypress group, round tree. Each is recognisable as a flat shape before any detail.',
      callouts: [['1', 'Silhouette first; it identifies the species.'], ['2', 'Trunks taper; branches get thinner each time they split.'], ['3', 'Leave sky holes in the foliage.'], ['4', 'Distant trees: tiny vertical marks. Near trees: full structure.']] },
    demo: {
      scene: 'forestPath',
      steps: [
        { t: 'Light placement lines', d: 'Many faint vertical lines place the trunks, as in the forest demo.', show: ['sky'], ov: [{ t: 'horizon' }, { t: 'line', pts: [[40, 0], [40, 490]], w: 1 }, { t: 'line', pts: [[175, 0], [175, 490]], w: 1 }, { t: 'line', pts: [[690, 0], [690, 490]], w: 1 }, { t: 'line', pts: [[775, 0], [775, 490]], w: 1 }] },
        { t: 'Far trunks thin and light', d: 'They stay pale for atmospheric depth.', show: ['sky', 'far', 'ground', 'path'], ov: [] },
        { t: 'Near trunks dark and wide', d: 'Vertical bark strokes. Flare at the base.', show: ['sky', 'far', 'ground', 'path', 'near'], ov: [] },
        { t: 'Ground the trees', d: 'Grass tufts at the base anchor each trunk so it does not float.', show: null, ov: [{ t: 'label', x: 240, y: 470, text: 'Grass anchors the trunk', to: [190, 488] }] },
      ],
    },
    watch: { v: 'forest', t: 340, note: 'After many faint placement lines, one foreground trunk goes dark, and grass strokes anchor its base.' },
    guided: { time: 15, steps: ['Draw five tree silhouettes as flat dark shapes: pine, oak, bare, poplar, bush.', 'Pick one and draw its trunk and main branches, tapering.', 'Add a shadow side opposite your light.', 'Add grass at its base.'], tip: 'Draw branches from the trunk outward, lifting the pencil so each branch tapers.' },
    exercise: { type: 'choose', prompt: 'Which tree reads as nearest to you?', options: [
      { scene: 'forestPath', show: ['sky', 'far'], cap: 'A' }, { scene: 'forestPath', show: ['sky', 'mid'], cap: 'B' }, { scene: 'forestPath', show: ['sky', 'near'], cap: 'C' },
    ], answer: 2, explain: 'C’s trunks are widest, darkest and most textured, and they run off the top of the page. A’s thin pale trunks read as far away; B sits in between.' },
    yourTurn: { title: 'Five silhouettes, one tree', brief: 'Draw five different tree silhouettes using simple shapes, then develop one into a full foreground tree.', do: ['Five flat silhouettes, 2 minutes each', 'One developed tree: structure, value, texture', 'Grass or roots anchor it', '30 minutes'], time: 30, stretch: 'Draw the same tree at three distances: foreground, middle, background.' },
    criteria: ['Distinct silhouettes', 'Tapering trunk and branches', 'Consistent light and shadow side', 'Tree is anchored to the ground'],
    checkpoint: [
      { q: 'What identifies a tree species from far away?', o: ['Leaf texture', 'Its silhouette', 'Bark detail', 'Its colour'], a: 1, why: 'At distance only the overall shape survives.' },
      { q: 'Branches should…', o: ['Stay the same thickness', 'Taper as they divide', 'Get thicker', 'Be drawn as outlines only'], a: 1, why: 'Each division is thinner than the branch it came from.' },
      { q: 'Why add grass at the base of a trunk?', o: ['Decoration', 'To anchor it to the ground', 'To hide mistakes', 'For atmospheric perspective'], a: 1, why: 'Without contact, trees appear to float.' },
    ],
    next: 'Next: rocks and terrain.',
  });

  add({
    id: 'rocks', unit: 'u5', n: 24, title: 'Rocks and terrain', skill: 'Planes and stacking', area: 'elements', level: 3, minutes: 30,
    prereq: ['shadows', 'marks'],
    thumb: { scene: 'rocks' },
    intro: 'Rocks are boxes that have been knocked around. Find the top, front and side planes and they become solid.',
    what: 'Every rock has a top plane (usually lightest, facing the sky), a lit side and a shadow side. Cracks run along planes. Rocks rest on the ground with a dark contact shadow, and larger formations are stacks of simple blocks.',
    why: 'Rocks appear at shorelines, riverbanks, waterfalls and foregrounds. Flat, outlined rocks look like potatoes; planar rocks look heavy and real.',
    visual: { scene: 'rocks', overlays: [{ t: 'region', id: 'top', label: 'Top: lightest', fill: 0 }, { t: 'region', id: 'front', label: 'Lit side', fill: 0 }, { t: 'region', id: 'side', label: 'Shadow side', fill: 0 }, { t: 'light' }], cap: 'Three planes, three values. The dark contact shadow sits the rock on the ground.',
      callouts: [['1', 'Block it in with straight lines, like a box.'], ['2', 'Top plane lightest, shadow side darkest.'], ['3', 'Dark contact shadow where it meets the ground.'], ['4', 'Stack blocks for cliffs; overlap them clearly.']] },
    demo: {
      scene: 'waterfall',
      steps: [
        { t: 'Stack simple blocks', d: 'The left wall is built from blocks stacked and overlapping, drawn with straight, angular lines.', show: ['sky', 'walls'], line: ['walls'], ov: [] },
        { t: 'Three values per block', d: 'Top planes light, faces middle, sides dark.', show: ['sky', 'walls'], ov: [{ t: 'light' }] },
        { t: 'Set them in the scene', d: 'The waterfall and pool sit between the walls.', show: null, ov: [] },
      ],
    },
    watch: { v: 'waterfall', t: 290, note: 'The rock wall on the left is built up block by block with angular contour lines.' },
    guided: { time: 12, steps: ['Draw a box in perspective.', 'Chip its corners with straight cuts to make a rock.', 'Shade: top light, one side middle, one side dark.', 'Add a dark contact shadow and one crack that follows a plane.'], tip: 'Use straight lines only. Curves make rocks look soft.' },
    exercise: { type: 'regions', scene: 'rocks', prompt: 'Label the planes of the big rock.', labels: ['Top plane', 'Lit side', 'Shadow side'], key: { top: 'Top plane', front: 'Lit side', side: 'Shadow side' }, explain: 'Light from the upper left: the top faces the sky and is lightest, the left-facing side is lit, and the right-facing side is in shadow.' },
    yourTurn: { title: 'Rocky shoreline', brief: 'Draw a group of 5–7 rocks at the edge of water or a path.', do: ['Varied sizes, overlapping', 'Three planes on each rock', 'Contact shadows', 'Water or ground texture around them', '25 minutes'], time: 25, stretch: 'Stack rocks into a small cliff with a stream running down it.' },
    criteria: ['Rocks read as solid, planar forms', 'Consistent light on all rocks', 'Contact shadows present', 'Varied sizes and overlaps'],
    checkpoint: [
      { q: 'Rocks are best started as…', o: ['Circles', 'Boxes with chipped corners', 'Squiggles', 'Outlines of cracks'], a: 1, why: 'Planes make them solid.' },
      { q: 'The lightest plane of a rock is usually…', o: ['The side', 'The top, facing the sky', 'The bottom', 'The crack'], a: 1, why: 'Top planes face the sky and catch the most light.' },
      { q: 'What makes a rock sit on the ground?', o: ['An outline', 'A dark contact shadow', 'Texture', 'Being large'], a: 1, why: 'The contact shadow anchors it.' },
    ],
    next: 'Next: water and reflections.',
  });

  add({
    id: 'water', unit: 'u5', n: 25, title: 'Water and reflections', skill: 'Reflections', area: 'elements', level: 3, minutes: 30,
    prereq: ['skies', 'overlap'],
    thumb: { scene: 'cabin', show: ['sky', 'mts', 'bgtrees', 'water', 'rocks', 'cabin', 'trees'] },
    intro: 'In the cabin, mountain and bridge demos, water is drawn after the things it reflects, with horizontal strokes and mirrored shapes.',
    what: 'Calm water reflects what is above it, directly below it and upside down. Reflections are slightly darker than light objects and slightly lighter than dark ones. Horizontal lines of light break the reflection and show the surface.',
    why: 'Water doubles your subject and adds calm. Getting the reflection position right (straight down, never at an angle) makes it read as water immediately.',
    visual: { scene: 'cabin', overlays: [{ t: 'line', pts: [[560, 206], [560, 430]], w: 1.5, dash: true }, { t: 'label', x: 600, y: 440, text: 'Reflection sits straight below', to: [560, 400] }], cap: 'The cabin’s reflection hangs directly beneath it, flipped, lower in contrast, and broken by horizontal lines.',
      callouts: [['1', 'Reflections go straight down, never sideways.'], ['2', 'Lights reflect a little darker; darks a little lighter.'], ['3', 'Horizontal strokes for calm water; leave thin paper lines.'], ['4', 'Distance compresses ripples: finer lines far away, wider near you.']] },
    demo: {
      scene: 'cabin',
      steps: [
        { t: 'Draw what is above first', d: 'Cabin, trees and island come before any water.', show: ['sky', 'mts', 'bgtrees', 'rocks', 'cabin', 'trees'], ov: [{ t: 'horizon' }] },
        { t: 'Drop vertical guides', d: 'From key points, drop light verticals into the water.', show: ['sky', 'mts', 'bgtrees', 'rocks', 'cabin', 'trees'], ov: [{ t: 'line', pts: [[560, 206], [560, 440]], w: 1.2, dash: true }, { t: 'line', pts: [[700, 50], [700, 480]], w: 1.2, dash: true }] },
        { t: 'Mirror and soften', d: 'Draw the flipped shapes with horizontal strokes, lower in contrast.', show: null, ov: [] },
      ],
    },
    watch: { v: 'cabin', t: 640, note: 'Reflections go in under the pines and cabin with short strokes, and a scrap of paper is used to keep the waterline clean.' },
    guided: { time: 12, steps: ['Draw a horizon and a simple tree on the far shore.', 'Drop a vertical guide from the treetop into the water.', 'Draw the reflection flipped, the same height, with horizontal strokes.', 'Erase two or three thin horizontal lines across it.'], tip: 'Lay a scrap of paper along the shoreline while you shade the water; it keeps the edge crisp, as in the demos.' },
    exercise: { type: 'line', scene: 'bridge', prompt: 'The bridge deck is at the top of the arch. Click how far below the waterline its reflection would appear.', answer: 450, tol: 45, reveal: [{ t: 'line', pts: [[140, 190], [660, 190]], w: 2, dash: true }, { t: 'line', pts: [[140, 450], [660, 450]], w: 2 }, { t: 'label', x: 20, y: 320, text: 'Waterline', to: [140, 322] }], right: 'Right. A reflection is as far below the waterline as the object is above it.', wrong: 'Measure from the waterline up to the deck, then the same distance down.', axisLabel: 'reflection' },
    yourTurn: { title: 'Still water', brief: 'Draw a lake or river scene with clear reflections.', do: ['Draw the objects above water first', 'Reflections directly below, flipped', 'Horizontal strokes and a few lifted light lines', '25 minutes'], time: 25, stretch: 'Add a gentle breeze: the reflection breaks into horizontal zigzags.' },
    criteria: ['Reflections are directly below their objects', 'Reflection values are slightly compressed', 'Horizontal marks describe the surface', 'Clean waterline edge'],
    checkpoint: [
      { q: 'Reflections in calm water appear…', o: ['At an angle', 'Directly below, upside down', 'Above the object', 'Only at night'], a: 1, why: 'Calm water mirrors vertically.' },
      { q: 'A white cabin’s reflection is…', o: ['Brighter white', 'Slightly darker', 'Black', 'Invisible'], a: 1, why: 'Reflections compress the value range.' },
      { q: 'How do you show the water surface?', o: ['Vertical lines', 'Horizontal strokes and lifted light lines', 'Circles', 'Outlines'], a: 1, why: 'Horizontal marks describe a flat surface.' },
    ],
    next: 'Next: buildings and bridges in the landscape.',
  });

  add({
    id: 'buildings', unit: 'u5', n: 26, title: 'Buildings in the landscape', skill: 'Man-made forms', area: 'perspective', level: 4, minutes: 35,
    prereq: ['twopoint', 'rocks'],
    thumb: { scene: 'bridge' },
    intro: 'A cabin or bridge gives a landscape scale and story. It also has to agree with the horizon and sit convincingly on the land.',
    what: 'Buildings and bridges combine perspective (for their straight edges) with the landscape skills you already have: planes, cast shadows, overlap and value. Arches are half-ellipses; stone and plank textures follow the perspective.',
    why: 'A small building immediately tells the viewer how big the mountains are. It is also a natural focal point, so it usually carries the highest contrast.',
    visual: { scene: 'bridge', overlays: [{ t: 'label', x: 30, y: 150, text: 'Stones follow the curve of the arch', to: [200, 236] }, { t: 'focal', at: [400, 290], r: 50, label: 'Darkest value' }], cap: 'Stone blocks radiate from the arch. The opening is the darkest, most contrasty area: the focal point.',
      callouts: [['1', 'Structure first, texture last.'], ['2', 'Texture (stones, planks) follows the form and perspective.'], ['3', 'Man-made edges are straighter and harder than natural ones: use that contrast.'], ['4', 'Keep it small: it gives the landscape scale.']] },
    demo: {
      scene: 'bridge',
      steps: [
        { t: 'Arch and deck', d: 'A horizontal deck line and a half-ellipse arch, sitting on the waterline.', show: ['sky', 'bridge'], line: ['bridge'], ov: [{ t: 'horizon', y: 318, label: 'Waterline' }] },
        { t: 'Banks and rocks', d: 'The land meets the bridge on both sides.', show: ['sky', 'banks', 'bridge', 'rocks'], line: ['banks', 'bridge', 'rocks'], ov: [] },
        { t: 'Dark under the arch', d: 'The single darkest area goes in, then the background stays pale behind it.', show: ['sky', 'bg', 'banks', 'bridge', 'rocks'], ov: [] },
        { t: 'Water and reflection', d: 'Horizontal strokes and a mirrored arch.', show: null, ov: [] },
      ],
    },
    watch: { v: 'bridge', t: 230, note: 'The arch is laid in as a simple curve with the stones following it, before the banks and bare trees.' },
    guided: { time: 15, steps: ['Draw a waterline and a deck line above it.', 'Draw a half-ellipse arch between them.', 'Divide the arch face into stones radiating from its centre.', 'Shade the opening darkest; add the reflection below.'], tip: 'Ellipses are symmetrical; sketch the full ellipse lightly and keep only the top half.' },
    exercise: { type: 'point', scene: 'bridge', prompt: 'Where is the darkest value in this drawing? Click it.', answer: [400, 290], tol: 70, reveal: [{ t: 'focal', at: [400, 290], r: 60, label: 'Value 9' }], right: 'Yes. The underside of the arch is the darkest area, and it touches the lightest water, which makes it the focal point.', wrong: 'Squint. Which area stays darkest when the rest blurs?' },
    yourTurn: { title: 'Cabin or bridge', brief: 'Draw a landscape with one building or bridge as the focal point.', do: ['Perspective or ellipse construction first', 'Texture follows the form', 'Highest contrast on the structure', 'It sits on the land (rocks, bank, shadow)', '35 minutes'], time: 35, stretch: 'Include its reflection in water.' },
    criteria: ['Structure agrees with the horizon', 'Convincingly grounded', 'Texture follows the form', 'Structure is the focal point'],
    checkpoint: [
      { q: 'An arch seen from the front is drawn as…', o: ['A triangle', 'A half-ellipse', 'A square', 'A spiral'], a: 1, why: 'Arches are curves; a half-ellipse is the simple construction.' },
      { q: 'Why include a small building?', o: ['Decoration', 'It gives scale and a focal point', 'It is required', 'It hides the horizon'], a: 1, why: 'Known sizes tell the viewer how large everything else is.' },
      { q: 'Stone texture on an arch should…', o: ['Be horizontal', 'Follow the curve of the arch', 'Be random', 'Be vertical'], a: 1, why: 'Texture follows form.' },
    ],
    next: 'Unit 6: putting it together with the HILLS analysis.',
  });

  /* ================= UNIT 6 — COMPLETE LANDSCAPES ================= */
  add({
    id: 'hills', unit: 'u6', n: 27, title: 'The HILLS analysis', skill: 'Breaking down any reference', area: 'composition', level: 4, minutes: 40,
    prereq: ['thumbnails', 'atmosphere', 'notan'],
    thumb: { scene: 'mountainLake', overlays: [{ t: 'horizon', label: '' }, { t: 'shapes' }] },
    intro: 'Every lesson so far is one question you can ask of a reference. HILLS puts them in order, so you can analyse any landscape in about five minutes.',
    what: 'HILLS: Horizon, bIg shapes, Layers, Light, Story. Ask the five questions in order, write short answers, and you have a drawing plan. The order matches the order you will draw in.',
    why: 'Without a system, an unfamiliar reference is overwhelming. With one, it becomes five small decisions. This is the habit that lets you draw landscapes you have never seen before.',
    visual: { scene: 'mountainLake', overlays: [{ t: 'horizon', label: 'H  Horizon' }, { t: 'shapes' }, { t: 'focal', r: 40, label: 'S  Story: focal point' }, { t: 'light', label: 'L  Light' }], cap: 'The mountain lake, analysed: horizon, four big shapes, three layers, light from the upper left, focal point on the main peak.',
      callouts: [['H', 'Horizon: where is eye level? Any vanishing points?'], ['I', 'Big shapes: what are the 3–5 largest masses?'], ['L', 'Layers: foreground, middle ground, background?'], ['L', 'Light: direction, shadow shapes, three value groups?'], ['S', 'Story: focal point; details to keep; details to drop.']] },
    demo: {
      scene: 'cabin',
      steps: [
        { t: 'H: Horizon', d: 'Eye level is the far shoreline. The cabin’s left wall vanishes on it.', show: null, ov: [{ t: 'horizon' }, { t: 'vp', extend: true }] },
        { t: 'I: Big shapes', d: 'Sky, pale mountains, dark pine-and-cabin mass, water.', show: null, mode: 'notan', ov: [] },
        { t: 'L: Layers', d: 'Background mountains, middle-ground island with the cabin, foreground bank.', show: null, ov: [{ t: 'region', id: 'mts', label: 'Background', fill: 0.1 }, { t: 'region', id: 'cabin', label: 'Middle ground', fill: 0.15 }] },
        { t: 'L: Light', d: 'Upper left. Cabin’s right wall and the pines’ right sides are in shadow.', show: null, ov: [{ t: 'light' }] },
        { t: 'S: Story', d: 'The cabin is the focal point. Keep its windows and door. Simplify the distant pines to marks and drop individual waves.', show: null, ov: [{ t: 'focal', r: 60, label: 'Keep detail here' }] },
      ],
    },
    guided: { time: 15, steps: ['Choose a landscape photo.', 'Write H, I, L, L, S down the side of your page.', 'Answer each in one line.', 'Make one thumbnail that follows your answers.'], tip: 'You will use this on every reference from now on. Reference Mode in this app walks you through it with any photo.' },
    exercise: { type: 'breakdown', scene: 'mountainLake', steps: [
      { type: 'line', prompt: 'H: click the horizon.', answer: 318, tol: 25, reveal: [{ t: 'horizon' }], right: 'The lake’s far edge is eye level.', wrong: 'Find where the water meets the far shore.' },
      { type: 'regions', prompt: 'L: label the layers.', labels: ['Foreground', 'Middle ground', 'Background'], key: { fg: 'Foreground', lake: 'Middle ground', near: 'Background', far: 'Background' }, explain: 'The pines are nearest; the lake spans the middle; the mountains are background.' },
      { type: 'dial', prompt: 'L: where is the light coming from?', answer: 220, tol: 45, explain: 'Shadow planes are on the right side of each peak, so light comes from the upper left.' },
      { type: 'point', prompt: 'S: click the focal point.', answer: [330, 110], tol: 70, reveal: [{ t: 'focal', r: 40 }], right: 'The tallest peak, with the strongest light-shadow split, is the focal point.', wrong: 'Look for the dominant shape with the strongest contrast.' },
    ] },
    yourTurn: { title: 'Analyse, then draw', brief: 'Pick an unfamiliar landscape photo. Write a HILLS analysis, make one thumbnail, then a 30-minute drawing.', do: ['Five written answers', 'One thumbnail following them', 'A 30-minute drawing in the HILLS order', 'Tip: use Reference Mode for the analysis'], time: 45, stretch: 'Do the same analysis on a painting you admire and note what the artist left out.' },
    criteria: ['Horizon placed first', 'Big shapes are clear', 'Layers separated in value', 'Consistent light', 'Clear focal point and simplified details'],
    checkpoint: [
      { q: 'What does the S in HILLS stand for?', o: ['Shadow', 'Story: focal point and what to keep or drop', 'Sky', 'Scale'], a: 1, why: 'Story decides what the drawing is about.' },
      { q: 'Why does HILLS start with the horizon?', o: ['It is easiest', 'Everything else is measured against eye level', 'Tradition', 'It is the focal point'], a: 1, why: 'Eye level anchors placement and perspective.' },
      { q: 'Which details should you keep?', o: ['All of them', 'Those near the focal point that tell the story', 'Only background details', 'None'], a: 1, why: 'Detail follows the story; the rest is simplified.' },
    ],
    next: 'Next: dramatic lighting.',
  });

  add({
    id: 'dramatic', unit: 'u6', n: 28, title: 'Dramatic lighting', skill: 'Backlight, silhouettes, value key', area: 'light', level: 4, minutes: 35,
    prereq: ['contrast', 'hills'],
    thumb: { scene: 'coast' },
    intro: 'The same place can feel calm at noon and theatrical at sunset. Lighting is a choice you can make, even if the reference does not.',
    what: 'Dramatic lighting uses low sun, backlight, or strong side light to create large shadow masses and small, bright lights. A low-key drawing is mostly dark with a few lights; a high-key drawing is mostly light with a few darks.',
    why: 'Mood lives in value proportions. A small area of light surrounded by darkness is dramatic because the contrast is concentrated.',
    visual: { scene: 'coast', overlays: [{ t: 'label', x: 610, y: 190, text: 'Light source in the picture', to: [520, 262] }, { t: 'label', x: 360, y: 470, text: 'Silhouettes with a thin rim of light', to: [170, 402] }], cap: 'Backlight: the sun is behind the scene, so land becomes silhouette and water carries a path of light toward you.',
      callouts: [['1', 'Backlight: forms become dark silhouettes; edges catch a rim of light.'], ['2', 'Low-key: 70% dark, 20% middle, 10% light.'], ['3', 'Light on water points straight at the viewer, below the sun.'], ['4', 'Lose some edges in the dark. Not everything needs an outline.']] },
    demo: {
      scene: 'coast',
      steps: [
        { t: 'Place the light first', d: 'Sun and glow near the horizon.', show: ['sky'], ov: [{ t: 'horizon' }] },
        { t: 'Silhouettes', d: 'Headland and rocks as flat dark shapes.', show: ['sky', 'far', 'headland', 'rocks'], ov: [] },
        { t: 'The light path', d: 'A path of broken horizontal lights on the water, below the sun.', show: null, ov: [{ t: 'line', pts: [[520, 262], [520, 500]], w: 1.2, dash: true }] },
      ],
    },
    guided: { time: 12, steps: ['Draw a thumbnail of a simple landscape at noon: three values.', 'Redraw it backlit at sunset: sun on the horizon, land as silhouette.', 'Add a light path on the water or a rim on the rocks.', 'Compare the mood.'], tip: 'Tone the whole page with a middle value first, then lift lights and push darks.' },
    exercise: { type: 'point', scene: 'coast', params: { sx: 600, sy: 268 }, prompt: 'Where is the light source?', answer: [600, 268], tol: 60, reveal: [{ t: 'mark', x: 600, y: 268, label: 'Sun' }], right: 'Yes. The glow centres on the sun, and the light path on the water sits directly below it.', wrong: 'Follow the light path on the water back up to the horizon.' },
    yourTurn: { title: 'Same place, two moods', brief: 'Draw one landscape twice: calm midday light, then dramatic backlight or low side light.', do: ['Thumbnails for both', 'Midday: high-key', 'Dramatic: low-key with a small area of light', '20 minutes each'], time: 40, stretch: 'Try a night scene with a single light source (moon or window).' },
    criteria: ['Clear difference in mood', 'Consistent light source in each', 'Value proportions support the mood', 'Silhouettes and rim light are convincing'],
    checkpoint: [
      { q: 'In backlight, near forms appear…', o: ['Bright', 'As dark silhouettes', 'Invisible', 'Colourful'], a: 1, why: 'Their lit sides face away from you.' },
      { q: 'A low-key drawing is…', o: ['Mostly light', 'Mostly dark with small lights', 'All middle values', 'Unfinished'], a: 1, why: 'Low-key concentrates light into small areas.' },
      { q: 'Sunlight on water appears…', o: ['Anywhere', 'As a path directly below the sun, toward you', 'Only at the edges', 'As vertical lines'], a: 1, why: 'The reflection lines up between the sun and your eye.' },
    ],
    next: 'Next: a complete landscape from start to finish.',
  });

  add({
    id: 'complete', unit: 'u6', n: 29, title: 'A complete landscape', skill: 'Full workflow', area: 'elements', level: 4, minutes: 60,
    prereq: ['mountains', 'trees', 'water', 'hills'],
    thumb: { scene: 'mountainLake' },
    intro: 'Put it all together. This lesson walks through a full drawing in the same order the playlist demos use, from blank page to finish.',
    what: 'The full workflow: analyse (HILLS), thumbnail, horizon, big shapes in light line, layers back to front, value groups, forms and textures, atmospheric adjustments, focal point accents, clean-up.',
    why: 'Knowing the order removes the fear of the blank page. Each stage has one job, and you never have to fix detail while structure is still wrong.',
    visual: { scene: 'mountainLake', cap: 'The target: a mountain lake with framing pines. Every step below is one you have practised.',
      callouts: [['1', 'Analyse and thumbnail (5 min).'], ['2', 'Structure in light line (10 min).'], ['3', 'Values back to front (25 min).'], ['4', 'Focal accents and clean-up (10 min).']] },
    demo: {
      scene: 'mountainLake',
      steps: [
        { t: 'Thumbnail', d: 'Three values, four shapes, focal point marked.', show: null, mode: 'notan', ov: [] },
        { t: 'Horizon', d: 'One light line.', show: [], ov: [{ t: 'horizon' }] },
        { t: 'Big shapes', d: 'Ridgelines, shore and pine mass in light line.', show: ['far', 'near', 'treeline', 'fg'], line: ['far', 'near', 'treeline', 'fg'], ov: [{ t: 'horizon' }] },
        { t: 'Background values', d: 'Sky and distant range, light and soft.', show: ['sky', 'far'], line: [], ov: [] },
        { t: 'Middle ground', d: 'Main mountain planes and tree line.', show: ['sky', 'far', 'near', 'treeline'], ov: [] },
        { t: 'Water', d: 'Horizontal strokes, reflections straight below.', show: ['sky', 'far', 'near', 'treeline', 'lake'], ov: [] },
        { t: 'Foreground and accents', d: 'Framing pines darkest; one accent at the focal point.', show: null, ov: [{ t: 'focal', r: 40 }] },
      ],
    },
    watch: { v: 'mountain', t: 0, note: 'The whole mountain demo follows this order; watch it once through at double speed.' },
    guided: { time: 15, steps: ['Choose your subject: mountain lake, forest path, cabin, bridge or waterfall.', 'Do the HILLS analysis and one thumbnail.', 'Draw the horizon and big shapes in light line.', 'Stop and check the structure before any shading.'], tip: 'Rotate the drawing upside down at the structure stage. Errors in shape become obvious.' },
    exercise: { type: 'order', prompt: 'Put the workflow in order.', items: [
      { id: 'b', text: 'Big shapes in light line' }, { id: 'v', text: 'Value groups, back to front' }, { id: 't', text: 'HILLS analysis and thumbnail' }, { id: 'a', text: 'Focal point accents and clean-up' }, { id: 'h', text: 'Horizon line' },
    ], answer: ['t', 'h', 'b', 'v', 'a'], explain: 'Plan, then eye level, then structure, then value, then accents. Each stage can be corrected before the next one starts.' },
    yourTurn: { title: 'The complete landscape', brief: 'Draw a complete landscape (about A4) following the full workflow.', do: ['HILLS notes and thumbnail on the side', 'At least three planes', 'Three value groups with a clear focal point', 'Atmospheric perspective', '60 minutes'], time: 60, stretch: 'Pick one of the five playlist subjects and draw it from your own imagination rather than a reference.' },
    criteria: ['Strong composition', 'Convincing depth', 'Clear value structure', 'Consistent light', 'Controlled detail at the focal point'],
    checkpoint: [
      { q: 'When should detail be added?', o: ['First', 'After structure and values are right', 'Anytime', 'Never'], a: 1, why: 'Detail on wrong structure is wasted.' },
      { q: 'A useful trick to check structure is…', o: ['Adding more detail', 'Turning the drawing upside down', 'Darkening everything', 'Erasing the horizon'], a: 1, why: 'Upside down, you see shapes instead of things.' },
      { q: 'Which plane do you shade first?', o: ['Foreground', 'Background', 'Focal point', 'It does not matter'], a: 1, why: 'Back to front lets near shapes overlap.' },
    ],
    next: 'Last lesson: independent study.',
  });

  add({
    id: 'independent', unit: 'u6', n: 30, title: 'Independent study', skill: 'Reference interpretation and style', area: 'composition', level: 5, minutes: 60,
    prereq: ['dramatic', 'complete'],
    thumb: { scene: 'waterfall', mode: 'notan' },
    intro: 'A reference is raw material, not a set of instructions. Now you decide what to keep, move, simplify or invent.',
    what: 'Reference interpretation means changing a photo on purpose: moving the horizon, removing clutter, shifting the light, exaggerating atmosphere, or simplifying shapes into a personal style.',
    why: 'This is the goal of the whole course: looking at a landscape you have never seen, understanding it with HILLS, and making a drawing that is better designed than the photo.',
    visual: { scene: 'waterfall', mode: 'notan', cap: 'The waterfall reduced to three values: a stylised version that keeps the story and drops the clutter.',
      callouts: [['Move', 'Shift elements to improve the composition.'], ['Remove', 'Drop anything that does not support the story.'], ['Relight', 'Change the light direction or time of day.'], ['Stylise', 'Simplify shapes and marks into a consistent language.']] },
    demo: {
      scene: 'waterfall',
      steps: [
        { t: 'The reference', d: 'Plenty going on: walls, falls, pool, rocks, trees.', show: null, ov: [] },
        { t: 'Decide the story', d: 'The falls are the subject. Walls frame it. Trees are optional.', show: null, ov: [{ t: 'region', id: 'falls', label: 'Story: the falls' }] },
        { t: 'Simplify', d: 'Three values. Trees dropped, rocks merged into two masses.', show: ['sky', 'back', 'falls', 'pool', 'walls'], mode: 'notan', ov: [] },
      ],
    },
    guided: { time: 15, steps: ['Choose a photo you have not drawn before.', 'Run HILLS in Reference Mode.', 'Write three changes you will make: move, remove, relight or stylise.', 'Make two thumbnails: faithful and interpreted.'], tip: 'Keep your interpretation consistent: if you simplify trees, simplify rocks the same way.' },
    exercise: { type: 'choose', prompt: 'You are drawing the mountain lake and want more drama. Which change best serves that goal?', options: [
      { scene: 'mountainLake', cap: 'Keep it as is' }, { scene: 'coast', cap: 'Relight: sun low behind the land' }, { scene: 'mountainLake', mode: 'line', cap: 'Add more outline detail' },
    ], answer: 1, explain: 'Relighting with a low backlight concentrates light into a small area and turns the land into silhouette, which is what creates drama. More outline detail adds noise, not mood.' },
    yourTurn: { title: 'Your landscape', brief: 'Draw a landscape from an unfamiliar reference, interpreted on purpose.', do: ['HILLS analysis', 'At least two deliberate changes from the photo', 'Thumbnail before the final', 'Write one sentence about what the drawing is about', '60 minutes'], time: 60, stretch: 'Do the same reference in two different styles.' },
    criteria: ['Clear intent', 'Deliberate, effective changes from the reference', 'Strong value structure and composition', 'Consistent style'],
    checkpoint: [
      { q: 'A reference photo is…', o: ['A set of instructions to copy exactly', 'Raw material you can change on purpose', 'Only for beginners', 'Always better than a drawing'], a: 1, why: 'You are the designer; the photo is information.' },
      { q: 'Which change adds drama?', o: ['Adding texture everywhere', 'Lower, stronger light and larger shadow masses', 'Centring the horizon', 'More detail in the background'], a: 1, why: 'Concentrated contrast creates drama.' },
      { q: 'Stylising means…', o: ['Random changes', 'Simplifying shapes and marks consistently', 'Copying another artist', 'Using colour'], a: 1, why: 'Consistency is what makes it a style.' },
    ],
    next: 'You have finished the course. Keep going in Reference Mode: one new landscape a week, analysed with HILLS.',
  });

  /* ================= PRACTICE DRILLS ================= */
  const DRILLS = [
    { id: 'd-horizon', title: 'Horizon hunt', area: 'perspective', minutes: 5, level: 1, thumb: { scene: 'cabin', overlays: [{ t: 'horizon', label: '' }] }, goal: 'Find eye level in any scene within ten seconds.', steps: ['Open five landscape photos.', 'For each, draw a 5 × 3 cm box and mark only the horizon.', 'Check: does the horizon pass through where the ground or water flattens out?'] },
    { id: 'd-shapes', title: 'Three-shape landscape', area: 'shapes', minutes: 8, level: 1, thumb: { scene: 'mountainLake', overlays: [{ t: 'shapes' }] }, goal: 'Reduce any scene to its largest masses.', steps: ['Pick a busy photo.', 'Draw it with exactly three shapes.', 'Draw it again with five.', 'Compare which reads better.'] },
    { id: 'd-valuestrip', title: 'Nine-step value strip', area: 'value', minutes: 10, level: 1, thumb: { svg: 'valueScale' }, goal: 'Control pressure and layering to hit exact values.', steps: ['Draw nine boxes.', 'Fill them from paper white to your darkest dark.', 'Squint: fix any two neighbours that look the same.'] },
    { id: 'd-silhouettes', title: 'Five tree silhouettes', area: 'elements', minutes: 10, level: 1, thumb: { scene: 'trees' }, goal: 'Recognise tree species by shape alone.', steps: ['Draw five different tree silhouettes as flat dark shapes.', 'Two minutes each.', 'Leave sky holes in at least two of them.'] },
    { id: 'd-thumbs', title: 'Four thumbnails in eight minutes', area: 'composition', minutes: 8, level: 2, thumb: { scene: 'hills', mode: 'notan' }, goal: 'Explore compositions quickly before committing.', steps: ['Four boxes, 5 × 3 cm.', 'Same scene, change the horizon or focal point each time.', 'Three values only.', 'Circle the best one.'] },
    { id: 'd-notan', title: 'Squint study in three values', area: 'value', minutes: 12, level: 2, thumb: { scene: 'coast', mode: 'notan' }, goal: 'See value groups instead of details.', steps: ['Pick a photo and squint.', 'Draw it with only light, middle and dark.', 'No lines inside shapes.'] },
    { id: 'd-road', title: 'One-point road', area: 'perspective', minutes: 12, level: 2, thumb: { scene: 'road' }, goal: 'Make receding parallels converge on the horizon.', steps: ['Horizon and a VP.', 'A road with five poles or trees along one side.', 'Check every top and bottom against a guide to the VP.'] },
    { id: 'd-ranges', title: 'Four ranges of air', area: 'depth', minutes: 12, level: 2, thumb: { scene: 'ranges' }, goal: 'Build depth with atmospheric perspective.', steps: ['Draw four overlapping ridgelines.', 'Shade each one two steps darker than the one behind.', 'Darkest and sharpest only at the front.'] },
    { id: 'd-cabinbox', title: 'Cabin boxes', area: 'perspective', minutes: 15, level: 3, thumb: { scene: 'cabin', overlays: [{ t: 'vp', extend: true, label: '' }] }, goal: 'Draw boxes in two-point perspective without distortion.', steps: ['Horizon with VPs near the page edges.', 'Draw three boxes: above, on and below eye level.', 'Add a gable roof to one of them.'] },
    { id: 'd-rocks', title: 'Three rocks, one light', area: 'light', minutes: 10, level: 2, thumb: { scene: 'rocks' }, goal: 'Keep shadows consistent with one light.', steps: ['Mark a light direction.', 'Draw three rocks as chipped boxes.', 'Shade top, lit side and shadow side; add contact shadows.'] },
    { id: 'd-clouds', title: 'Cloud ceiling', area: 'elements', minutes: 10, level: 2, thumb: { scene: 'sky' }, goal: 'Clouds that recede toward the horizon.', steps: ['Low horizon.', 'Three rows of clouds shrinking toward it.', 'Flat bottoms and shaded undersides.'] },
    { id: 'd-reflect', title: 'Reflection mirror', area: 'elements', minutes: 10, level: 2, thumb: { scene: 'cabin', show: ['sky', 'mts', 'bgtrees', 'water', 'rocks', 'cabin', 'trees'] }, goal: 'Place reflections straight down, flipped.', steps: ['Draw a tree, a post and a rock on a shoreline.', 'Drop vertical guides into the water.', 'Draw each reflection flipped, slightly compressed in value.'] },
    { id: 'd-hatch', title: 'Directional marks sampler', area: 'line', minutes: 8, level: 2, thumb: { scene: 'waterfall' }, goal: 'Match stroke direction to surface.', steps: ['Four boxes: vertical, horizontal, along-slope, clusters.', 'Label what each describes.', 'Use one of them in a tiny landscape.'] },
    { id: 'd-frame', title: 'Three frames', area: 'composition', minutes: 10, level: 2, thumb: { scene: 'hills', params: { frame: true } }, goal: 'Use framing without tangents.', steps: ['One scene, three thumbnails.', 'Frame with a tree, with an overhanging branch, and with dark foreground rocks.', 'Check every thumbnail for tangents.'] },
    { id: 'd-contrast', title: 'One magnet', area: 'light', minutes: 12, level: 3, thumb: { scene: 'bridge' }, goal: 'Put the strongest contrast only at the focal point.', steps: ['Thumbnail a scene in values 2–7 only.', 'Add a single 6B accent at the focal point.', 'Lift a highlight beside it.'] },
    { id: 'd-hillsref', title: 'Weekly reference study', area: 'composition', minutes: 30, level: 4, thumb: { scene: 'mountainLake', overlays: [{ t: 'horizon', label: '' }, { t: 'shapes' }] }, goal: 'Analyse and draw an unfamiliar landscape independently.', steps: ['Open Reference Mode with a new photo.', 'Complete the HILLS analysis.', 'Thumbnail, then a 20-minute drawing.', 'Submit it for feedback.'], link: 'reference' },
  ];

  window.Course = { VIDEOS, AREAS, UNITS, HILLS, LESSONS: L, DRILLS, byId: Object.fromEntries(L.map((l) => [l.id, l])) };
})();
