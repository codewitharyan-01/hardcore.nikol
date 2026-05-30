// ====== PRELOADER ======
(function() {
    document.documentElement.classList.add('loading');
    document.body.classList.add('loading');
    window.addEventListener('load', function() {
        setTimeout(function() {
            var preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('done');
                document.documentElement.classList.remove('loading');
                document.body.classList.remove('loading');
                setTimeout(function() { preloader.remove(); }, 900);
            }
        }, 0);
    });
})();

// ====== SMOOTH CUSTOM CURSOR ======
document.addEventListener('DOMContentLoaded', function initCursor() {
    // Detect touch/mobile — skip cursor on those
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        document.body.classList.add('mobile-device');
        return;
    }

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'custom-cursor-dot';
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    const lerpFactor = 0.12; // Ring lags behind dot — feels like it's "chasing"

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot snaps immediately
        dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }, { passive: true });

    // Lerp the ring for the smooth trail effect
    function animateCursor() {
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Grow cursor on interactive elements
    const interactiveSelectors = 'a, button, [class*="btn"], input, select, .hamburger, .carousel-nav, .mem-btn, .testi-prev-c, .testi-next-c, .close-modal, .close-popup, .mega-slide-link, .mobile-link, .popup-btn';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.add('cursor-link');
        }
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.remove('cursor-link');
        }
    }, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Staggered Text Reveal & Rotation for Hero
    const heroTitle = document.querySelector('.stagger-text');
    if (heroTitle) {
        const phrases = [
            "Push Your <br><span style='color: var(--color-yellow);'>Limits.</span>",
            "Turn Your <br><span style='color: var(--color-yellow);'>Hopes</span> Into <br>Reality."
        ];

        const renderPhrase = (htmlString) => {
            heroTitle.innerHTML = '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;

            let delay = 0;

            Array.from(tempDiv.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(/\s+/).filter(w => w.length > 0);
                    words.forEach(word => {
                        const wordSpan = document.createElement('span');
                        wordSpan.classList.add('stagger-word');
                        wordSpan.innerHTML = word + '&nbsp;';
                        wordSpan.style.animationDelay = `${delay}s`;
                        heroTitle.appendChild(wordSpan);
                        delay += 0.08;
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'BR') {
                        heroTitle.appendChild(document.createElement('br'));
                    } else if (node.tagName === 'SPAN') {
                        const words = node.textContent.split(/\s+/).filter(w => w.length > 0);
                        words.forEach(word => {
                            const wordSpan = document.createElement('span');
                            wordSpan.classList.add('stagger-word');
                            wordSpan.innerHTML = word + '&nbsp;';
                            const nodeStyle = node.getAttribute('style') || '';
                            wordSpan.setAttribute('style', `${nodeStyle}; animation-delay: ${delay}s;`);
                            heroTitle.appendChild(wordSpan);
                            delay += 0.08;
                        });
                    }
                }
            });
        };

        let currentIndex = 0;
        renderPhrase(phrases[0]);

        setInterval(() => {
            Array.from(heroTitle.children).forEach(child => {
                if (child.tagName === 'SPAN') {
                    child.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    child.style.opacity = '0';
                    child.style.transform = 'translate3d(0, -40px, -100px) rotateX(20deg) scale(0.9)';
                    child.style.filter = 'blur(15px)';
                }
            });

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % phrases.length;
                renderPhrase(phrases[currentIndex]);
            }, 800);
        }, 8000);
    }

    // 1.b Hero Image Carousel — smooth cross-fade
    const heroImg = document.getElementById('hero-carousel');
    const heroImages = Array.from({ length: 21 }, (_, i) => `${i + 1}.webp`);
    let heroIdx = 0;
    if (heroImg) {
        heroImg.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        setInterval(() => {
            heroImg.style.opacity = '0';
            setTimeout(() => {
                heroIdx = (heroIdx + 1) % heroImages.length;
                heroImg.src = heroImages[heroIdx];
                heroImg.style.opacity = '1';
            }, 400);
        }, 4000);
    }

    // 2. Live Gym Status
    const updateGymStatus = () => {
        const statusDot  = document.querySelector('.dot');
        const statusText = document.querySelector('.status-text');
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 23) {
            statusDot.className  = 'dot open';
            statusText.innerText = 'GYM IS OPEN';
        } else {
            statusDot.className  = 'dot closed';
            statusText.innerText = 'GYM IS CLOSED';
        }
    };
    updateGymStatus();
    setInterval(updateGymStatus, 60000);

    // 3. Smooth Scroll (offset for sticky nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.parentElement.classList.contains('has-mega-menu')) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
                return;
            }
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 75;
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            if (mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        const megaMenu = document.querySelector('.has-mega-menu');
        if (megaMenu && !megaMenu.contains(e.target)) {
            megaMenu.classList.remove('active');
        }
    });

    // 4. Off-Canvas Mobile Drawer Toggle
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');
    const closeMobileBtn = document.getElementById('close-mobile-menu');

    hamburger.addEventListener('click', () => {
        const isActive = !hamburger.classList.contains('active');
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    if (closeMobileBtn) {
        closeMobileBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 5. Booking Modal Logic
    const modal   = document.getElementById('booking-modal');
    const triggers = document.querySelectorAll('.trigger-modal');
    const closeBtn = document.querySelector('.close-modal');

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            if (mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name    = document.getElementById('eq-name').value;
            const contact = '+91 ' + document.getElementById('eq-contact').value.trim();
            const message = `Hello Hardcore Fitness!%0AI would like to make an enquiry.%0A%0A*Name:* ${name}%0A*Contact Number:* ${contact}`;
            const waUrl   = `https://wa.me/919687222006?text=${message}`;
            window.open(waUrl, '_blank');

            const btn = enquiryForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Opening WhatsApp...';
            btn.style.backgroundColor = '#25D366';
            btn.style.color = 'var(--color-white)';

            setTimeout(() => {
                modal.classList.remove('active');
                enquiryForm.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 500);
            }, 1500);
        });
    }

    // 6. Magnetic Button Physics (rAF optimised)
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach((el) => {
        let bounds  = el.getBoundingClientRect();
        let mouseX  = 0, mouseY  = 0;
        let currentX = 0, currentY = 0;
        let isHovered = false;

        window.addEventListener('resize', () => { bounds = el.getBoundingClientRect(); }, { passive: true });

        const animate = () => {
            if (isHovered) {
                currentX += (mouseX - currentX) * 0.2;
                currentY += (mouseY - currentY) * 0.2;
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                requestAnimationFrame(animate);
            } else {
                currentX += (0 - currentX) * 0.1;
                currentY += (0 - currentY) * 0.1;
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    el.style.transform = 'translate3d(0, 0, 0)';
                }
            }
        };

        el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); isHovered = true; animate(); });
        el.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - bounds.left - bounds.width  / 2) * 0.4;
            mouseY = (e.clientY - bounds.top  - bounds.height / 2) * 0.4;
        });
        el.addEventListener('mouseleave', () => { isHovered = false; });
    });

    // 8. Intersection Observer for fade-up reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
    };

    const animateCounters = (counterElement) => {
        const target   = +counterElement.getAttribute('data-target');
        const duration = 2000;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress    = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            counterElement.innerText = Math.floor(easeProgress * target) + (target > 1000 ? '+' : '');
            if (progress < 1) window.requestAnimationFrame(step);
            else counterElement.innerText = target + (target > 1000 ? '+' : '');
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) animateCounters(counter);
                }
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .hero-image').forEach(el => observer.observe(el));

    // 10. Real-time BMI Dashboard
    const bmiWeight = document.getElementById('bmi-weight');
    const bmiHeight = document.getElementById('bmi-height');
    const weightVal = document.getElementById('weight-val');
    const heightVal = document.getElementById('height-val');
    const bmiValue  = document.getElementById('bmi-value');
    const bmiStatus = document.getElementById('bmi-status');
    const bmiNeedle = document.getElementById('bmi-needle');

    const updateBMI = () => {
        const weight   = parseFloat(bmiWeight.value);
        const heightCm = parseFloat(bmiHeight.value);
        weightVal.textContent = weight;
        heightVal.textContent = heightCm;
        if (weight > 0 && heightCm > 0) {
            const heightM = heightCm / 100;
            const bmi     = (weight / (heightM * heightM)).toFixed(1);
            bmiValue.textContent = bmi;
            let status = '', color = '';
            let rawScale = (bmi - 15) / (40 - 15) * 100;
            const percentage = Math.max(0, Math.min(100, rawScale));
            if (bmi < 18.5)              { status = 'Underweight';   color = '#3498db'; }
            else if (bmi <= 24.9)        { status = 'Optimal Weight'; color = '#2ecc71'; }
            else if (bmi <= 29.9)        { status = 'Overweight';    color = '#f1c40f'; }
            else                          { status = 'Obese';          color = '#e74c3c'; }
            bmiStatus.textContent = status;
            bmiStatus.style.color = color;
            bmiNeedle.style.left  = `${percentage}%`;
        }
    };

    if (bmiWeight && bmiHeight) {
        bmiWeight.addEventListener('input', updateBMI);
        bmiHeight.addEventListener('input', updateBMI);
        updateBMI();
    }

    // ============================================================
    // 11–13.  UNIFIED SMOOTH SCROLL ANIMATION LOOP
    // All horizontal scroll tracks use lerp (linear interpolation)
    // so motion is perfectly buttery — no abrupt jumps.
    // ============================================================

    const LERP = 0.09; // Smoothing factor (0 = frozen, 1 = instant)

    // --- 11. Facilities Slider (scroll-linked, crossfade) ---
    const facilitySection = document.getElementById('facility');
    const scrollSlides    = facilitySection ? facilitySection.querySelectorAll('.minimal-slider-slide') : [];

    // --- 12. Trainer Horizontal Scroll ---
    const trainerSection = document.getElementById('trainers');
    const trainerTrack   = document.getElementById('trainer-scroll-track');
    let trainerTargetX   = 0;
    let trainerCurrentX  = 0;

    // --- 12.5. Programs Horizontal Scroll ---
    const programSection = document.getElementById('programs');
    const programTrack   = document.getElementById('program-scroll-track');
    let programTargetX   = 0;
    let programCurrentX  = 0;

    // --- 13. Stacking Panels ---
    const stackPanels = document.querySelectorAll('.stack-panel');

    // Single unified RAF loop
    let lastScrollY = window.scrollY;

    function unifiedScrollLoop() {
        const scrollY = window.scrollY;

        // ---- Facility Slider ----
        if (facilitySection && scrollSlides.length > 0) {
            const rect = facilitySection.getBoundingClientRect();
            const scrollDistance = 75 - rect.top;
            const maxScroll = rect.height - window.innerHeight;
            let slideIndex = 0;
            if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                const progress = scrollDistance / maxScroll;
                slideIndex = Math.min(Math.floor(progress * scrollSlides.length), scrollSlides.length - 1);
            } else if (scrollDistance > maxScroll) {
                slideIndex = scrollSlides.length - 1;
            }
            scrollSlides.forEach((slide, i) => {
                if (i === slideIndex) slide.classList.add('active');
                else slide.classList.remove('active');
            });
        }

        // ---- Trainer Track (lerp) ----
        if (trainerSection && trainerTrack) {
            const rect = trainerSection.getBoundingClientRect();
            const scrollDistance = 75 - rect.top;
            const maxScroll = rect.height - window.innerHeight;
            if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                const progress = scrollDistance / maxScroll;
                trainerTargetX = progress * (trainerTrack.scrollWidth - window.innerWidth);
            } else if (scrollDistance < 0) {
                trainerTargetX = 0;
            } else {
                trainerTargetX = trainerTrack.scrollWidth - window.innerWidth;
            }
            trainerCurrentX += (trainerTargetX - trainerCurrentX) * LERP;
            if (Math.abs(trainerCurrentX - trainerTargetX) > 0.5) {
                trainerTrack.style.transform = `translate3d(-${trainerCurrentX}px, 0, 0)`;
            } else {
                trainerCurrentX = trainerTargetX;
                trainerTrack.style.transform = `translate3d(-${trainerTargetX}px, 0, 0)`;
            }
        }

        // ---- Program Track (lerp) ----
        if (programSection && programTrack) {
            const rect = programSection.getBoundingClientRect();
            const scrollDistance = 75 - rect.top;
            const maxScroll = rect.height - window.innerHeight;
            const programCards = programTrack.querySelectorAll('.program-card');
            if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                const progress = scrollDistance / maxScroll;
                programTargetX = progress * (programTrack.scrollWidth - window.innerWidth);
            } else if (scrollDistance < 0) {
                programTargetX = 0;
            } else {
                programTargetX = programTrack.scrollWidth - window.innerWidth;
            }
            programCurrentX += (programTargetX - programCurrentX) * LERP;
            if (Math.abs(programCurrentX - programTargetX) > 0.5) {
                programTrack.style.transform = `translate3d(-${programCurrentX}px, 0, 0)`;
            } else {
                programCurrentX = programTargetX;
                programTrack.style.transform = `translate3d(-${programTargetX}px, 0, 0)`;
            }

            // Card highlight — batch reads then writes
            if (programCards.length > 0) {
                const windowCenter = window.innerWidth / 2;
                const cardCenters  = Array.from(programCards).map(card => {
                    const r = card.getBoundingClientRect();
                    return r.left + r.width / 2;
                });
                programCards.forEach((card, idx) => {
                    if (Math.abs(cardCenters[idx] - windowCenter) < window.innerWidth * 0.25) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }

        // ---- Stacking Panels ----
        if (stackPanels.length > 0) {
            // Batch reads
            const rects = Array.from(stackPanels).map(p => p.getBoundingClientRect());
            // Batch writes
            stackPanels.forEach((panel, index) => {
                if (index >= stackPanels.length - 1) return;
                const rect = rects[index];
                const overlapStart = 75;
                const panelHeight  = rect.height;
                let progress = 0;
                if (rect.top <= overlapStart) {
                    progress = (overlapStart - rect.top) / (panelHeight * 0.6);
                    progress = Math.max(0, Math.min(1, progress));
                }
                const scale     = 1 - (progress * 0.08);
                const opacity   = 1 - (progress * 0.35);
                const translateY = progress * -12;
                panel.style.transform = `scale3d(${scale}, ${scale}, 1) translateY(${translateY}px)`;
                panel.style.opacity   = opacity;
            });
        }

        lastScrollY = scrollY;
        requestAnimationFrame(unifiedScrollLoop);
    }

    // Kick off the loop
    requestAnimationFrame(unifiedScrollLoop);

    // 14. Creative Testimonial Carousel
    const testiSlides       = document.querySelectorAll('.testi-slide');
    const testiDotsContainer = document.querySelector('.testi-dots-c');
    const testiPrevBtns     = document.querySelectorAll('.testi-prev-c');
    const testiNextBtns     = document.querySelectorAll('.testi-next-c');

    if (testiSlides.length > 0) {
        let currentTesti = 0;
        let testiInterval;

        testiSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testi-dot-c');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTesti(i));
            if (testiDotsContainer) testiDotsContainer.appendChild(dot);
        });
        const testiDots = document.querySelectorAll('.testi-dot-c');

        const goToTesti = (index) => {
            testiSlides[currentTesti].classList.remove('active');
            testiSlides[currentTesti].classList.add('exit');
            if (testiDots[currentTesti]) testiDots[currentTesti].classList.remove('active');

            setTimeout(() => {
                const exitingSlide = document.querySelector('.testi-slide.exit');
                if (exitingSlide) exitingSlide.classList.remove('exit');
            }, 800);

            currentTesti = (index + testiSlides.length) % testiSlides.length;
            testiSlides[currentTesti].classList.remove('exit');
            testiSlides[currentTesti].classList.add('active');
            if (testiDots[currentTesti]) testiDots[currentTesti].classList.add('active');
            resetTestiInterval();
        };

        const nextTesti = () => goToTesti(currentTesti + 1);
        const prevTesti = () => goToTesti(currentTesti - 1);

        testiPrevBtns.forEach(btn => btn.addEventListener('click', prevTesti));
        testiNextBtns.forEach(btn => btn.addEventListener('click', nextTesti));

        const resetTestiInterval = () => {
            clearInterval(testiInterval);
            testiInterval = setInterval(nextTesti, 5000);
        };
        resetTestiInterval();
    }

    // 15. Mega Menu Slide Navigation
    const megaSlideLinks = document.querySelectorAll('.mega-slide-link');
    megaSlideLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSlide   = parseInt(link.getAttribute('data-slide'), 10);
            const facilitySect  = document.getElementById('facility');

            if (facilitySect && !isNaN(targetSlide)) {
                const slides   = facilitySect.querySelectorAll('.minimal-slider-slide');
                const numSlides = slides.length;
                if (numSlides > 0) {
                    const rect      = facilitySect.getBoundingClientRect();
                    const maxScroll = rect.height - window.innerHeight;
                    const progress  = (targetSlide + 0.5) / numSlides;
                    const targetY   = facilitySect.offsetTop - 75 + progress * maxScroll;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });

                    const mm = document.getElementById('mobile-menu');
                    if (mm && mm.classList.contains('active')) {
                        mm.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

});

