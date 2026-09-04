(function () {
  var ranges = [
    [0, .16],
    [.13, .31],
    [.28, .46],
    [.43, .61],
    [.58, .735],
    [.705, .855],
    [.825, .955],
    [.925, 1.001]
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(start, end, value) {
    var x = clamp((value - start) / Math.max(.0001, end - start), 0, 1);
    return x * x * (3 - 2 * x);
  }

  function boot() {
    var track = document.querySelector('.track');
    var stage = document.querySelector('.stage');
    var chapters = [].slice.call(document.querySelectorAll('.chapter'));
    var rail = document.querySelector('.rail');
    var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
    var readout = document.querySelector('.gv-layer-readout');
    var cue = document.querySelector('.cue');
    var cta = document.getElementById('ctaBtn');
    var labels = [
      'HORIZONTE',
      'LEVANTAMENTO',
      'ESTRUTURA',
      'PETRÓLEO ONSHORE',
      'KIMBERLITO',
      'MINERALIZAÇÃO',
      'PERFURAÇÃO',
      'RELATÓRIO'
    ];
    var destinations = [0, .18, .34, .49, .64, .76, .88, .965];

    if (!track || !stage || chapters.length < 8) {
      setTimeout(boot, 120);
      return;
    }
    if (stage.dataset.gvTextFlow) return;
    stage.dataset.gvTextFlow = '1';

    if (!document.getElementById('gv-text-flow-stylesheet')) {
      var stylesheet = document.createElement('link');
      stylesheet.id = 'gv-text-flow-stylesheet';
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'assets/geovalor-text-flow.css?v=3';
      document.head.appendChild(stylesheet);
    }

    var siteOrigin = 'https://geovalor.joel-ricardo2012.chatgpt.site';
    var metadata = [
      ['name', 'description', 'Experiência cinematográfica de leitura geológica, prospecção e validação de recursos em território angolano.'],
      ['name', 'theme-color', '#111311'],
      ['property', 'og:type', 'website'],
      ['property', 'og:locale', 'pt_AO'],
      ['property', 'og:title', 'Geovalor — Leitura do subsolo'],
      ['property', 'og:description', 'Do terreno ao parecer: interpretação geológica, alvos minerais e perfuração orientada por dados.'],
      ['property', 'og:url', siteOrigin],
      ['property', 'og:image', siteOrigin + '/assets/og.png'],
      ['property', 'og:image:width', '1672'],
      ['property', 'og:image:height', '941'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', 'Geovalor — Leitura do subsolo'],
      ['name', 'twitter:description', 'Interpretação geológica e prospecção de recursos em território angolano.'],
      ['name', 'twitter:image', siteOrigin + '/assets/og.png']
    ];
    metadata.forEach(function (item) {
      var selector = 'meta[' + item[0] + '="' + item[1] + '"]';
      if (!document.head.querySelector(selector)) {
        var meta = document.createElement('meta');
        meta.setAttribute(item[0], item[1]);
        meta.setAttribute('content', item[2]);
        document.head.appendChild(meta);
      }
    });
    if (!document.head.querySelector('link[rel="canonical"]')) {
      var canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = siteOrigin;
      document.head.appendChild(canonical);
    }
    if (!document.head.querySelector('link[rel="icon"]')) {
      var icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      icon.href = 'assets/favicon.svg';
      document.head.appendChild(icon);
    }

    if (!document.getElementById('gv-text-flow-style')) {
      var style = document.createElement('style');
      style.id = 'gv-text-flow-style';
      style.textContent = [
        '.chapter{will-change:opacity,transform,filter;transform-origin:0 50%;pointer-events:none}',
        '.chapter[data-gv-active="true"]{pointer-events:auto}',
        '.chapter .over,.chapter h2,.chapter p,.chapter .stats,.chapter .cta{will-change:transform,opacity}',
        '.rail,.rail a{pointer-events:auto!important}',
        '.rail a{cursor:pointer;touch-action:manipulation}',
        '@media(prefers-reduced-motion:reduce){.chapter{filter:none!important;transform:none!important}}'
      ].join('');
      document.head.appendChild(style);
    }

    if (!document.head.querySelector('link[rel="manifest"]')) {
      var manifest = document.createElement('link');
      manifest.rel = 'manifest';
      manifest.href = 'site.webmanifest';
      document.head.appendChild(manifest);
    }

    if (cta) {
      cta.href = 'mailto:geral@geovalor.co.ao?subject=Solicitação%20de%20levantamento%20Geovalor';
      cta.setAttribute('aria-label', 'Solicitar levantamento por email');
    }

    railLinks.forEach(function (link, index) {
      link.setAttribute('aria-label', 'Ir para ' + labels[index].toLowerCase());
      link.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var max = Math.max(1, track.scrollHeight - innerHeight);
        scrollTo({
          top: destinations[index] * max,
          behavior: reduced ? 'auto' : 'smooth'
        });
      }, true);
    });

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var framePending = false;

    function render() {
      var max = Math.max(1, track.scrollHeight - innerHeight);
      var progress = clamp(scrollY / max, 0, 1);
      var strongest = 0;
      var strongestOpacity = -1;

      chapters.forEach(function (chapter, index) {
        var range = ranges[index] || [index / chapters.length, (index + 1) / chapters.length];
        var start = range[0];
        var end = range[1];
        var edge = Math.min(.035, (end - start) * .24);
        var enter = index === 0 ? 1 : smoothstep(start, start + edge, progress);
        var leave = index === chapters.length - 1
          ? smoothstep(.972, .997, progress)
          : smoothstep(end - edge, end, progress);
        var opacity = clamp(enter * (1 - leave), 0, 1);
        var local = clamp((progress - start) / Math.max(.001, end - start), 0, 1);
        var y = reduced ? 0 : ((1 - enter) * 48) - (leave * 42) - (local * 10);
        var scale = reduced ? 1 : .985 + opacity * .015;
        var blur = reduced ? 0 : (1 - opacity) * 7;
        var visible = opacity > .05;

        chapter.style.setProperty('opacity', opacity.toFixed(4), 'important');
        chapter.style.setProperty(
          'transform',
          'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')',
          'important'
        );
        chapter.style.setProperty('filter', 'blur(' + blur.toFixed(2) + 'px)', 'important');
        chapter.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
        chapter.dataset.gvActive = visible ? 'true' : 'false';
        chapter.setAttribute('aria-hidden', visible ? 'false' : 'true');

        [].slice.call(chapter.querySelectorAll('a,button')).forEach(function (control) {
          control.tabIndex = visible ? 0 : -1;
        });

        if (opacity > strongestOpacity) {
          strongestOpacity = opacity;
          strongest = index;
        }
      });

      railLinks.forEach(function (link, index) {
        link.classList.toggle('on', index === strongest);
        if (index === strongest) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });

      var finaleChrome = smoothstep(.965, .995, progress);
      if (rail) {
        rail.style.setProperty('opacity', (1 - finaleChrome).toFixed(3), 'important');
        rail.style.setProperty(
          'transform',
          'translate3d(' + (finaleChrome * 18).toFixed(2) + 'px,0,0)',
          'important'
        );
        rail.style.setProperty('visibility', finaleChrome < .98 ? 'visible' : 'hidden', 'important');
        rail.setAttribute('aria-hidden', finaleChrome < .98 ? 'false' : 'true');
        railLinks.forEach(function (link) {
          link.tabIndex = finaleChrome < .98 ? 0 : -1;
        });
      }

      if (readout) {
        readout.innerHTML = 'CAMADA <b>0' + (strongest + 1) + '</b> · ' + labels[strongest];
        readout.classList.toggle('on', progress > .015 && progress < .99);
        readout.style.setProperty('opacity', (1 - finaleChrome).toFixed(3), 'important');
        readout.style.setProperty('visibility', finaleChrome < .98 ? 'visible' : 'hidden', 'important');
      }

      if (cue) {
        var cueOpacity = 1 - smoothstep(.008, .05, progress);
        cue.style.setProperty('opacity', cueOpacity.toFixed(3), 'important');
        cue.style.setProperty(
          'transform',
          'translate3d(0,' + (-10 * (1 - cueOpacity)).toFixed(2) + 'px,0)',
          'important'
        );
        cue.style.setProperty('visibility', cueOpacity > .03 ? 'visible' : 'hidden', 'important');
        cue.setAttribute('aria-hidden', cueOpacity > .03 ? 'false' : 'true');
      }

      framePending = false;
    }

    function requestRender() {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(render);
    }

    addEventListener('scroll', requestRender, { passive: true });
    addEventListener('resize', requestRender, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) requestRender();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
