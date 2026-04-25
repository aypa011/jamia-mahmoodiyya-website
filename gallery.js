document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video-container');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');

    let galleryData = [];

    // Load data
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            galleryData = data.gallery || [];
            renderGallery('all');
        });

    function renderGallery(filter) {
        grid.innerHTML = '';
        const filtered = filter === 'all' ? galleryData : galleryData.filter(item => item.type === filter);

        filtered.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'gallery-item reveal';
            el.innerHTML = `
                <img src="${item.thumb}" alt="${item.title}" loading="lazy">
                <div class="gallery-type">
                    <i class="fa-solid ${item.type === 'video' ? 'fa-play' : 'fa-image'}"></i>
                </div>
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                </div>
            `;
            el.addEventListener('click', () => openLightbox(item));
            grid.appendChild(el);
            
            // Trigger reveal animation
            setTimeout(() => el.classList.add('active'), index * 50);
        });
    }

    function openLightbox(item) {
        lightbox.classList.add('active');
        lightboxCaption.innerText = item.title;
        
        if (item.type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            lightboxVideo.style.display = 'none';
            lightboxVideo.innerHTML = '';
            lightboxImg.style.display = 'block';
            lightboxImg.src = item.full;
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxVideo.innerHTML = '';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.dataset.filter);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});
