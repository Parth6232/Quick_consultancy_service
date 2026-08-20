/**
 * filter.js
 * Responsibility: Service tab filtering with robust show/hide logic.
 *
 * FIXES applied vs the old setTimeout approach:
 *  - Cards use data-hidden="true/false" driven by CSS (no display:none timing race).
 *  - A per-card transitionend listener re-adds display:none only AFTER the fade
 *    is truly complete, so rapid clicks can't leave orphaned invisible cards.
 *  - Cancels any pending show/hide from a previous click via a guard flag on the card.
 */

/**
 * @param {Event} evt   - The click event from the tab button.
 * @param {string} category - 'all' or a category class like 'tax', 'biz', etc.
 */
function filterServices(evt, category) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    evt.currentTarget.classList.add('active');

    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        const matches = category === 'all' || card.classList.contains(category);

        if (matches) {
            _showCard(card);
        } else {
            _hideCard(card);
        }
    });

    if (typeof window.filterVideos === 'function') {
        window.filterVideos(category);
    }
}

/** Make a card visible with a smooth fade-in. */
function _showCard(card) {
    // Cancel any pending hide
    card._pendingHide = false;

    // Ensure it's in the document flow before the transition starts
    card.style.position  = '';
    card.style.visibility = '';
    card.style.display   = 'block'; // must be block before removing data-hidden
    card.removeAttribute('data-hidden');
}

/** Fade out a card, then remove it from document flow after the transition. */
function _hideCard(card) {
    card._pendingHide = true;
    card.setAttribute('data-hidden', 'true');

    // After CSS transition completes, fully remove from flow
    // (guard with _pendingHide so a rapid show cancels this)
    const onEnd = () => {
        card.removeEventListener('transitionend', onEnd);
        if (card._pendingHide) {
            // already set by CSS data-hidden rule, but be explicit for safety
            card.style.display = 'none';
        }
    };
    card.addEventListener('transitionend', onEnd, { once: true });
}
