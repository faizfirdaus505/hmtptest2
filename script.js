 

'use strict';

 

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

 

(function initLoader() {
  const loader             = document.getElementById('loader');
  const loaderContent      = document.getElementById('loaderContent');
  const loaderPercentValue = document.getElementById('loaderPercentValue');
  const loaderBarFill      = document.getElementById('loaderBarFill');

  if (!loader) return;

  let progress = 0;

  function animateProgress() {
    if      (progress < 25) progress += Math.random() * 7;
    else if (progress < 55) progress += Math.random() * 4;
    else if (progress < 80) progress += Math.random() * 2.5;
    else if (progress < 95) progress += Math.random() * 1.2;
    else if (progress < 99) progress += Math.random() * 0.4;
    else                    progress  = 100;

    progress = Math.min(progress, 100);

    if (loaderPercentValue) loaderPercentValue.textContent = Math.floor(progress);
    if (loaderBarFill)      loaderBarFill.style.width      = progress + '%';

    if (progress < 100) {
      setTimeout(animateProgress, 35);
    } else {
      finishLoader();
    }
  }

  function finishLoader() {
    if (loaderPercentValue) loaderPercentValue.textContent = '100';
    if (loaderBarFill)      loaderBarFill.style.width      = '100%';

    setTimeout(() => {                           
      loaderContent?.classList.add('is-hidden');

      setTimeout(() => {                         
        loader.classList.add('show-seam');

        setTimeout(() => {                       
          loader.classList.add('is-opening');

          setTimeout(() => {                     
            loader.remove();
            document.body.classList.add('is-revealed');
          }, 1200);
        }, 250);
      }, 450);
    }, 300);
  }

  window.addEventListener('load', animateProgress);
})();

 

(function initNav() {
  const nav        = document.getElementById('siteNav');
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLogoBtn = document.getElementById('navLogoBtn');
  const allLinks   = document.querySelectorAll('[data-nav-link]');

  if (!nav) return;

   

  function isMenuOpen() {
    return navBurger?.getAttribute('aria-expanded') === 'true';
  }

  function openMenu() {
    mobileMenu?.classList.add('is-open');
    mobileMenu?.removeAttribute('aria-hidden');
    navBurger?.setAttribute('aria-expanded', 'true');
    navBurger?.setAttribute('aria-label', 'Tutup menu navigasi');
    document.documentElement.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    navBurger?.setAttribute('aria-expanded', 'false');
    navBurger?.setAttribute('aria-label', 'Buka menu navigasi');
    document.documentElement.classList.remove('no-scroll');
  }

  navBurger?.addEventListener('click', () => {
    isMenuOpen() ? closeMenu() : openMenu();
  });

  
  allLinks.forEach(link => link.addEventListener('click', closeMenu));

  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isMenuOpen()) closeMenu();
  });

  
  document.addEventListener('click', e => {
    if (isMenuOpen() && !nav.contains(e.target)) closeMenu();
  });

  
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 860) closeMenu();
  }, 150));

   

  navLogoBtn?.addEventListener('click', () => {
    if (window.scrollY === 0) {
      window.location.reload();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

   

  const sections = document.querySelectorAll('section[id]');

  function updateActiveLinks() {
    const scrollPos = window.scrollY + 160;
    sections.forEach(sec => {
      const inView = scrollPos >= sec.offsetTop &&
                     scrollPos < sec.offsetTop + sec.offsetHeight;
      if (inView) {
        allLinks.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + sec.id
          );
        });
      }
    });
  }

   

  let lastScrollY = window.scrollY;
  let navTicking  = false;

  function updateNav() {
    const y = window.scrollY;

    
    nav.classList.toggle('is-scrolled', y > 40);

    
    if (y > 150) {
      nav.classList.toggle('is-hidden', y > lastScrollY);
    } else {
      nav.classList.remove('is-hidden');
    }

    lastScrollY = y;
    updateActiveLinks();
    navTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(updateNav);
      navTicking = true;
    }
  });

  updateNav(); 
})();

 

(function initNavDropdowns() {

   
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  function closeAllDropdowns(except) {
    dropdowns.forEach(dd => {
      if (dd === except) return;
      dd.classList.remove('is-open');
      const trigger = dd.querySelector('.nav-dropdown__trigger');
      const panel   = dd.querySelector('.nav-dropdown__menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel)   panel.setAttribute('aria-hidden', 'true');
    });
  }

  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown__trigger');
    const panel   = dd.querySelector('.nav-dropdown__menu');
    if (!trigger || !panel) return;

    function openDD() {
      closeAllDropdowns(dd);
      dd.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
    }

    function closeDD() {
      dd.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    }

    function toggleDD() {
      dd.classList.contains('is-open') ? closeDD() : openDD();
    }

    
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      toggleDD();
    });

    
    panel.querySelectorAll('.nav-dropdown__item').forEach(item => {
      item.addEventListener('click', closeDD);
    });

    
    dd.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDD(); trigger.focus(); }
    });
  });

  
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) closeAllDropdowns(null);
  });

   
  const accordions = document.querySelectorAll('.mobile-accordion');

  accordions.forEach(acc => {
    const trigger = acc.querySelector('.mobile-accordion__trigger');
    const panel   = acc.querySelector('.mobile-accordion__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      
      accordions.forEach(other => {
        if (other === acc) return;
        const ot = other.querySelector('.mobile-accordion__trigger');
        const op = other.querySelector('.mobile-accordion__panel');
        if (ot) ot.setAttribute('aria-expanded', 'false');
        if (op) { op.classList.remove('is-open'); op.setAttribute('aria-hidden', 'true'); }
      });

      
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
    });

    
    panel.querySelectorAll('.mobile-accordion__item').forEach(item => {
      item.addEventListener('click', () => {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      });
    });
  });

  
  const navBurger = document.getElementById('navBurger');
  if (navBurger) {
    navBurger.addEventListener('click', () => {
      
      setTimeout(() => {
        if (navBurger.getAttribute('aria-expanded') === 'false') {
          accordions.forEach(acc => {
            const ot = acc.querySelector('.mobile-accordion__trigger');
            const op = acc.querySelector('.mobile-accordion__panel');
            if (ot) ot.setAttribute('aria-expanded', 'false');
            if (op) { op.classList.remove('is-open'); op.setAttribute('aria-hidden', 'true'); }
          });
        }
      }, 350);
    });
  }

})();

 

(function initHero() {
  const hero        = document.querySelector('.hero');
  const heroMedia   = document.getElementById('heroMedia');
  const heroImage   = document.getElementById('heroImage');
  const heroContent = document.querySelector('.hero__content');
  const heroScroll  = document.getElementById('heroScroll');

   

  let ticking = false;

  function onScrollHero() {
    const y     = window.scrollY;
    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    const p     = Math.min(y / heroH, 1); 

    
    if (heroImage) {
        heroImage.style.transform = `scale(${1 + p * 0.25})`;
    }

    
    if (heroContent) {
        heroContent.style.transform = `translateY(${y * -0.45}px)`;
        heroContent.style.opacity   = String(Math.max(1 - p * 2.2, 0));
    }

    ticking = false;
}

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScrollHero);
      ticking = true;
    }
  });

   

  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (hero && heroImage && hasHover) {
    hero.addEventListener('mousemove', e => {
      const r  = hero.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width  - 0.5) * 14;
      const py = ((e.clientY - r.top)  / r.height - 0.5) * 14;
      heroImage.style.transform = `translate3d(${px}px,${py}px,0) scale(1.08)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'translate3d(0,0,0) scale(1.08)';
    });
  }

   

  heroScroll?.addEventListener('click', () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height-mobile')
      ) || 68;
      window.scrollTo({ top: nextSection.offsetTop - navH, behavior: 'smooth' });
    }
  });
})();

 
(function initStudioScrollBtn() {
  const btn = document.getElementById('studioScrollBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const himpunan = document.getElementById('himpunan');
    if (!himpunan) return;
     
    window.scrollTo({ top: himpunan.offsetTop, behavior: 'smooth' });
  });
})();

 

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height-mobile')
      ) || 68;
      window.scrollTo({
        top: Math.max(target.offsetTop - navH, 0),
        behavior: 'smooth'
      });
    });
  });
})();

 

(function initCursorGlow() {
  
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mx = innerWidth / 2, my = innerHeight / 2;
  let gx = mx, gy = my;
  const HALF = 240; 

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animGlow() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate(${gx - HALF}px,${gy - HALF}px)`;
    requestAnimationFrame(animGlow);
  })();
})();

 

(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target); 
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.section-placeholder, .konsen-card, .jurusan__stats'
  ).forEach(el => obs.observe(el));
})();

 

(function initBlurScrollText() {

   
  const BLUR_TEXTS = {
    id: {
      'jurusan.stmt':
        'Program studi yang membentuk engineer visioner — mampu merancang solusi ' +
        'manufaktur masa depan dengan presisi teknis dan kepekaan estetika tinggi, ' +
        'menjawab tantangan industri global melalui inovasi yang berlandaskan ' +
        'keilmuan solid.'
    }
  };

   
  function buildSpans(container, text) {
     
    const tokens = text.trim().split(/(\s+)/);
    container.innerHTML = tokens
      .map(t => /^\s+$/.test(t) ? t : `<span class="blur-word">${t}</span>`)
      .join('');
    return Array.from(container.querySelectorAll('.blur-word'));
  }

   
  function applyBlur(wordEls, container) {
    const rect = container.getBoundingClientRect();
    const vh   = window.innerHeight;

     
    const rawProgress = (vh * 0.85 - rect.top) / (vh * 0.20);

    const n = wordEls.length;
    wordEls.forEach((span, i) => {
       
      const wordProgress = Math.min(1, Math.max(0,
        (rawProgress - (i / n) * 0.4) / 0.6
      ));

      span.style.opacity = 0.08 + wordProgress * 0.92;
      span.style.filter  = `blur(${(1 - wordProgress) * 10}px)`;
    });
  }

   
  const containers = document.querySelectorAll('.js-blur-text[data-blur-key]');
  if (!containers.length) return;

  containers.forEach(container => {
    const key    = container.dataset.blurKey;
    const textId = BLUR_TEXTS.id[key];
    if (!textId) return;

    let wordEls = buildSpans(container, textId);

     
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          applyBlur(wordEls, container);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    applyBlur(wordEls, container); 

  });

})();

 

(function initAboutScroll() {

   

   
  const TOTAL_FRAMES = 240;
   
  const FRAME_DIR    = 'assets/about-sequence/';
   
  const FRAME_PREFIX = 'esx-';
   
  const FRAME_EXT    = '.webp';
   
  const LERP         = 0.12;

   

  const section = document.querySelector('.about');
  if (!section) return;

  const canvas  = document.getElementById('aboutCanvas');
  if (!canvas)  return;

  const ctx     = canvas.getContext('2d');
  const fill    = document.getElementById('aboutVideoFill');
  const lbl     = document.getElementById('aboutVideoLbl');
  const ph      = document.getElementById('aboutCanvasPh');
  const phSub   = document.getElementById('aboutCanvasPhSub');
  const cards     = [...section.querySelectorAll('[data-about-card]')];
  const stmt      = section.querySelector('.about__stmt');
  const leftInner = section.querySelector('.about__left-inner');

   

   
  let frames      = new Array(TOTAL_FRAMES);
   
  let isReady     = false;
   
  let currentFrame = 0;
   
  let targetFrame  = 0;
   
  let lastDrawn    = -1;

   

  const IS_MOBILE  = window.innerWidth <= 768;
  const TEXT_END   = IS_MOBILE ? 0.38 : 0.78;
  const CARD_START = [0.05, 0.25, 0.45];
  const CARD_WIN   = 0.22;

   

  const STMT = {
    id: 'Teknik Perancangan adalah disiplin ilmu yang berfokus pada perancangan sistem, komponen, ' +
        'dan proses manufaktur melalui penerapan ilmu keteknikan, matematika, serta teknologi ' +
        'modern. Mahasiswa dibekali kemampuan dalam gambar teknik, CAD, dan CAE untuk merancang ' +
        'berbagai produk seperti press tool, injection mold, jigs & fixtures, mesin perkakas,' +
        'mesin otomatis, hingga desain produk. Pembelajaran diperkuat dengan praktik industri dan ' +
        'tugas akhir sehingga lulusan siap menghadapi tantangan dunia manufaktur.'
  };

  let wordSpans = [];

  function buildStmtSpans(text) {
    if (!stmt) return;
    stmt.innerHTML = text.trim()
      .split(/(\s+)/)
      .map(t => /^\s+$/.test(t) ? t : `<span class="blur-word">${t}</span>`)
      .join('');
    wordSpans = [...stmt.querySelectorAll('.blur-word')];
  }

  buildStmtSpans(STMT.id);

   

  function resizeCanvas() {
  const parent = canvas.parentElement;

  const cssW = parent.clientWidth;
  const cssH = parent.clientHeight;

  const dpr = window.devicePixelRatio || 1;

  canvas.width  = cssW * dpr;
  canvas.height = cssH * dpr;

  canvas.style.width  = cssW + "px";
  canvas.style.height = cssH + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (isReady) drawFrame(currentFrame + 0.5 | 0);
}

   

  function preloadFrames() {
    return new Promise(resolve => {
      let settled = 0;

      function onSettle() {
        settled++;

         
        if (phSub) {
          const pct = Math.round(settled / TOTAL_FRAMES * 100);
          phSub.textContent = `Memuat animasi\u2026 ${pct}%`;
        }

        if (settled >= TOTAL_FRAMES) resolve();
      }

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const n   = String(i + 1).padStart(4, '0');
        const img = new Image();
        img.onload  = onSettle;
        img.onerror = onSettle;  
        img.src     = `${FRAME_DIR}${FRAME_PREFIX}${n}${FRAME_EXT}`;
        frames[i]   = img;
      }
    });
  }

   

  function drawFrame(frameIndex) {
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex | 0));
    const img = frames[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

     
const isMobile = window.innerWidth <= 1059;

let scale;

if (isMobile) {
    
    scale = Math.min(cw / iw, ch / ih) * 2;
} else {
    
    scale = Math.max(cw / iw, ch / ih);
}

const dw = iw * scale;
const dh = ih * scale;

ctx.clearRect(0, 0, cw, ch);

ctx.drawImage(
    img,
    (cw - dw) * 0.5,
    (ch - dh) * 0.5,
    dw,
    dh
);

    lastDrawn = idx;
  }

   

  function getProgress() {
    const rect    = section.getBoundingClientRect();
    const sHeight = section.offsetHeight;    
    const scrolled = -rect.top + window.innerHeight * 0.35;
    return Math.max(0, Math.min(1, scrolled / (sHeight - window.innerHeight)));
  }

   

  function updateTargetFrame(p) {
    targetFrame = p * (TOTAL_FRAMES - 1);
  }

   

  function updateBar(p) {
    if (fill) fill.style.transform = `scaleX(${p})`;
  }

  function updateText(p) {
    if (!wordSpans.length) return;

    if (p >= TEXT_END) {
      wordSpans.forEach(s => { s.style.opacity = '1'; s.style.filter = 'blur(0px)'; });
      return;
    }

    const textP = Math.max(0, Math.min(1, p / TEXT_END));
    const n     = wordSpans.length;

    wordSpans.forEach((s, i) => {
      const wP = Math.max(0, Math.min(1, (textP - (i / n) * 0.1) / 0.22));
      s.style.opacity = 0.15 + wP * 0.85;
      s.style.filter  = `blur(${(1 - wP) * 6}px)`;
    });
  }

  function updateCards(p) {
    cards.forEach((card, i) => {
      const start = CARD_START[i] ?? (0.05 + i * 0.2);

      if (p < start) {
        card.style.filter    = 'blur(16px)';
        card.style.opacity   = '0.04';
        card.style.transform = 'translateY(12px)';
      } else if (p >= start + CARD_WIN) {
        card.style.filter    = 'none';
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      } else {
        const cP = (p - start) / CARD_WIN;
        card.style.filter    = `blur(${(1 - cP) * 16}px)`;
        card.style.opacity   = String(cP);
        card.style.transform = `translateY(${(1 - cP) * 12}px)`;
      }
    });
  }

   

  function updateLeftScroll(p) {
    if (!leftInner) return;
    const containerH = leftInner.parentElement.offsetHeight;
    const contentH   = leftInner.scrollHeight;
    const maxScroll  = Math.max(0, contentH - containerH);
    leftInner.style.transform = `translateY(${-p * maxScroll}px)`;
  }

  function renderFrame(p) {
    updateBar(p);
    updateText(p);
    updateCards(p);
    updateLeftScroll(p);    
  }

   

  function animate() {
    requestAnimationFrame(animate);

    if (!isReady) return;  

     
    currentFrame += (targetFrame - currentFrame) * LERP;

     
    const frameIdx = currentFrame + 0.5 | 0;

     
    if (frameIdx !== lastDrawn) {
      drawFrame(frameIdx);
    }
  }

   

  let lblTimer;

  function updateLabel(p) {
    if (!lbl) return;
    clearTimeout(lblTimer);
    lbl.classList.add('is-active');
    lbl.textContent = `\u25B6 ${Math.round(p * 100)}%`;
    lblTimer = setTimeout(() => {
      lbl.classList.remove('is-active');
      lbl.textContent = '\u25B6 Scroll untuk memutar';
    }, 700);
  }

   

  window.addEventListener('scroll', () => {
    const p = getProgress();
    updateTargetFrame(p);   
    updateLabel(p);         
    renderFrame(p);         
  }, { passive: true });

   

  window.addEventListener('resize',
    debounce(() => {
      resizeCanvas();
      renderFrame(getProgress());
    }, 120),
    { passive: true }
  );

   

   
  resizeCanvas();

   
  animate();

   
  preloadFrames().then(() => {
    isReady = true;

     
    if (ph) {
      ph.style.transition = 'opacity 0.5s ease';
      ph.style.opacity    = '0';
      setTimeout(() => { if (ph) ph.style.display = 'none'; }, 500);
    }

     
    const p0 = getProgress();
    updateTargetFrame(p0);
    currentFrame = targetFrame;    
    drawFrame(currentFrame + 0.5 | 0);
    renderFrame(p0);
  });

   
  renderFrame(getProgress());

})();

 

