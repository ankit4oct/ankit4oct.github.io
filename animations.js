document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    animatedElements.forEach((el) => revealObserver.observe(el));

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    function updateNavChrome() {
        const scrollY = window.scrollY;

        if (scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNav();
    }

    window.addEventListener('scroll', updateNavChrome, { passive: true });
    updateNavChrome();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    const navToggle = document.getElementById('nav-toggle');
    const navLinksEl = document.getElementById('nav-links');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            const open = navLinksEl.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksEl.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function runCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        statNumbers.forEach((num) => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            animateCounter(num, target);
        });
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) runCounters();
            });
        },
        { threshold: 0.15 }
    );

    const statsWrapper = document.getElementById('stats-row');
    if (statsWrapper) {
        counterObserver.observe(statsWrapper);
    } else {
        runCounters();
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = Math.max(target / 40, 0.25);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 24);
    }

    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.getAttribute('data-width');
                    entry.target.style.width = targetWidth + '%';
                }
            });
        },
        { threshold: 0.25 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
