/* ============================================
   SETUP — Lenis + GSAP Registration
   ============================================ */
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Initialize Lenis smooth scroll */
let lenis = null;

if (!prefersReducedMotion) {
    lenis = new Lenis({
        smoothWheel: window.innerWidth >= 1024,
        autoRaf: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* ============================================
   CUSTOM CURSOR — gsap.quickTo for 120Hz
   ============================================ */
const cursor = document.getElementById('cursor');
const isDesktop = window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && isDesktop && cursor) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    /* Hover targets — images and interactive elements */
    const hoverTargets = document.querySelectorAll(
        '.panel-image, .bento-img img, .contact-link, .lightbox-prev, .lightbox-next'
    );

    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
} else if (cursor) {
    cursor.style.display = 'none';
}

/* ============================================
   PRELOADER
   ============================================ */
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');

function dismissPreloader() {
    if (!prefersReducedMotion) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.6,
            delay: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
                initAnimations();
            }
        });
    } else {
        preloader.style.display = 'none';
        navbar.style.transform = 'translateY(0)';
    }
}

if (!prefersReducedMotion) {
    const preloaderTl = gsap.timeline();
    preloaderTl
        .from('.preloader-name', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.preloader-line', {
            scaleX: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.4');
}

window.addEventListener('load', () => {
    dismissPreloader();
    /* Slow down hero video for a dreamlike feel */
    const heroVideo = document.querySelector('.hero-media video');
    if (heroVideo) heroVideo.playbackRate = 0.75;
});

/* ============================================
   MAIN ANIMATIONS
   ============================================ */
function initAnimations() {
    if (prefersReducedMotion) return;

    /* — Navbar entrance — */
    gsap.to(navbar, {
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
    });

    /* — Hero Cinemático — */
    gsap.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.hero-eyebrow', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3
    });

    gsap.from('.hero-title .char', {
        y: 60,
        opacity: 0,
        filter: 'blur(12px)',
        scale: 1.2,
        duration: 1.4,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.4
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
    });

    gsap.from('.hero-tagline', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.4
    });

    gsap.from('.scroll-indicator', {
        opacity: 0,
        duration: 1,
        delay: 1.5
    });

    /* — Hero Magnetic Parallax on Mousemove (Desktop) — */
    if (!prefersReducedMotion && window.innerWidth >= 1024) {
        const heroContent = document.querySelector('.hero-content');
        const heroBadge = document.querySelector('.hero-badge');
        
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            // Move title slightly
            gsap.to(heroContent, {
                x: x * -30,
                y: y * -20,
                duration: 1,
                ease: 'power3.out'
            });
            
            // Move badge slightly (reverse direction for depth)
            if (heroBadge) {
                gsap.to(heroBadge, {
                    x: x * 15,
                    y: y * 10,
                    duration: 1.5,
                    ease: 'power3.out'
                });
            }
        });
    }

    /* — Hero parallax on scroll — */
    gsap.to('.hero-media video', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-content', {
        y: -100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            scrub: true
        }
    });

    gsap.to('.scroll-indicator', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '15% top',
            scrub: true
        }
    });

    /* — Gallery header entrance — */
    gsap.from('.gallery-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.gallery-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    /* — Responsive gallery — */
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
        setupHorizontalGallery();
    });

    mm.add('(max-width: 1023px)', () => {
        setupVerticalGallery();
    });

    /* — Bento entrance — */
    gsap.from('.bento-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.bento-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    /* ✦ Bento tiles — cascade entrance with scale + rotation */
    gsap.utils.toArray('.bento-tile').forEach((tile, i) => {
        const rotateDir = i % 2 === 0 ? -3 : 3;
        const xDir = i % 2 === 0 ? -40 : 40;
        const tileImg = tile.querySelector('img');

        gsap.from(tile, {
            y: 70,
            x: xDir,
            opacity: 0,
            scale: 0.85,
            rotate: rotateDir,
            duration: 0.9,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: tile,
                start: 'top 92%',
                toggleActions: 'play none none reverse'
            }
        });

        /* Grayscale → Color for bento images */
        if (tileImg) {
            gsap.fromTo(tileImg,
                { filter: 'grayscale(1) brightness(0.8)' },
                {
                    filter: 'grayscale(0) brightness(1)',
                    duration: 1,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: tile,
                        start: 'top 85%',
                        end: 'top 45%',
                        scrub: true
                    }
                }
            );
        }
    });

    /* — Contact entrance — */
    gsap.from('.contact-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-text', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-link', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-links',
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    });
}