(function initStatistik() {

  const section = document.getElementById('statistik');
  const header  = document.getElementById('statHeader');
  const rule    = document.getElementById('statRule');
  const cards   = section
    ? Array.from(section.querySelectorAll('.stat-card'))
    : [];

  if (!section || !cards.length) return;

  const STAGGER_IN  = 130;    
  const STAGGER_OUT = 90;     

  let timers = [];

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

   
  function animateIn() {
    clearTimers();
    header?.classList.remove('stat-out');
    header?.classList.add('stat-in');

     
    cards.forEach((card, i) => {
      const delay = (cards.length - 1 - i) * STAGGER_IN;
      const t = setTimeout(() => {
        card.classList.remove('stat-out');
        card.classList.add('stat-in');
      }, delay);
      timers.push(t);
    });

     
    const ruleDelay = (cards.length - 1) * STAGGER_IN + 280;
    const rt = setTimeout(() => {
      rule?.classList.remove('stat-out');
      rule?.classList.add('stat-in');
    }, ruleDelay);
    timers.push(rt);
  }

   
  function animateOut() {
    clearTimers();
    header?.classList.remove('stat-in');
    header?.classList.add('stat-out');
    rule?.classList.remove('stat-in');
    rule?.classList.add('stat-out');

     
    cards.forEach((card, i) => {
      const delay = i * STAGGER_OUT;
      const t = setTimeout(() => {
        card.classList.remove('stat-in');
        card.classList.add('stat-out');
      }, delay);
      timers.push(t);
    });
  }

   
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateIn();
        else animateOut();
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  io.observe(section);

})();

 

(() => {

    const section = document.querySelector(".statistik");
    if (!section) return;

    const header  = section.querySelector(".statistik__header");
    const marquee = section.querySelector(".stat-marquee");
    const rule    = section.querySelector(".statistik__rule");
    const track   = section.querySelector(".stat-marquee__track");
    const cards   = section.querySelectorAll(".stat-card");
    if (!track) return;

     
    track.style.animation = "none";

    const BASE_SPEED = 0.7;   
    const FRICTION   = 0.90;  

    let currentX   = 0;
    let isRunning  = false;   
    let isHovered  = false;   
    let isDragging = false;   
    let momentumV  = 0;       

     
    let startX     = 0;
    let dragStartX = 0;
    let lastX      = 0;
    let lastT      = 0;

     
    function halfWidth() {
        return track.scrollWidth / 2;
    }

    function wrapX(x) {
        const half = halfWidth();
        let pos = x;
         
        while (pos <  -half) pos += half;
        while (pos >   0)    pos -= half;
        return pos;
    }

     
    function tick() {
        if (!isDragging) {
            if (Math.abs(momentumV) > 0.05) {
                 
                currentX  = wrapX(currentX + momentumV);
                momentumV *= FRICTION;
            } else if (isRunning && !isHovered) {
                 
                momentumV = 0;
                currentX  = wrapX(currentX - BASE_SPEED);
            }
        }
        track.style.transform = `translateX(${currentX}px)`;
        requestAnimationFrame(tick);
    }

     
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const isIn = entry.isIntersecting;
            isRunning  = isIn;
            header.classList.toggle("stat-in",   isIn);
            marquee.classList.toggle("stat-in",  isIn);
            rule.classList.toggle("stat-in",     isIn);
            header.classList.toggle("stat-out",  !isIn);
            marquee.classList.toggle("stat-out", !isIn);
            rule.classList.toggle("stat-out",    !isIn);
        });
    }, { threshold: 0.25 }).observe(section);

     
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            if (isDragging) return;
            isHovered = true;
            momentumV = 0;
            marquee.classList.add("is-paused");
            cards.forEach(c => c.classList.remove("is-hovered"));
            card.classList.add("is-hovered");
        });
        card.addEventListener("mouseleave", () => {
            if (isDragging) return;
            isHovered = false;
            marquee.classList.remove("is-paused");
            card.classList.remove("is-hovered");
        });
    });

     
    function beginDrag(x) {
        isDragging  = true;
        isHovered   = false;
        momentumV   = 0;
        startX      = x;
        dragStartX  = currentX;
        lastX       = x;
        lastT       = performance.now();
        marquee.classList.remove("is-paused");
        marquee.classList.add("is-dragging");
        cards.forEach(c => c.classList.remove("is-hovered"));
    }

    function moveDrag(x) {
        if (!isDragging) return;
        const now   = performance.now();
        const dt    = Math.max(now - lastT, 1);
        const delta = x - lastX;
         
        momentumV  = (delta / dt) * 16.7;
        lastX      = x;
        lastT      = now;
        currentX   = wrapX(dragStartX + (x - startX));
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        marquee.classList.remove("is-dragging");
         
        if (Math.abs(momentumV) < 0.3) momentumV = 0;
    }

     
    marquee.addEventListener("mousedown", e => {
        if (e.button !== 0) return;
        beginDrag(e.clientX);
        e.preventDefault();    
    });
    document.addEventListener("mousemove", e => moveDrag(e.clientX));
    document.addEventListener("mouseup",   ()  => endDrag());

     
    marquee.addEventListener("touchstart", e => {
        beginDrag(e.touches[0].clientX);
    }, { passive: true });

    marquee.addEventListener("touchmove", e => {
        moveDrag(e.touches[0].clientX);
    }, { passive: true });

    marquee.addEventListener("touchend",  () => endDrag());

     
    marquee.addEventListener("wheel", e => {
        e.preventDefault();
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        currentX    = wrapX(currentX - delta * 1.5);
        momentumV   = 0;    
    }, { passive: false });

     
    requestAnimationFrame(tick);

})();

 

'use strict';

 

const PRODI_DATA = {
  tppp: { code:'TPPP', name:'Teknik Perancangan Manufaktur',          badge:'DEA', idx:'01' },
  rpm: { code:'RPM', name:'Rekayasa Perancangan Mekanik',           badge:'DEB', idx:'02' },
  trpm: { code:'TRPM', name:'Teknologi Perancangan Perkakas Presisi', badge:'DEC', idx:'03' },
};

const SEMESTER_DATA = {
  tppp: {
    1:{title:'Fondasi Teknik & Matematika',  count:8,desc:'Pengenalan konsep dasar teknik, matematika terapan, dan pengantar gambar teknik serta material.'},
    2:{title:'Material & Proses Manufaktur', count:7,desc:'Material teknik, proses produksi, metrologi industri, dan pengujian sifat mekanik bahan.'},
    3:{title:'CAD & Perancangan Produk',     count:8,desc:'Pelatihan intensif software CAD 2D/3D, perancangan komponen mesin, dan analisis teknis geometri.'},
    4:{title:'Mold & Press Tool Design',     count:7,desc:'Perancangan cetakan injeksi plastik, sistem punch & die, serta tooling manufaktur terintegrasi.'},
    5:{title:'CAE & Simulasi Rekayasa',      count:8,desc:'Analisis tegangan FEA, simulasi aliran CFD, dan optimasi desain menggunakan software CAE modern.'},
    6:{title:'Otomasi & Jigs–Fixtures',      count:7,desc:'Perancangan jig, fixture, dan sistem otomasi manufaktur berbasis PLC dan kontrol numerik CNC.'},
  },
  rpm: {
    1:{title:'Dasar Rekayasa Mekanik',       count:8,desc:'Fondasi ilmu rekayasa, mekanika teknik, statika, dan pengantar termodinamika terapan.'},
    2:{title:'Dinamika & Kinematika Mesin',  count:7,desc:'Analisis dinamika, kinematika mesin, getaran mekanik, dan pengantar fenomena fluida.'},
    3:{title:'CAD Mekanik & Simulasi',       count:8,desc:'Perancangan komponen mekanik dengan software CAD profesional dan tools simulasi terintegrasi.'},
    4:{title:'Desain Elemen Mesin',          count:7,desc:'Perancangan roda gigi, poros, bantalan, kopling, rem, dan sistem transmisi daya mekanik.'},
    5:{title:'Rekayasa Sistem Mekanik',      count:8,desc:'Analisis sistem mekanik terintegrasi, kontrol mekanik, dan pengantar robotika industri.'},
    6:{title:'Manufaktur & Metrologi',       count:7,desc:'Teknik manufaktur presisi, pengukuran dimensi 3D, dan sistem manajemen kontrol kualitas.'},
    7:{title:'Proyek Rekayasa',              count:6,desc:'Implementasi proyek rekayasa mekanik nyata dalam konteks kerja industri mitra terpilih.'},
    8:{title:'Tugas Akhir',                  count:4,desc:'Proyek akhir rekayasa sebagai demonstrasi kompetensi vokasi bidang rekayasa mekanik.'},
  },
  trpm: {
    1:{title:'Dasar Perkakas & Material',    count:8,desc:'Pengenalan perkakas presisi, material teknik perkakas, dan proses pembentukan logam dasar.'},
    2:{title:'Gambar Teknik Presisi',        count:7,desc:'Gambar teknik lanjutan, toleransi ISO, geometri produk, dan pengantar metrologi presisi.'},
    3:{title:'CAD/CAM & Pemrograman CNC',    count:8,desc:'Integrasi CAD/CAM profesional dan pemrograman mesin CNC untuk perkakas presisi industri.'},
    4:{title:'Desain Tooling & Perkakas',    count:7,desc:'Perancangan tooling sistem, cutting tools, dan perkakas presisi terintegrasi untuk manufaktur.'},
    5:{title:'CNC Lanjutan & Otomasi',       count:8,desc:'Pemrograman CNC multi-sumbu, otomasi sel manufaktur, dan pengantar sistem robotika industri.'},
    6:{title:'Fabrikasi Non-Konvensional',   count:7,desc:'EDM, laser cutting, waterjet, dan additive manufacturing sebagai solusi perkakas presisi tinggi.'},
    7:{title:'Proyek Perkakas Industri',     count:6,desc:'Perancangan dan fabrikasi perkakas presisi nyata bersama mitra industri manufaktur unggulan.'},
    8:{title:'Tugas Akhir',                  count:4,desc:'Tugas akhir komprehensif dalam perancangan dan fabrikasi perkakas presisi industri manufaktur.'},
  },
};

const DRIVE_LINKS = {
  tppp: {1:'https://drive.google.com/drive/u/0/folders/1DfzL-8A4WXd7XvB7qZGiXvApIca9C_Nc',2:'',3:'',4:'',5:'',6:''},
  rpm: {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:''},
  trpm: {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:''},
};

const SEM_COLORS = [
  {bg:'#FFD84A',text:'rgba(0,0,0,.72)',  tag:'rgba(0,0,0,.38)'},
  {bg:'#F2C63D',text:'rgba(0,0,0,.72)',  tag:'rgba(0,0,0,.38)'},
  {bg:'#E6B532',text:'rgba(0,0,0,.7)',   tag:'rgba(0,0,0,.35)'},
  {bg:'#D39B18',text:'rgba(0,0,0,.75)',  tag:'rgba(0,0,0,.38)'},
  {bg:'#B88310',text:'rgba(255,255,255,.82)',tag:'rgba(255,255,255,.4)'},
  {bg:'#95650B',text:'rgba(255,255,255,.85)',tag:'rgba(255,255,255,.42)'},
  {bg:'#6F4A06',text:'rgba(255,255,255,.88)',tag:'rgba(255,255,255,.45)'},
  {bg:'#463003',text:'rgba(255,255,255,.88)',tag:'rgba(255,255,255,.45)'},
];

 

let _currentProdi = null;
let _currentSem   = null;

(function initCoverflow() {
  const track  = document.getElementById('cfTrack');
  const stage  = document.getElementById('cfStage');
  if (!track || !stage) return;

  const cards   = [...track.querySelectorAll('.cflow-card')];
  const prevBtn = document.getElementById('cfPrev');
  const nextBtn = document.getElementById('cfNext');
  const dots    = [...document.querySelectorAll('.cflow-dot')];
  const TOTAL   = cards.length;

  let activeIdx   = 0;
  let isDragging  = false;
  let dragStartX  = 0;
  let dragDeltaX  = 0;
  let wasDragging = false;
  let dragTimerId = null;

  function getGap() {
    const w = window.innerWidth;
    if (w < 560)  return 210;
    if (w < 860)  return 248;
    if (w < 1200) return 285;
    return 305;
  }

  function getT(offset) {
    if (offset === 0)
      return {tx:'-50%',tz:0,ry:0,sc:1,br:1,op:1,zi:10,pe:'auto'};
    const dir = offset > 0 ? 1 : -1;
    const abs = Math.abs(offset);
    const gap = getGap();
    return {
      tx: `calc(-50% + ${dir*gap*abs}px)`,
      tz: -220*abs,
      ry: dir * -35,
      sc: Math.max(0.60, 0.82-(abs-1)*.12),
      br: Math.max(0.22, 0.55-(abs-1)*.20),
      op: Math.max(0.22, 0.72-(abs-1)*.28),
      zi: 10-abs,
      pe: abs>1?'none':'auto',
    };
  }

  function render(instant) {
    cards.forEach((card,idx) => {
      const offset = idx - activeIdx;
      const t = getT(offset);
      if (instant) card.style.transition = 'none';
      card.style.transform     = `translateX(${t.tx}) translateY(-50%) translateZ(${t.tz}px) rotateY(${t.ry}deg) scale(${t.sc})`;
      card.style.filter        = `brightness(${t.br})`;
      card.style.opacity       = t.op;
      card.style.zIndex        = t.zi;
      card.style.pointerEvents = t.pe;
      card.classList.toggle('is-active', idx===activeIdx);
    });
    if (instant) requestAnimationFrame(()=>requestAnimationFrame(()=>cards.forEach(c=>c.style.transition='')));
    dots.forEach((d,i)=>d.classList.toggle('is-active',i===activeIdx));
    if (prevBtn) prevBtn.disabled = activeIdx===0;
    if (nextBtn) nextBtn.disabled = activeIdx===TOTAL-1;
  }

  function goTo(idx, source) {
    if (idx<0||idx>=TOTAL) return;
    if (idx===activeIdx && source!=='init') return;
    activeIdx = idx;
    render(false);
    notifyProdiChange(cards[activeIdx].dataset.prodi);
  }

  prevBtn?.addEventListener('click',()=>goTo(activeIdx-1,'btn'));
  nextBtn?.addEventListener('click',()=>goTo(activeIdx+1,'btn'));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>goTo(i,'dot')));

  cards.forEach((card,idx)=>{
    card.addEventListener('click',()=>{
      if (wasDragging){wasDragging=false;return;}
      if (idx!==activeIdx) goTo(idx,'card');
      else toggleCardDropdown();
    });
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();idx===activeIdx?toggleCardDropdown():goTo(idx,'key');}
    });
  });

  document.addEventListener('click',e=>{
    const dd=document.getElementById('cardDropdown');
    if(!dd||!dd.classList.contains('is-open'))return;
    if(!dd.contains(e.target)&&!stage.contains(e.target)) closeCardDropdown();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCardDropdown();});

  stage.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    isDragging=true; dragStartX=e.clientX; dragDeltaX=0;
    stage.style.cursor='grabbing'; e.preventDefault();
  });
  window.addEventListener('mousemove',e=>{if(!isDragging)return; dragDeltaX=e.clientX-dragStartX;});
  window.addEventListener('mouseup',()=>{
    if(!isDragging)return;
    isDragging=false; stage.style.cursor='';
    if(Math.abs(dragDeltaX)>52){wasDragging=true;goTo(activeIdx+(dragDeltaX<0?1:-1),'drag');}
    else{clearTimeout(dragTimerId);dragTimerId=setTimeout(()=>{wasDragging=false;},50);}
  });

  let touchX0=0;
  stage.addEventListener('touchstart',e=>{touchX0=e.touches[0].clientX;},{passive:true});
  stage.addEventListener('touchend',e=>{
    const delta=e.changedTouches[0].clientX-touchX0;
    if(Math.abs(delta)>48)goTo(activeIdx+(delta<0?1:-1),'touch');
  });

  stage.setAttribute('tabindex','0');
  stage.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(activeIdx-1,'key');}
    if(e.key==='ArrowRight'){e.preventDefault();goTo(activeIdx+1,'key');}
  });

  cards.forEach(card=>{
    const inner=card.querySelector('.cflow-card__inner');
    if(!inner)return;
    card.addEventListener('mousemove',e=>{
      if(!card.classList.contains('is-active'))return;
      const rect=card.getBoundingClientRect();
      const dx=(e.clientX-rect.left-rect.width/2)/(rect.width/2);
      const dy=(e.clientY-rect.top-rect.height/2)/(rect.height/2);
      inner.style.transform=`perspective(700px) rotateX(${dy*-5}deg) rotateY(${dx*5}deg)`;
    });
    card.addEventListener('mouseleave',()=>{inner.style.transform='';});
  });

  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>render(true),120);});

  render(true);
  notifyProdiChange(cards[activeIdx].dataset.prodi);
}());

 

