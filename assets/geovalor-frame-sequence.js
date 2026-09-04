/* Geovalor cinematic frame sequence: 30 pixel-aligned states from one master. */
(function () {
  'use strict';
  var FRAME_COUNT = 30;
  var frame = document.getElementById('frame');
  var track = document.querySelector('.track');
  if (!frame || !track || frame.dataset.gvSequence) return;
  frame.dataset.gvSequence = '1';

  var overlay = frame.querySelector('svg.overlay');
  var base = frame.querySelector('img');
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
  style.textContent = '#gv-sequence{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;background:#050708}#gv-sequence .gv-sequence-frame{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;opacity:0;transition:opacity .16s linear;will-change:opacity}#gv-sequence .gv-sequence-frame.is-a{opacity:1}#frame>img{opacity:.16!important}#frame svg.overlay{position:relative;z-index:2}@media(prefers-reduced-motion:reduce){#gv-sequence .gv-sequence-frame{transition:none}}';
  document.head.appendChild(style);

  var urls = [];
  for (var i = 0; i < FRAME_COUNT; i++) urls.push('assets/frames-4k/frame-' + String(i + 1).padStart(2, '0') + '.jpg?v=2');
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
  for (var first = 0; first < 5; first++) load(first);
  var n = 5;
  function warm() { if (n < FRAME_COUNT) { load(n++); setTimeout(warm, 180); } }
  setTimeout(warm, 600);

  var raf = 0;
  function update() {
    var max = Math.max(1, track.scrollHeight - innerHeight);
    var p = Math.max(0, Math.min(1, scrollY / max));
    var position = p * (FRAME_COUNT - 1);
    show(Math.floor(position), position % 1);
    raf = 0;
  }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
