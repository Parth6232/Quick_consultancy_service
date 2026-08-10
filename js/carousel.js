/**
 * carousel.js
 * Responsibility: Compute and apply per-card arc transforms for the
 * "Our Approach in Action" carousel section.
 *
 * The infinite-loop scrolling itself is handled by CSS @keyframes in
 * animations.css. This script adds the fanned-arc visual by assigning
 * per-card rotate() + translateY() transforms based on each card's
 * index distance from the visual center of the visible viewport.
 *
 * Behaviour:
 *  - On load: applies arc transforms to all .carousel-card elements
 *  - prefers-reduced-motion: disables animation, shows a static grid
 *  - Hover on .carousel-track: pauses animation (also handled in CSS)
 */

(function () {
    'use strict';

    /**
     * Arc configuration — tweak these to adjust the visual intensity.
     * maxRotateDeg : max rotation (degrees) for cards at the far edges
     * maxTranslateY: max downward shift (px) for cards at the far edges
     * centerBoost  : px lift on the center card (negative = up)
     * scaleDrop    : scale reduction per step from center
     */
    var ARC_CONFIG = {
        maxRotateDeg:  4,
        maxTranslateY: 14,
        centerBoost:   -6,
        scaleDrop:     0.018
    };

    /**
     * Apply arc transforms to a set of carousel cards.
     * @param {NodeList|Array} cards - the .carousel-card elements
     */
    function applyArcTransforms(cards) {
        var total  = cards.length;
        var center = (total - 1) / 2; // fractional center index

        Array.prototype.forEach.call(cards, function (card, i) {
            var dist    = i - center;
            var absDist = Math.abs(dist);

            var rotate     = dist * ARC_CONFIG.maxRotateDeg;
            var translateY = (absDist === 0)
                ? ARC_CONFIG.centerBoost
                : absDist * ARC_CONFIG.maxTranslateY;
            var scale = Math.max(1 - absDist * ARC_CONFIG.scaleDrop, 0.88);

            card.style.transform =
                'rotate(' + rotate + 'deg) translateY(' + translateY + 'px) scale(' + scale + ')';
            card.style.zIndex = String(Math.round(10 - absDist * 2));
        });
    }

    /**
     * Replace the animated carousel with a static responsive grid.
     * Called when prefers-reduced-motion is active.
     */
    function buildStaticGrid(section) {
        var container = section.querySelector('.carousel-container');
        if (!container) return;

        var allCards = section.querySelectorAll('.carousel-card');
        var half     = Math.floor(allCards.length / 2);
        var unique   = Array.prototype.slice.call(allCards, 0, half);

        var grid = document.createElement('div');
        grid.className = 'carousel-static-grid';

        unique.forEach(function (card) {
            card.style.transform = '';
            card.style.zIndex    = '';
            grid.appendChild(card.cloneNode(true));
        });

        container.parentNode.replaceChild(grid, container);
    }

    /**
     * Main init — runs on DOMContentLoaded.
     */
    function init() {
        var section = document.querySelector('.carousel-section');
        if (!section) return;

        var track = section.querySelector('.carousel-track');
        if (!track) return;

        /* ── Reduced-motion: static grid ── */
        var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) {
            buildStaticGrid(section);
            return;
        }

        /* ── Normal: apply arc transforms ── */
        var cards = track.querySelectorAll('.carousel-card');
        if (!cards.length) return;

        applyArcTransforms(cards);

        /* Hover pause — belt-and-suspenders behind the CSS rule */
        track.addEventListener('mouseenter', function () {
            track.style.animationPlayState = 'paused';
        });
        track.addEventListener('mouseleave', function () {
            track.style.animationPlayState = 'running';
        });

        /* Re-apply on resize */
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                applyArcTransforms(track.querySelectorAll('.carousel-card'));
            }, 150);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
}());