function notifyProdiChange(prodi) {
  if (prodi===_currentProdi) return;
  _currentProdi = prodi; _currentSem = null;
  const nameEl = document.getElementById('cdProdiName');
  if (nameEl) nameEl.textContent = PRODI_DATA[prodi]?.name ?? prodi.toUpperCase();
  buildDropdownOptions(prodi);
  closeCardDropdown();
  closeInfoPanel();
}

function openCardDropdown() {
  const dd   = document.getElementById('cardDropdown');
  const card = document.querySelector('.cflow-card.is-active');
  if (dd)   {dd.classList.add('is-open'); dd.setAttribute('aria-hidden','false');}
  if (card) card.classList.add('dd-open');
}
function closeCardDropdown() {
  const dd = document.getElementById('cardDropdown');
  if (dd) {dd.classList.remove('is-open'); dd.setAttribute('aria-hidden','true');}
  document.querySelectorAll('.cflow-card.dd-open').forEach(c=>c.classList.remove('dd-open'));
}
function toggleCardDropdown() {
  const dd = document.getElementById('cardDropdown');
  if (dd&&dd.classList.contains('is-open')) closeCardDropdown();
  else openCardDropdown();
}

function buildDropdownOptions(prodi) {
  const panel = document.getElementById('cardDropdownPanel');
  if (!panel) return;
  panel.innerHTML='';
  for (let s=1;s<=8;s++) {
    const col  = SEM_COLORS[s-1];
    const data = SEMESTER_DATA[prodi]?.[s];
    const opt  = document.createElement('button');
    opt.className = 'sem-option';
    opt.type      = 'button';
    opt.dataset.sem = s; opt.dataset.prodi = prodi;
    opt.setAttribute('role','option');
    opt.setAttribute('aria-label',`Semester ${s}: ${data?.title??''}`);
    opt.innerHTML=`
      <span class="sem-option__badge" style="background:${col.bg};color:${col.text}">
        <span class="sem-option__tag" style="color:${col.tag}">SEM</span>
        <span class="sem-option__num">${s}</span>
      </span>
      <span class="sem-option__content">
        <span class="sem-option__title">${data?.title??'—'}</span>
        <span class="sem-option__meta">${data?.count??'—'} Mata Kuliah</span>
      </span>
      <span class="sem-option__arrow" aria-hidden="true">→</span>`;
    opt.addEventListener('click',()=>{
      panel.querySelectorAll('.sem-option').forEach(o=>o.classList.remove('s-active'));
      opt.classList.add('s-active');
      closeCardDropdown();
      onSemSelect(prodi,s);
    });
    panel.appendChild(opt);
  }
}

 

function onSemSelect(prodi, sem) {
  _currentSem = sem;
  const panel = document.getElementById('cardDropdownPanel');
  if (panel) panel.querySelectorAll('.sem-option').forEach(o=>o.classList.toggle('s-active',parseInt(o.dataset.sem)===sem));
  renderInfoPanel(prodi, sem);
}

function renderInfoPanel(prodi, sem) {
  const wrap  = document.getElementById('infoWrap');
  const data  = SEMESTER_DATA[prodi]?.[sem];
  const link  = DRIVE_LINKS[prodi]?.[sem];
  const pData = PRODI_DATA[prodi];
  if (!wrap||!data) return;
  const q = id => document.getElementById(id);
  if (q('infoTag'))   q('infoTag').textContent   = pData?.name??prodi.toUpperCase();
  if (q('infoSem'))   q('infoSem').textContent   = `SEMESTER ${sem}`;
  if (q('infoTitle')) q('infoTitle').textContent = data.title;
  if (q('infoCount')) q('infoCount').textContent = data.count;
  if (q('infoDesc'))  q('infoDesc').textContent  = data.desc;
  const btn = q('driveBtn');
  if (btn) {
    if (link&&link.trim()) {
      btn.href=link; btn.classList.remove('no-link');
      btn.onclick=null; btn.setAttribute('aria-disabled','false');
    } else {
      btn.href='#'; btn.classList.add('no-link');
      btn.setAttribute('aria-disabled','true');
      btn.onclick=e=>e.preventDefault();
    }
  }
  wrap.classList.add('i-open');
}

function closeInfoPanel() {
  const wrap = document.getElementById('infoWrap');
  if (wrap) wrap.classList.remove('i-open');
}

 

(function initMateriEntrance() {
  const section = document.getElementById('materi');
  if (!section) return;

  const header = section.querySelector('.materi__header');
  const stage  = document.getElementById('cfStage');
  const dots   = document.getElementById('cfDots');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        header?.classList.add('m-in');    header?.classList.remove('m-out');
        stage?.classList.add('m-in');     stage?.classList.remove('m-out');
        dots?.classList.add('m-in');      dots?.classList.remove('m-out');
      } else {
        header?.classList.remove('m-in'); header?.classList.add('m-out');
        stage?.classList.remove('m-in');  stage?.classList.add('m-out');
        dots?.classList.remove('m-in');   dots?.classList.add('m-out');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  obs.observe(section);
}());

 

(function initProyek() {
  'use strict';

   
  var DATA = [
    {
      id:'p1', num:'01', prodi:'DEA',
      title:'Progressive Die Stamping',
      author:'Ahmad Fadlilah  ·  DEA 2022',
      desc:'Perancangan progressive die stamping untuk komponen bracket otomotif berbahan SPCC 1,2 mm. Desain mencakup operasi blanking, bending, dan drawing dalam satu rangkaian. Analisis gaya potong dan estimasi umur pakai die dilakukan dengan simulasi FEM.',
      color:'#100800',
      media:[
        {type:'placeholder', label:'Tampak Isometrik',  icon:'cube'},
        {type:'placeholder', label:'Detail Punch & Die', icon:'detail'},
        {type:'placeholder', label:'Hasil Produk',       icon:'product'},
      ]
    },
    {
      id:'p2', num:'02', prodi:'DEB',
      title:'Jig Pengeboran Presisi',
      author:'Reza Pratama  ·  DEB 2021',
      desc:'Perancangan jig pengeboran untuk komponen blok mesin dengan 8 lubang diameter 8 mm toleransi H7. Sistem locating menggunakan pin silinder dan rest pad untuk akurasi posisi ±0,02 mm.',
      color:'#001308',
      media:[
        {type:'placeholder', label:'Assembly Jig',    icon:'cube'},
        {type:'placeholder', label:'Detail Locating', icon:'detail'},
      ]
    },
    {
      id:'p3', num:'03', prodi:'DEC',
      title:'Injection Mold Tutup Botol',
      author:'Siti Nurhaliza  ·  DEC 2023',
      desc:'Perancangan cetakan injeksi plastik untuk produksi tutup botol minuman 30 ml berbahan PP dengan conformal cooling channel. Simulasi aliran material dan warpage dilakukan dengan Moldflow.',
      color:'#080018',
      media:[
        {type:'placeholder', label:'Cavity & Core', icon:'cube'},
        {type:'placeholder', label:'Runner System', icon:'detail'},
        {type:'placeholder', label:'Produk Akhir',  icon:'product'},
        {type:'3d',          label:'3D Interaktif', src:null},
      ]
    },
    {
      id:'p4', num:'04', prodi:'DEB',
      title:'Mesin Bending Semi-Otomatis',
      author:'Dimas Aditya  ·  DEB 2022',
      desc:'Perancangan mesin bending pelat baja 3 mm kapasitas 300 mm dengan sistem hidrolik 50 bar. Kontrol sudut bending menggunakan sensor rotary encoder dan PLC.',
      color:'#0a0a00',
      media:[
        {type:'placeholder', label:'Mesin Keseluruhan', icon:'cube'},
        {type:'placeholder', label:'Sistem Hidrolik',   icon:'detail'},
      ]
    },
    {
      id:'p5', num:'05', prodi:'DEA',
      title:'Fixture Welding Chasis',
      author:'Nur Aini Safitri  ·  DEA 2023',
      desc:'Fixture pengelasan rangka chasis kendaraan roda tiga dengan 12 titik clamp. Mempertahankan toleransi geometri ±0,1 mm setelah proses pengelasan GMAW.',
      color:'#100005',
      media:[
        {type:'placeholder', label:'Fixture Assembly', icon:'cube'},
        {type:'placeholder', label:'Detail Clamp',     icon:'detail'},
        {type:'placeholder', label:'Proses Welding',   icon:'product'},
      ]
    },
    {
      id:'p6', num:'06', prodi:'DEC',
      title:'Optimasi Desain Sprocket',
      author:'Rizki Maulana  ·  DEC 2021',
      desc:'Optimasi sprocket rantai motor menggunakan FEA Ansys Workbench. Pengurangan massa 23% dengan Al 7075 tanpa mengurangi batas fatigue cycle minimum 10⁶ siklus.',
      color:'#000f10',
      media:[
        {type:'placeholder', label:'Model 3D',      icon:'cube'},
        {type:'placeholder', label:'Analisis FEA',  icon:'detail'},
        {type:'3d',          label:'3D Interaktif', src:null},
      ]
    },
  ];

   
  function icon(type, s) {
    s = s || 36;
    if (type === 'cube')
      return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M18 4L4 11v14l14 7 14-7V11L18 4z"/><path d="M4 11l14 7 14-7"/><line x1="18" y1="18" x2="18" y2="32"/></svg>';
    if (type === 'detail')
      return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="5" y="5" width="26" height="26"/><line x1="10" y1="13" x2="26" y2="13"/><line x1="10" y1="18" x2="26" y2="18"/><line x1="10" y1="23" x2="20" y2="23"/></svg>';
    return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="18" cy="15" r="8"/><path d="M8 31c0-5.5 4.5-10 10-10s10 4.5 10 10"/></svg>';
  }

   
  window.hmtpProyekStaticData = DATA;

   
  var grid = document.getElementById('proyekGrid');
  if (!grid) return;

  DATA.forEach(function(p) {
    var card = document.createElement('article');
    card.className = 'proyek-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Buka proyek: ' + p.title);
    card.setAttribute('data-proyek-id', p.id);  

    var has3d = p.media.some(function(m){ return m.type === '3d'; });

    card.innerHTML =
      '<div class="proyek-card__bg" style="background:'+p.color+'">'+
        icon(p.media[0].icon || 'cube', 40)+
      '</div>'+
      '<div class="proyek-card__overlay"></div>'+
      '<span class="proyek-card__num">'+p.num+'</span>'+
      '<span class="proyek-card__tag">'+p.prodi+'</span>'+
      '<div class="proyek-card__info">'+
        '<p class="proyek-card__name">'+p.title+'</p>'+
        '<p class="proyek-card__author">'+p.author+'</p>'+
      '</div>'+
      '<span class="proyek-card__media">'+
        '<svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="1.5" width="7" height="6"/><line x1="3.5" y1="1.5" x2="3.5" y2="7.5"/></svg>'+
        ' '+p.media.length+(has3d ? ' · 3D' : '')+
      '</span>';

    card.addEventListener('click',   function(){  openModal(p); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal(p); } });
    grid.appendChild(card);
  });

   
  if ('IntersectionObserver' in window) {

     
    var ioH = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('p-in');    e.target.classList.remove('p-out');
        } else {
          e.target.classList.remove('p-in'); e.target.classList.add('p-out');
        }
      });
    }, { threshold: 0.2 });
    var hdr = document.getElementById('proyekHeader');
    if (hdr) ioH.observe(hdr);

     
    var addBtn = document.getElementById('proyekAddBtn');
    if (addBtn) ioH.observe(addBtn);

     
    var ioC = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('p-in');    e.target.classList.remove('p-out');
        } else {
          e.target.classList.remove('p-in'); e.target.classList.add('p-out');
        }
      });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.proyek-card').forEach(function(c, i) {
      c.style.transitionDelay = (i * 0.07) + 's';
      ioC.observe(c);
    });
  }

   
  var modal      = document.getElementById('proyekModal');
  var backdrop   = document.getElementById('proyekModalBackdrop');
  var closeBtn   = document.getElementById('proyekModalClose');
  var slidesEl   = document.getElementById('proyekModalSlides');
  var sliderLeft = document.getElementById('proyekModalLeft');
  var prevBtn    = document.getElementById('proyekModalPrev');
  var nextBtn    = document.getElementById('proyekModalNext');
  var dotsEl     = document.getElementById('proyekModalDots');
  var counterEl  = document.getElementById('proyekModalCounter');
  var nameEl     = document.getElementById('proyekModalName');
  var authorEl   = document.getElementById('proyekModalAuthor');
  var descEl     = document.getElementById('proyekModalDesc');
  var numEl      = document.getElementById('proyekModalNum');
  var prodiEl    = document.getElementById('proyekModalProdi');
  var btn3d      = document.getElementById('proyekUpload3dBtn');
  var inp3d      = document.getElementById('proyekUpload3dInput');

  if (!modal) return;

  var curProject = null;
  var curIdx     = 0;
  var mediaList  = [];

   
   
  window.proyekOpenModal = function(p) { openModal(p); };

  function openModal(p) {
    curProject = p;
    curIdx     = 0;
    mediaList  = p.media ? p.media.slice() : [];

    if (numEl)    numEl.textContent    = p.num;
    if (prodiEl)  prodiEl.textContent  = p.prodi;
    if (nameEl)   nameEl.textContent   = p.title;
    if (authorEl) authorEl.textContent = p.author;
    if (descEl)   descEl.textContent   = p.desc;

    buildSlides();
    goTo(0, false);

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.documentElement.classList.add('no-scroll');
    setTimeout(function(){ if (closeBtn) closeBtn.focus(); }, 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    if (slidesEl) {
      slidesEl.querySelectorAll('model-viewer').forEach(function(mv){
        if (mv.src && mv.src.startsWith('blob:')) URL.revokeObjectURL(mv.src);
      });
    }
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goTo(curIdx - 1);
    if (e.key === 'ArrowRight')  goTo(curIdx + 1);
  });

   
  function buildSlides() {
    if (!slidesEl || !dotsEl) return;
    slidesEl.innerHTML = '';
    dotsEl.innerHTML   = '';
    slidesEl.style.transform  = 'translateX(0)';
    slidesEl.style.transition = 'none';

    mediaList.forEach(function(m, i) {
      var slide = document.createElement('div');
      slide.className = 'proyek-modal__slide';

      if (m.type === 'image' && m.src) {
        var img = document.createElement('img');
        img.src = m.src; img.alt = m.label || ''; img.loading = 'lazy'; img.draggable = false;
        slide.appendChild(img);
      } else if (m.type === '3d' && m.src) {
        slide.innerHTML =
          '<model-viewer src="'+m.src+'" auto-rotate camera-controls '+
          'shadow-intensity="0.4" exposure="0.9" '+
          'style="width:100%;height:100%;background:transparent;" '+
          'alt="'+(m.label || '3D Model')+'"></model-viewer>';
      } else {
        slide.classList.add('proyek-modal__slide--ph');
        slide.style.setProperty('--_ph-bg', curProject.color || '#111');
        slide.innerHTML =
          '<div class="ph-icon">'+icon(m.icon || 'cube', 36)+'</div>'+
          '<span class="ph-lbl">'+(m.label || 'Slide '+(i+1))+'</span>';
      }

      var badge = document.createElement('span');
      badge.className = 'proyek-modal__slide-type';
      badge.textContent = m.type === '3d' ? '3D MODEL' : m.type === 'image' ? 'IMAGE' : 'PREVIEW';
      slide.appendChild(badge);
      slidesEl.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'proyek-modal__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Slide '+(i+1));
      (function(idx){ dot.addEventListener('click', function(){ goTo(idx); }); })(i);
      dotsEl.appendChild(dot);
    });
  }

   
  function goTo(idx, animate) {
    var total = mediaList.length;
    if (!total) return;
    curIdx = Math.max(0, Math.min(idx, total - 1));

    if (slidesEl) {
      slidesEl.style.transition = animate === false
        ? 'none'
        : 'transform .4s cubic-bezier(0.16,1,0.3,1)';
      slidesEl.style.transform = 'translateX('+(-curIdx * 100)+'%)';
    }

    if (dotsEl) dotsEl.querySelectorAll('.proyek-modal__dot').forEach(function(d,i){
      d.classList.toggle('is-active', i === curIdx);
    });

    if (counterEl) counterEl.textContent = (curIdx+1)+' / '+total;
    if (prevBtn)   prevBtn.disabled = (curIdx === 0);
    if (nextBtn)   nextBtn.disabled = (curIdx === total - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', function(){ goTo(curIdx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ goTo(curIdx + 1); });

   
  var startX = 0, dragging = false;
  function dragStart(x){ startX = x; dragging = true; }
  function dragEnd(x){
    if (!dragging) return; dragging = false;
    var diff = x - startX;
    if      (diff < -45) goTo(curIdx + 1);
    else if (diff >  45) goTo(curIdx - 1);
  }
  if (sliderLeft) {
    sliderLeft.addEventListener('touchstart', function(e){ dragStart(e.touches[0].clientX); }, {passive:true});
    sliderLeft.addEventListener('touchend',   function(e){ dragEnd(e.changedTouches[0].clientX); }, {passive:true});
    sliderLeft.addEventListener('mousedown',  function(e){ dragStart(e.clientX); e.preventDefault(); });
  }
  document.addEventListener('mouseup', function(e){ dragEnd(e.clientX); });

   
  if (btn3d) btn3d.addEventListener('click', function(){ if (inp3d) inp3d.click(); });
  if (inp3d) inp3d.addEventListener('change', function(e){
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'glb' && ext !== 'gltf'){ alert('Format didukung: .glb atau .gltf'); inp3d.value=''; return; }
    var url = URL.createObjectURL(file);
    mediaList.push({type:'3d', label:file.name, src:url});
    buildSlides();
    goTo(mediaList.length - 1, false);
    inp3d.value = '';
  });

   
  var addBtnEl = document.getElementById('proyekAddBtn');
  if (addBtnEl) addBtnEl.addEventListener('click', function(){
    if (typeof window.devModeOpenProyek === 'function') {
      window.devModeOpenProyek();
    } else {
      alert('Tambah proyek: masukkan data ke array DATA di script.js bagian "9. PROYEK".');
    }
  });

}());

 

