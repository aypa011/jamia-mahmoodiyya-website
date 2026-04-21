/**
 * Jamia Mahmoodiyya - Main Script File
 */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Lenis Smooth Scroll Initialization
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // 1. Splash Screen & Initial Transitions
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('fade-out');
        }, 1500); 
    }

    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // 2. Sticky Header & Scroll to Top Button
    const header = document.querySelector('.main-head');
    const scrollButton = document.getElementById('scroll-to-top');
    const progressBar = document.getElementById('scroll-progress-bar');

    const handleScroll = () => {
        // Sticky Header Logic
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll to Top Button Logic - use direct style manipulation
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollButton) {
            if (scrollTop > 200) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
                scrollButton.style.transform = 'translateY(0)';
                scrollButton.style.pointerEvents = 'auto';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
                scrollButton.style.transform = 'translateY(20px)';
                scrollButton.style.pointerEvents = 'none';
            }
        }

        // Scroll Progress Bar
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 3. Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLink = document.querySelector('.nav-link');
    const mediaHover = document.querySelector('.media-hover');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLink.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLink.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Media Dropdown Toggle (click on all screen sizes)
    if (mediaHover) {
        const mediaTrigger = mediaHover.querySelector('a');
        mediaTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            mediaHover.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mediaHover.contains(e.target)) {
                mediaHover.classList.remove('active');
            }
        });
    }

    // 5. Initial Intersection Observer Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counter Animation (Vanilla JS)
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // 6. Theme Toggle (Dark Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const updateThemeIcon = (isDark) => {
        if (!themeBtn) return;
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    };

    const savedTheme = localStorage.getItem('jamia-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            localStorage.setItem('jamia-theme', isDark ? 'dark' : 'light');

            themeBtn.style.transform = 'scale(0.8) rotate(90deg)';
            setTimeout(() => {
                updateThemeIcon(isDark);
                themeBtn.style.transform = 'scale(1) rotate(0deg)';
            }, 150);
        });
    }

    // 7. Page Transition on Links
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || target === '_blank') {
                return;
            }

            if (href.indexOf('.html') !== -1) {
                e.preventDefault();
                document.body.classList.remove('loaded');
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });

    // 8. Auto-select Institution in Admissions Form
    const urlParams = new URLSearchParams(window.location.search);
    const selectedInst = urlParams.get('institution');
    if (selectedInst) {
        const instSelect = document.getElementById('institution-select');
        if (instSelect) {
            for (let i = 0; i < instSelect.options.length; i++) {
                if (instSelect.options[i].value === selectedInst || instSelect.options[i].value === selectedInst.replace("'", "")) {
                    instSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // Update Footer Year
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 9. Prayer Times Fetcher (Aladhan API)
    const fetchPrayerTimes = async () => {
        const prayerContainer = document.getElementById('prayer-times-grid');
        if (!prayerContainer) return;

        try {
            // Perinjanam, Thrissur (680686) roughly Lat: 10.31, Lon: 76.16
            // Using method 2 (ISNA) or 1 (UMKR) - standard for the region
            const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Thrissur&country=India&method=1');
            const data = await response.json();
            
            if (data.code === 200) {
                const timings = data.data.timings;
                const relevantPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                
                let html = '';
                relevantPrayers.forEach(p => {
                    html += `
                        <div class="prayer-card glass-card">
                            <span class="prayer-name" data-i18n="prayer-${p.toLowerCase()}">${p}</span>
                            <span class="prayer-time">${timings[p]}</span>
                        </div>
                    `;
                });
                prayerContainer.innerHTML = html;
                
                // Trigger translation update for new elements
                if (typeof window.setLanguage === 'function') {
                    window.setLanguage(localStorage.getItem('preferredLang') || 'en');
                }
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            prayerContainer.innerHTML = '<p class="error-msg">Connection issue. Please refresh.</p>';
        }
    };

    fetchPrayerTimes();

});