/* ============================================
   GALLERY — Horizontal (Desktop) ✦ Magic Edition
   ============================================ */
function setupHorizontalGallery() {
    const track = document.querySelector('.gallery-track');
    const progressBar = document.getElementById('gallery-progress-bar');
    const panels = gsap.utils.toArray('.gallery-panel');

    const horizontalScroll = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery',
            pin: true,
            scrub: 1,
            end: () => '+=' + track.scrollWidth,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                if (progressBar) {
                    progressBar.style.width = (self.progress * 100) + '%';
                }
            }
        }
    });

    /* ✦ Circle clip-path reveal — expanding from center */
    gsap.utils.toArray('.panel-image-wrapper').forEach((wrapper) => {
        gsap.fromTo(wrapper,
            { clipPath: 'circle(0% at 50% 50%)' },
            {
                clipPath: 'circle(100% at 50% 50%)',
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: wrapper,
                    containerAnimation: horizontalScroll,
                    start: 'left 95%',
                    end: 'left 45%',
                    scrub: true
                }
            }
        );
    });

    /* ✦ 3D panel entrance — scale + alternating rotateY */
    panels.forEach((panel, i) => {
        const direction = i % 2 === 0 ? 8 : -8;
        gsap.fromTo(panel,
            {
                scale: 0.82,
                rotateY: direction,
                opacity: 0.4,
                filter: 'brightness(0.6)'
            },
            {
                scale: 1,
                rotateY: 0,
                opacity: 1,
                filter: 'brightness(1)',
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontalScroll,
                    start: 'left 100%',
                    end: 'left 55%',
                    scrub: true
                }
            }
        );
    });

    /* ✦ Inner parallax — image moves inside its container */
    gsap.utils.toArray('.panel-image').forEach((img) => {
        gsap.fromTo(img,
            { yPercent: -15 },
            {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.gallery-panel'),
                    containerAnimation: horizontalScroll,
                    start: 'left 100%',
                    end: 'right 0%',
                    scrub: true
                }
            }
        );
    });

    /* ✦ Grayscale → Color on scroll — photos come alive */
    gsap.utils.toArray('.panel-image').forEach((img) => {
        gsap.fromTo(img,
            { filter: 'grayscale(1) brightness(0.75)' },
            {
                filter: 'grayscale(0) brightness(1)',
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: img.closest('.gallery-panel'),
                    containerAnimation: horizontalScroll,
                    start: 'left 80%',
                    end: 'left 35%',
                    scrub: true
                }
            }
        );
    });

    /* Counter entrance with scale */
    gsap.utils.toArray('.panel-counter').forEach((counter) => {
        gsap.from(counter, {
            opacity: 0,
            scale: 0.5,
            y: 20,
            scrollTrigger: {
                trigger: counter,
                containerAnimation: horizontalScroll,
                start: 'left 60%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

/* ============================================
   GALLERY — Vertical (Mobile) ✦ Magic Edition
   ============================================ */
function setupVerticalGallery() {
    gsap.utils.toArray('.gallery-panel').forEach((panel, i) => {
        const direction = i % 2 === 0 ? -30 : 30;
        const img = panel.querySelector('.panel-image');

        gsap.from(panel, {
            y: 80,
            x: direction,
            opacity: 0,
            scale: 0.9,
            rotate: i % 2 === 0 ? -2 : 2,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: panel,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });

        /* Grayscale → Color on mobile too */
        if (img) {
            gsap.fromTo(img,
                { filter: 'grayscale(1) brightness(0.75)' },
                {
                    filter: 'grayscale(0) brightness(1)',
                    duration: 1.2,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 80%',
                        end: 'top 40%',
                        scrub: true
                    }
                }
            );
        }
    });
}

/* ============================================
   BENTO — 3D Perspective Hover
   ============================================ */
if (!prefersReducedMotion && window.innerWidth >= 1024) {
    document.querySelectorAll('.bento-img').forEach((tile) => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(tile, {
                rotateY: x * 12,
                rotateX: -y * 12,
                transformPerspective: 800,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        tile.addEventListener('mouseleave', () => {
            gsap.to(tile, {
                rotateX: 0,
                rotateY: 0,
                ease: 'power3.out',
                duration: 0.8
            });
        });
    });

    /* ✦ Bento Hover Spotlight */
    document.querySelectorAll('.bento-about, .bento-quote, .bento-stats').forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            tile.style.setProperty('--mouse-x', `${x}px`);
            tile.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ✦ Bento Stats Counter Animation */
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        ScrollTrigger.create({
            trigger: '.bento-stats',
            start: 'top 85%',
            onEnter: () => {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target') || 0, 10);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    const proxy = { val: 0 };
                    gsap.to(proxy, {
                        val: target,
                        duration: 2.5,
                        ease: "power3.out",
                        onUpdate: () => {
                            stat.innerText = Math.round(proxy.val) + suffix;
                        }
                    });
                });
            },
            once: true
        });
    }

    /* ✦ Magnetic Buttons */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    /* ✦ Parallax Footer Reveal */
    gsap.fromTo('.footer-parallax-wrapper', 
        { yPercent: -30 }, 
        { 
            yPercent: 0, 
            ease: "none", 
            scrollTrigger: {
                trigger: '.footer-parallax-wrapper',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true
            }
        }
    );
}

/* ============================================
   LIGHTBOX — with Navigation
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxCaption = document.getElementById('lightbox-caption');
const allImages = Array.from(document.querySelectorAll('.panel-image, .bento-img img'));
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage(false);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % allImages.length;
    updateLightboxImage(true);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    updateLightboxImage(true);
}

function updateLightboxImage(animate) {
    if (animate && !prefersReducedMotion) {
        gsap.to(lightboxImg, {
            opacity: 0,
            scale: 0.95,
            duration: 0.12,
            onComplete: () => {
                setLightboxSrc();
                gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.2 });
            }
        });
    } else {
        setLightboxSrc();
    }
}

function setLightboxSrc() {
    const img = allImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${allImages.length}`;

    /* Show caption from data-caption attribute */
    const caption = img.dataset.caption || '';
    lightboxCaption.textContent = caption;

    /* Animate caption entrance */
    if (caption && !prefersReducedMotion) {
        gsap.fromTo(lightboxCaption,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: 'power3.out' }
        );
    }
}