(function initExploreStudio() {
  'use strict';

   
  const ROOM = {
    'Lobby':    { name: 'LOBBY',              desc: 'Pintu masuk utama kompleks studio HMTP' },
    'B102':     { name: 'STUDIO B102',         desc: 'Studio rekaman dengan acoustic treatment premium' },
    'B104':     { name: 'STUDIO B104',         desc: 'Ruang serbaguna untuk berbagai kebutuhan produksi' },
    'B106':     { name: 'STUDIO B106',         desc: 'Studio dengan pencahayaan profesional' },
    'B108':     { name: 'STUDIO B108',         desc: 'Studio produksi video & audio berkualitas tinggi' },
    'B006':     { name: 'STUDIO B006',         desc: 'Studio lantai dasar dengan akses mudah' },
    'B008':     { name: 'STUDIO B008',         desc: 'Studio berkapasitas besar untuk produksi skala penuh' },
    'B110':     { name: 'STUDIO B110',         desc: 'Studio premium dengan peralatan terkini' },
    'B109':     { name: 'STUDIO B109',         desc: 'Studio dengan desain akustik superior' },
    'B107':     { name: 'STUDIO B107',         desc: 'Studio multifungsi untuk kreasi tanpa batas' },
    'B105':     { name: 'STUDIO B105',         desc: 'Studio compact dengan kualitas rekaman profesional' },
    'B103':     { name: 'STUDIO B103',         desc: 'Studio dengan atmosfer kreatif yang mendukung' },
    'Loker':    { name: 'AREA LOKER',          desc: 'Fasilitas penyimpanan pribadi untuk pengguna studio' },
    'Selasar1': { name: 'SELASAR',             desc: 'Koridor penghubung antar area studio' },
    'Selasar2': { name: 'SELASAR 2',           desc: 'Jalur koridor menuju area administrasi' },
    'Admin':    { name: 'ADMINISTRASI',        desc: 'Pusat layanan dan administrasi studio' },
    'C104':     { name: 'RUANG C104',          desc: 'Ruang serbaguna di area C' },
    'A201':     { name: 'RUANG A201',          desc: 'Ruang lantai dua di area A' },
  };

   
  const LOOPS = {
    studio:  ['Lobby','B102','B104','B106','B108','B006','B008','B110','B109','B107','B105','B103'],
    koridor: ['Lobby','Loker','Selasar1','Selasar2','Admin','C104','A201'],
  };
  const BADGE = { entry:'EXPLORE STUDIO', studio:'LOOP — STUDIO', koridor:'LOOP — KORIDOR' };

   
  const IMG_BASE = 'explore/';

   
  const S = { open:false, busy:false, mode:'entry', idx:0 };

   
  const ov         = document.getElementById('explore-overlay');
  const bg         = document.getElementById('es-photo');
  const fd         = document.getElementById('es-fade');
  const nameEl     = document.getElementById('es-room-name');
  const descEl     = document.getElementById('es-room-desc');
  const badgeEl    = document.getElementById('es-badge-label');
  const progEl     = document.getElementById('es-progress');
  const hsStudio   = document.getElementById('es-hs-studio');
  const hsKoridor  = document.getElementById('es-hs-koridor');
  const cta        = document.getElementById('es-cta');
  const hsPrev     = document.getElementById('es-hs-prev');
  const hsNext     = document.getElementById('es-hs-next');
  const hsHome     = document.getElementById('es-home');
  const exitBtn    = document.getElementById('es-exit');
  const openBtn    = document.getElementById('studioOpenBtn');
  const siteNav    = document.getElementById('siteNav');

  if (!ov) return;  

   
  const cache = {};
  function preload(key) {
    if (!key || cache[key]) return;
    const img = new Image(); img.src = IMG_BASE + key + '.webp'; cache[key] = img;
  }
  function setBg(key) {
    bg.style.backgroundImage = "url('" + IMG_BASE + key + ".webp')";
  }

   
  function updateInfo(key) {
    const d = ROOM[key] || { name: key, desc: '' };
    nameEl.textContent = d.name;
    descEl.textContent = d.desc;
  }

  function showEntry() {
    [hsStudio, hsKoridor, cta].forEach(el => { if(el) el.style.display = ''; });
    [hsPrev, hsNext, hsHome].forEach(el => { if(el) el.style.display = 'none'; });
    if (badgeEl) badgeEl.textContent = BADGE.entry;
    if (progEl)  progEl.innerHTML = '';
  }

  function showNav() {
    [hsStudio, hsKoridor, cta].forEach(el => { if(el) el.style.display = 'none'; });
    [hsPrev, hsNext, hsHome].forEach(el => { if(el) el.style.display = ''; });
    if (badgeEl) badgeEl.textContent = BADGE[S.mode];
    buildDots(); preloadNeighbors();
  }

  function buildDots() {
    if (!progEl) return;
    const loop = LOOPS[S.mode];
    progEl.innerHTML = loop.map((_,i) =>
      '<div class="es-pdot' + (i === S.idx ? ' cur' : '') + '"></div>'
    ).join('');
  }

  function preloadNeighbors() {
    const loop = LOOPS[S.mode], len = loop.length;
    preload(loop[(S.idx - 1 + len) % len]);
    preload(loop[(S.idx + 1) % len]);
  }

   
  const wait  = ms => new Promise(r => setTimeout(r, ms));
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  async function transition(doUpdate) {
    if (S.busy) return;
    S.busy = true;
    if (fd) fd.classList.add('dark');
    await wait(350);
    doUpdate();
    await frame();
    if (fd) fd.classList.remove('dark');
    await wait(380);
    S.busy = false;
  }

   
  function enterLoop(loopName) {
    transition(() => {
      S.mode = loopName; S.idx = 1;
      const room = LOOPS[loopName][1];
      setBg(room); updateInfo(room); showNav();
    });
  }

  function navigate(dir) {
    if (S.mode === 'entry') return;
    const loop = LOOPS[S.mode];
    const next = (S.idx + dir + loop.length) % loop.length;
    transition(() => {
      S.idx = next;
      setBg(loop[next]); updateInfo(loop[next]);
      if (next === 0) { S.mode = 'entry'; showEntry(); }
      else showNav();
    });
  }

  function goLobby() {
    if (S.mode === 'entry') return;
    transition(() => {
      S.mode = 'entry'; S.idx = 0;
      setBg('Lobby'); updateInfo('Lobby'); showEntry();
    });
  }

   
  window.openExplore = function () {
    if (S.open) return;
    S.open = true; S.mode = 'entry'; S.idx = 0; S.busy = false;
    setBg('Lobby'); updateInfo('Lobby'); showEntry();
    ov.classList.add('es-open');
    document.body.style.overflow = 'hidden';
     
    if (siteNav) siteNav.classList.add('is-hidden');
     
    setTimeout(() => { [...LOOPS.studio, ...LOOPS.koridor].forEach(preload); }, 800);
  };

  window.closeExplore = function () {
    if (!S.open) return;
    S.open = false;
    ov.classList.remove('es-open');
    document.body.style.overflow = '';
    if (siteNav) siteNav.classList.remove('is-hidden');
  };

   
  if (hsStudio)  hsStudio.addEventListener('click',  () => enterLoop('studio'));
  if (hsKoridor) hsKoridor.addEventListener('click', () => enterLoop('koridor'));
  if (hsPrev)    hsPrev.addEventListener('click',    () => navigate(-1));
  if (hsNext)    hsNext.addEventListener('click',    () => navigate(1));
  if (hsHome)    hsHome.addEventListener('click',    () => goLobby());
  if (exitBtn)   exitBtn.addEventListener('click',   () => window.closeExplore());
  if (openBtn)   openBtn.addEventListener('click',   () => window.openExplore());

   
  document.addEventListener('keydown', e => {
    if (!S.open) return;
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape')     window.closeExplore();
    if (e.key === 'h' || e.key === 'H') goLobby();
  });

   
  preload('Lobby');

}());

 

 

document.addEventListener('DOMContentLoaded', () => {

  const transition = document.querySelector('.hmtp-transition');

  if (!transition) return;

  const black = transition.querySelector(
    '.hmtp-transition__black'
  );

  const logos = transition.querySelector(
    '.hmtp-transition__logos'
  );

  const title = transition.querySelector(
    '.hmtp-transition__title'
  );

   
  const leak = document.querySelector(
    '.hmtp-transition__leak'
  );

  if (!black || !logos || !title) return;

   

  let targetProgress = 0;
  let currentProgress = 0;

  function updateProgress() {

    const rect =
      transition.getBoundingClientRect();

    const scrollDistance =
      transition.offsetHeight -
      window.innerHeight;

    if (scrollDistance <= 0) return;

    const scrolled =
      -rect.top;

    targetProgress =
      scrolled / scrollDistance;

    targetProgress =
      Math.max(
        0,
        Math.min(
          1,
          targetProgress
        )
      );
  }

   

  function animate() {

     

    currentProgress +=
      (targetProgress - currentProgress) * 0.14;

     

    if (
      Math.abs(
        targetProgress - currentProgress
      ) < 0.0005
    ) {
      currentProgress =
        targetProgress;
    }

    const p =
      currentProgress;

     

    let blackProgress =
      p / 0.60;

    blackProgress =
      Math.max(
        0,
        Math.min(
          1,
          blackProgress
        )
      );

     

    const blackEase =
      blackProgress;

    black.style.height =
      `${blackEase * 150}%`;

     

    let logoProgress =
      (p - 0.58) / 0.24;

    logoProgress =
      Math.max(
        0,
        Math.min(
          1,
          logoProgress
        )
      );

     

    const logoEase =
      logoProgress *
      logoProgress *
      (3 - 2 * logoProgress);

    logos.style.opacity =
      logoEase;

    logos.style.transform =
      `scale(${1.05 -
        (logoEase * 0.05)})`;

     

    let titleProgress =
      (p - 0.78) / 0.22;

    titleProgress =
      Math.max(
        0,
        Math.min(
          1,
          titleProgress
        )
      );

     

    const titleEase =
      titleProgress *
      titleProgress *
      (3 - 2 * titleProgress);

    title.style.opacity =
      titleEase;

    title.style.transform =
      `scale(${1.12 -
        (titleEase * 0.12)})`;

     

    if (leak) {

       
      let leakProgress =
        (p - 0.78) / 0.22;

      leakProgress =
        Math.max(
          0,
          Math.min(
            1,
            leakProgress
          )
        );

       
      const leakEase =
        leakProgress *
        leakProgress *
        (3 - 2 * leakProgress);

       
      let leakOpacity = leakEase * 0.15;

       
      if (p >= 0.99) {

        const kontakEl =
          document.getElementById('kontak');

        if (kontakEl) {

          const kontakRect =
            kontakEl.getBoundingClientRect();

           
          const fadeThreshold =
            kontakEl.offsetHeight * 0.70;

          const scrolledIntoBottom =
            -kontakRect.top - fadeThreshold;

          if (scrolledIntoBottom > 0) {

             
            const fadeRange =
              window.innerHeight * 0.40;

            const fadeAmt =
              Math.min(1, scrolledIntoBottom / fadeRange);

             
            const fadeSS =
              fadeAmt * fadeAmt * (3 - 2 * fadeAmt);

            leakOpacity *= (1 - fadeSS);
          }
        }
      }

       
      const exploreEl =
        document.getElementById('explore-overlay');

      if (
        exploreEl &&
        exploreEl.classList.contains('es-open')
      ) {

         
        leakOpacity = 0;
      }

      leak.style.opacity = leakOpacity;
    }

    requestAnimationFrame(
      animate
    );
  }

   

  window.addEventListener(
    'scroll',
    updateProgress,
    {
      passive: true
    }
  );

   

  window.addEventListener(
    'resize',
    updateProgress,
    {
      passive: true
    }
  );

   

  updateProgress();

  animate();

});

const aboutText = document.querySelector(
    '#aboutHimpunanText'
);

 
(function buildCharSpans() {
    const segments = aboutText.textContent.trim().split(/(\s+)/);
    let html = '';
    segments.forEach(function(seg) {
        if (/^\s+$/.test(seg)) {
            html += seg;  
        } else {
            seg.split('').forEach(function(ch) {
                html += '<span>' + ch + '</span>';
            });
        }
    });
    aboutText.innerHTML = html;
})();

const aboutSection =
    document.querySelector('.about-himpunan');

const aboutChars =
    aboutText.querySelectorAll('span');

function updateAboutColor() {

    const rect =
        aboutSection.getBoundingClientRect();

    const sectionHeight =
        aboutSection.offsetHeight;

    const viewport =
        window.innerHeight;

     

    let progress =
        -rect.top /
        (sectionHeight - viewport);

    progress =
        Math.max(0, Math.min(1, progress));

    aboutChars.forEach((char, index) => {

         

        const charProgress =
            progress * (aboutChars.length + 8)
            - index;

        const p =
            Math.max(
                0,
                Math.min(1, charProgress)
            );

         

        const start = [50, 50, 50];

        const end = [255, 187, 0];

        const r =
            Math.round(
                start[0] +
                (end[0] - start[0]) * p
            );

        const g =
            Math.round(
                start[1] +
                (end[1] - start[1]) * p
            );

        const b =
            Math.round(
                start[2] +
                (end[2] - start[2]) * p
            );

        char.style.color =
            `rgb(${r}, ${g}, ${b})`;
    });
}

window.addEventListener(
    'scroll',
    updateAboutColor,
    { passive: true }
);

updateAboutColor();

 

(function initHimpunanReveal() {
    if (!('IntersectionObserver' in window)) {
         
        document.querySelectorAll('[data-hmpn-reveal]').forEach(function(el) {
            el.classList.add('is-in');
        });
        return;
    }

    var els = document.querySelectorAll('[data-hmpn-reveal]');
    if (!els.length) return;

    var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add('is-in');      
            } else {
                e.target.classList.remove('is-in');   
            }
        });
    }, {
        threshold:  0.18,
        rootMargin: '0px 0px -40px 0px'    
    });

    els.forEach(function(el) { io.observe(el); });
})();

 

