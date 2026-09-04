/* Geovalor cinematic frame sequence: 30 pixel-aligned states from one master.
   Serves 1080p on typical/small viewports and 4K only where the extra
   resolution is actually visible (large viewport x DPR), so the page does
   not force everyone to download 68MB of 4K frames regardless of screen. */
(function () {
  'use strict';
  var FRAME_COUNT = 30;
  var frame = document.getElementById('frame');
  var track = document.querySelector('.track');
  if (!frame || !track || frame.dataset.gvSequence) return;
  frame.dataset.gvSequence = '1';

  var overlay = frame.querySelector('svg.overlay');
  var base = frame.querySelector('img');
  var surface = document.createElement('img');
  surface.className = 'gv-surface-photo';
  surface.src = 'assets/surface-real-1920.jpg?v=1';
  surface.srcset = 'assets/surface-real-1920.jpg?v=1 1920w, assets/surface-real-4k.jpg?v=1 3840w';
  surface.sizes = '100vw';
  surface.alt = 'Fotografia real de referência de uma operação de sondagem; não representa uma concessão específica em Angola.';
  surface.decoding = 'async';
  surface.fetchPriority = 'high';
  base.after ? base.after(surface) : frame.insertBefore(surface, base.nextSibling); // depois de 'base' na ordem do DOM, para não ser apanhada por frame.querySelector('img') no bootAlive()
  var wrap = document.createElement('div');
  wrap.id = 'gv-sequence';
  wrap.setAttribute('aria-hidden', 'true');
  var a = document.createElement('img');
  var b = document.createElement('img');
  a.className = 'gv-sequence-frame is-a';
  b.className = 'gv-sequence-frame is-b';
  [a, b].forEach(function (img) {
    img.decoding = 'async';
    img.draggable = false;
    img.alt = '';
  });
  wrap.appendChild(a);
  wrap.appendChild(b);
  if (overlay) frame.insertBefore(wrap, overlay);
  else frame.appendChild(wrap);

  var style = document.createElement('style');
  style.textContent = '#gv-sequence{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;background:#050708;opacity:0;transition:opacity .35s ease}#gv-sequence .gv-sequence-frame{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;opacity:0;transition:opacity .16s linear;will-change:opacity}#gv-sequence .gv-sequence-frame.is-a{opacity:1}.gv-surface-photo{position:absolute;inset:0;z-index:2;width:100%;height:100%;display:block;object-fit:cover;opacity:1;transition:opacity .35s ease;filter:contrast(1.04) saturate(.92) brightness(.78)}#frame>img:not(.gv-surface-photo){opacity:.16!important}#frame svg.overlay{position:relative;z-index:3}@media(prefers-reduced-motion:reduce){#gv-sequence,.gv-surface-photo,#gv-sequence .gv-sequence-frame{transition:none}}';
  document.head.appendChild(style);

  // Effective pixels needed to fill the frame at native resolution. Below
  // ~2200 effective px, 1080p already covers it 1:1 or better; only large
  // and/or high-DPI viewports get real benefit from the 4K set.
  var effectivePx = (window.innerWidth || 1280) * (window.devicePixelRatio || 1);
  var folder = effectivePx > 2200 ? 'frames-4k' : 'frames-1080';
  var version = folder === 'frames-4k' ? 'v=2' : 'v=1';

  var urls = [];
  for (var i = 0; i < FRAME_COUNT; i++) urls.push('assets/' + folder + '/frame-' + String(i + 1).padStart(2, '0') + '.jpg?' + version);
  var loaded = Object.create(null);
  function load(index) {
    if (index < 0 || index >= FRAME_COUNT || loaded[index]) return;
    loaded[index] = true;
    var preload = new Image();
    preload.decoding = 'async';
    preload.src = urls[index];
  }
  function show(index, mix) {
    var next = Math.min(FRAME_COUNT - 1, index + 1);
    load(index); load(next);
    if (a.dataset.frame !== String(index)) { a.src = urls[index]; a.dataset.frame = String(index); }
    if (b.dataset.frame !== String(next)) { b.src = urls[next]; b.dataset.frame = String(next); }
    a.style.opacity = String(1 - mix);
    b.style.opacity = String(mix);
  }
  // Only the first frame is needed immediately (it's what's on screen at
  // load); the rest trickle in afterwards so initial paint isn't blocked
  // by a burst of large image requests.
  load(0); load(1);
  var n = 2;
  function warm() { if (n < FRAME_COUNT) { load(n++); setTimeout(warm, 220); } }
  setTimeout(warm, 900);

  var raf = 0;
  function update() {
    var max = Math.max(1, track.scrollHeight - innerHeight);
    var p = Math.max(0, Math.min(1, scrollY / max));
    var position = p * (FRAME_COUNT - 1);
    show(Math.floor(position), position % 1);
    var sequenceReveal = Math.max(0, Math.min(1, (p - .06) / .18));
    wrap.style.opacity = String(sequenceReveal);
    surface.style.opacity = String(1 - Math.max(0, Math.min(1, (p - .03) / .20)));
    raf = 0;
  }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
