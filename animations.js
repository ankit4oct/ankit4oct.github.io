/* ===================================
   Animations — scroll, nav, counters, skills
   =================================== */

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
        { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    animatedElements.forEach((el) => revealObserver.observe(el));

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const hero = document.getElementById('hero');

    function updateNavChrome() {
        const scrollY = window.scrollY;
        const heroBottom = hero ? hero.offsetHeight - 80 : 0;

        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY < heroBottom) {
            navbar.classList.add('on-hero');
        } else {
            navbar.classList.remove('on-hero');
        }

        if (scrollY > 600) {
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
    const navLinksEl = document.querySelector('.nav-links');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksEl.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksEl.classList.remove('open');
            });
        });
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach((num) => {
                        const target = parseInt(num.getAttribute('data-target'), 10);
                        animateCounter(num, target);
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    if (statNumbers.length > 0) {
        const statsWrapper = statNumbers[0].closest('.about-aside');
        if (statsWrapper) counterObserver.observe(statsWrapper);
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 28);
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
        { threshold: 0.35 }
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