(function initDepartments() {

    'use strict';

     

    const section =
        document.getElementById('departments');

    if (!section) return;

    const carousel =
        document.getElementById(
            'departmentCarousel'
        );

    if (!carousel) return;

     

    const allPairs =
        Array.from(
            carousel.querySelectorAll(
                '.department-pair'
            )
        );

     

    const pairs =
        allPairs.filter(function(pair) {

            return !pair.classList.contains(
                'department-pair--buffer'
            );

        });

     

    const buffer =
        carousel.querySelector(
            '.department-pair--buffer'
        );

    const counter =
        document.getElementById(
            'departmentCurrent'
        );

    if (!pairs.length) return;

     

    const PAIR_COUNT =
        pairs.length;

     

    let PAIR_DISTANCE =
        window.innerHeight * 0.72;

    let ticking = false;

     

    function getProgress() {

        const rect =
            section.getBoundingClientRect();

        const scrollable =
            section.offsetHeight -
            window.innerHeight;

        if (scrollable <= 0) {

            return 0;

        }

        const progress =
            -rect.top / scrollable;

        return Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );

    }

     

    function updateDepartments() {

        ticking = false;

        const progress =
            getProgress();

         

        const virtualIndex =
            progress *
            (PAIR_COUNT - 1);

        const activeIndex =
            Math.round(
                virtualIndex
            );

         

        pairs.forEach(
            function(pair, index) {

                const distance =
                    index -
                    virtualIndex;

                const distanceAbs =
                    Math.abs(
                        distance
                    );

                 

                const translateY =
                    distance *
                    PAIR_DISTANCE;

                pair.style.transform =
                    `translate3d(
                        0,
                        calc(-50% + ${translateY}px),
                        0
                    )`;

                 

                const scale =
                    Math.max(
                        0.90,
                        1 -
                        distanceAbs *
                        0.06
                    );

                 

                const opacity =
                    Math.max(
                        0.12,
                        1 -
                        distanceAbs *
                        0.72
                    );

                 

                const blur =
                    Math.min(
                        10,
                        distanceAbs *
                        8
                    );

                 

                const cards =
                    pair.querySelectorAll(
                        '.department-card'
                    );

                cards.forEach(
                    function(card) {

                        card.style.transform =
                            `scale(${scale})`;

                        card.style.opacity =
                            opacity;

                        card.style.filter =
                            `blur(${blur}px)`;

                    }
                );

                 

                if (
                    index ===
                    activeIndex
                ) {

                    pair.classList.add(
                        'is-active'
                    );

                } else {

                    pair.classList.remove(
                        'is-active'
                    );

                }

            }
        );

         

        if (buffer) {

             

            const bufferDistance =
                (PAIR_COUNT - virtualIndex);

            const bufferTranslateY =
                bufferDistance *
                PAIR_DISTANCE;

            buffer.style.transform =
                `translate3d(
                    0,
                    calc(-50% + ${bufferTranslateY}px),
                    0
                )`;

             

            buffer.style.opacity =
                '0';

            buffer.style.pointerEvents =
                'none';

        }

         

        if (counter) {

            const number =
                String(
                    activeIndex + 1
                ).padStart(
                    2,
                    '0'
                );

            counter.textContent =
                number;

        }

    }

     

    function requestUpdate() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
            updateDepartments
        );

    }

    window.addEventListener(
        'scroll',
        requestUpdate,
        { passive: true }
    );

     

    let lockedPairIndex   = 0;    
    let lockAnimating     = false;
    let lastScrollY       = window.scrollY;

     

    function scrollYForPair(index) {

        const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY;

        const scrollable =
            section.offsetHeight -
            window.innerHeight;

        const pairProgress =
            PAIR_COUNT > 1
                ? index / (PAIR_COUNT - 1)
                : 0;

        return sectionTop + pairProgress * scrollable;

    }

     

    function isDeptSticky() {

        const r = section.getBoundingClientRect();

        return r.top <= 1 && r.bottom >= window.innerHeight - 1;

    }

     

    function smoothScrollTo(targetY, onDone) {

        const startY    = window.scrollY;
        const distance  = targetY - startY;
        const duration  = 520;
        let   startTime = null;

        function ease(t) {
            return t < 0.5
                ? 2 * t * t
                : -1 + (4 - 2 * t) * t;
        }

        function step(ts) {
            if (!startTime) startTime = ts;

            const elapsed = ts - startTime;
            const t       = Math.min(elapsed / duration, 1);

            window.scrollTo(0, startY + distance * ease(t));

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                if (onDone) onDone();
            }
        }

        requestAnimationFrame(step);

    }

     

    function goToPair(index) {

        if (lockAnimating) return;

        lockAnimating = true;

        lockedPairIndex = index;

        smoothScrollTo(
            scrollYForPair(index),
            function() {
                lockAnimating = false;
            }
        );

    }

     

    function exitDown() {

        if (lockAnimating) return;

        lockAnimating = true;

        const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY;

        const exitY =
            sectionTop +
            section.offsetHeight -
            window.innerHeight +
            4;

        smoothScrollTo(
            exitY,
            function() { lockAnimating = false; }
        );

    }

     

    function exitUp() {

        if (lockAnimating) return;

        lockAnimating = true;

        const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY;

        smoothScrollTo(
            sectionTop - 4,
            function() { lockAnimating = false; }
        );

    }

     

    function handleWheel(e) {

        if (!isDeptSticky()) return;

         
        e.preventDefault();

        if (lockAnimating) return;

        const dir =
            e.deltaY > 0 ? 1 : -1;

        const next =
            lockedPairIndex + dir;

        if (next < 0) {
             
            exitUp();
            return;
        }

        if (next >= PAIR_COUNT) {
             
            exitDown();
            return;
        }

        goToPair(next);

    }

    window.addEventListener(
        'wheel',
        handleWheel,
        { passive: false }
    );

     

    let touchStartY = null;

    window.addEventListener(
        'touchstart',
        function(e) {
            if (!isDeptSticky()) return;
            touchStartY = e.touches[0].clientY;
        },
        { passive: true }
    );

    window.addEventListener(
        'touchmove',
        function(e) {

            if (!isDeptSticky()) return;
            if (touchStartY === null) return;

            e.preventDefault();

            if (lockAnimating) return;

            const delta =
                touchStartY - e.touches[0].clientY;

             
            if (Math.abs(delta) < 40) return;

            touchStartY = null;

            const dir  = delta > 0 ? 1 : -1;
            const next = lockedPairIndex + dir;

            if (next < 0)            { exitUp();     return; }
            if (next >= PAIR_COUNT)  { exitDown();   return; }

            goToPair(next);

        },
        { passive: false }
    );

    window.addEventListener(
        'touchend',
        function() { touchStartY = null; },
        { passive: true }
    );

     

    window.addEventListener(
        'scroll',
        function() {

            if (lockAnimating) return;
            if (!isDeptSticky()) return;

            const prog = getProgress();

            lockedPairIndex = Math.round(
                prog * (PAIR_COUNT - 1)
            );

        },
        { passive: true }
    );

     

    window.addEventListener(
        'resize',
        function() {

            PAIR_DISTANCE =
                window.innerHeight * 0.72;

            requestUpdate();

        }
    );

     

    updateDepartments();

})();

 

