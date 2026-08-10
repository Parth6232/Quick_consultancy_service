/**
 * theme.js
 * Responsibility: Dark/light mode toggle, icon synchronisation, and
 * re-applying the correct theme after DOMContentLoaded.
 *
 * NOTE: The theme-detection that runs BEFORE Tailwind (to avoid FOUC) is an
 * inline <script> in <head> in index.html — it does NOT live here.
 * This file handles the interactive toggle and icon state only.
 */

/**
 * Toggle between dark and light mode, persist the choice, and sync icons.
 * Called by the sun/moon button's onclick in the nav.
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    // DEBUG: remove this log once toggle is confirmed working
    console.log('[theme.js] toggleTheme called — currently dark?', isDark);

    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }

    syncThemeIcons();
}

/**
 * Set the sun/moon icons to match the current theme state.
 * Safe to call at any time — does nothing if elements don't exist yet.
 */
function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const sunIcon  = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (!sunIcon || !moonIcon) return;

    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

/**
 * Safety net: sync icons as soon as the DOM is ready.
 * This runs even if main.js encounters an error and its own
 * DOMContentLoaded handler never fires.
 */
document.addEventListener('DOMContentLoaded', syncThemeIcons);
