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
                setTimeout(function() { preloader.remove(); }, 500);
            }
        }, 0);
    });
})();

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
                            // Merge styles to keep color and animation delay
                            const nodeStyle = node.getAttribute('style') || '';
                            wordSpan.setAttribute('style', `${nodeStyle}; animation-delay: ${delay}s;`);
                            heroTitle.appendChild(wordSpan);
                            delay += 0.08;
                        });
                    }
                }
            });
        };

        // Initially render first phrase
        let currentIndex = 0;
        renderPhrase(phrases[0]);

        // Infinite loop every 8 seconds
        setInterval(() => {
            // Cinematic Blur Fade Out current phrase
            Array.from(heroTitle.children).forEach(child => {
                if (child.tagName === 'SPAN') {
                    child.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    child.style.opacity = '0';
                    child.style.transform = 'translate3d(0, -40px, -100px) rotateX(20deg) scale(0.9)';
                    child.style.filter = 'blur(15px)';
                }
            });

            // Wait for fade out, then render next phrase
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % phrases.length;
                renderPhrase(phrases[currentIndex]);
            }, 800);
        }, 8000);
    }
    // 1.b Hero Image Carousel
    const heroImg = document.getElementById('hero-carousel');
    const heroImages = Array.from({ length: 21 }, (_, i) => `${i + 1}.webp`);
    let heroIdx = 0;
    if (heroImg) {
        setInterval(() => {
            // Fade out
            heroImg.style.opacity = '0';
            // After fade-out duration, change image and fade in
            setTimeout(() => {
                heroIdx = (heroIdx + 1) % heroImages.length;
                heroImg.src = heroImages[heroIdx];
                heroImg.style.opacity = '1';
            }, 400); // match CSS transition duration (0.8s)
        }, 4000);
    }

    // 2. Live Gym Status
    const updateGymStatus = () => {
        const statusDot = document.querySelector('.dot');
        const statusText = document.querySelector('.status-text');
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 23) {
            statusDot.className = 'dot open';
            statusText.innerText = 'GYM IS OPEN';
        } else {
            statusDot.className = 'dot closed';
            statusText.innerText = 'GYM IS CLOSED';
        }
    };
    updateGymStatus();
    setInterval(updateGymStatus, 60000);

    // 3. Smooth Scroll Optimization (Native handling)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Ignore if it's the mega menu toggle to prevent jumping
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
                targetElement.scrollIntoView({ behavior: 'smooth' });
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
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
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

    // Close drawer when clicking outside (on the body)
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 5. Booking Modal Logic
    const modal = document.getElementById('booking-modal');
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

            const name = document.getElementById('eq-name').value;
            const contact = '+91 ' + document.getElementById('eq-contact').value.trim();

            // Construct WhatsApp Message
            const message = `Hello Hardcore Fitness!%0AI would like to make an enquiry.%0A%0A*Name:* ${name}%0A*Contact Number:* ${contact}`;
            const waUrl = `https://wa.me/919687222006?text=${message}`;

            // Open WhatsApp in new tab
            window.open(waUrl, '_blank');

            const btn = enquiryForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Opening WhatsApp...';
            btn.style.backgroundColor = '#25D366'; // WhatsApp Green
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

    // 6. 10x Magnetic Button Physics (requestAnimationFrame optimized)
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach((el) => {
        let bounds = el.getBoundingClientRect();
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovered = false;

        // Recalculate bounds on resize
        window.addEventListener('resize', () => { bounds = el.getBoundingClientRect(); });

        const animate = () => {
            if (isHovered) {
                // Smooth interpolation (lerp)
                currentX += ((mouseX - currentX) * 0.2);
                currentY += ((mouseY - currentY) * 0.2);
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                requestAnimationFrame(animate);
            } else {
                // Return to origin smoothly
                currentX += ((0 - currentX) * 0.1);
                currentY += ((0 - currentY) * 0.1);
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    el.style.transform = `translate3d(0, 0, 0)`;
                }
            }
        };

        el.addEventListener('mouseenter', () => {
            bounds = el.getBoundingClientRect();
            isHovered = true;
            animate();
        });

        el.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - bounds.left - bounds.width / 2) * 0.4;
            mouseY = (e.clientY - bounds.top - bounds.height / 2) * 0.4;
        });

        el.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    });

    // 8. Advanced Intersection Observer (Multi-threshold for Parallax/Fade)
    const animateCounters = (counterElement) => {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);

            counterElement.innerText = current + (target > 1000 ? '+' : '');

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counterElement.innerText = target + (target > 1000 ? '+' : '');
            }
        };
        window.requestAnimationFrame(step);
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes into view
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) animateCounters(counter);
                }
                // Also trigger hero image scale down
                if (entry.target.classList.contains('hero-image')) {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .hero-image').forEach(el => observer.observe(el));

    // Removed outdated Schedule filtering logic to prevent JS errors

    // 10. Real-time BMI Dashboard
    const bmiWeight = document.getElementById('bmi-weight');
    const bmiHeight = document.getElementById('bmi-height');
    const weightVal = document.getElementById('weight-val');
    const heightVal = document.getElementById('height-val');
    const bmiValue = document.getElementById('bmi-value');
    const bmiStatus = document.getElementById('bmi-status');
    const bmiNeedle = document.getElementById('bmi-needle');

    const updateBMI = () => {
        const weight = parseFloat(bmiWeight.value);
        const heightCm = parseFloat(bmiHeight.value);

        weightVal.textContent = weight;
        heightVal.textContent = heightCm;

        if (weight > 0 && heightCm > 0) {
            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(1);

            bmiValue.textContent = bmi;

            let status = "";
            let color = "";
            let percentage = 0;

            // Map BMI (15 to 40) to percentage (0% to 100%) for the gauge
            // 15 = 0%, 18.5 = 14%, 25 = 40%, 30 = 60%, 40 = 100% (Approx based on flex values)
            let rawScale = (bmi - 15) / (40 - 15) * 100;
            percentage = Math.max(0, Math.min(100, rawScale));

            if (bmi < 18.5) {
                status = "Underweight"; color = "#3498db";
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                status = "Optimal Weight"; color = "#2ecc71";
            } else if (bmi >= 25 && bmi <= 29.9) {
                status = "Overweight"; color = "#f1c40f";
            } else {
                status = "Obese"; color = "#e74c3c";
            }

            bmiStatus.textContent = status;
            bmiStatus.style.color = color;
            bmiNeedle.style.left = `${percentage}%`;
        }
    };

    if (bmiWeight && bmiHeight) {
        bmiWeight.addEventListener('input', updateBMI);
        bmiHeight.addEventListener('input', updateBMI);
        // Initialize
        updateBMI();
    }

    // 11. Scroll-Linked Facilities Slider
    const facilitySection = document.getElementById('facility');
    const scrollSlides = facilitySection ? facilitySection.querySelectorAll('.minimal-slider-slide') : [];
    const progressBar = document.getElementById('scroll-progress-bar');
    const currentNum = document.getElementById('current-slide-num');

    if (facilitySection && scrollSlides.length > 0) {
        window.addEventListener('scroll', () => {
            const rect = facilitySection.getBoundingClientRect();
            // Account for 75px offset so the JS slider math matches the CSS sticky lock
            const scrollDistance = 75 - rect.top;
            const maxScroll = rect.height - window.innerHeight;

            if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                let progress = scrollDistance / maxScroll;

                if (progressBar) progressBar.style.width = `${progress * 100}%`;

                let slideIndex = Math.floor(progress * scrollSlides.length);
                if (slideIndex >= scrollSlides.length) slideIndex = scrollSlides.length - 1;

                if (currentNum) currentNum.textContent = `0${slideIndex + 1}`;

                scrollSlides.forEach((slide, index) => {
                    if (index === slideIndex) slide.classList.add('active');
                    else slide.classList.remove('active');
                });
            } else if (scrollDistance < 0) {
                if (progressBar) progressBar.style.width = `0%`;
                if (currentNum) currentNum.textContent = `01`;
                scrollSlides.forEach((slide, index) => {
                    if (index === 0) slide.classList.add('active');
                    else slide.classList.remove('active');
                });
            } else {
                if (progressBar) progressBar.style.width = `100%`;
                if (currentNum) currentNum.textContent = `0${scrollSlides.length}`;
                scrollSlides.forEach((slide, index) => {
                    if (index === scrollSlides.length - 1) slide.classList.add('active');
                    else slide.classList.remove('active');
                });
            }
        }, { passive: true });
    }

    // 12. Horizontal Scroll Trainer Gallery
    const trainerSection = document.getElementById('trainers');
    const trainerTrack = document.getElementById('trainer-scroll-track');

    if (trainerSection && trainerTrack) {
        let isTrainerTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTrainerTicking) {
                window.requestAnimationFrame(() => {
                    const rect = trainerSection.getBoundingClientRect();
                    const scrollDistance = 75 - rect.top;
                    const maxScroll = rect.height - window.innerHeight;

                    if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                        let progress = scrollDistance / maxScroll;
                        const maxTranslate = trainerTrack.scrollWidth - window.innerWidth;
                        trainerTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
                    } else if (scrollDistance < 0) {
                        trainerTrack.style.transform = `translate3d(0, 0, 0)`;
                    } else {
                        const maxTranslate = trainerTrack.scrollWidth - window.innerWidth;
                        trainerTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
                    }
                    isTrainerTicking = false;
                });
                isTrainerTicking = true;
            }
        }, { passive: true });
    }

    // 12.5 Horizontal Scroll Programs Gallery
    const programSection = document.getElementById('programs');
    const programTrack = document.getElementById('program-scroll-track');

    if (programSection && programTrack) {
        const programCards = programTrack.querySelectorAll('.program-card');

        let isProgramTicking = false;
        window.addEventListener('scroll', () => {
            if (!isProgramTicking) {
                window.requestAnimationFrame(() => {
                    const rect = programSection.getBoundingClientRect();
                    const scrollDistance = 75 - rect.top;
                    const maxScroll = rect.height - window.innerHeight;

                    if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                        let progress = scrollDistance / maxScroll;
                        const maxTranslate = programTrack.scrollWidth - window.innerWidth;
                        programTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
                    } else if (scrollDistance < 0) {
                        programTrack.style.transform = `translate3d(0, 0, 0)`;
                    } else {
                        const maxTranslate = programTrack.scrollWidth - window.innerWidth;
                        programTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
                    }

                    // Color highlight logic based on center proximity
                    const windowCenter = window.innerWidth / 2;
                    // BATCH READS: get all left positions first to prevent layout thrashing
                    const cardCenters = Array.from(programCards).map(card => {
                        const cardRect = card.getBoundingClientRect();
                        return cardRect.left + cardRect.width / 2;
                    });
                    
                    // BATCH WRITES: apply classes after reading all bounds
                    programCards.forEach((card, index) => {
                        const cardCenter = cardCenters[index];
                        if (Math.abs(cardCenter - windowCenter) < window.innerWidth * 0.25) {
                            card.classList.add('active');
                        } else {
                            card.classList.remove('active');
                        }
                    });
                    
                    isProgramTicking = false;
                });
                isProgramTicking = true;
            }
        }, { passive: true });
    }

    // 13. 3D Stacking Panels Parallax Engine
    const stackPanels = document.querySelectorAll('.stack-panel');

    if (stackPanels.length > 0) {
        let isStackTicking = false;
        const onStackScroll = () => {
            if (!isStackTicking) {
                window.requestAnimationFrame(() => {
                    // BATCH READS: get all bounding rects first
                    const rects = Array.from(stackPanels).map(panel => panel.getBoundingClientRect());
                    
                    // BATCH WRITES
                    stackPanels.forEach((panel, index) => {
                        if (index >= stackPanels.length - 1) return;

                        const rect = rects[index];
                        const stickyTop = 75;
                        const panelHeight = rect.height;
                        const overlapStart = stickyTop;
                        const overlapEnd = stickyTop - panelHeight * 0.6; 

                        let progress = 0;
                        if (rect.top <= overlapStart) {
                            progress = (overlapStart - rect.top) / (panelHeight * 0.6);
                            progress = Math.max(0, Math.min(1, progress));
                        }

                        const scale = 1 - (progress * 0.08);
                        const opacity = 1 - (progress * 0.35);
                        const translateY = progress * -12;

                        panel.style.transform = `scale3d(${scale}, ${scale}, 1) translateY(${translateY}px)`;
                        panel.style.opacity = opacity;
                    });
                    isStackTicking = false;
                });
                isStackTicking = true;
            }
        };

        window.addEventListener('scroll', onStackScroll, { passive: true });
        onStackScroll(); // init on load
    }

    // 14. Creative Testimonial Carousel
    const testiSlides = document.querySelectorAll('.testi-slide');
    const testiDotsContainer = document.querySelector('.testi-dots-c');
    const testiPrevBtns = document.querySelectorAll('.testi-prev-c');
    const testiNextBtns = document.querySelectorAll('.testi-next-c');

    if (testiSlides.length > 0) {
        let currentTesti = 0;
        let testiInterval;

        // Create dots
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

            // Clean up exit class after transition
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
            const targetSlide = parseInt(link.getAttribute('data-slide'), 10);
            const facilitySection = document.getElementById('facility');

            if (facilitySection && !isNaN(targetSlide)) {
                const slides = facilitySection.querySelectorAll('.minimal-slider-slide');
                const numSlides = slides.length;

                if (numSlides > 0) {
                    const rect = facilitySection.getBoundingClientRect();
                    const maxScroll = rect.height - window.innerHeight;

                    // Add 0.5 to land perfectly in the middle of the active range for that slide
                    const progress = (targetSlide + 0.5) / numSlides;
                    const scrollDistance = progress * maxScroll;

                    // Calculate absolute scroll position
                    const targetY = facilitySection.offsetTop - 75 + scrollDistance;

                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });

                    // Also close the mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

});

