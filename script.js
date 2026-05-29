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
                if(child.tagName === 'SPAN') {
                    child.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
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

    // 2. Live Gym Status
    const updateGymStatus = () => {
        const statusDot = document.querySelector('.dot');
        const statusText = document.querySelector('.status-text');
        const hour = new Date().getHours();
        if(hour >= 5 && hour < 23) {
            statusDot.className = 'dot open';
            statusText.innerText = 'Gym is OPEN';
        } else {
            statusDot.className = 'dot closed';
            statusText.innerText = 'Gym is CLOSED';
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
            if(mobileMenu.classList.contains('active')){
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
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
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    if (closeMobileBtn) {
        closeMobileBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    }

    // Close drawer when clicking outside (on the body)
    document.addEventListener('click', (e) => {
        if(mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
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
            if(mobileMenu.classList.contains('active')){
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('eq-name').value;
            const contact = '+91 ' + document.getElementById('eq-contact').value.trim();
            const dob = document.getElementById('eq-dob').value;
            
            // Construct WhatsApp Message
            const message = `Hello Hardcore Fitness!%0AI would like to make an enquiry.%0A%0A*Name:* ${name}%0A*Contact Number:* ${contact}%0A*Date of Birth:* ${dob}`;
            const waUrl = `https://wa.me/919023668571?text=${message}`;
            
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

    // 7. Scroll Progress Ring Optimization
    const circle = document.querySelector('.progress-ring__circle.bar');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    const progressContainer = document.getElementById('progress-ring');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight);
                const offset = circumference - scrollPercent * circumference;
                circle.style.strokeDashoffset = offset;

                if(window.scrollY > 300) {
                    progressContainer.classList.add('visible');
                } else {
                    progressContainer.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive flag for better scroll performance

    progressContainer.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                if(entry.target.classList.contains('stat-item')){
                    const counter = entry.target.querySelector('.counter');
                    if(counter) animateCounters(counter);
                }
                // Also trigger hero image scale down
                if(entry.target.classList.contains('hero-image')){
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

    if(bmiWeight && bmiHeight) {
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
        window.addEventListener('scroll', () => {
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
        }, { passive: true });
    }

    // 12.5 Horizontal Scroll Programs Gallery
    const programSection = document.getElementById('programs');
    const programTrack = document.getElementById('program-scroll-track');

    if (programSection && programTrack) {
        window.addEventListener('scroll', () => {
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
        }, { passive: true });
    }

    // 13. 3D Stacking Panels Parallax Engine
    const stackPanels = document.querySelectorAll('.stack-panel');
    
    if (stackPanels.length > 0) {
        const onStackScroll = () => {
            stackPanels.forEach((panel, index) => {
                // Only panels that are NOT the last one need to shrink
                if (index >= stackPanels.length - 1) return;

                const rect = panel.getBoundingClientRect();
                const stickyTop = 75;

                // How much has this panel been "covered" by the next one?
                // When rect.top === stickyTop, panel is freshly locked in. 
                // As next panel comes up, rect.top goes further negative.
                const panelHeight = rect.height;
                
                // Progress: 0 = panel just pinned, 1 = panel fully covered
                // The panel starts shrinking once it's stuck and the next panel begins overlapping
                const overlapStart = stickyTop;
                const overlapEnd = stickyTop - panelHeight * 0.6; // begins feeling depth after 60% overlap

                let progress = 0;
                if (rect.top <= overlapStart) {
                    progress = (overlapStart - rect.top) / (panelHeight * 0.6);
                    progress = Math.max(0, Math.min(1, progress));
                }

                // 3D scale: shrinks from 1 to 0.92 as it goes "back"
                const scale = 1 - (progress * 0.08);
                // Subtle opacity fade
                const opacity = 1 - (progress * 0.35);
                // Slight vertical push-back
                const translateY = progress * -12;

                panel.style.transform = `scale3d(${scale}, ${scale}, 1) translateY(${translateY}px)`;
                panel.style.opacity = opacity;
            });
        };

        window.addEventListener('scroll', onStackScroll, { passive: true });
        onStackScroll(); // init on load
    }
});