(function initOrganization() {

  'use strict';

   

  const canvas =
    document.getElementById('organizationCanvas');

  const svg =
    document.getElementById(
      'organizationConnections'
    );

  const modal =
    document.getElementById('personModal');

  if (!canvas || !svg) {
    return;
  }

   

  function getElement(selector) {

    return document.querySelector(selector);

  }

  function getPoint(element, side) {

    const rect =
      element.getBoundingClientRect();

    const canvasRect =
      canvas.getBoundingClientRect();

    const x =
      rect.left -
      canvasRect.left;

    const y =
      rect.top -
      canvasRect.top;

    switch (side) {

      case 'top':

        return {
          x: x + rect.width / 2,
          y: y
        };

      case 'bottom':

        return {
          x: x + rect.width / 2,
          y: y + rect.height
        };

      case 'left':

        return {
          x: x,
          y: y + rect.height / 2
        };

      case 'right':

        return {
          x: x + rect.width,
          y: y + rect.height / 2
        };

    }

    return {
      x: x + rect.width / 2,
      y: y + rect.height / 2
    };

  }

   

  function createPath(
    start,
    end,
    className = ''
  ) {

    const ns =
      'http://www.w3.org/2000/svg';

    const path =
      document.createElementNS(
        ns,
        'path'
      );

    const middleY =
      start.y +
      (end.y - start.y) * 0.5;

    const d = `
      M ${start.x} ${start.y}
      C
        ${start.x} ${middleY},
        ${end.x} ${middleY},
        ${end.x} ${end.y}
    `;

    path.setAttribute(
      'd',
      d
    );

    if (className) {

      path.setAttribute(
        'class',
        className
      );

    }

    svg.appendChild(path);

  }

   

  function createBus(
    parent,
    children
  ) {

    if (
      !parent ||
      !children.length
    ) {
      return;
    }

    const parentPoint =
      getPoint(
        parent,
        'bottom'
      );

    const childPoints =
      children.map(
        child =>
          getPoint(
            child,
            'top'
          )
      );

    const ns =
      'http://www.w3.org/2000/svg';

    const minX =
      Math.min(
        ...childPoints.map(
          p => p.x
        )
      );

    const maxX =
      Math.max(
        ...childPoints.map(
          p => p.x
        )
      );

    const busY =
      parentPoint.y +
      25;

     

    const parentPath =
      document.createElementNS(
        ns,
        'path'
      );

    parentPath.setAttribute(
      'd',
      `
      M ${parentPoint.x} ${parentPoint.y}
      L ${parentPoint.x} ${busY}
      `
    );

    parentPath.setAttribute(
      'class',
      'connection-main'
    );

    svg.appendChild(
      parentPath
    );

     

    const busPath =
      document.createElementNS(
        ns,
        'path'
      );

    busPath.setAttribute(
      'd',
      `
      M ${minX} ${busY}
      L ${maxX} ${busY}
      `
    );

    busPath.setAttribute(
      'class',
      'connection-main'
    );

    svg.appendChild(
      busPath
    );

     

    childPoints.forEach(
      point => {

        const childPath =
          document.createElementNS(
            ns,
            'path'
          );

        childPath.setAttribute(
          'd',
          `
          M ${point.x} ${busY}
          L ${point.x} ${point.y}
          `
        );

        svg.appendChild(
          childPath
        );

      }
    );

  }

   

  function drawConnections() {

    svg.innerHTML = '';

     

    const chairman =
      getElement(
        '[data-person="chairman"]'
      );

    const vice1 =
      getElement(
        '[data-person="vice1"]'
      );

    const vice2 =
      getElement(
        '[data-person="vice2"]'
      );

    createBus(
      chairman,
      [
        vice1,
        vice2
      ]
    );

     

    const generation24 =
      getElement(
        '[data-person="generation24"]'
      );

    const generation25 =
      getElement(
        '[data-person="generation25"]'
      );

    createPath(
      getPoint(
        vice1,
        'bottom'
      ),
      getPoint(
        generation24,
        'top'
      )
    );

    createPath(
      getPoint(
        vice2,
        'bottom'
      ),
      getPoint(
        generation25,
        'top'
      )
    );

     

    const departmentCards =
      Array.from(
        document.querySelectorAll(
          '.org-card--department'
        )
      );

    const generationPoints = [
      getPoint(
        generation24,
        'bottom'
      ),
      getPoint(
        generation25,
        'bottom'
      )
    ];

    const departmentPoints =
      departmentCards.map(
        card =>
          getPoint(
            card,
            'top'
          )
      );

    const ns =
      'http://www.w3.org/2000/svg';

    const allGenerationX =
      generationPoints.map(
        p => p.x
      );

    const allDepartmentX =
      departmentPoints.map(
        p => p.x
      );

    const minX =
      Math.min(
        ...allGenerationX,
        ...allDepartmentX
      );

    const maxX =
      Math.max(
        ...allGenerationX,
        ...allDepartmentX
      );

    const generationBusY =
      Math.max(
        ...generationPoints.map(
          p => p.y
        )
      ) + 30;

    const departmentBusY =
      Math.min(
        ...departmentPoints.map(
          p => p.y
        )
      ) - 30;

     

    generationPoints.forEach(
      point => {

        const path =
          document.createElementNS(
            ns,
            'path'
          );

        path.setAttribute(
          'd',
          `
          M ${point.x} ${point.y}
          L ${point.x} ${generationBusY}
          `
        );

        svg.appendChild(path);

      }
    );

     

    const generationBus =
      document.createElementNS(
        ns,
        'path'
      );

    generationBus.setAttribute(
      'd',
      `
      M ${minX} ${generationBusY}
      L ${maxX} ${generationBusY}
      `
    );

    generationBus.setAttribute(
      'class',
      'connection-main'
    );

    svg.appendChild(
      generationBus
    );

     

    const centralX =
      (minX + maxX) / 2;

    const centralPath =
      document.createElementNS(
        ns,
        'path'
      );

    centralPath.setAttribute(
      'd',
      `
      M ${centralX} ${generationBusY}
      L ${centralX} ${departmentBusY}
      `
    );

    centralPath.setAttribute(
      'class',
      'connection-main'
    );

    svg.appendChild(
      centralPath
    );

     

    const departmentBus =
      document.createElementNS(
        ns,
        'path'
      );

    departmentBus.setAttribute(
      'd',
      `
      M ${minX} ${departmentBusY}
      L ${maxX} ${departmentBusY}
      `
    );

    departmentBus.setAttribute(
      'class',
      'connection-main'
    );

    svg.appendChild(
      departmentBus
    );

     

    departmentPoints.forEach(
      point => {

        const path =
          document.createElementNS(
            ns,
            'path'
          );

        path.setAttribute(
          'd',
          `
          M ${point.x} ${departmentBusY}
          L ${point.x} ${point.y}
          `
        );

        svg.appendChild(
          path
        );

      }
    );

     

    const columns =
      Array.from(
        document.querySelectorAll(
          '.department-column'
        )
      );

    columns.forEach(
      column => {

        const department =
          column.querySelector(
            '.org-card--department'
          );

        const divisions =
          Array.from(
            column.querySelectorAll(
              '.org-card--division'
            )
          );

        if (
          !department ||
          !divisions.length
        ) {
          return;
        }

        createBus(
          department,
          divisions
        );

      }
    );

     

    const legislative =
      getElement(
        '[data-person="legislative"]'
      );

    const legislativeVice1 =
      getElement(
        '[data-person="legislativeVice1"]'
      );

    const legislativeVice2 =
      getElement(
        '[data-person="legislativeVice2"]'
      );

    const commission1 =
      getElement(
        '[data-person="commission1"]'
      );

    const commission2 =
      getElement(
        '[data-person="commission2"]'
      );

    const commission3 =
      getElement(
        '[data-person="commission3"]'
      );

    createBus(
      legislative,
      [
        legislativeVice1,
        legislativeVice2
      ]
    );

    createBus(
      legislativeVice1,
      [
        commission1
      ]
    );

    createBus(
      legislativeVice2,
      [
        commission2,
        commission3
      ]
    );

  }

   

  const people = {

    chairman: {
      name: 'Debi Gideon Pandiangan',
      role: 'Ketua HMTP',
      nim: '224422027',
      photo: 'kabinet/ketua himpunan.webp',
      instagram: '@dionpndgn_',
      instagramUrl: 'https://instagram.com/dionpndgn_',
      description:
        'Ketua Himpunan Mahasiswa Teknik Perancangan.'
    },

    vice1: {
      name: 'Rafi Altarizky Athallah',
      role: 'Wakil Ketua HMTP I',
      nim: '224321041',
      photo: 'kabinet/wakil ketua himpunan 1.webp',
      instagram: '@rafialtar_',
      instagramUrl: 'https://instagram.com/rafialtar_',
      description:
        'Wakil Ketua I Himpunan Mahasiswa Teknik Perancangan.'
    },

    vice2: {
      name: 'Muhammad Ajran Karim',
      role: 'Wakil Ketua HMTP II',
      nim: '225422014',
      photo: 'kabinet/wakil ketua himpunan 2.webp',
      instagram: '@ajran.karim',
      instagramUrl: 'https://instagram.com/ajran.karim',
      description:
        'Wakil Ketua II Himpunan Mahasiswa Teknik Perancangan.'
    },

    secretary1: {
      name: 'Mulyana',
      role: 'Sekretaris I',
      nim: '224321038',
      photo: 'kabinet/sekre 1.webp',
      instagram: '-',
      instagramUrl: '#',
      description:
        'Sekretaris I HMTP.'
    },

    secretary2: {
      name: 'Faris Faturrahman Irawan',
      role: 'Sekretaris II',
      nim: '224321003',
      photo: 'kabinet/sekre 2.webp',
      instagram: '@farisfaturrahmani',
      instagramUrl: 'https://instagram.com/farisfaturrahmani',
      description:
        'Sekretaris II HMTP.'
    },

    treasurer1: {
      name: 'Muhammad Dzikri Al Waritsi',
      role: 'Bendahara I',
      nim: '224321034',
      photo: 'kabinet/bendahara 1.webp',
      instagram: '@dzikri.10',
      instagramUrl: 'https://instagram.com/dzikri.10',
      description:
        'Bendahara I HMTP.'
    },

    treasurer2: {
      name: 'Serla Marviyah',
      role: 'Bendahara II',
      nim: '224421046',
      photo: 'kabinet/bendahara 2.webp',
      instagram: '@serlamvy',
      instagramUrl: 'https://instagram.com/serlamvy',
      description:
        'Bendahara II HMTP.'
    },

    legislative: {
      name: 'Muhammad Satria Tri Lesmana',
      role: 'Ketua Badan Legislatif',
      nim: '224421018',
      photo: 'kabinet/kepala legislatif.webp',
      instagram: '-',
      instagramUrl: '#',
      description:
        'Ketua Badan Legislatif HMTP.'
    },

    legislativeVice1: {
      name: 'Salwa Ayu Wandari',
      role: 'Wakil Ketua I Legislatif',
      nim: '224321044',
      photo: 'kabinet/wakil 1 legislatif .webp',
      instagram: '@slwa27',
      instagramUrl: 'https://instagram.com/slwa27',
      description:
        'Wakil Ketua I Badan Legislatif HMTP.'
    },

    legislativeVice2: {
      name: 'Nadya Rasyida',
      role: 'Wakil Ketua II Legislatif',
      nim: '225421037',
      photo: 'kabinet/wakil 2 legislatif.webp',
      instagram: '@erstrasyida_',
      instagramUrl: 'https://instagram.com/erstrasyida_',
      description:
        'Wakil Ketua II Badan Legislatif HMTP.'
    },

    commission1: {
      name: "Muhammad Syaikhu Mumtaz'Ilmi",
      role: 'Komisi I – Hukum',
      nim: '224422037',
      photo: 'kabinet/ketua komisi 1.webp',
      instagram: '@ciiiruno',
      instagramUrl: 'https://instagram.com/ciiiruno',
      description:
        'Ketua Komisi I Hukum Badan Legislatif HMTP.'
    },

    commission2: {
      name: 'Rian Mulyana',
      role: 'Komisi II – Pengawasan',
      nim: '224422021',
      photo: 'kabinet/ketua komisi 2.webp',
      instagram: '@rianmlyna',
      instagramUrl: 'https://instagram.com/rianmlyna',
      description:
        'Komisi II Pengawasan Badan Legislatif HMTP.'
    },

    commission3: {
      name: 'Fadli Martin Tresnanda',
      role: 'Komisi III – Aspirasi & Advokasi',
      nim: '224421030',
      photo: 'kabinet/ketua komisi 3.webp',
      instagram: '@fadlimartint',
      instagramUrl: 'https://instagram.com/fadlimartint',
      description:
        'Komisi III Aspirasi & Advokasi Badan Legislatif HMTP.'
    },

    kaderisasi: {
      name: 'Amr Nasrullah Robbani',
      role: 'Kepala Dept. Kaderisasi',
      nim: '224421027',
      photo: 'kabinet/kepala departemen kaderisasi.webp',
      instagram: '@mer.mfz',
      instagramUrl: 'https://instagram.com/mer.mfz',
      description:
        'Kepala Departemen Kaderisasi HMTP.'
    },

    viceKaderisasi: {
      name: 'Angga Ardhian D. Putera',
      role: 'Wakil Kepala Dept. Kaderisasi',
      nim: '224321024',
      photo: 'kabinet/wakil kepala departemen kaderisasi copy.webp',
      instagram: '@angg.ardh',
      instagramUrl: 'https://instagram.com/angg.ardh',
      description:
        'Wakil Kepala Departemen Kaderisasi HMTP.'
    },

    internal: {
      name: 'Muhammad Difaush Sidqi',
      role: 'Kepala Dept. Internal',
      nim: '224321011',
      photo: 'kabinet/kepala departemen internal.webp',
      instagram: '@adifaush',
      instagramUrl: 'https://instagram.com/adifaush',
      description:
        'Kepala Departemen Internal HMTP.'
    },

    viceInternal: {
      name: 'Greenmaldy Sean Caldhera',
      role: 'Wakil Kepala Dept. Internal',
      nim: '224421032',
      photo: 'kabinet/wakil kepala departemen internal.webp',
      instagram: '@seyancaldhr',
      instagramUrl: 'https://instagram.com/seyancaldhr',
      description:
        'Wakil Kepala Departemen Internal HMTP.'
    },

    academic: {
      name: 'Trya Oktaviani Putri',
      role: 'Kepala Divisi Akademik',
      nim: '224321020',
      photo: 'kabinet/kepala akademik.webp',
      instagram: '@tryaaock',
      instagramUrl: 'https://instagram.com/tryaaock',
      description:
        'Kepala Divisi Akademik Departemen Internal HMTP.'
    },

    family: {
      name: 'Zalfaa Safaa Halimatu Maulana',
      role: 'Kepala Divisi Kekeluargaan',
      nim: '224421048',
      photo: 'kabinet/kepala kekeluargaan.webp',
      instagram: '@zalfaa.safaa',
      instagramUrl: 'https://instagram.com/zalfaa.safaa',
      description:
        'Kepala Divisi Kekeluargaan Departemen Internal HMTP.'
    },

    external: {
      name: 'Mochamad Rahman Nawawi',
      role: 'Kepala Dept. Eksternal',
      nim: '224422009',
      photo: 'kabinet/kepala departemen eksternal.webp',
      instagram: '@mochrahmann',
      instagramUrl: 'https://instagram.com/mochrahmann',
      description:
        'Kepala Departemen Eksternal HMTP.'
    },

    viceExternal: {
      name: 'Prasetyo Nurdianto',
      role: 'Wakil Kepala Dept. Eksternal',
      nim: '224321040',
      photo: 'kabinet/wakil kepala departemen eksternal.webp',
      instagram: '@big_46_',
      instagramUrl: 'https://instagram.com/big_46_',
      description:
        'Wakil Kepala Departemen Eksternal HMTP.'
    },

    foreignRelations: {
      name: 'Devan Firmansyah',
      role: 'Kepala Divisi Hubungan Luar',
      nim: '224422004',
      photo: 'kabinet/kepala hub luar.webp',
      instagram: '@devanfh_',
      instagramUrl: 'https://instagram.com/devanfh_',
      description:
        'Kepala Divisi Hubungan Luar Departemen Eksternal HMTP.'
    },

    internalRelations: {
      name: 'Femi Hidayat',
      role: 'Kepala Divisi Hubungan Dalam',
      nim: '224421010',
      photo: 'kabinet/kepala hub dalam.webp',
      instagram: '@pema_3327',
      instagramUrl: 'https://instagram.com/pema_3327',
      description:
        'Kepala Divisi Hubungan Dalam Departemen Eksternal HMTP.'
    },

    mediaCenter: {
      name: 'Agung Darmawan',
      role: 'Kepala Dept. Media Center',
      nim: '224421026',
      photo: 'kabinet/kepala departemen medcen.webp',
      instagram: '@agungg.darmawannn',
      instagramUrl: 'https://instagram.com/agungg.darmawannn',
      description:
        'Kepala Departemen Media Center HMTP.'
    },

    viceMediaCenter: {
      name: 'Zahra Afifah Ramadhani',
      role: 'Wakil Kepala Dept. Media Center',
      nim: '224321047',
      photo: 'kabinet/wakil kepala departemen medcen.webp',
      instagram: '@arhazz._',
      instagramUrl: 'https://instagram.com/arhazz._',
      description:
        'Wakil Kepala Departemen Media Center HMTP.'
    },

    design: {
      name: 'Muhammad Faiz Firdaus',
      role: 'Kepala Divisi Design',
      nim: '224422035',
      photo: 'kabinet/kepala design.webp',
      instagram: '@faiz_qoiz',
      instagramUrl: 'https://instagram.com/faiz_qoiz',
      description:
        'Kepala Divisi Design Departemen Media Center HMTP.'
    },

    media: {
      name: 'Raisza Yasykur Herlambang',
      role: 'Kepala Divisi Media',
      nim: '224421020',
      photo: 'kabinet/kepala media.webp',
      instagram: '@raiszayh',
      instagramUrl: 'https://instagram.com/raiszayh',
      description:
        'Kepala Divisi Media Departemen Media Center HMTP.'
    },

    entrepreneurship: {
      name: 'Faqih Ar Rosyid',
      role: 'Kepala Divisi KWU',
      nim: '224421031',
      photo: 'kabinet/kepala KWU.webp',
      instagram: '@masfaarosy',
      instagramUrl: 'https://instagram.com/masfaarosy',
      description:
        'Kepala Divisi Kewirausahaan Departemen Media Center HMTP.'
    },

    generation24: {
      name: 'Naufal Hakim',
      role: 'Ketua Angkatan 2024',
      nim: '224421019',
      photo: 'kabinet/ketua angkatan 2024.webp',
      instagram: '@nopalle.e',
      instagramUrl: 'https://instagram.com/nopalle.e',
      description:
        'Ketua Angkatan 2024 HMTP.'
    },

    generation25: {
      name: 'Zahy Muhammad Hasby',
      role: 'Ketua Angkatan 2025',
      nim: '225421046',
      photo: 'kabinet/ketua angkatan 2025.webp',
      instagram: '@jeerrrrrryyyyyyy',
      instagramUrl: 'https://instagram.com/jeerrrrrryyyyyyy',
      description:
        'Ketua Angkatan 2025 HMTP.'
    }

  };

   

  const modalPhoto =
    document.getElementById(
      'personModalPhoto'
    );

  const modalRole =
    document.getElementById(
      'personModalRole'
    );

  const modalName =
    document.getElementById(
      'personModalName'
    );

  const modalNim =
    document.getElementById(
      'personModalNim'
    );

  const modalInstagram =
    document.getElementById(
      'personModalInstagram'
    );

  const modalDescription =
    document.getElementById(
      'personModalDescription'
    );

  function openPerson(personId) {

    if (!modal) {
      return;
    }

    const person =
      people[personId];

     

    if (person) {

      if (person.photo) {
        modalPhoto.src   = person.photo;
        modalPhoto.alt   = person.name || '';
        modalPhoto.style.display = '';
        if (modalPhoto.parentElement) {
          modalPhoto.parentElement.removeAttribute('data-initials');
          modalPhoto.parentElement.classList.remove('org-card__photo--initials');
        }
      } else {
        modalPhoto.src   = '';
        modalPhoto.alt   = '';
        modalPhoto.style.display = 'none';
        if (modalPhoto.parentElement) {
          const initials = (person.name || '?')
            .split(' ')
            .slice(0, 2)
            .map(function(w){ return w[0]; })
            .join('');
          modalPhoto.parentElement.setAttribute('data-initials', initials);
          modalPhoto.parentElement.classList.add('org-card__photo--initials');
        }
      }

      modalRole.textContent =
        person.role || '';

      modalName.textContent =
        person.name || '';

      modalNim.textContent =
        person.nim || '-';

      modalInstagram.textContent =
        person.instagram || '@username';

      modalInstagram.href =
        person.instagramUrl || '#';

      modalDescription.textContent =
        person.description || '';

    }

    modal.classList.add(
      'is-open'
    );

    modal.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow =
      'hidden';

  }

  function closePerson() {

    if (!modal) {
      return;
    }

    modal.classList.remove(
      'is-open'
    );

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow =
      '';

  }

   

  const cards =
    document.querySelectorAll(
      '[data-person]'
    );

  cards.forEach(
    card => {

      card.addEventListener(
        'click',
        function () {

          const personId =
            this.dataset.person;

          openPerson(
            personId
          );

        }
      );

    }
  );

   

  document
    .querySelectorAll(
      '[data-close-modal]'
    )
    .forEach(
      element => {

        element.addEventListener(
          'click',
          closePerson
        );

      }
    );

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape'
      ) {

        closePerson();

      }

    }
  );

   

  let resizeTimer;

  function redraw() {

    requestAnimationFrame(
      function () {

        drawConnections();

      }
    );

  }

  window.addEventListener(
    'resize',
    function () {

      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(
          redraw,
          100
        );

    }
  );

   

  window.addEventListener(
    'load',
    redraw
  );

  redraw();

})();

 
(function () {
  'use strict';

   
  var STORAGE_KEY   = 'hmtp_berita';
  var CARD_W_DESK   = 248;
  var CARD_W_MOB    = 200;
  var CARD_GAP      = 16;

   
  var data         = [];
  var currentIdx   = 0;
  var isDragging   = false;
  var dragStartX   = 0;
  var dragMoved    = 0;
  var editingId    = null;

   
  var track        = document.getElementById('beritaTrack');
  var trackOuter   = document.getElementById('beritaTrackOuter');
  var prevBtn      = document.getElementById('beritaPrev');
  var nextBtn      = document.getElementById('beritaNext');
  var dotsWrap     = document.getElementById('beritaDots');
  var addBtn       = document.getElementById('beritaAddBtn');
  var header       = document.getElementById('beritaHeader');
  var modal        = document.getElementById('beritaModal');
  var modalClose   = document.getElementById('beritaModalClose');
  var modalBack    = document.getElementById('beritaModalBackdrop');
  var cancelBtn    = document.getElementById('beritaCancelBtn');
  var modalHeading = document.getElementById('beritaModalHeading');
  var form         = document.getElementById('beritaForm');
  var inpTitle        = document.getElementById('beritaInputTitle');
  var inpLink         = document.getElementById('beritaInputLink');
   
  var inpImageFile    = document.getElementById('beritaInputImageFile');
  var beritaUploadArea  = document.getElementById('beritaUploadArea');
  var beritaPreviewImg  = document.getElementById('beritaPreviewImg');
  var beritaUploadInner = document.getElementById('beritaUploadInner');
  var beritaImageSrc    = null;  

  if (!track) return;  

   
  function uid() {
    return 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

  function cardW() {
    return window.innerWidth <= 768 ? CARD_W_MOB : CARD_W_DESK;
  }

  function visibleCount() {
    var outer = trackOuter.offsetWidth;
    return Math.max(1, Math.floor((outer + CARD_GAP) / (cardW() + CARD_GAP)));
  }

  function maxIndex() {
    return Math.max(0, data.length - visibleCount());
  }

  function formatDate(str) {
    try {
      var d = new Date(str);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return str; }
  }

   
  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { data = JSON.parse(raw); }
    } catch (e) { data = []; }
    if (!data || !data.length) { data = defaultData(); }
  }

  function saveData() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
     
    if (window.hmtpGH && document.body.classList.contains('dev-mode')) {
      window.hmtpGH.pushBerita(data);
    }
  }

  function defaultData() {
    var today = new Date().toISOString().slice(0, 10);
    return [
      { id: uid(), title: 'Selamat Datang di HMTP', link: '#', image: '', date: today },
      { id: uid(), title: 'Pengumuman Kegiatan Semester Ganjil 2026/2027', link: '#', image: '', date: today },
      { id: uid(), title: 'Rekrutmen Anggota Baru HMTP — Buka Pendaftaran', link: '#', image: '', date: today },
      { id: uid(), title: 'Hasil Lomba Desain Manufaktur Tingkat Nasional', link: '#', image: '', date: today },
      { id: uid(), title: 'Workshop CAD/CAM Gratis untuk Mahasiswa Aktif', link: '#', image: '', date: today },
    ];
  }

   
  function render() {
    track.innerHTML  = '';
    dotsWrap.innerHTML = '';

    var cw = cardW();

    data.forEach(function (item, i) {

       
       
      var card = document.createElement('div');
      card.className = 'berita-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', item.title);
      card.style.setProperty('--berita-card-w', cw + 'px');

       
      var a = document.createElement('a');
      a.className = 'berita-card__inner';
      a.href      = item.link || '#';
      a.target    = (item.link && item.link !== '#') ? '_blank' : '_self';
      a.rel       = 'noopener noreferrer';

       
      var imgWrap = document.createElement('div');
      imgWrap.className = 'berita-card__img';

      if (item.image) {
        var img   = document.createElement('img');
        img.src     = item.image;
        img.alt     = item.title;
        img.loading = 'lazy';
        imgWrap.appendChild(img);
      } else {
        var ph = document.createElement('div');
        ph.className = 'berita-card__img-ph';
        ph.innerHTML =
          '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#bbb" stroke-width="1.4">' +
          '<rect x="3" y="7" width="34" height="26" rx="2"/>' +
          '<circle cx="13" cy="16" r="3.5"/>' +
          '<path d="M3 26l10-9 7 7 5-5 12 13"/>' +
          '</svg>';
        imgWrap.appendChild(ph);
      }

       
      if (item.date) {
        var badge = document.createElement('span');
        badge.className   = 'berita-card__date';
        badge.textContent = formatDate(item.date);
        imgWrap.appendChild(badge);
      }

       
      var devActs = document.createElement('div');
      devActs.className = 'berita-card__dev-acts';
      devActs.addEventListener('click', function (e) { e.preventDefault(); });

      var editB = document.createElement('button');
      editB.className = 'berita-card__act berita-card__act--edit';
      editB.type      = 'button';
      editB.title     = 'Edit';
      editB.innerHTML = '&#9998;';
      editB.addEventListener('click', (function (id) {
        return function (e) { e.preventDefault(); e.stopPropagation(); openModal(id); };
      }(item.id)));

      var delB = document.createElement('button');
      delB.className = 'berita-card__act berita-card__act--del';
      delB.type      = 'button';
      delB.title     = 'Hapus';
      delB.textContent = '×';
      delB.addEventListener('click', (function (id) {
        return function (e) { e.preventDefault(); e.stopPropagation(); deleteItem(id); };
      }(item.id)));

      devActs.appendChild(editB);
      devActs.appendChild(delB);
       

       
      var body = document.createElement('div');
      body.className = 'berita-card__body';

      var src = document.createElement('span');
      src.className   = 'berita-card__source';
      src.textContent = 'HMTP';

      var ttl = document.createElement('h3');
      ttl.className   = 'berita-card__title';
      ttl.textContent = item.title;

      var rm = document.createElement('span');
      rm.className = 'berita-card__readmore';
      rm.innerHTML =
        '<span>Baca selengkapnya</span>' +
        '<svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
        '<path d="M1 4.5h7M5.5 1.5l3 3-3 3"/>' +
        '</svg>';

      body.appendChild(src);
      body.appendChild(ttl);
      body.appendChild(rm);

      a.appendChild(imgWrap);
      a.appendChild(body);
      card.appendChild(a);
      card.appendChild(devActs);  
      track.appendChild(card);

       
      (function (el, delay) {
        setTimeout(function () {
          requestAnimationFrame(function () { el.classList.add('b-in'); });
        }, delay);
      }(card, i * 55 + 60));

       
      var dot = document.createElement('button');
      dot.className = 'berita__dot' + (i === currentIdx ? ' is-active' : '');
      dot.type      = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Berita ' + (i + 1));
      dot.addEventListener('click', (function (idx) {
        return function () { goTo(idx); };
      }(i)));
      dotsWrap.appendChild(dot);
    });

    updatePosition(false);
    updateNav();
    updateDots();
  }

   
  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, maxIndex()));
    updatePosition(true);
    updateNav();
    updateDots();
  }

  function updatePosition(animate) {
    var offset = currentIdx * (cardW() + CARD_GAP);
    if (!animate) {
      track.style.transition = 'none';
      track.style.transform  = 'translateX(-' + offset + 'px)';
      requestAnimationFrame(function () { track.style.transition = ''; });
    } else {
      track.style.transform = 'translateX(-' + offset + 'px)';
    }
  }

  function updateNav() {
    prevBtn.disabled = (currentIdx <= 0);
    nextBtn.disabled = (currentIdx >= maxIndex());
  }

  function updateDots() {
    var dots = dotsWrap.querySelectorAll('.berita__dot');
    var mx   = maxIndex();
    dots.forEach(function (d, i) {
      d.classList.toggle(
        'is-active',
        i === currentIdx || (currentIdx >= mx && i === dots.length - 1)
      );
    });
  }

   
  function resetBeritaUpload() {
    if (beritaPreviewImg)  { beritaPreviewImg.style.display = 'none'; beritaPreviewImg.src = ''; }
    if (beritaUploadInner)   beritaUploadInner.style.display = '';
    if (inpImageFile)        inpImageFile.value = '';
    beritaImageSrc = null;
  }

  function handleBeritaFile(file) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      beritaImageSrc = ev.target.result;
      if (beritaPreviewImg) { beritaPreviewImg.src = beritaImageSrc; beritaPreviewImg.style.display = 'block'; }
      if (beritaUploadInner) beritaUploadInner.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

   
  function openModal(id) {
    editingId = id || null;
    beritaImageSrc = null;
    var item  = id ? data.find(function (b) { return b.id === id; }) : null;

    modalHeading.textContent = id ? 'Edit Berita' : 'Tambah Berita';
    inpTitle.value = item ? item.title : '';
    inpLink.value  = item ? item.link  : '';

     
    if (item && item.image) {
      beritaImageSrc = item.image;
      if (beritaPreviewImg) { beritaPreviewImg.src = item.image; beritaPreviewImg.style.display = 'block'; }
      if (beritaUploadInner) beritaUploadInner.style.display = 'none';
    } else {
      resetBeritaUpload();
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function () { inpTitle.focus(); }, 80);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    editingId = null;
    form.reset();
    resetBeritaUpload();
  }

  function handleSubmit(e) {
    e.preventDefault();
    var title = inpTitle.value.trim();
    var link  = inpLink.value.trim();
    var image = beritaImageSrc || '';    
    if (!title || !link) return;

    if (editingId) {
      var item = data.find(function (b) { return b.id === editingId; });
      if (item) { item.title = title; item.link = link; item.image = image; }
    } else {
      data.push({
        id:    uid(),
        title: title,
        link:  link,
        image: image,
        date:  new Date().toISOString().slice(0, 10)
      });
    }

    saveData();
    closeModal();
    render();
  }

  function deleteItem(id) {
    if (!confirm('Hapus berita ini?')) return;
    data = data.filter(function (b) { return b.id !== id; });
    currentIdx = Math.max(0, Math.min(currentIdx, maxIndex()));
    saveData();
    render();
  }

   
  function initDrag() {
    trackOuter.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('button, .berita-card__dev-acts')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragMoved  = 0;
      track.style.transition = 'none';
       
    });

    document.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      dragMoved    = e.clientX - dragStartX;
      var base     = currentIdx * (cardW() + CARD_GAP);
      track.style.transform = 'translateX(-' + (base - dragMoved) + 'px)';
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging             = false;
      track.style.transition = '';
      var threshold = cardW() * 0.22;
      if (Math.abs(dragMoved) > threshold) {
        goTo(dragMoved < 0 ? currentIdx + 1 : currentIdx - 1);
      } else {
        updatePosition(true);
      }
    }

    document.addEventListener('pointerup',     endDrag);
    document.addEventListener('pointercancel', function () {
      isDragging = false;
      track.style.transition = '';
      updatePosition(true);
    });

     
    trackOuter.addEventListener('click', function (e) {
      if (Math.abs(dragMoved) > 5) e.preventDefault();
    });
  }

   
  function initObserver() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          header.classList.add('b-in');
          io.unobserve(header);
        }
      });
    }, { threshold: 0.25 });
    io.observe(header);
  }

   
  function init() {
    loadData();
    render();
    initDrag();
    initObserver();

    prevBtn.addEventListener('click', function () { goTo(currentIdx - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIdx + 1); });

    addBtn.addEventListener('click',      function () { openModal(null); });
    modalClose.addEventListener('click',  closeModal);
    modalBack.addEventListener('click',   closeModal);
    cancelBtn.addEventListener('click',   closeModal);
    form.addEventListener('submit',       handleSubmit);

     
    if (beritaUploadArea && inpImageFile) {
      beritaUploadArea.addEventListener('click', function (e) {
        if (e.target !== beritaPreviewImg) inpImageFile.click();
      });
      beritaUploadArea.addEventListener('dragover', function (e) {
        e.preventDefault(); beritaUploadArea.classList.add('drag-over');
      });
      beritaUploadArea.addEventListener('dragleave', function () {
        beritaUploadArea.classList.remove('drag-over');
      });
      beritaUploadArea.addEventListener('drop', function (e) {
        e.preventDefault(); beritaUploadArea.classList.remove('drag-over');
        var file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleBeritaFile(file);
      });
      inpImageFile.addEventListener('change', function () {
        if (inpImageFile.files[0]) handleBeritaFile(inpImageFile.files[0]);
      });
    }
    if (beritaPreviewImg) {
      beritaPreviewImg.addEventListener('click', function (e) {
        e.stopPropagation(); resetBeritaUpload();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
    });

    window.addEventListener('resize', function () {
      updatePosition(false);
      updateNav();
      updateDots();
    });
  }

  init();

}());

 

