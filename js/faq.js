/**
 * faq.js
 * Responsibility: FAQ accordion — toggle open/close, enforce single-open
 * behaviour, and wire up keyboard accessibility.
 */

/**
 * Toggle the clicked FAQ item.  Closes all other items first.
 * @param {HTMLElement} element - The .faq-item wrapper div.
 */
function toggleFaq(element) {
    const allFaqs = document.querySelectorAll('.faq-item');
    const isActive = element.classList.contains('active');

    // Close everything
    allFaqs.forEach(faq => faq.classList.remove('active'));

    // If it wasn't already open, open it
    if (!isActive) {
        element.classList.add('active');
    }
}
