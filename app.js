document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Media files
    const photoGrid = document.getElementById('photo-grid');
    const videoGrid = document.getElementById('video-grid');

    // We know we have 32 photos and 3 videos based on previous steps
    const numPhotos = 32;
    const numVideos = 3;
    const photosPerPage = 8;
    let currentPage = 1;

    // Load Videos
    const videoPrefix = 'video_';
    for (let i = 1; i <= numVideos; i++) {
        const videoNum = String(i).padStart(2, '0');
        const videoSrc = 'assets/' + videoPrefix + videoNum + '.mp4';

        const videoItem = document.createElement('div');
        videoItem.className = 'video-item fade-in-section';

        // Use standard HTML5 video player, optimized for mobile (controls, playsinline)
        videoItem.innerHTML = `<video controls playsinline preload="metadata"><source src="${videoSrc}" type="video/mp4">브라우저가 비디오 태그를 지원하지 않습니다.</video>`;

        videoGrid.appendChild(videoItem);
    }

    // Load Photos with Pagination
    function loadPage(page) {
        photoGrid.innerHTML = ''; // Clear current photos
        window.scrollTo({ top: document.getElementById('photo-section').offsetTop - 50, behavior: 'smooth' });

        const startIdx = (page - 1) * photosPerPage + 1;
        const endIdx = Math.min(page * photosPerPage, numPhotos);

        const photoPrefix = 'photo_';
        for (let i = startIdx; i <= endIdx; i++) {
            const photoNum = String(i).padStart(2, '0');
            const photoSrc = 'assets/' + photoPrefix + photoNum + '.jpg';

            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item fade-in-section is-visible'; // pre-visible for paginated

            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = `유성이 돌잔치 사진 ` + i;
            img.loading = "lazy";

            // Layout logic
            img.onload = function () {
                photoItem.classList.add('loaded');
                const rowHeight = 20;
                const gap = 15;
                const clientHeight = img.getBoundingClientRect().height;
                const rowSpan = Math.ceil((clientHeight + gap) / (rowHeight + gap));
                photoItem.style.gridRowEnd = `span ` + rowSpan;
            };

            // Lightbox functionality
            photoItem.addEventListener('click', () => {
                openLightbox(photoSrc);
            });

            photoItem.appendChild(img);
            photoGrid.appendChild(photoItem);
        }

        // Render Pagination Controls
        renderPagination();
    }

    function renderPagination() {
        let paginationContainer = document.getElementById('pagination-controls');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-controls';
            paginationContainer.className = 'pagination';
            photoGrid.parentNode.appendChild(paginationContainer); // Append below masonry-grid
        }

        paginationContainer.innerHTML = ''; // clear old controls

        const totalPages = Math.ceil(numPhotos / photosPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.innerText = i;
            pageBtn.className = i === currentPage ? 'page-btn active' : 'page-btn';
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadPage(currentPage);
            });
            paginationContainer.appendChild(pageBtn);
        }
    }

    // Initialize first page
    loadPage(currentPage);

    // 2. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300); // match css transition
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 3. Scroll Fade-in Animation Observer (for videos mostly now)
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setTimeout(() => {
        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });
    }, 100);
});
