/* ===================================
   TYPED-INIT.JS — Typed.js initialization
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    var typedElement = document.getElementById('typed');
    if (!typedElement) return;

    var typed = new Typed('#typed', {
        strings: [
            'Sr. Technology Specialist',
            'Python Developer',
            'FOSS Consultant',
            'AI Enthusiast',
            'Vibe Coder',
            'Web Developer'
        ],
        typeSpeed: 60,
        backSpeed: 35,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: false,
        smartBackspace: true
    });
});