/* Click handlers */
allImages.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(i));
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', prevImage);
document.querySelector('.lightbox-next').addEventListener('click', nextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

/* Keyboard navigation */
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    switch (e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowRight': nextImage(); break;
        case 'ArrowLeft': prevImage(); break;
    }
});

/* Touch swipe */
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    /* Only swipe if horizontal movement is dominant */
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) nextImage();
        else prevImage();
    }
}, { passive: true });

/* ============================================
   AUDIO TOGGLE
   ============================================ */
const audioToggle = document.getElementById('audio-toggle');
const bgAudio = document.getElementById('bg-audio');

audioToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
        bgAudio.play().then(() => {
            audioToggle.classList.add('playing');
            audioToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }).catch(() => {
            /* Autoplay blocked — silently fail */
        });
    } else {
        bgAudio.pause();
        audioToggle.classList.remove('playing');
        audioToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
    }
});

/* ============================================
   SMOOTH NAV SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        /* Close mobile menu if open */
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (lenis) {
            lenis.scrollTo(target, { offset: 0, duration: 1.2 });
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   NAVBAR — Hide on scroll down, show on scroll up
   ============================================ */
{
    let lastY = 0;
    const navbarEl = document.getElementById('navbar');
    const scrollThreshold = 80;

    function handleNavScroll(currentY) {
        if (currentY <= scrollThreshold) {
            navbarEl.classList.remove('hidden');
            navbarEl.classList.add('visible');
            return;
        }
        if (currentY > lastY) {
            /* Scrolling down */
            navbarEl.classList.add('hidden');
            navbarEl.classList.remove('visible');
        } else {
            /* Scrolling up */
            navbarEl.classList.remove('hidden');
            navbarEl.classList.add('visible');
        }
        lastY = currentY;
    }

    if (lenis) {
        lenis.on('scroll', ({ scroll }) => handleNavScroll(scroll));
    } else {
        window.addEventListener('scroll', () => handleNavScroll(window.scrollY), { passive: true });
    }
}

/* ============================================
   HAMBURGER — Mobile menu toggle
   ============================================ */
{
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            if (lenis) {
                isOpen ? lenis.stop() : lenis.start();
            }
        });
    }
}