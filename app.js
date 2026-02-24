document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Media files
    const photoGrid = document.getElementById('photo-grid');
    const videoGrid = document.getElementById('video-grid');
    
    // We know we have 32 photos and 3 videos based on previous steps
    const numPhotos = 32;
    const numVideos = 3;

    // Load Videos
    const videoPrefix = '%EC%9C%A0%EC%84%B1%EC%9D%B4_%EB%8F%8C%EC%9E%94%EC%B9%98_%EC%98%81%EC%83%81_';
    for (let i = 1; i <= numVideos; i++) {
        const videoNum = String(i).padStart(2, '0');
        const videoSrc = 'assets/' + videoPrefix + videoNum + '.mp4';
        
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item fade-in-section';
        
        // Use standard HTML5 video player, optimized for mobile (controls, playsinline)
        videoItem.innerHTML = <video controls playsinline preload="metadata"><source src="${videoSrc}" type="video/mp4">브라우저가 비디오 태그를 지원하지 않습니다.</video>;
        
        videoGrid.appendChild(videoItem);
    }

    // Load Photos
    const photoPrefix = '%EC%9C%A0%EC%84%B1%EC%9D%B4_%EB%8F%8C%EC%9E%94%EC%B9%98_%EC%82%AC%EC%A7%84_';
    for (let i = 1; i <= numPhotos; i++) {
        const photoNum = String(i).padStart(2, '0');
        const photoSrc = 'assets/' + photoPrefix + photoNum + '.jpg';
        
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item fade-in-section';
        
        const img = document.createElement('img');
        img.src = photoSrc;
        img.alt = 유성이 돌잔치 사진  + i;
        img.loading = "lazy"; // lazy loading for better performance
        
        // When image loads, calculate its row span for CSS Grid Masonry
        img.onload = function() {
            // Apply loaded class for fade-in effect
            photoItem.classList.add('loaded');
            
            // Calculate how many 10px rows this image should span
            const rowHeight = 10;
            const gap = 15;
            // Get actual rendered dimensions
            const clientHeight = img.getBoundingClientRect().height;
            const rowSpan = Math.ceil((clientHeight + gap) / (rowHeight + gap));
            
            photoItem.style.gridRowEnd = span  + rowSpan;
        };

        // Fallback for masonry layout if resize happens
        window.addEventListener('resize', () => {
             if (photoItem.classList.contains('loaded')) {
                 const rowHeight = 10;
                 const gap = 15;
                 const clientHeight = img.getBoundingClientRect().height;
                 const rowSpan = Math.ceil((clientHeight + gap) / (rowHeight + gap));
                 photoItem.style.gridRowEnd = span  + rowSpan;
             }
        });
        
        // Lightbox functionality
        photoItem.addEventListener('click', () => {
            openLightbox(photoSrc);
        });

        photoItem.appendChild(img);
        photoGrid.appendChild(photoItem);
    }

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

    // 3. Scroll Fade-in Animation Observer
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
                // Optional: stop observing once it's visible to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Give DOM a tiny bit of time to insert elements before observing
    setTimeout(() => {
        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });
    }, 100);
});
