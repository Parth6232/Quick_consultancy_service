/**
 * main.js
 * Responsibility: DOMContentLoaded bootstrap — wires all modules together
 * after the DOM is ready.  Import order in index.html must be:
 *   theme.js → filter.js → faq.js → counters.js → chat.js → main.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sync theme icons to match whatever class is already on <html>
    syncThemeIcons();

    // 2. Start scroll-reveal and animated counters
    initRevealAndCounters();

    // 3. Initialize chat drag + enter-key shortcut
    initChatDrag();
    initChatEnterKey();

    // 4. Initialise filter so all cards are visible on load
    //    (call with a synthetic event pointing to the "All" button)
    const allBtn = document.querySelector('.tab-btn.active');
    if (allBtn) {
        filterServices({ currentTarget: allBtn }, 'all');
    }
});