// 16. Discount Popup Logic
document.addEventListener('DOMContentLoaded', () => {
    const popup        = document.getElementById('discount-popup');
    const closePopupBtn = document.getElementById('close-popup');

    if (popup) {
        setTimeout(() => {
            if (!sessionStorage.getItem('discountPopupClosed')) {
                popup.classList.add('active');
            }
        }, 15000);

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                popup.classList.remove('active');
                sessionStorage.setItem('discountPopupClosed', 'true');
            });
        }
    }
});

// 17. Health Metrics Slider
document.addEventListener('DOMContentLoaded', () => {
    const track   = document.getElementById('metrics-slider-track');
    const prevBtn = document.getElementById('metrics-prev');
    const nextBtn = document.getElementById('metrics-next');
    let currentSlide = 0;
    const totalSlides = 2;

    const updateSlider = () => {
        if (track) track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    };

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    let startX = 0, currentX = 0;
    if (track) {
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchmove',  (e) => { currentX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', () => {
            if (startX - currentX > 50) { currentSlide = (currentSlide + 1) % totalSlides; updateSlider(); }
            if (currentX - startX > 50) { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlider(); }
        });
    }

    // Protein Calculator
    const pWeight = document.getElementById('protein-weight');
    const pGoal   = document.getElementById('protein-goal');
    const pWeightVal = document.getElementById('protein-weight-val');
    const pValueDisplay = document.getElementById('protein-value');

    const calculateProtein = () => {
        const weight     = parseFloat(pWeight.value);
        const multiplier = parseFloat(pGoal.value);
        pWeightVal.textContent = weight;
        pValueDisplay.textContent = Math.round(weight * multiplier) + 'g';
    };

    if (pWeight && pGoal) {
        pWeight.addEventListener('input', calculateProtein);
        pGoal.addEventListener('change', calculateProtein);
        calculateProtein();
    }
});

