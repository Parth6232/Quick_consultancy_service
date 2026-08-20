/**
 * video-reels.js
 * Handles dynamic rendering, autoplaying, pausing via IntersectionObserver, muting, and prefers-reduced-motion.
 */

const TAXONOMY = {
    'tax': ['Income Tax Return (ITR) Filing', 'GST Registration & GST Return Filing', 'TDS Return Filing & TDS Compliance', 'Tax Planning & Advisory', 'Income Tax Notices & Assessments'],
    'reg': ['Proprietorship & Partnership Firm', 'LLP & Private Limited Company', 'Startup India & MSME (Udyam)', 'PAN, TAN & Digital Signature (DSC)'],
    'acc': ['Bookkeeping & Accounting', 'Payroll Processing', 'Financial Statements', 'Internal Audit & Virtual CFO'],
    'it': ['ERP & SAP Consulting', 'Power BI & Business Intelligence', 'Data Analytics', 'Cloud & Digital Transformation'],
    'ai': ['AI Voice Agents', 'WhatsApp Business Automation', 'Chatbot Development', 'Workflow Automation & GenAI'],
    'web': ['Website Design & Development', 'E-commerce Development', 'SEO & Google Business Profile', 'Digital Marketing & Social Media'],
    'biz': ['Startup Consulting & Strategy', 'Business Process Improvement', 'Project Management Consulting', 'Government Schemes & Subsidies']
};

const VIDEOS = [
    { category: 'ai', title: 'Voice AI Assistance', src: 'assets/videos/Voice AI Assistance.mp4' },
    { category: 'general', title: 'Quick Consulting Services', src: 'assets/videos/reel-1.mp4' }
];

let videoObserver;
let prefersReducedMotion = false;

document.addEventListener('DOMContentLoaded', () => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        const reducedMotionMsg = document.querySelector('.reduced-motion-msg');
        if (reducedMotionMsg) reducedMotionMsg.classList.remove('hidden');
    }

    // Set up IntersectionObserver for videos
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.2
    };

    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(err => {
                    console.warn("Video autoplay prevented:", err);
                });
            } else {
                video.pause();
            }
        });
    }, observerOptions);

    renderAllVideos();
});

function renderAllVideos() {
    const container = document.getElementById('video-reels-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    VIDEOS.forEach(videoData => {
        // Removed strict validation check as requested.
        // TAXONOMY remains as a reference above.

        const card = document.createElement('div');
        // Match .service-card fade/scale behavior via similar CSS classes
        card.className = `video-reel-card service-card flex-none w-[85%] snap-center sm:w-full sm:flex-auto ${videoData.category} relative rounded-2xl overflow-hidden shadow-xl bg-black group max-w-[280px] sm:max-w-none transition-all duration-300`;
        
        const videoSrc = videoData.src + (videoData.src.includes('#') ? '' : '#t=0.001');
        const posterAttr = videoData.poster ? `poster="${videoData.poster}"` : '';
        const posterBgClass = videoData.poster ? '' : 'bg-slate-900';

        card.innerHTML = `
            <div class="relative w-full h-[320px] md:h-[380px] lg:h-[420px] ${posterBgClass}">
                <video class="w-full h-full object-cover" 
                       loop muted playsinline preload="metadata"
                       ${posterAttr}
                       src="${videoSrc}">
                </video>
                <button class="reel-mute-btn absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition" aria-label="Toggle mute">
                    <i class="fa-solid fa-volume-xmark"></i>
                </button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-4 border-t border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-sm md:text-base text-slate-900 dark:text-white text-center">${videoData.title}</h3>
            </div>
        `;
        
        container.appendChild(card);

        const video = card.querySelector('video');
        const muteBtn = card.querySelector('.reel-mute-btn');
        
        if (video && !prefersReducedMotion) {
            videoObserver.observe(video);
        }
        
        if (muteBtn && video) {
            const icon = muteBtn.querySelector('i');
            muteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
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
    });
}

window.filterVideos = function(category) {
    const container = document.getElementById('video-reels-container');
    const emptyState = document.getElementById('video-empty-state');
    if (!container || !emptyState) return;

    let visibleCount = 0;
    const cards = container.querySelectorAll('.video-reel-card');

    cards.forEach(card => {
        const matches = category === 'all' || card.classList.contains(category);

        if (matches) {
            if (typeof _showCard === 'function') {
                _showCard(card);
            } else {
                card.style.display = 'block';
            }
            visibleCount++;
        } else {
            if (typeof _hideCard === 'function') {
                _hideCard(card);
            } else {
                card.style.display = 'none';
            }
        }
    });

    if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
};
