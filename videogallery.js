/**
 * Jamia Mahmoodiyya - Video Gallery
 * JS handles: Video Lightbox Modal, Category Filtering.
 */

// ── Video Modal Logic ───────────────────────────────────────────
function openVideoModal(videoId, title) {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoModalFrame');
    const titleEl = document.getElementById('videoModalTitle');
    
    if (!modal || !frame) return;

    // Set YouTube embed URL with autoplay and no related videos
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    
    if (titleEl) titleEl.textContent = title;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // History state integration
    if (!history.state || !history.state.videoModalOpen) {
        history.pushState({ videoModalOpen: true }, "");
    }
}

function closeVideoModal(fromHistory = false) {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoModalFrame');
    
    if (!modal || !frame) return;

    frame.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';

    // If closing via UI/X button, remove the history state
    if (!fromHistory && history.state && history.state.videoModalOpen) {
        history.back();
    }
}

// Handle browser back button
window.onpopstate = function(event) {
    const videoModal = document.getElementById('videoModal');
    if (videoModal && videoModal.style.display === 'block') {
        closeVideoModal(true);
    }
};

// ── Category Filtering Logic ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.vg-filter-btn');
    const videoCards = document.querySelectorAll('.vg-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Toggle Cards
            videoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    // Optional: add animation class here
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Close Modal on overlay click (if not the frame)
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVideoModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeVideoModal();
    });
});