// ====== CALCULATOR CAROUSEL LOGIC ======
document.addEventListener('DOMContentLoaded', () => {
    const track    = document.getElementById('health-tools-track');
    const slides   = document.querySelectorAll('.calculator-slide');
    const leftBtn  = document.querySelector('.carousel-nav.left');
    const rightBtn = document.querySelector('.carousel-nav.right');
    let currentIndex = 0;
    if (!track || slides.length === 0) return;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.forEach((slide, idx) => slide.classList.toggle('active', idx === currentIndex));
    };

    if (leftBtn)  leftBtn.addEventListener('click',  () => { currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1; updateCarousel(); });
    if (rightBtn) rightBtn.addEventListener('click', () => { currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0; updateCarousel(); });

    let startX = 0, swipeX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove',  (e) => { swipeX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   () => {
        if (startX - swipeX > 50 && swipeX !== 0) { currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0; updateCarousel(); }
        if (swipeX - startX > 50 && swipeX !== 0) { currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1; updateCarousel(); }
        swipeX = 0;
    });
});

// ====== 1RM CALCULATOR LOGIC ======
document.addEventListener('DOMContentLoaded', () => {
    const ormWeight    = document.getElementById('onerm-weight');
    const ormReps      = document.getElementById('onerm-reps');
    const ormWeightVal = document.getElementById('onerm-weight-val');
    const ormRepsVal   = document.getElementById('onerm-reps-val');
    const ormValue     = document.getElementById('onerm-value');

    const update1RM = () => {
        const w = parseInt(ormWeight.value);
        const r = parseInt(ormReps.value);
        ormWeightVal.textContent = w;
        ormRepsVal.textContent   = r;
        ormValue.textContent     = r === 1 ? w : Math.round(w * (1 + (r / 30)));
    };

    if (ormWeight && ormReps) {
        ormWeight.addEventListener('input', update1RM);
        ormReps.addEventListener('input',   update1RM);
        update1RM();
    }
});