(function initGaleri() {
  'use strict';

   
  var STORAGE_KEY  = 'hmtp_galeri';
  var CARD_W       = 224;    
  var CARD_MARGIN  = 10;     
  var MIN_ITEMS    = 5;      

   
  var track1        = document.getElementById('galeriTrack1');
  var track2        = document.getElementById('galeriTrack2');
  var row1El        = document.getElementById('galeriRow1');
  var row2El        = document.getElementById('galeriRow2');
  var emptyEl       = document.getElementById('galeriEmpty');
  var addBtn        = document.getElementById('galeriAddBtn');

   
  var lightbox      = document.getElementById('galeriLightbox');
  var lightboxBack  = document.getElementById('galeriLightboxBackdrop');
  var lightboxClose = document.getElementById('galeriLightboxClose');
  var lightboxImg   = document.getElementById('galeriLightboxImg');
  var lightboxCap   = document.getElementById('galeriLightboxCaption');

   
  var modal         = document.getElementById('galeriModal');
  var modalBack     = document.getElementById('galeriModalBackdrop');
  var modalClose    = document.getElementById('galeriModalClose');
  var cancelBtn     = document.getElementById('galeriCancelBtn');
  var form          = document.getElementById('galeriForm');
  var inputFile     = document.getElementById('galeriInputFile');
  var uploadArea    = document.getElementById('galeriUploadArea');
  var uploadPh      = document.getElementById('galeriUploadPh');
  var previewImg    = document.getElementById('galeriPreviewImg');
  var inputUrl      = document.getElementById('galeriInputUrl');
  var inputCaption  = document.getElementById('galeriInputCaption');

   
  if (!track1 || !track2 || !lightbox || !modal) return;

   
  var data         = [];
  var pendingBase64 = null;

   
  function uid() {
    return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

   
  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { data = JSON.parse(raw); }
    } catch (e) { data = []; }
    if (!Array.isArray(data)) { data = []; }
  }

  function saveData() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
     
    if (window.hmtpGH && document.body.classList.contains('dev-mode')) {
      window.hmtpGH.pushGaleri(data).then(function (prepared) {
        if (prepared) { data = prepared; }
      });
    }
  }

   
  function render() {
    track1.innerHTML = '';
    track2.innerHTML = '';

    var hasPhotos = data.length > 0;

     
    if (emptyEl) {
      emptyEl.setAttribute('aria-hidden', hasPhotos ? 'true' : 'false');
    }
    if (row1El) row1El.setAttribute('aria-hidden', hasPhotos ? 'false' : 'true');
    if (row2El) row2El.setAttribute('aria-hidden', hasPhotos ? 'false' : 'true');

    if (!hasPhotos) return;

     
    var photos1 = data.filter(function(_, i) { return i % 2 === 0; });
    var photos2 = data.filter(function(_, i) { return i % 2 !== 0; });

     
    if (!photos2.length) { photos2 = photos1.slice(); }
    if (!photos1.length) { photos1 = photos2.slice(); }

     
    photos1 = padToMin(photos1);
    photos2 = padToMin(photos2);

     
    buildTrack(track1, photos1);
    buildTrack(track2, photos2);
  }

   
  function padToMin(arr) {
    while (arr.length < MIN_ITEMS) {
      arr = arr.concat(arr);
    }
    return arr;
  }

   
  function buildTrack(trackEl, photos) {
     
    var all = photos.concat(photos);
    all.forEach(function(item) {
      trackEl.appendChild(makeCard(item));
    });
  }

   
  function makeCard(item) {
    var div = document.createElement('div');
    div.className = 'galeri-photo';

     
    div.setAttribute('draggable', 'false');

     
    if (item.src) {
      var img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.caption || 'Foto kegiatan HMTP';
      img.loading = 'lazy';
      img.setAttribute('draggable', 'false');
      div.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'galeri-photo__ph';
      ph.innerHTML =
        '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">' +
        '<rect x="2" y="6" width="30" height="22" rx="3"/>' +
        '<circle cx="11" cy="13" r="3"/>' +
        '<path d="M2 22l9-8 6 6 4-4 13 12" stroke-linecap="round"/>' +
        '</svg>';
      div.appendChild(ph);
    }

     
    if (item.caption) {
      var cap = document.createElement('span');
      cap.className   = 'galeri-photo__caption';
      cap.textContent = item.caption;
      div.appendChild(cap);
    }

     
    div.addEventListener('click', function(e) {
      if (e.target.closest('.galeri-photo__dev-acts')) return;
      if (item.src) openLightbox(item.src, item.caption || '');
    });

     
    var devActs = document.createElement('div');
    devActs.className = 'galeri-photo__dev-acts';
    devActs.addEventListener('click', function(e) { e.stopPropagation(); });

    var delBtn = document.createElement('button');
    delBtn.className   = 'galeri-photo__act galeri-photo__act--del';
    delBtn.type        = 'button';
    delBtn.title       = 'Hapus foto ini';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', (function(id) {
      return function(e) {
        e.stopPropagation();
        deletePhoto(id);
      };
    }(item.id)));

    devActs.appendChild(delBtn);
    div.appendChild(devActs);

    return div;
  }

   
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    if (lightboxCap) lightboxCap.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
     
    setTimeout(function() {
      lightboxImg.src = '';
      if (lightboxCap) lightboxCap.textContent = '';
    }, 380);
  }

  if (lightboxBack)  lightboxBack.addEventListener('click',  closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

   
  function openModal() {
    pendingBase64 = null;
    form.reset();
     
    previewImg.src         = '';
    previewImg.style.display = 'none';
    uploadPh.style.display = 'flex';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
    setTimeout(function() { if (inputCaption) inputCaption.focus(); }, 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    pendingBase64 = null;
  }

   
  uploadArea.addEventListener('click', function(e) {
     
    if (e.target === inputFile) return;
    inputFile.click();
  });

  inputFile.addEventListener('change', function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar (JPG, PNG, WEBP, dll.)');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(evt) {
      pendingBase64         = evt.target.result;
      previewImg.src        = pendingBase64;
      previewImg.style.display = 'block';
      uploadPh.style.display   = 'none';
       
      if (inputUrl) inputUrl.value = '';
    };
    reader.readAsDataURL(file);
  });

   
  if (inputUrl) {
    inputUrl.addEventListener('input', function() {
      var val = inputUrl.value.trim();
      if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
        pendingBase64           = null;
        previewImg.src          = val;
        previewImg.style.display = 'block';
        uploadPh.style.display   = 'none';
      } else if (!val) {
        previewImg.src           = '';
        previewImg.style.display = 'none';
        uploadPh.style.display   = 'flex';
      }
    });
  }

   
  function handleSubmit(e) {
    e.preventDefault();
    var src     = pendingBase64 || (inputUrl ? inputUrl.value.trim() : '');
    var caption = inputCaption ? inputCaption.value.trim() : '';

    if (!src) {
      alert('Pilih foto dari perangkat atau masukkan URL gambar terlebih dahulu.');
      return;
    }

    data.push({ id: uid(), src: src, caption: caption });
    saveData();
    closeModal();
    render();
  }

  if (addBtn)   addBtn.addEventListener('click',    openModal);
  if (modalBack) modalBack.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (cancelBtn)  cancelBtn.addEventListener('click',  closeModal);
  if (form)       form.addEventListener('submit', handleSubmit);

   
  function deletePhoto(id) {
    if (!confirm('Hapus foto ini dari galeri?')) return;
    data = data.filter(function(p) { return p.id !== id; });
    saveData();
    render();
  }

   
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('is-open')) closeLightbox();
      else if (modal.classList.contains('is-open')) closeModal();
    }
  });

   
  loadData();
  render();

}());

 

(function initKontakReveal() {

  if (!('IntersectionObserver' in window)) {
     
    var fallbackEls = document.querySelectorAll(
      '.kontak__left, .kontak-card'
    );
    fallbackEls.forEach(function(el) {
      el.classList.add('is-visible');
    });
    return;
  }

   
  var leftEl = document.getElementById('kontakLeft');

  if (leftEl) {
    var leftObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          leftObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    leftObs.observe(leftEl);
  }

   
  var cards = document.querySelectorAll('.kontak-card');

  if (cards.length) {
    var cardObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx   = parseInt(entry.target.dataset.kontakIdx || 0);
          var delay = idx * 120;  

          setTimeout(function() {
            entry.target.classList.add('is-visible');
          }, delay);

          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function(card, i) {
      card.dataset.kontakIdx = i;
      cardObs.observe(card);
    });
  }

})();

 

