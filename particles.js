/* ===================================
   PARTICLES.JS — Animated Background
   =================================== */
(function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;

    function init() {
        resize();
        particles = [];
        mouse = { x: -9999, y: -9999 };

        const count = Math.min(Math.floor((width * height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        animate();
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle() {
        const colors = [
            'rgba(14, 165, 233, ',   /* sky blue */
            'rgba(99, 102, 241, ',   /* indigo */
            'rgba(217, 70, 239, ',   /* fuchsia */
            'rgba(139, 92, 246, ',   /* violet */
            'rgba(56, 189, 248, '    /* cyan */
        ];
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.2,
            alphaDir: Math.random() > 0.5 ? 0.003 : -0.003
        };
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Pulse alpha
            p.alpha += p.alphaDir;
            if (p.alpha > 0.6 || p.alpha < 0.05) p.alphaDir *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    const lineAlpha = (1 - dist / 140) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Base line color to match brand slightly mixed
                    ctx.strokeStyle = 'rgba(139, 92, 246, ' + lineAlpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Enhanced Mouse interaction
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 200) {
                const force = (200 - mdist) / 200;
                // Repel effect
                p.vx += (mdx / mdist) * force * 0.08;
                p.vy += (mdy / mdist) * force * 0.08;
                // Damping
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Also draw connecting line to mouse for dynamic vibe
                if (mdist < 150) {
                    const mouseLineAlpha = (1 - mdist / 150) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(14, 165, 233, ' + mouseLineAlpha + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            } else {
                // Slower base speed damping
                if (Math.abs(p.vx) > 1.5) p.vx *= 0.98;
                if (Math.abs(p.vy) > 1.5) p.vy *= 0.98;
            }
        });

        requestAnimationFrame(animate);
    }

    init();
})();
