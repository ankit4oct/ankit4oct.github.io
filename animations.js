document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const preloader = document.getElementById('preloader');
    const body = document.body;
    document.documentElement.classList.add('js');
    body.classList.add('js');
    let loaderGone = false;

    function dismissLoader() {
        if (loaderGone) return;
        loaderGone = true;
        body.classList.remove('is-loading');
        body.classList.add('is-ready');
        if (!preloader) return;
        preloader.classList.add('is-done');
        window.setTimeout(() => preloader.remove(), 800);
    }

    if (reduceMotion) {
        dismissLoader();
    } else {
        body.classList.add('is-loading');
        window.setTimeout(dismissLoader, 750);
        window.setTimeout(dismissLoader, 1600);
    }

    let lenis = null;
    if (!reduceMotion && typeof Lenis === 'function') {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const mouse = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };

    if (finePointer && !reduceMotion && cursorDot && cursorRing && window.innerWidth > 860) {
        body.classList.add('has-cursor');

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
        }, { passive: true });

        function followCursor() {
            ring.x += (mouse.x - ring.x) * 0.16;
            ring.y += (mouse.y - ring.y) * 0.16;
            cursorRing.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
            requestAnimationFrame(followCursor);
        }
        followCursor();

        document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                body.classList.add('cursor-hover');
                if (el.getAttribute('data-cursor') === 'view') {
                    body.classList.add('cursor-view');
                }
            });
            el.addEventListener('mouseleave', () => {
                body.classList.remove('cursor-hover', 'cursor-view');
            });
        });
    }

    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const progress = document.getElementById('scroll-progress');
    const navIndexCurrent = document.getElementById('nav-index-current');
    const indexedSections = document.querySelectorAll('section[data-index]');
    const portrait = document.querySelector('[data-parallax]');

    function onScroll() {
        const scrollY = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? scrollY / max : 0;

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 24);
        }
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }
        if (progress) {
            progress.style.width = `${Math.min(ratio * 100, 100)}%`;
        }

        if (portrait && !reduceMotion) {
            const rect = portrait.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.08;
            portrait.style.transform = `translate3d(0, ${offset}px, 0)`;
        }

        let currentIndex = '01';
        let currentId = '';
        const marker = window.innerHeight * 0.28;
        indexedSections.forEach((section) => {
            const top = section.getBoundingClientRect().top;
            if (top <= marker) {
                currentIndex = section.getAttribute('data-index') || currentIndex;
                currentId = section.id;
            }
        });
        if (navIndexCurrent) {
            navIndexCurrent.textContent = currentIndex;
        }

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.toggle('active', link.getAttribute('data-section') === currentId);
        });
    }

    if (lenis) {
        lenis.on('scroll', onScroll);
    } else {
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    const navToggle = document.getElementById('nav-toggle');
    const navLinksEl = document.getElementById('nav-links');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            const open = navLinksEl.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navbar.classList.toggle('menu-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksEl.classList.remove('open');
                navbar.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounter(el, target) {
        const duration = 1100;
        const startTime = performance.now();

        function tick(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function runCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        statNumbers.forEach((num) => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            animateCounter(num, target);
        });
    }

    const statsWrapper = document.getElementById('stats-row');
    if (statsWrapper) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) runCounters();
                });
            },
            { threshold: 0.2 }
        );
        counterObserver.observe(statsWrapper);
    }

    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.width = `${entry.target.getAttribute('data-width')}%`;
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );
    document.querySelectorAll('.skill-bar-fill').forEach((bar) => skillObserver.observe(bar));

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -8 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