// 16. Discount Popup Logic
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('discount-popup');
    const closePopupBtn = document.getElementById('close-popup');

    if (popup) {
        // Show after 10 seconds
        setTimeout(() => {
            // Only show if it hasn't been closed previously in this session
            if (!sessionStorage.getItem('discountPopupClosed')) {
                popup.classList.add('active');
            }
        }, 10000);

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                popup.classList.remove('active');
                // Remember that user closed it
                sessionStorage.setItem('discountPopupClosed', 'true');
            });
        }
    }
});



// 17. Health Metrics Slider & Protein Calculator
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('metrics-slider-track');
    const prevBtn = document.getElementById('metrics-prev');
    const nextBtn = document.getElementById('metrics-next');
    let currentSlide = 0;
    const totalSlides = 2;

    const updateSlider = () => {
        track.style.transform = "translate3d(-${currentSlide * 100}%, 0, 0)";
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

    // Swipe Support
    let startX = 0;
    let currentX = 0;
    if (track) {
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive: true});
        track.addEventListener('touchmove', (e) => { currentX = e.touches[0].clientX; }, {passive: true});
        track.addEventListener('touchend', () => {
            if (startX - currentX > 50) { currentSlide = (currentSlide + 1) % totalSlides; updateSlider(); }
            if (currentX - startX > 50) { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlider(); }
        });
    }

    // Protein Calculator Logic
    const pWeight = document.getElementById('protein-weight');
    const pGoal = document.getElementById('protein-goal');
    const pWeightVal = document.getElementById('protein-weight-val');
    const pValueDisplay = document.getElementById('protein-value');

    const calculateProtein = () => {
        const weight = parseFloat(pWeight.value);
        const multiplier = parseFloat(pGoal.value);
        pWeightVal.textContent = weight;
        const protein = Math.round(weight * multiplier);
        pValueDisplay.textContent = protein + 'g';
    };

    if (pWeight && pGoal) {
        pWeight.addEventListener('input', calculateProtein);
        pGoal.addEventListener('change', calculateProtein);
        calculateProtein();
    }
});

