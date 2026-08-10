/**
 * counters.js
 * Responsibility: Scroll-reveal IntersectionObserver and animated number counters.
 * Runs after DOMContentLoaded (called from main.js).
 */

function initRevealAndCounters() {
    // --- Scroll-reveal ---
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Animated counters ---
    const counters   = document.querySelectorAll('.stat-counter');
    let hasCounted   = false;

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    if (!target || isNaN(target)) return;

                    const duration  = 1800; // ms
                    const fps       = 60;
                    const increment = target / (duration / (1000 / fps));
                    let current     = 0;

                    const tick = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(tick);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    requestAnimationFrame(tick);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) counterObserver.observe(statsSection);
}
