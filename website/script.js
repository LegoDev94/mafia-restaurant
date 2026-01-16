/**
 * MAFIA Restaurant - Ultimate WOW Website JavaScript
 * ==================================================
 * Enhanced interactivity, GSAP animations, and premium effects
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    ParticlesSystem.init();
    CustomCursor.init();
    Navigation.init();
    HeroAnimations.init();
    TypingEffect.init();
    MenuSystem.init();
    ReviewsSlider.init();
    GalleryLightbox.init();
    BookingForm.init();
    ScrollEffects.init();
    MagneticElements.init();
    TiltCards.init();
    CartSystem.init();
});

/**
 * Preloader Module with animated letters
 */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        const letters = preloader.querySelectorAll('.letter');
        const progressBar = preloader.querySelector('.preloader-progress-bar');

        // Animate letters
        letters.forEach((letter, index) => {
            gsap.fromTo(letter,
                { opacity: 0, y: 30, rotationX: -90 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                }
            );
        });

        // Progress bar animation
        gsap.to(progressBar, {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut'
        });

        // Hide preloader
        window.addEventListener('load', () => {
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        preloader.classList.add('hidden');
                        document.body.classList.remove('no-scroll');
                        // Trigger entrance animations
                        HeroAnimations.playEntranceAnimation();
                    }
                });
            }, 1500);
        });

        // Fallback
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
            }
        }, 4000);
    }
};

/**
 * Floating Particles Background
 */
