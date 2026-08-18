/**
 * video-reels.js
 * Handles autoplaying, pausing via IntersectionObserver, muting, and prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-reel-card');
    const reducedMotionMsg = document.querySelector('.reduced-motion-msg');
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Hide videos and show static message
        if (reducedMotionMsg) reducedMotionMsg.classList.remove('hidden');
        videoCards.forEach(card => card.style.display = 'none');
        return; // Stop initialization
    }

    // Set up IntersectionObserver for videos
    const observerOptions = {
        root: null,
        rootMargin: '50px', // Start playing slightly before it comes into view
        threshold: 0.2 // Play when 20% visible
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Play if it's visible
                video.play().catch(err => {
                    console.warn("Video autoplay prevented:", err);
                });
            } else {
                // Pause to save battery/data when out of view
                video.pause();
            }
        });
    }, observerOptions);

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const muteBtn = card.querySelector('.reel-mute-btn');
        
        if (video) {
            videoObserver.observe(video);
            
            // Mute button logic
            if (muteBtn) {
                const icon = muteBtn.querySelector('i');
                muteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent other clicks
                    
                    if (video.muted) {
                        video.muted = false;
                        icon.classList.remove('fa-volume-xmark');
                        icon.classList.add('fa-volume-high');
                    } else {
                        video.muted = true;
                        icon.classList.remove('fa-volume-high');
                        icon.classList.add('fa-volume-xmark');
                    }
                });
            }
        }
    });
});
