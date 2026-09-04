(function(){
  var NS='http://www.w3.org/2000/svg';
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function smoothstep(a,b,v){
    var x=clamp((v-a)/Math.max(.0001,b-a),0,1);
    return x*x*(3-2*x);
  }
  function fadeWindow(p,start,end){
    var edge=.028;
    return clamp((p-start)/edge,0,1)*clamp((end-p)/edge,0,1);
  }
  function boot(){
    var stage=document.querySelector('.stage');
    var track=document.querySelector('.track');
    var frame=document.querySelector('#frame');
    var gs=window.gsap;
    if(!stage||!track||!frame||!gs)return setTimeout(boot,160);
    if(stage.dataset.gvDataStory)return;
    stage.dataset.gvDataStory='1';
    if(!document.getElementById('gv-data-story-stylesheet')){
      var stylesheet=document.createElement('link');
      stylesheet.id='gv-data-story-stylesheet';
      stylesheet.rel='stylesheet';
      stylesheet.href='assets/geovalor-data-story.css?v=3';
      document.head.appendChild(stylesheet);
    }

    var legacy=frame.querySelector('svg.overlay');
    if(legacy)legacy.style.opacity='0';
    var oldPump=frame.querySelector('.gv-pump-beam');
    var oldPumpLight=frame.querySelector('.gv-light-pump');
    if(oldPump)oldPump.style.display='none';
    if(oldPumpLight)oldPumpLight.style.display='none';

    var svg=document.createElementNS(NS,'svg');
    svg.setAttribute('class','gv-story-layer');
    svg.setAttribute('viewBox','0 0 1672 941');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');
    svg.innerHTML=`
      <g class="gv-phase gv-callout" data-start=".26" data-end=".52">
        <path class="gv-line soft gv-draw" d="M106 460 H222 L278 500"/><circle class="gv-dot" cx="278" cy="500" r="3.5"/>
        <text class="gv-title" x="106" y="442">FALHA GEOLÓGICA</text><text class="gv-copy" x="106" y="458">CONTROLO ESTRUTURAL</text>
        <path class="gv-aquifer gv-draw" d="M108 590 C260 552 420 603 572 574 S826 566 945 592"/>
        <path class="gv-line gv-draw" d="M106 546 H196 L226 574"/><circle class="gv-dot" cx="226" cy="574" r="3.5"/>
        <text class="gv-title" x="106" y="528">AQUÍFERO</text><text class="gv-copy" x="106" y="544">CIRCULAÇÃO SUBTERRÂNEA</text>
        <path class="gv-line gv-draw" d="M106 744 H304 L342 690"/><circle class="gv-dot" cx="342" cy="690" r="3.5"/>
        <text class="gv-title" x="106" y="724">FORMAÇÃO FERRÍFERA BANDADA</text><text class="gv-copy" x="106" y="740">ALVO PARA FERRO</text>
      </g>

      <g class="gv-phase gv-callout" data-start=".34" data-end=".64">
        <path class="gv-line gv-draw" d="M662 454 H748 L786 510"/><circle class="gv-dot" cx="786" cy="510" r="3.5"/>
        <text class="gv-title" x="662" y="434">SULFETOS MACIÇOS</text><text class="gv-copy" x="662" y="451">CONDUTOR GEOFÍSICO PRIORITÁRIO</text>
        <path class="gv-line gv-draw" d="M1170 418 H1132 L1110 455"/><circle class="gv-dot" cx="1110" cy="455" r="3.5"/>
        <text class="gv-title" x="1170" y="388">ALTERAÇÃO HIDROTERMAL</text><text class="gv-copy" x="1170" y="405">INDICADOR DE SISTEMA MINERAL</text>
        <circle class="gv-pulse" cx="1138" cy="445" r="16"/><circle class="gv-pulse" cx="1138" cy="445" r="27" opacity=".55"/>
      </g>

      <g class="gv-phase gv-panel" data-start=".34" data-end=".64" transform="translate(1360 258)">
        <rect class="gv-panel-bg" width="274" height="112"/>
        <path class="gv-panel-grid" d="M14 36H260 M14 58H260 M14 80H260 M52 30V96 M94 30V96 M136 30V96 M178 30V96 M220 30V96"/>
        <text class="gv-panel-label" x="14" y="20">MAGNETOMETRIA (TMI)</text><text class="gv-panel-unit" x="232" y="20">nT</text>
        <path class="gv-wave-cold gv-chart" d="M14 73 C42 22 72 86 102 45 S164 85 194 43 S238 76 260 38"/>
        <path class="gv-wave-gold gv-chart" d="M14 80 C44 38 72 92 104 54 S162 92 195 53 S238 82 260 49"/>
        <path class="gv-wave-hot gv-chart" d="M14 88 C42 52 72 98 104 66 S164 96 196 64 S238 91 260 61"/>
      </g>
      <g class="gv-phase gv-panel" data-start=".40" data-end=".67" transform="translate(1360 382)">
        <rect class="gv-panel-bg" width="274" height="106"/>
        <path class="gv-panel-grid" d="M14 34H260 M14 56H260 M14 78H260 M52 28V92 M94 28V92 M136 28V92 M178 28V92 M220 28V92"/>
        <text class="gv-panel-label" x="14" y="19">RESISTIVIDADE / IP</text><text class="gv-panel-unit" x="208" y="19">Ohm.m / mV/V</text>
        <path class="gv-wave-cold gv-chart" d="M14 70 C45 61 76 82 108 67 S170 50 202 62 S238 55 260 60"/>
        <path class="gv-wave-hot gv-chart" d="M14 55 C46 44 76 65 108 52 S170 38 202 48 S238 43 260 46"/>
      </g>

      <g class="gv-phase gv-callout" data-start=".56" data-end=".78">
        <path class="gv-line gv-draw" d="M1104 314 H1064 L1030 356"/><circle class="gv-dot" cx="1030" cy="356" r="4"/>
        <text class="gv-title" x="1104" y="294">CONDUTO KIMBERLÍTICO</text><text class="gv-copy" x="1104" y="311">ALVO PARA DIAMANTES</text>
        <g class="gv-diamond-field">
          <rect class="gv-diamond" x="1013" y="332" width="8" height="8" transform="rotate(45 1017 336)"/>
          <rect class="gv-diamond" x="1021" y="414" width="7" height="7" transform="rotate(45 1024.5 417.5)"/>
          <rect class="gv-diamond" x="1017" y="506" width="9" height="9" transform="rotate(45 1021.5 510.5)"/>
          <rect class="gv-diamond" x="1033" y="604" width="8" height="8" transform="rotate(45 1037 608)"/>
          <rect class="gv-diamond" x="1018" y="716" width="10" height="10" transform="rotate(45 1023 721)"/>
        </g>
      </g>

      <g class="gv-phase gv-callout gv-mineral-phase" data-start=".67" data-end=".90">
        <path class="gv-line gv-draw" d="M238 294 H214 L187 341"/><circle class="gv-dot" cx="187" cy="341" r="4"/>
        <text class="gv-title" x="238" y="274">VEIOS AURÍFEROS</text><text class="gv-copy" x="238" y="291">ALVO DE PROSPECÇÃO ESTRUTURAL</text>
        <path class="gv-line gv-draw" d="M560 332 H526 L492 384"/><circle class="gv-dot" cx="492" cy="384" r="4"/>
        <text class="gv-title" x="560" y="312">ZONA CUPRÍFERA</text><text class="gv-copy" x="560" y="329">MINERALIZAÇÃO DISSEMINADA</text>
        <path class="gv-line gv-draw" d="M1164 570 H1128 L1092 611"/><circle class="gv-dot" cx="1092" cy="611" r="4"/>
        <text class="gv-title" x="1164" y="550">SULFETOS DE Ni-Cu-Co</text><text class="gv-copy" x="1164" y="567">ALVO PARA NÍQUEL, COBRE E COBALTO</text>
        <path class="gv-line gv-draw" d="M574 760 H704 L788 722"/><circle class="gv-dot" cx="788" cy="722" r="4"/>
        <text class="gv-title" x="574" y="740">ZONA RARA / PEGMATITO</text><text class="gv-copy" x="574" y="757">ALVO PARA ELEMENTOS DE TERRAS RARAS</text>
        <g class="gv-gold-field">
          <circle class="gv-gold" cx="240" cy="354" r="3"/><circle class="gv-gold" cx="318" cy="376" r="2.5"/><circle class="gv-gold" cx="670" cy="405" r="3"/><circle class="gv-gold" cx="848" cy="429" r="2.5"/>
        </g>
        <g class="gv-copper-field"><circle class="gv-copper" cx="440" cy="377" r="3"/><circle class="gv-copper" cx="486" cy="391" r="2.5"/><circle class="gv-copper" cx="812" cy="676" r="3"/></g>
      </g>

      <g class="gv-phase gv-drill-phase" data-start=".80" data-end=".97">
        <path class="gv-bore gv-draw" d="M997 184 C997 362 1003 528 1018 772"/>
        <circle class="gv-target" cx="1018" cy="772" r="17"/><circle class="gv-target" cx="1018" cy="772" r="29" opacity=".45"/>
        <circle class="gv-dot gv-bit" cx="997" cy="184" r="5"/>
        <text class="gv-title" x="1056" y="718">FURO DE SONDAGEM</text><text class="gv-copy" x="1056" y="735">PERFURAÇÃO ATÉ AO ALVO</text>
      </g>

      <g class="gv-phase" data-start=".92" data-end="1.01">
        <rect class="gv-overview" x="1338" y="650" width="294" height="154"/>
        <text class="gv-overview-title" x="1356" y="675">ALVOS PRIORITÁRIOS</text>
        <text class="gv-overview-copy" x="1356" y="704">OURO  ·  ESTRUTURAL</text>
        <text class="gv-overview-copy" x="1356" y="727">COBRE  ·  DISSEMINADO</text>
        <text class="gv-overview-copy" x="1356" y="750">DIAMANTES  ·  KIMBERLITO</text>
        <text class="gv-overview-copy" x="1356" y="773">Ni-Cu-Co  ·  SULFETOS</text>
      </g>`;
    frame.appendChild(svg);

    var scan=document.createElement('div');
    scan.className='gv-story-scan';
    frame.appendChild(scan);
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var phases=[].slice.call(svg.querySelectorAll('.gv-phase'));
    phases.forEach(function(group){
      group.dataset.baseTransform=group.getAttribute('transform')||'';
    });
    var drawPaths=[].slice.call(svg.querySelectorAll('.gv-draw'));
    drawPaths.forEach(function(path){
      var len=path.getTotalLength();
      path.dataset.len=len;
      path.style.strokeDasharray=len;
      path.style.strokeDashoffset=len;
    });

    /*
      O plano geral final usa a mesma imagem limpa e uma cópia vectorial dos
      dados. Assim, a sequência termina com a leitura completa sem texto
      rasterizado, sem desalinhamento e sem interromper o movimento da câmara.
    */
    var finale=document.createElement('div');
    finale.className='gv-technical-finale';
    finale.setAttribute('aria-hidden','true');
    var finaleFrame=document.createElement('div');
    finaleFrame.className='gv-finale-frame';
    var finaleImage=document.createElement('img');
    var baseImage=frame.querySelector('img');
    var bundledFallback=baseImage?baseImage.src:'';
    finaleImage.alt='';
    finaleImage.decoding='async';
    finaleImage.loading='lazy';
    finaleImage.fetchPriority='low';
    finaleImage.sizes='100vw';
    finaleImage.srcset='assets/geovalor-subsolo-clean-v3-1920.jpg 1920w, assets/geovalor-subsolo-clean-v3-4k.jpg 3840w, assets/geovalor-subsolo-clean-v3-8k.jpg 7680w';
    finaleImage.src='assets/geovalor-subsolo-clean-v3-4k.jpg';
    finaleImage.onerror=function(){
      finaleImage.onerror=null;
      finaleImage.removeAttribute('srcset');
      if(bundledFallback)finaleImage.src=bundledFallback;
    };
    var finaleSvg=svg.cloneNode(true);
    finaleSvg.classList.add('gv-finale-overlay');
    finaleSvg.removeAttribute('style');
    finaleSvg.querySelectorAll('.gv-phase').forEach(function(group){
      group.removeAttribute('style');
    });
    finaleSvg.querySelectorAll('.gv-draw').forEach(function(path){
      path.style.strokeDashoffset='0';
    });
    var mobileSummary=document.createElement('div');
    mobileSummary.className='gv-finale-mobile-summary';
    mobileSummary.innerHTML='<strong>Modelo técnico integrado · 1:25k</strong><span><b>Au</b> · Ouro</span><span><b>Cu</b> · Cobre</span><span><b>C</b> · Diamantes</span><span><b>Ni</b> · Ni-Cu-Co</span><span><b>REE</b> · Pegmatito</span>';
    finaleFrame.appendChild(finaleImage);
    finaleFrame.appendChild(finaleSvg);
    finale.appendChild(finaleFrame);
    finale.appendChild(mobileSummary);
    stage.appendChild(finale);
    var finalePhases=[].slice.call(finaleSvg.querySelectorAll('.gv-phase'));
    finalePhases.forEach(function(group){
      group.dataset.baseTransform=group.getAttribute('transform')||'';
    });

    var previewProgress=parseFloat(new URLSearchParams(location.search).get('preview'));
    function progress(){
      if(Number.isFinite(previewProgress))return clamp(previewProgress,0,1);
      var max=Math.max(1,track.scrollHeight-innerHeight);
      return clamp(scrollY/max,0,1);
    }
    function render(){
      var p=progress();
      phases.forEach(function(group){
        var start=parseFloat(group.dataset.start),end=parseFloat(group.dataset.end);
        var opacity=fadeWindow(p,start,end);
        group.style.opacity=opacity.toFixed(3);
        group.style.removeProperty('transform');
        group.setAttribute('transform',(group.dataset.baseTransform+' translate(0 '+((1-opacity)*10).toFixed(2)+')').trim());
        var local=clamp((p-start)/.075,0,1);
        group.querySelectorAll('.gv-draw').forEach(function(path){
          path.style.strokeDashoffset=(parseFloat(path.dataset.len||0)*(1-local)).toFixed(2);
        });
      });

      var finaleOpacity=smoothstep(.925,.982,p);
      var finaleSettle=smoothstep(.925,1,p);
      finale.style.opacity=finaleOpacity.toFixed(3);
      finale.style.visibility=finaleOpacity>.002?'visible':'hidden';
      finaleFrame.style.transform='translate3d(-50%,-50%,0) scale('+(1.035-finaleSettle*.035).toFixed(4)+')';
      finalePhases.forEach(function(group,index){
        var delay=Math.min(index,7)*.0045;
        var reveal=smoothstep(.932+delay,.975+delay,p);
        group.style.opacity=(reveal*.96).toFixed(3);
        group.style.removeProperty('transform');
        group.setAttribute('transform',(group.dataset.baseTransform+' translate(0 '+((1-reveal)*12).toFixed(2)+')').trim());
      });
      var scanOpacity=fadeWindow(p,.07,.29);
      scan.style.opacity=(scanOpacity*.72).toFixed(3);
    }
    var raf=0;
    addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(function(){render();raf=0;});},{passive:true});
    addEventListener('resize',render,{passive:true});
    render();

    if(!reduced){
      gs.to(scan,{xPercent:200,duration:3.8,repeat:-1,ease:'none'});
      gs.to(svg.querySelectorAll('.gv-pulse'),{scale:1.7,opacity:.06,duration:1.8,repeat:-1,stagger:.35,ease:'power1.out'});
      gs.to(svg.querySelectorAll('.gv-chart'),{strokeDasharray:'16 8',strokeDashoffset:-88,duration:3.4,repeat:-1,ease:'none'});
      gs.to(svg.querySelector('.gv-aquifer'),{strokeDashoffset:-64,duration:2.8,repeat:-1,ease:'none'});
      svg.querySelectorAll('.gv-diamond').forEach(function(node,i){gs.to(node,{y:-20-(i%3)*8,rotation:'+=180',opacity:.35,duration:2.3+i*.24,repeat:-1,yoyo:true,ease:'sine.inOut',delay:i*.16});});
      svg.querySelectorAll('.gv-gold,.gv-copper').forEach(function(node,i){gs.to(node,{scale:2.1,opacity:.2,duration:1.15+(i%4)*.3,repeat:-1,yoyo:true,ease:'sine.inOut',delay:i*.12});});
      var bore=svg.querySelector('.gv-bore');
      var bit=svg.querySelector('.gv-bit');
      if(bore&&bit){
        var boreLen=bore.getTotalLength();
        gs.to(bit,{duration:3.6,repeat:-1,yoyo:true,ease:'sine.inOut',onUpdate:function(){var pt=bore.getPointAtLength(this.progress()*boreLen);bit.setAttribute('cx',pt.x);bit.setAttribute('cy',pt.y);}});
      }
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
