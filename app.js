/* ==========================================================
   app.js — premium landing interactions (vanilla, dependency-free)
   Theme · preloader · reveal · counters · nav · rotator · misc
   ========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;
  var body = document.body;

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById('theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist !== false) {
      try { localStorage.setItem('as-theme', theme); } catch (e) { /* ignore */ }
    }
    if (themeToggle) {
      var next = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0C1117' : '#FAFAF7');
  }

  applyTheme(currentTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  var loaderGone = false;

  function dismissLoader() {
    if (loaderGone) return;
    loaderGone = true;
    body.classList.remove('is-loading');
    if (!preloader) return;
    preloader.classList.add('is-done');
    window.setTimeout(function () {
      if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 700);
  }

  if (reduceMotion) {
    dismissLoader();
  } else {
    body.classList.add('is-loading');
    window.setTimeout(dismissLoader, 650);
    window.setTimeout(dismissLoader, 1800); // safety
    if (document.readyState === 'complete') window.setTimeout(dismissLoader, 900);
    else window.addEventListener('load', function () { window.setTimeout(dismissLoader, 350); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Skill bars ---------- */
  var bars = document.querySelectorAll('.skill-bar-fill');
  if ('IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    bars.forEach(function (bar) { barObserver.observe(bar); });
  } else {
    bars.forEach(function (bar) { bar.style.width = bar.getAttribute('data-width') + '%'; });
  }

  /* ---------- Counters ---------- */
  function animateCount(el, target) {
    if (reduceMotion) { el.textContent = String(target); return; }
    var duration = 1200;
    var start = null;
    function tick(now) {
      if (!start) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counted = false;
    var countObserver = new IntersectionObserver(function (entries) {
      if (counted) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counted = true;
          counters.forEach(function (el) {
            animateCount(el, parseInt(el.getAttribute('data-count'), 10) || 0);
          });
          countObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    countObserver.observe(counters[0].closest('.hero-stats') || counters[0]);
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Role rotator (replaces Typed.js) ---------- */
  var roles = ['FOSS Consultant', 'Python Developer', 'OSS Compliance Lead', 'AI Enthusiast', 'Vibe Coder', 'Web Developer'];
  var roleEl = document.getElementById('role-rotator');
  var roleIndex = 0;
  if (roleEl && !reduceMotion) {
    window.setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.classList.add('swap');
      window.setTimeout(function () {
        roleEl.textContent = roles[roleIndex];
        roleEl.classList.remove('swap');
      }, 280);
    }, 2600);
  }

  /* ---------- Nav: scroll state, progress, active section ---------- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');
  var progress = document.getElementById('scroll-progress');
  var navIndexCurrent = document.getElementById('nav-index-current');
  var indexedSections = document.querySelectorAll('section[data-index], section#top');
  var navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? scrollY / max : 0;

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 16);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 560);
    if (progress) progress.style.width = Math.min(ratio * 100, 100).toFixed(2) + '%';

    var currentIndex = '01';
    var currentId = '';
    var marker = window.innerHeight * 0.3;
    indexedSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= marker) {
        if (section.getAttribute('data-index')) currentIndex = section.getAttribute('data-index');
        if (section.id && section.id !== 'top') currentId = section.id;
      }
    });
    if (navIndexCurrent) navIndexCurrent.textContent = currentIndex;
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-section') === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinksEl = document.getElementById('nav-links');
  var scrim = document.getElementById('nav-scrim');

  function setMenu(open) {
    if (!navToggle || !navLinksEl) return;
    navLinksEl.classList.toggle('open', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (scrim) scrim.classList.toggle('show', open);
    body.style.overflow = open ? 'hidden' : '';
  }

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', function () {
      setMenu(!navLinksEl.classList.contains('open'));
    });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    navLinksEl.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- Smooth anchor offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', href);
      target.setAttribute('tabindex', '-1');
      window.setTimeout(function () {
        try { target.focus({ preventScroll: true }); } catch (err) { /* noop */ }
      }, reduceMotion ? 0 : 600);
    });
  });

  /* ---------- Magnetic buttons (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.22).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = 'ankit_998877@yahoo.com';
      function done() {
        var label = copyBtn.querySelector('span');
        var original = label ? label.textContent : '';
        if (label) label.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        window.setTimeout(function () {
          if (label) label.textContent = original;
          copyBtn.classList.remove('copied');
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
