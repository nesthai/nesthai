/* ========================================
   GALERIE IMMOBILIÈRE — PREMIUM
   Thumbnails, Lightbox, Zoom & Pan
   Solution universelle - toutes les pages
   ======================================== */

(function () {
    'use strict';

    // =======================================
    // 1. THUMBNAIL → MAIN IMAGE SWAP
    // =======================================

    function initGalleryThumbnails() {
        var galleries = document.querySelectorAll('.detail-gallery');
        if (!galleries.length) return;

        galleries.forEach(function (gallery) {
            var mainImg = gallery.querySelector('.gallery-main img');
            var thumbs = gallery.querySelectorAll('.gallery-thumb');
            if (!mainImg || !thumbs.length) return;

            // Set first thumb as active on load
            thumbs[0].classList.add('active');

            thumbs.forEach(function (thumb) {
                thumb.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Get the high-res source from onclick attribute or data-src or thumb img
                    var newSrc = getHighResSrc(thumb);
                    if (!newSrc || newSrc === mainImg.src) return;

                    // Fade out
                    mainImg.classList.add('gallery-fading');

                    setTimeout(function () {
                        mainImg.src = newSrc;
                        mainImg.onload = function () {
                            mainImg.classList.remove('gallery-fading');
                        };
                        // Fallback if onload doesn't fire (cached)
                        setTimeout(function () {
                            mainImg.classList.remove('gallery-fading');
                        }, 300);
                    }, 200);

                    // Update active state
                    thumbs.forEach(function (t) { t.classList.remove('active'); });
                    thumb.classList.add('active');
                });
            });

            // Make main image clickable for lightbox
            var mainContainer = gallery.querySelector('.gallery-main');
            if (mainContainer) {
                mainContainer.removeAttribute('onclick'); // Remove old inline handler
                mainContainer.addEventListener('click', function () {
                    var allSrcs = collectGallerySources(gallery);
                    var currentSrc = mainImg.src;
                    var startIndex = allSrcs.indexOf(currentSrc);
                    if (startIndex === -1) startIndex = 0;
                    openLightbox(allSrcs, startIndex);
                });
            }
        });
    }

    /**
     * Extract high-res source from a thumbnail element.
     * Checks: onclick attribute, data-src, or img src.
     */
    function getHighResSrc(thumb) {
        // 1. Check onclick attribute for changePhoto('url') or changeDetailPhoto('url')
        var onclickAttr = thumb.getAttribute('onclick');
        if (onclickAttr) {
            var match = onclickAttr.match(/(?:changePhoto|changeDetailPhoto)\(['"]([^'"]+)['"]\)/);
            if (match) return match[1];
        }
        // 2. Check data-src
        if (thumb.dataset && thumb.dataset.src) return thumb.dataset.src;
        // 3. Fallback to img src (for Unsplash, upgrade thumb to main size)
        var img = thumb.querySelector('img');
        if (img) {
            var src = img.src;
            // If Unsplash thumb (w=400), upgrade to main size (w=800)
            if (src.indexOf('w=400') !== -1) {
                return src.replace('w=400', 'w=800').replace('h=300', 'h=600');
            }
            return src;
        }
        return null;
    }

    /**
     * Collect all image sources from a gallery (main + thumbs).
     */
    function collectGallerySources(gallery) {
        var sources = [];
        var mainImg = gallery.querySelector('.gallery-main img');
        var thumbs = gallery.querySelectorAll('.gallery-thumb');

        // Get unique sources from thumbnails (high-res versions)
        thumbs.forEach(function (thumb) {
            var src = getHighResSrc(thumb);
            if (src && sources.indexOf(src) === -1) sources.push(src);
        });

        // Ensure main image source is included
        if (mainImg && mainImg.src && sources.indexOf(mainImg.src) === -1) {
            sources.unshift(mainImg.src);
        }

        return sources;
    }

    // =======================================
    // 2. LIGHTBOX (Fullscreen Viewer)
    // =======================================

    var lightbox = null;
    var lightboxImg = null;
    var lightboxSources = [];
    var lightboxIndex = 0;
    var zoomLevel = 1;
    var panX = 0, panY = 0;
    var isPanning = false;
    var panStartX, panStartY, panOriginX, panOriginY;
    var minZoom = 1;
    var maxZoom = 8;

    function openLightbox(sources, startIndex) {
        lightboxSources = sources;
        lightboxIndex = startIndex || 0;
        zoomLevel = 1;
        panX = 0;
        panY = 0;

        if (lightbox) {
            // Reuse existing lightbox
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }

        // Create lightbox DOM
        lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML =
            '<div class="gallery-lightbox-wrapper">' +
                '<img class="gallery-lightbox-img" src="" alt="Vue agrandie">' +
            '</div>' +
            '<button class="gallery-lightbox-close" aria-label="Fermer" title="Fermer">&times;</button>' +
            '<button class="gallery-lightbox-prev" aria-label="Photo précédente" title="Photo précédente">&#8249;</button>' +
            '<button class="gallery-lightbox-next" aria-label="Photo suivante" title="Photo suivante">&#8250;</button>' +
            '<div class="gallery-lightbox-counter"></div>' +
            '<div class="gallery-lightbox-controls">' +
                '<button class="gallery-lightbox-btn" data-action="zoom-out" aria-label="Dézoomer" title="Dézoomer">&minus;</button>' +
                '<span class="gallery-lightbox-zoom-label">100%</span>' +
                '<button class="gallery-lightbox-btn" data-action="zoom-in" aria-label="Zoomer" title="Zoomer">&plus;</button>' +
                '<button class="gallery-lightbox-btn" data-action="zoom-reset" aria-label="Réinitialiser" title="Réinitialiser le zoom">&#8634;</button>' +
            '</div>';

        document.body.appendChild(lightbox);
        lightboxImg = lightbox.querySelector('.gallery-lightbox-img');

        // --- EVENT LISTENERS ---

        // Close
        lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeLightbox);

        // Nav arrows
        lightbox.querySelector('.gallery-lightbox-prev').addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(-1);
        });
        lightbox.querySelector('.gallery-lightbox-next').addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(1);
        });

        // Zoom controls
        lightbox.querySelectorAll('.gallery-lightbox-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var action = btn.dataset.action;
                if (action === 'zoom-in') setZoom(zoomLevel * 1.4);
                else if (action === 'zoom-out') setZoom(zoomLevel / 1.4);
                else if (action === 'zoom-reset') resetZoom();
            });
        });

        // Close on background click (not on image/controls)
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('click', function (e) {
            if (e.target === this && zoomLevel <= 1) {
                closeLightbox();
            }
        });

        // Keyboard
        document.addEventListener('keydown', handleLightboxKeydown);

        // Mouse wheel zoom
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('wheel', handleWheelZoom, { passive: false });

        // Pan (mouse)
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('mousedown', handlePanStart);
        document.addEventListener('mousemove', handlePanMove);
        document.addEventListener('mouseup', handlePanEnd);

        // Touch: pinch zoom + pan
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('touchstart', handleTouchStart, { passive: false });
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('touchmove', handleTouchMove, { passive: false });
        lightbox.querySelector('.gallery-lightbox-wrapper').addEventListener('touchend', handleTouchEnd);

        // Update and show
        updateLightboxImage();
        // Force reflow then activate for animation
        void lightbox.offsetHeight;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
    }

    function navigateLightbox(direction) {
        if (lightboxSources.length <= 1) return;
        resetZoom();
        lightboxIndex = (lightboxIndex + direction + lightboxSources.length) % lightboxSources.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        if (!lightboxImg) return;
        lightboxImg.src = lightboxSources[lightboxIndex];
        // Update counter
        var counter = lightbox.querySelector('.gallery-lightbox-counter');
        if (counter) {
            counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxSources.length;
        }
        // Show/hide arrows
        var prevBtn = lightbox.querySelector('.gallery-lightbox-prev');
        var nextBtn = lightbox.querySelector('.gallery-lightbox-next');
        if (prevBtn) prevBtn.style.display = lightboxSources.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = lightboxSources.length > 1 ? 'flex' : 'none';
        // Hide counter if only 1 image
        if (counter) counter.style.display = lightboxSources.length > 1 ? 'block' : 'none';
    }

    // =======================================
    // 3. ZOOM & PAN
    // =======================================

    function setZoom(newZoom, originX, originY) {
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, newZoom));

        if (zoomLevel <= 1) {
            panX = 0;
            panY = 0;
        } else {
            constrainPan();
        }

        applyTransform();
        updateZoomLabel();
    }

    function resetZoom() {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        applyTransform();
        updateZoomLabel();
    }

    function applyTransform() {
        if (!lightboxImg) return;
        lightboxImg.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoomLevel + ')';
        // Update cursor
        if (lightbox) {
            if (zoomLevel > 1) {
                lightbox.classList.add('grabbing');
            } else {
                lightbox.classList.remove('grabbing');
            }
        }
    }

    function constrainPan() {
        if (!lightboxImg) return;
        var imgRect = lightboxImg.getBoundingClientRect();
        var wrapperRect = lightboxImg.parentElement.getBoundingClientRect();

        var scaledW = lightboxImg.naturalWidth ? Math.min(lightboxImg.offsetWidth * zoomLevel, wrapperRect.width * 2) : imgRect.width;
        var scaledH = lightboxImg.naturalHeight ? Math.min(lightboxImg.offsetHeight * zoomLevel, wrapperRect.height * 2) : imgRect.height;

        var maxPanX = Math.max(0, (scaledW - wrapperRect.width) / 2);
        var maxPanY = Math.max(0, (scaledH - wrapperRect.height) / 2);

        panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
        panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
    }

    function updateZoomLabel() {
        if (!lightbox) return;
        var label = lightbox.querySelector('.gallery-lightbox-zoom-label');
        if (label) label.textContent = Math.round(zoomLevel * 100) + '%';
    }

    // --- Mouse wheel zoom ---
    function handleWheelZoom(e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? 0.85 : 1.18;
        setZoom(zoomLevel * delta);
    }

    // --- Mouse pan ---
    function handlePanStart(e) {
        if (zoomLevel <= 1) return;
        if (e.button !== 0) return; // left click only
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        panOriginX = panX;
        panOriginY = panY;
        e.preventDefault();
    }

    function handlePanMove(e) {
        if (!isPanning) return;
        panX = panOriginX + (e.clientX - panStartX);
        panY = panOriginY + (e.clientY - panStartY);
        constrainPan();
        applyTransform();
    }

    function handlePanEnd() {
        isPanning = false;
    }

    // --- Touch: pinch zoom + pan ---
    var touchStartDist = 0;
    var touchStartZoom = 1;
    var touchStartPanX = 0;
    var touchStartPanY = 0;
    var lastTouchX = 0;
    var lastTouchY = 0;
    var isTouchPanning = false;
    var isPinching = false;

    function getTouchDistance(touches) {
        var dx = touches[0].clientX - touches[1].clientX;
        var dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(e) {
        if (e.touches.length === 2) {
            // Pinch start
            isPinching = true;
            isTouchPanning = false;
            touchStartDist = getTouchDistance(e.touches);
            touchStartZoom = zoomLevel;
            e.preventDefault();
        } else if (e.touches.length === 1 && zoomLevel > 1) {
            // Pan start (single finger when zoomed)
            isTouchPanning = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
            touchStartPanX = panX;
            touchStartPanY = panY;
            e.preventDefault();
        }
    }

    function handleTouchMove(e) {
        if (isPinching && e.touches.length === 2) {
            e.preventDefault();
            var dist = getTouchDistance(e.touches);
            var scale = dist / touchStartDist;
            setZoom(touchStartZoom * scale);
        } else if (isTouchPanning && e.touches.length === 1) {
            e.preventDefault();
            var dx = e.touches[0].clientX - lastTouchX;
            var dy = e.touches[0].clientY - lastTouchY;
            panX = touchStartPanX + dx;
            panY = touchStartPanY + dy;
            constrainPan();
            applyTransform();
        }
    }

    function handleTouchEnd(e) {
        if (e.touches.length < 2) isPinching = false;
        if (e.touches.length === 0) isTouchPanning = false;
    }

    // --- Keyboard navigation ---
    function handleLightboxKeydown(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
            case '+':
            case '=':
                setZoom(zoomLevel * 1.3);
                break;
            case '-':
                setZoom(zoomLevel / 1.3);
                break;
            case '0':
                resetZoom();
                break;
        }
    }

    // =======================================
    // 4. OVERRIDE OLD FUNCTIONS
    // =======================================

    // Override the old openZoom (from main.js) so existing onclick handlers still work
    window.openZoom = function (src) {
        openLightbox([src], 0);
    };

    // Override changePhoto (inline scripts) — keep backward compat
    window.changePhoto = function (srcOrId, maybeSrc) {
        // Handle both signatures:
        // changePhoto('url')           — detail pages (1 arg)
        // changePhoto('id', 'url')     — listing terrain gallery (2 args)
        var src, mainImg;
        if (maybeSrc !== undefined) {
            // 2-arg version: changePhoto(galleryId, src)
            src = maybeSrc;
            mainImg = document.getElementById('main-photo-' + srcOrId);
        } else {
            // 1-arg version: changePhoto(src)
            src = srcOrId;
            mainImg = document.getElementById('main-photo') || document.getElementById('main-detail-photo');
        }
        if (!mainImg) return;

        mainImg.classList.add('gallery-fading');
        setTimeout(function () {
            mainImg.src = src;
            mainImg.onload = function () {
                mainImg.classList.remove('gallery-fading');
            };
            setTimeout(function () {
                mainImg.classList.remove('gallery-fading');
            }, 300);
        }, 200);
    };

    // Override changeDetailPhoto (terrain-chaknok.html)
    window.changeDetailPhoto = function (src) {
        window.changePhoto(src);
    };

    // Override closeZoom (from main.js)
    window.closeZoom = closeLightbox;

    // =======================================
    // 5. INIT ON DOM READY
    // =======================================

    function init() {
        initGalleryThumbnails();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