(function initProdiOverlay() {

   
  const PRODI = {
    dea: {
      code:  'DEA',
      num:   '01',
      title: 'Teknologi Perancangan Perkakas Presisi',
      desc:  'Berfokus pada analisis, perencanaan, dan perancangan konstruksi perkakas presisi dengan penerapan metode dan prosedur manufaktur modern. Mahasiswa dibekali keahlian dalam desain press tool, injection mold, jigs & fixtures, serta kemampuan membaca dan membuat gambar teknik berstandar industri.',
      focus: [
        { label: 'Press Tool & Die',   desc: 'Perancangan alat tekan untuk sheet metal' },
        { label: 'Injection Mold',     desc: 'Cetakan injeksi plastik presisi tinggi' },
        { label: 'Jigs & Fixtures',    desc: 'Alat bantu dan pemegang benda kerja' },
        { label: 'CAD / CAM',          desc: 'Desain dan manufaktur berbantuan komputer' },
      ],
      career: [
        'Tooling & Die Design Engineer',
        'CAD/CAM Specialist',
        'Mold Design Engineer',
        'Quality Control Inspector',
        'Manufacturing Engineer',
        'Technical Drawing Specialist',
      ],
      skills: ['SolidWorks', 'AutoCAD', 'Mastercam', 'Gambar Teknik', 'GD&T', 'Material Science', 'CNC Programming'],
      accentHue: '43deg',  
    },
    deb: {
      code:  'DEB',
      num:   '02',
      title: 'Rekayasa Perancangan Mekanik',
      desc:  'Membekali mahasiswa dengan kompetensi vokasi dalam rekayasa dan perancangan mesin untuk menghasilkan solusi mekanik yang inovatif dan aplikatif. Kurikulum mencakup desain mesin, analisis kekuatan struktur, simulasi FEA, serta pengembangan prototipe produk berbasis kebutuhan industri.',
      focus: [
        { label: 'Desain Mesin',      desc: 'Perancangan komponen dan sistem mekanik' },
        { label: 'Analisis FEA',      desc: 'Simulasi kekuatan dan kegagalan struktur' },
        { label: 'Otomasi Mekanik',   desc: 'Sistem mekanik semi-otomatis dan otomatis' },
        { label: 'Rapid Prototyping', desc: '3D printing dan pembuatan prototipe cepat' },
      ],
      career: [
        'Mechanical Design Engineer',
        'Product Development Engineer',
        'R&D Engineer',
        'Structural Analysis Engineer',
        'Manufacturing Engineer',
        'Automation Technician',
      ],
      skills: ['SolidWorks Simulation', 'ANSYS', 'Inventor', 'AutoCAD Mechanical', 'Mekanika Kekuatan', '3D Printing', 'GD&T'],
      accentHue: '200deg',  
    },
    dec: {
      code:  'DEC',
      num:   '03',
      title: 'Teknologi Rekayasa Perancangan Manufaktur',
      desc:  'Mengembangkan keahlian dalam rekayasa dan perancangan sistem manufaktur berbasis teknologi modern untuk menjawab kebutuhan industri. Mahasiswa mempelajari tata letak pabrik, sistem produksi, lean manufacturing, CNC, serta manajemen kualitas untuk mempersiapkan diri sebagai engineer manufaktur yang kompetitif.',
      focus: [
        { label: 'Sistem Manufaktur', desc: 'Perencanaan dan tata letak lini produksi' },
        { label: 'Lean Manufacturing', desc: 'Efisiensi proses dan pengurangan waste' },
        { label: 'CNC & Mekatronika', desc: 'Pemrograman mesin CNC dan sistem terpadu' },
        { label: 'Quality Engineering', desc: 'Sistem manajemen mutu dan kontrol proses' },
      ],
      career: [
        'Manufacturing Process Engineer',
        'Industrial Engineer',
        'Production Planner',
        'Plant Layout Engineer',
        'Quality Assurance Engineer',
        'Lean / Kaizen Specialist',
      ],
      skills: ['CAM / CNC', 'AutoCAD Plant 3D', 'CATIA', 'SPC / Minitab', 'Lean Tools', 'ISO 9001', 'FMEA'],
      accentHue: '150deg',  
    },
  };

   
  const overlay   = document.getElementById('prodiOverlay');
  const backBtn   = document.getElementById('prodiOverlayBack');
  const closeBtn  = document.getElementById('prodiOverlayCloseBtn');
  const heroBg    = document.getElementById('prodiOverlayHeroBg');
  const elCode    = document.getElementById('prodiOverlayCode');
  const elNum     = document.getElementById('prodiOverlayNum');
  const elTitle   = document.getElementById('prodiOverlayTitle');
  const elDesc    = document.getElementById('prodiOverlayDesc');
  const elFocus   = document.getElementById('prodiOverlayFocus');
  const elCareer  = document.getElementById('prodiOverlayCareer');
  const elSkills  = document.getElementById('prodiOverlaySkills');
  const elFooter  = document.getElementById('prodiOverlayFooterCode');

  if (!overlay) return;

   
  const prodiCards = document.querySelectorAll('.prodi-glass');
  const KEYS       = ['dea', 'deb', 'dec'];

  prodiCards.forEach(function(card, i) {
    var key = KEYS[i] || 'dea';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', 'Lihat detail ' + (PRODI[key] ? PRODI[key].title : key.toUpperCase()));

    card.addEventListener('click', function() { openProdi(key); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProdi(key);
      }
    });
  });

   
  function openProdi(key) {
    var d = PRODI[key];
    if (!d) return;

     
    if (elCode)   elCode.textContent  = d.code;
    if (elNum)    elNum.textContent   = d.num;
    if (elTitle)  elTitle.textContent = d.title;
    if (elDesc)   elDesc.textContent  = d.desc;
    if (elFooter) elFooter.textContent = d.code;

     
    if (elFocus) {
      elFocus.innerHTML = d.focus.map(function(f) {
        return '<div class="prodi-overlay__focus-item">' +
          '<span class="prodi-overlay__focus-label">' + f.label + '</span>' +
          '<span class="prodi-overlay__focus-desc">'  + f.desc  + '</span>' +
          '</div>';
      }).join('');
    }

     
    if (elCareer) {
      elCareer.innerHTML = d.career.map(function(c) {
        return '<li class="prodi-overlay__career-item">' + c + '</li>';
      }).join('');
    }

     
    if (elSkills) {
      elSkills.innerHTML = d.skills.map(function(s) {
        return '<span class="prodi-overlay__skill-tag">' + s + '</span>';
      }).join('');
    }

     
    if (heroBg) {
      heroBg.style.background =
        'radial-gradient(ellipse 70% 60% at 80% 40%, ' +
        'hsl(' + d.accentHue + ' 100% 50% / .12) 0%, transparent 70%), ' +
        'var(--color-void)';
    }

     
    overlay.scrollTop = 0;
    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');
    document.documentElement.classList.add('no-scroll');

     
    if (history.pushState) {
      history.pushState({ prodiKey: key }, '', '#prodi-' + key);
    }

     
    setTimeout(function() {
      if (backBtn) backBtn.focus();
    }, 120);
  }

   
  function closeProdi() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');

     
    if (history.pushState) {
      history.pushState({}, '', window.location.pathname + window.location.search);
    }
  }

   
  if (backBtn)  backBtn.addEventListener('click',  closeProdi);
  if (closeBtn) closeBtn.addEventListener('click', closeProdi);

   
  document.addEventListener('keydown', function(e) {
    if (overlay.classList.contains('is-open') && e.key === 'Escape') {
      closeProdi();
    }
  });

   
  window.addEventListener('popstate', function() {
    if (overlay.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('no-scroll');
    }
  });

   
  (function checkHashOnLoad() {
    var hash = window.location.hash;  
    if (!hash) return;
    var match = hash.match(/^#prodi-([a-z]+)$/i);
    if (match && PRODI[match[1].toLowerCase()]) {
      setTimeout(function() {
        openProdi(match[1].toLowerCase());
      }, 800);
    }
  }());

})();

 
(function() {
  'use strict';

   
  var DEPT_DATA = {

    'legislatif': {
      id:       '01',
      logo:     'img/legislatif-logo.png',
      name:     'Badan Legislatif',
      category: 'BADAN KHUSUS',
      desc:     'Badan Legislatif HMTP berperan sebagai lembaga pengawas ' +
                'jalannya roda organisasi, menampung aspirasi seluruh mahasiswa, ' +
                'serta memastikan setiap kebijakan dan program kerja berjalan ' +
                'sesuai visi, misi, dan konstitusi HMTP Kabinet Aeternum Gloria.',
      sdm:      5,
      proker:   4,
      leaders: [
        {
          role:  'Ketua Legislatif',
          name:  'Muhammad Satria Tri Lesmana',
          photo: 'kabinet/kepala legislatif.webp'
        },
        {
          role:  'Wakil Ketua I',
          name:  'Salwa Ayu Wandari',
          photo: 'kabinet/wakil 1 legislatif .webp'
        },
        {
          role:  'Wakil Ketua II',
          name:  'Nadya Rasyida',
          photo: 'kabinet/wakil 2 legislatif.webp'
        },
        {
          role:  'Ketua Komisi I – Hukum',
          name:  "Muhammad Syaikhu Mumtaz\'Ilmi",
          photo: 'kabinet/ketua komisi 1.webp'
        },
        {
          role:  'Ketua Komisi II – Pengawasan',
          name:  'Rian Mulyana',
          photo: 'kabinet/ketua komisi 2.webp'
        },
        {
          role:  'Ketua Komisi III – Aspirasi & Advokasi',
          name:  'Fadli Martin Tresnanda',
          photo: 'kabinet/ketua komisi 3.webp'
        }
      ]
    },

    'ketua-angkatan': {
      id:       '02',
      logo:     'img/logo-hmtp.png',
      name:     'Ketua Angkatan',
      category: 'BADAN KHUSUS',
      desc:     'Ketua Angkatan menjadi penghubung antara HMTP dengan seluruh ' +
                'mahasiswa di setiap angkatan, mendorong solidaritas intra-angkatan, ' +
                'serta mengkoordinasikan kegiatan bersama demi terciptanya lingkungan ' +
                'akademik yang suportif dan kompak.',
      sdm:      4,
      proker:   6,
      leaders: [
        {
          role:  'Ketua Angkatan 2024',
          name:  '[Nama Ketua Angkatan 24]',
          photo: 'kabinet/ketua angkatan 2024.webp'
        },
        {
          role:  'Ketua Angkatan 2025',
          name:  '[Nama Ketua Angkatan 25]',
          photo: 'kabinet/ketua angkatan 2025.webp'
        }
      ]
    },

    'sekretaris': {
      id:       '03',
      logo:     'img/sekretaris-logo.png',
      name:     'Sekretaris',
      category: 'BADAN KHUSUS',
      desc:     'Sekretaris bertanggung jawab atas kelancaran administrasi dan ' +
                'dokumentasi organisasi HMTP. Setiap keputusan, surat, dan laporan ' +
                'kegiatan diarsipkan agar rekam jejak organisasi terjaga secara ' +
                'terstruktur, profesional, dan dapat dipertanggungjawabkan.',
      sdm:      4,
      proker:   5,
      leaders: [
        {
          role:  'Sekretaris I',
          name:  '[Nama Sekretaris 1]',
          photo: 'kabinet/sekre 1.webp'
        },
        {
          role:  'Sekretaris II',
          name:  '[Nama Sekretaris 2]',
          photo: 'kabinet/sekre 2.webp'
        }
      ]
    },

    'bendahara': {
      id:       '04',
      logo:     'img/bendahara-logo.png',
      name:     'Bendahara',
      category: 'BADAN KHUSUS',
      desc:     'Bendahara mengelola seluruh sirkulasi keuangan HMTP secara ' +
                'akuntabel dan transparan. Setiap aliran dana dicatat, diaudit, ' +
                'dan dilaporkan secara berkala untuk memastikan keberlangsungan ' +
                'program kerja organisasi berjalan dengan sehat.',
      sdm:      4,
      proker:   4,
      leaders: [
        {
          role:  'Bendahara I',
          name:  '[Nama Bendahara 1]',
          photo: 'kabinet/bendahara 1.webp'
        },
        {
          role:  'Bendahara II',
          name:  '[Nama Bendahara 2]',
          photo: 'kabinet/bendahara 2.webp'
        }
      ]
    },

    'media-center': {
      id:       '05',
      logo:     'img/media-center-logo.png',
      name:     'Media Center',
      category: 'DEPARTEMEN',
      desc:     'Media Center adalah ujung tombak komunikasi dan citra HMTP. ' +
                'Bertanggung jawab dalam produksi konten visual, manajemen media ' +
                'sosial, peliputan kegiatan, serta penyebaran informasi kepada ' +
                'seluruh civitas akademika Teknik Pertambangan.',
      sdm:      10,
      proker:   7,
      leaders: [
        {
          role:  'Kepala Departemen',
          name:  '[Nama Kadep Medcen]',
          photo: 'kabinet/kepala departemen medcen.webp'
        },
        {
          role:  'Wakil Kepala Dept.',
          name:  '[Nama Wakadep Medcen]',
          photo: ''
        }
      ]
    },

    'kaderisasi': {
      id:       '06',
      logo:     'img/kaderisasi-logo.png',
      name:     'Kaderisasi',
      category: 'DEPARTEMEN',
      desc:     'Kaderisasi merancang dan menjalankan sistem pembinaan karakter ' +
                'serta kapasitas kader-kader HMTP. Memastikan regenerasi organisasi ' +
                'berjalan sehat sehingga estafet kepemimpinan dapat berlangsung ' +
                'secara berkelanjutan dan penuh semangat.',
      sdm:      8,
      proker:   6,
      leaders: [
        {
          role:  'Kepala Departemen',
          name:  '[Nama Kadep Kaderisasi]',
          photo: 'kabinet/kepala departemen kaderisasi.webp'
        },
        {
          role:  'Wakil Kepala Dept.',
          name:  '[Nama Wakadep Kaderisasi]',
          photo: ''
        }
      ]
    },

    'internal': {
      id:       '07',
      logo:     'img/internal-logo.png',
      name:     'Internal',
      category: 'DEPARTEMEN',
      desc:     'Departemen Internal membangun rasa kekeluargaan dan solidaritas ' +
                'di antara seluruh anggota HMTP. Melalui berbagai kegiatan sosial ' +
                'dan pemberdayaan anggota, departemen ini menciptakan iklim ' +
                'organisasi yang hangat, inklusif, dan produktif.',
      sdm:      9,
      proker:   8,
      leaders: [
        {
          role:  'Kepala Departemen',
          name:  '[Nama Kadep Internal]',
          photo: 'kabinet/kepala departemen internal.webp'
        },
        {
          role:  'Wakil Kepala Dept.',
          name:  '[Nama Wakadep Internal]',
          photo: ''
        }
      ]
    },

    'eksternal': {
      id:       '08',
      logo:     'img/eksternal-logo.png',
      name:     'Eksternal',
      category: 'DEPARTEMEN',
      desc:     'Departemen Eksternal membuka jaringan kolaborasi seluas-luasnya ' +
                'bagi HMTP. Membangun relasi strategis dengan instansi pendidikan, ' +
                'industri, dan komunitas, serta mewakili HMTP dalam berbagai forum ' +
                'dan kegiatan di luar lingkungan kampus.',
      sdm:      9,
      proker:   7,
      leaders: [
        {
          role:  'Kepala Departemen',
          name:  '[Nama Kadep Eksternal]',
          photo: 'kabinet/kepala departemen eksternal.webp'
        },
        {
          role:  'Wakil Kepala Dept.',
          name:  '[Nama Wakadep Eksternal]',
          photo: ''
        }
      ]
    }

  };

   
  var overlay      = document.getElementById('deptOverlay');
  var closeBtn     = document.getElementById('deptOverlayClose');
  var glowEl       = document.getElementById('deptOverlayGlow');

  var elLogo       = document.getElementById('deptOverlayLogo');
  var elNumber     = document.getElementById('deptOverlayNumber');
  var elCategory   = document.getElementById('deptOverlayCategory');
  var elTitle      = document.getElementById('deptOverlayTitle');
  var elDesc       = document.getElementById('deptOverlayDesc');
  var elSdm        = document.getElementById('deptOverlaySdm');
  var elProker     = document.getElementById('deptOverlayProker');
  var elLeaders    = document.getElementById('deptOverlayLeaders');

  if (!overlay) return;    

   
  function buildLeaderCard(leader) {
    var card = document.createElement('div');
    card.className = 'dept-overlay__leader';

     
    var photoWrap = document.createElement('div');
    photoWrap.className = 'dept-overlay__leader-photo';

    if (leader.photo) {
      var img = document.createElement('img');
      img.src = leader.photo;
      img.alt = leader.name;
       
      img.addEventListener('error', function() {
        img.style.display = 'none';
        photoWrap.appendChild(buildPlaceholder());
      });
      photoWrap.appendChild(img);
    } else {
      photoWrap.appendChild(buildPlaceholder());
    }

     
    var info = document.createElement('div');
    info.className = 'dept-overlay__leader-info';

    var role = document.createElement('span');
    role.className = 'dept-overlay__leader-role';
    role.textContent = leader.role;

    var name = document.createElement('span');
    name.className = 'dept-overlay__leader-name';
    name.textContent = leader.name;

    info.appendChild(role);
    info.appendChild(name);

    card.appendChild(photoWrap);
    card.appendChild(info);
    return card;
  }

   
  function buildPlaceholder() {
    var ph = document.createElement('div');
    ph.className = 'dept-overlay__leader-ph';
    ph.setAttribute('aria-hidden', 'true');
    ph.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">' +
        '<circle cx="12" cy="8" r="4"/>' +
        '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' +
      '</svg>' +
      '<span>Foto<br>Menyusul</span>';
    return ph;
  }

   
  function populateOverlay(data) {
    elLogo.src        = data.logo;
    elLogo.alt        = 'Logo ' + data.name;
    elNumber.textContent  = data.id;
    elCategory.textContent = data.category;
    elTitle.textContent   = data.name;
    elDesc.textContent    = data.desc;
    elSdm.textContent     = data.sdm;
    elProker.textContent  = data.proker;

     
    if (data.category === 'DEPARTEMEN') {
      glowEl.style.background =
        'radial-gradient(ellipse 55% 50% at 25% 40%, rgba(255,187,0,0.07), transparent 65%)';
    } else {
      glowEl.style.background =
        'radial-gradient(ellipse 55% 50% at 30% 35%, rgba(255,200,50,0.055), transparent 60%)';
    }

     
    elLeaders.innerHTML = '';
    data.leaders.forEach(function(leader) {
      elLeaders.appendChild(buildLeaderCard(leader));
    });
  }

   
  function openDeptOverlay(deptId) {
    var data = DEPT_DATA[deptId];
    if (!data) return;

    populateOverlay(data);

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');

     
    overlay._prevFocus = document.activeElement;
    setTimeout(function() { closeBtn.focus(); }, 50);

     
    if (history.pushState) {
      history.pushState({ deptOverlay: deptId }, '', '#dept-' + deptId);
    }
  }

   
  function closeDeptOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');

     
    if (overlay._prevFocus) {
      overlay._prevFocus.focus();
      overlay._prevFocus = null;
    }

     
    if (history.pushState && window.location.hash.indexOf('#dept-') === 0) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

   
   
  (function activateCardPointerEvents() {
    var allPairs = document.querySelectorAll(
      '.department-pair:not(.department-pair--buffer)'
    );

    function syncPointerEvents(pair) {
      var isActive = pair.classList.contains('is-active');
      pair.querySelectorAll('[data-dept-id]').forEach(function(card) {
        card.style.pointerEvents = isActive ? 'auto' : 'none';
        card.style.cursor        = isActive ? 'pointer' : '';
      });
    }

    allPairs.forEach(function(pair) {
       
      syncPointerEvents(pair);

       
      var obs = new MutationObserver(function() {
        syncPointerEvents(pair);
      });
      obs.observe(pair, { attributes: true, attributeFilter: ['class'] });
    });
  }());

   
   

  function handleDeptClick(e) {
    var card = e.target.closest('[data-dept-id]');
    if (!card) return;
    var pair = card.closest('.department-pair');
    if (!pair || !pair.classList.contains('is-active')) return;
    e.stopPropagation();           
    openDeptOverlay(card.getAttribute('data-dept-id'));
  }

   
  document.querySelectorAll('[data-dept-id]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      var pair = card.closest('.department-pair');
      if (!pair || !pair.classList.contains('is-active')) return;
      openDeptOverlay(card.getAttribute('data-dept-id'));
    });
  });

   
  var deptSticky = document.querySelector('.departments__sticky');
  if (deptSticky) {
    deptSticky.addEventListener('click', handleDeptClick);
  }

   
  document.addEventListener('click', handleDeptClick);

   
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('[data-dept-id]');
    if (!card) return;
    var pair = card.closest('.department-pair');
    if (!pair || !pair.classList.contains('is-active')) return;

    e.preventDefault();
    openDeptOverlay(card.getAttribute('data-dept-id'));
  });

   
  closeBtn.addEventListener('click', closeDeptOverlay);

   
  overlay.addEventListener('click', function(e) {
     
    if (e.target === overlay || e.target.closest('.dept-overlay__bg')) {
      closeDeptOverlay();
    }
  });

   
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeDeptOverlay();
    }
  });

   
  window.addEventListener('popstate', function() {
    if (overlay.classList.contains('is-open')) {
      closeDeptOverlay();
    }
  });

   
  (function() {
    var hash = window.location.hash;
    if (!hash) return;
    var match = hash.match(/^#dept-([a-z-]+)$/i);
    if (match && DEPT_DATA[match[1].toLowerCase()]) {
      setTimeout(function() {
        openDeptOverlay(match[1].toLowerCase());
      }, 900);
    }
  }());

}());