// ====== CALCULATOR CAROUSEL LOGIC ======
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('health-tools-track');
    const slides = document.querySelectorAll('.calculator-slide');
    const leftBtn = document.querySelector('.carousel-nav.left');
    const rightBtn = document.querySelector('.carousel-nav.right');
    let currentIndex = 0;
    if(!track || slides.length === 0) return;
    
    const updateCarousel = () => {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
    };
    
    if(leftBtn) leftBtn.addEventListener('click', () => { currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1; updateCarousel(); });
    if(rightBtn) rightBtn.addEventListener('click', () => { currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0; updateCarousel(); });
    
    // Touch/Swipe Logic
    let startX = 0, currentX = 0;
    track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, {passive: true});
    track.addEventListener('touchmove', (e) => currentX = e.touches[0].clientX, {passive: true});
    track.addEventListener('touchend', (e) => {
        if(startX - currentX > 50 && currentX !== 0) { currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0; updateCarousel(); }
        if(currentX - startX > 50 && currentX !== 0) { currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1; updateCarousel(); }
        currentX = 0;
    });
});

// ====== 1RM & WATER INTAKE LOGIC ======
document.addEventListener('DOMContentLoaded', () => {
    // 1RM Logic
    const ormWeight = document.getElementById('onerm-weight');
    const ormReps = document.getElementById('onerm-reps');
    const ormWeightVal = document.getElementById('onerm-weight-val');
    const ormRepsVal = document.getElementById('onerm-reps-val');
    const ormValue = document.getElementById('onerm-value');
    const update1RM = () => {
        const w = parseInt(ormWeight.value);
        const r = parseInt(ormReps.value);
        ormWeightVal.textContent = w;
        ormRepsVal.textContent = r;
        const rm = r === 1 ? w : Math.round(w * (1 + (r / 30)));
        ormValue.textContent = rm;
    };
    if(ormWeight && ormReps) { ormWeight.addEventListener('input', update1RM); ormReps.addEventListener('input', update1RM); update1RM(); }
    

});