const ParticlesSystem = {
    init() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(201, 168, 108, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
            `;
            container.appendChild(particle);

            // Animate particle
            gsap.to(particle, {
                y: -window.innerHeight,
                x: `+=${Math.random() * 200 - 100}`,
                opacity: 0,
                duration: Math.random() * 10 + 10,
                repeat: -1,
                delay: Math.random() * 5,
                ease: 'none'
            });
        }
    }
};

/**
 * Custom Cursor with text and effects
 */
const CustomCursor = {
    cursor: null,
    cursorDot: null,
    cursorRing: null,
    cursorText: null,
    mouseX: 0,
    mouseY: 0,

    init() {
        // Only on desktop with hover capability
        if (window.matchMedia('(max-width: 1024px)').matches ||
            !window.matchMedia('(hover: hover)').matches) {
            return;
        }

        this.cursor = document.getElementById('cursor');
        if (!this.cursor) return;

        this.cursorDot = this.cursor.querySelector('.cursor-dot');
        this.cursorRing = this.cursor.querySelector('.cursor-ring');
        this.cursorText = this.cursor.querySelector('.cursor-text');

        this.bindEvents();
        this.animate();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover effects on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .menu-item, .gallery-item, .review-card, .tilt-card');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');

                // Show cursor text for specific elements
                if (el.classList.contains('menu-item')) {
                    this.showCursorText('Подробнее');
                } else if (el.classList.contains('gallery-item')) {
                    this.showCursorText('Смотреть');
                }
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.hideCursorText();
            });
        });

        // Hide cursor on leave
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    },

    animate() {
        gsap.to(this.cursorDot, {
            x: this.mouseX,
            y: this.mouseY,
            duration: 0.1,
            ease: 'power2.out'
        });

        gsap.to(this.cursorRing, {
            x: this.mouseX,
            y: this.mouseY,
            duration: 0.3,
            ease: 'power2.out'
        });

        requestAnimationFrame(() => this.animate());
    },

    showCursorText(text) {
        if (this.cursorText) {
            this.cursorText.textContent = text;
            this.cursor.classList.add('show-text');
        }
    },

    hideCursorText() {
        if (this.cursor) {
            this.cursor.classList.remove('show-text');
        }
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navToggle &&
                !this.navMenu.contains(e.target) &&
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    },

    closeMenu() {
        if (this.navToggle) this.navToggle.classList.remove('active');
        if (this.navMenu) this.navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/**
 * Hero Animations with GSAP
 */
const HeroAnimations = {
    init() {
        this.animateCounters();
        this.initParallax();
    },

    playEntranceAnimation() {
        const tl = gsap.timeline();

        // Animate hero elements sequentially
        tl.fromTo('.hero-badge',
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo('.title-small',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo('.title-main',
            { opacity: 0, scale: 0.8, rotationX: 30 },
            { opacity: 1, scale: 1, rotationX: 0, duration: 0.8, ease: 'back.out(1.7)' },
            '-=0.3'
        )
        .fromTo('.title-tagline .word',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
            '-=0.4'
        )
        .fromTo('.hero-description',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo('.hero-buttons .btn',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo('.stat-card',
            { opacity: 0, y: 40, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' },
            '-=0.2'
        )
        .fromTo('.hero-scroll',
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            '-=0.2'
        )
        .fromTo('.hero-social .social-link',
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo('.float-icon',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' },
            '-=0.5'
        );
    },

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = target % 1 !== 0;

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: isDecimal ? 0.1 : 1 },
                        onUpdate: function() {
                            const val = parseFloat(counter.innerText);
                            counter.innerText = isDecimal ? val.toFixed(1) : Math.round(val);
                        }
                    });
                }
            });
        });
    },

    initParallax() {
        const heroBg = document.querySelector('.hero-bg');
        const shapes = document.querySelectorAll('.shape');
        const floatIcons = document.querySelectorAll('.float-icon');

        if (heroBg) {
            gsap.to(heroBg, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 200
            });
        }

        shapes.forEach((shape, index) => {
            gsap.to(shape, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100 + index * 50,
                rotation: index % 2 === 0 ? 45 : -45
            });
        });
    }
};

/**
 * Typing Effect for About Section
 */
const TypingEffect = {
    words: ['традиции', 'эмоции', 'воспоминания', 'праздники'],
    currentIndex: 0,

    init() {
        this.element = document.querySelector('.typed-text');
        if (!this.element) return;

        this.type();
    },

    type() {
        const word = this.words[this.currentIndex];
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            this.element.textContent = word.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === word.length) {
                clearInterval(typeInterval);
                setTimeout(() => this.erase(), 2000);
            }
        }, 100);
    },

    erase() {
        let charIndex = this.element.textContent.length;

        const eraseInterval = setInterval(() => {
            this.element.textContent = this.element.textContent.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                clearInterval(eraseInterval);
                this.currentIndex = (this.currentIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
            }
        }, 50);
    }
};

/**
 * Menu System with Filtering and 3D Cards
 */
const MenuSystem = {
    init() {
        this.tabs = document.querySelectorAll('.menu-tab');
        this.items = document.querySelectorAll('.menu-item');
        this.grid = document.getElementById('menu-grid');

        if (!this.tabs.length || !this.items.length) return;

        this.bindEvents();
        this.initCardFlip();
        this.initScrollAnimation();
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.filterItems(category);
                this.updateActiveTab(tab);
            });
        });
    },

    filterItems(category) {
        this.items.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;

            if (shouldShow) {
                gsap.to(item, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: 'back.out(1.4)',
                    onStart: () => {
                        item.style.display = 'block';
                    }
                });
            } else {
                gsap.to(item, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    },

    updateActiveTab(activeTab) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');

        // Animate tab indicator
        gsap.fromTo(activeTab,
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: 'back.out(2)' }
        );
    },

    initCardFlip() {
        this.items.forEach(item => {
            const inner = item.querySelector('.menu-item-inner');
            if (!inner) return;

            item.addEventListener('click', (e) => {
                // Don't flip if clicking add to cart button
                if (e.target.closest('.add-to-cart')) return;

                item.classList.toggle('flipped');
            });

            // Touch support
            item.addEventListener('touchstart', () => {}, { passive: true });
        });
    },

    initScrollAnimation() {
        this.items.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50, rotateX: -15 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    },
                    delay: (index % 4) * 0.1
                }
            );
        });
    }
};

/**
 * Reviews Slider with Auto-scroll
 */
const ReviewsSlider = {
    init() {
        this.track = document.querySelector('.reviews-track');
        this.cards = document.querySelectorAll('.review-card');
        this.prevBtn = document.querySelector('.review-nav.prev');
        this.nextBtn = document.querySelector('.review-nav.next');
        this.dotsContainer = document.querySelector('.reviews-dots');

        if (!this.track || !this.cards.length) return;

        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
        this.autoSlideInterval = null;

        this.createDots();
        this.bindEvents();
        this.updateSlider();
        this.startAutoSlide();
    },

    getCardsToShow() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    },

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        const dotsCount = this.maxIndex + 1;

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    },

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Update on resize
        window.addEventListener('resize', () => {
            this.cardsToShow = this.getCardsToShow();
            this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
            if (this.currentIndex > this.maxIndex) {
                this.currentIndex = this.maxIndex;
            }
            this.createDots();
            this.updateSlider();
        });

        // Pause on hover
        if (this.track) {
            this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.track.addEventListener('mouseleave', () => this.startAutoSlide());
        }

        // Swipe support
        this.initSwipe();
    },

    initSwipe() {
        let startX = 0;
        let endX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoSlide();
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.startAutoSlide();
        });
    },

    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateSlider();
    },

    next() {
        this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
        this.updateSlider();
    },

    goTo(index) {
        this.currentIndex = index;
        this.updateSlider();
    },

    updateSlider() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.track).gap) || 24;
        const offset = this.currentIndex * (cardWidth + gap);

        gsap.to(this.track, {
            x: -offset,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    },

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSlider();
        }, 5000);
    },

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
};

/**
 * Gallery Lightbox
 */
const GalleryLightbox = {
    init() {
        this.items = document.querySelectorAll('.gallery-item');
        this.lightbox = document.getElementById('gallery-lightbox');

        if (!this.items.length) return;

        this.bindEvents();
        this.initScrollAnimation();
    },

    bindEvents() {
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                // For demo, just show a visual effect
                gsap.fromTo(item,
                    { scale: 1 },
                    { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
                );
            });
        });

        // Close lightbox
        if (this.lightbox) {
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeLightbox());
            }

            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }
    },

    initScrollAnimation() {
        this.items.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    },
                    delay: index * 0.1
                }
            );
        });
    },

    openLightbox(item) {
        if (!this.lightbox) return;

        this.lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    },

    closeLightbox() {
        if (!this.lightbox) return;

        this.lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

/**
 * Booking Form with Validation
 */
const BookingForm = {
    init() {
        this.form = document.getElementById('booking-form');
        this.modal = document.getElementById('success-modal');

        if (!this.form) return;

        this.setMinDate();
        this.bindEvents();
        this.initInputAnimations();
    },

    setMinDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Modal close events
        if (this.modal) {
            const closeBtn = this.modal.querySelector('.modal-close');
            const overlay = this.modal.querySelector('.modal-overlay');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }

            if (overlay) {
                overlay.addEventListener('click', () => this.closeModal());
            }
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Phone formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhone(e));
        }
    },

    initInputAnimations() {
        const inputs = this.form.querySelectorAll('.form-control');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    borderColor: '#c9a86c',
                    boxShadow: '0 0 0 3px rgba(201, 168, 108, 0.2)',
                    duration: 0.3
                });
            });

            input.addEventListener('blur', () => {
                gsap.to(input, {
                    borderColor: input.value ? '#c9a86c' : 'rgba(255,255,255,0.1)',
                    boxShadow: '0 0 0 0 transparent',
                    duration: 0.3
                });
            });
        });
    },

    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('373')) {
            value = '+' + value;
        } else if (value.startsWith('0')) {
            value = '+373' + value.substring(1);
        }

        e.target.value = value;
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (!this.validateForm(data)) {
            return;
        }

        // Show success modal with animation
        this.showModal();

        // Reset form
        this.form.reset();

        console.log('Booking submitted:', data);
    },

    validateForm(data) {
        const validations = [
            { field: 'name', check: data.name && data.name.trim().length >= 2, message: 'Пожалуйста, введите ваше имя' },
            { field: 'phone', check: data.phone && data.phone.trim().length >= 6, message: 'Пожалуйста, введите корректный номер телефона' },
            { field: 'date', check: data.date, message: 'Пожалуйста, выберите дату' },
            { field: 'time', check: data.time, message: 'Пожалуйста, выберите время' },
            { field: 'guests', check: data.guests, message: 'Пожалуйста, укажите количество гостей' }
        ];

        for (const validation of validations) {
            if (!validation.check) {
                this.showError(validation.field, validation.message);
                return false;
            }
        }

        return true;
    },

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            gsap.to(field, {
                borderColor: '#ff6b6b',
                duration: 0.3,
                yoyo: true,
                repeat: 2
            });

            // Shake animation
            gsap.fromTo(field,
                { x: -10 },
                { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
            );

            field.focus();
        }

        // Show toast notification instead of alert
        this.showToast(message, 'error');
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === 'error' ? '#ff6b6b' : '#51cf66'};
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(toast);

        gsap.to(toast, {
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });

        setTimeout(() => {
            gsap.to(toast, {
                y: 100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => toast.remove()
            });
        }, 3000);
    },

    showModal() {
        if (!this.modal) return;

        this.modal.classList.add('active');
        document.body.classList.add('no-scroll');

        // Animate modal content
        const content = this.modal.querySelector('.modal-content');
        if (content) {
            gsap.fromTo(content,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    },

    closeModal() {
        if (!this.modal) return;

        const content = this.modal.querySelector('.modal-content');
        if (content) {
            gsap.to(content, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.modal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        } else {
            this.modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
};

/**
 * Scroll Effects and Animations
 */
const ScrollEffects = {
    init() {
        this.backToTop = document.getElementById('back-to-top');
        this.initBackToTop();
        this.initSmoothScroll();
        this.initRevealAnimations();
        this.initSectionAnimations();
    },

    initBackToTop() {
        if (!this.backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        });

        this.backToTop.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: 0,
                duration: 1,
                ease: 'power2.inOut'
            });
        });
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    gsap.to(window, {
                        scrollTo: targetPosition,
                        duration: 1,
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    },

    initRevealAnimations() {
        // Reveal text animations
        const revealTexts = document.querySelectorAll('.reveal-text p');

        revealTexts.forEach((text, index) => {
            gsap.fromTo(text,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 85%',
                        once: true
                    },
                    delay: index * 0.2
                }
            );
        });
    },

    initSectionAnimations() {
        // Section headers
        const headers = document.querySelectorAll('.section-header, .section-header-left');

        headers.forEach(header => {
            const tag = header.querySelector('.section-tag');
            const title = header.querySelector('.section-title');
            const desc = header.querySelector('.section-desc');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    once: true
                }
            });

            if (tag) {
                tl.fromTo(tag,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5 }
                );
            }

            if (title) {
                tl.fromTo(title,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.3'
                );
            }

            if (desc) {
                tl.fromTo(desc,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    '-=0.3'
                );
            }
        });

        // Feature items
        const featureItems = document.querySelectorAll('.feature-item, .atm-card');

        featureItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    },
                    delay: (index % 4) * 0.1
                }
            );
        });
    }
};

/**
 * Magnetic Elements Effect
 */
const MagneticElements = {
    init() {
        if (window.matchMedia('(max-width: 1024px)').matches) return;

        const elements = document.querySelectorAll('.magnetic');

        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }
};

/**
 * Tilt Cards Effect
 */
const TiltCards = {
    init() {
        if (window.matchMedia('(max-width: 1024px)').matches) return;

        const cards = document.querySelectorAll('.tilt-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }
};

/**
 * Shopping Cart System
 */
const CartSystem = {
    items: [],

    init() {
        this.widget = document.getElementById('cart-widget');
        this.badge = document.querySelector('.cart-badge');
        this.panel = document.getElementById('cart-panel');
        this.itemsList = document.querySelector('.cart-items');
        this.totalElement = document.querySelector('.cart-total-amount');

        this.bindEvents();
        this.load();
    },

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuItem = btn.closest('.menu-item');
                if (menuItem) {
                    this.addItem(menuItem);
                }
            });
        });

        // Toggle cart panel
        if (this.widget) {
            this.widget.addEventListener('click', () => this.togglePanel());
        }

        // Close cart panel
        const closeBtn = document.querySelector('.cart-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }

        // Clear cart
        const clearBtn = document.querySelector('.clear-cart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }
    },

    addItem(menuItem) {
        const name = menuItem.querySelector('h3').textContent;
        const priceText = menuItem.querySelector('.item-price').textContent;
        const price = parseInt(priceText.replace(/\D/g, ''));

        const existingItem = this.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ name, price, quantity: 1 });
        }

        this.updateUI();
        this.save();
        this.showAddedAnimation(menuItem);
    },

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.updateUI();
        this.save();
    },

    updateQuantity(name, delta) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(name);
            } else {
                this.updateUI();
                this.save();
            }
        }
    },

    clearCart() {
        this.items = [];
        this.updateUI();
        this.save();
    },

    updateUI() {
        // Update badge
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (this.badge) {
            this.badge.textContent = totalItems;
            this.badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update widget visibility
        if (this.widget) {
            this.widget.classList.toggle('has-items', totalItems > 0);
        }

        // Update items list
        if (this.itemsList) {
            if (this.items.length === 0) {
                this.itemsList.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
            } else {
                this.itemsList.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-price">${item.price * item.quantity} ₽</span>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-name="${item.name}">-</button>
                            <span class="qty">${item.quantity}</span>
                            <button class="qty-btn plus" data-name="${item.name}">+</button>
                        </div>
                    </div>
                `).join('');

                // Bind quantity buttons
                this.itemsList.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.dataset.name;
                        const delta = btn.classList.contains('plus') ? 1 : -1;
                        this.updateQuantity(name, delta);
                    });
                });
            }
        }

        // Update total
        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (this.totalElement) {
            this.totalElement.textContent = total + ' ₽';
        }
    },

    showAddedAnimation(menuItem) {
        // Create flying element
        const fly = document.createElement('div');
        fly.className = 'fly-to-cart';
        fly.innerHTML = '<i class="fas fa-check"></i>';
        fly.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            background: var(--color-primary);
            color: var(--color-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            pointer-events: none;
        `;

        const rect = menuItem.getBoundingClientRect();
        fly.style.left = rect.left + rect.width / 2 - 20 + 'px';
        fly.style.top = rect.top + rect.height / 2 - 20 + 'px';

        document.body.appendChild(fly);

        // Animate to cart widget
        const cartRect = this.widget ? this.widget.getBoundingClientRect() : { right: 30, bottom: 30 };

        gsap.to(fly, {
            x: cartRect.left - rect.left - rect.width / 2 + 30,
            y: cartRect.top - rect.top - rect.height / 2 + 30,
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => fly.remove()
        });

        // Pulse cart widget
        if (this.widget) {
            gsap.fromTo(this.widget,
                { scale: 1 },
                { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
        }

        // Show toast
        BookingForm.showToast('Добавлено в корзину!', 'success');
    },

    togglePanel() {
        if (this.panel) {
            this.panel.classList.toggle('active');
        }
    },

    closePanel() {
        if (this.panel) {
            this.panel.classList.remove('active');
        }
    },

    save() {
        localStorage.setItem('mafia-cart', JSON.stringify(this.items));
    },

    load() {
        const saved = localStorage.getItem('mafia-cart');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
                this.updateUI();
            } catch (e) {
                this.items = [];
            }
        }
    }
};

/**
 * Console Easter Egg
 */
console.log('%c🍕 MAFIA Restaurant 🍣', 'font-size: 24px; font-weight: bold; color: #c9a86c;');
console.log('%cДобро пожаловать в лучший ресторан Тирасполя!', 'font-size: 14px; color: #888;');
console.log('%cул. Юности 14/3 | +373 533 78 080', 'font-size: 12px; color: #666;');
console.log('%c@balka_mafia', 'font-size: 12px; color: #c9a86c;');
