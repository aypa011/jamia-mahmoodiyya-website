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

    // 10. Load Dynamic Data (Notices, Faculty, Events)
    const loadDynamicData = async () => {
        const marqueeTrack = document.querySelector('.marquee-track');
        const facultyList = document.getElementById('faculty-list');


        // 10.1 Load Data (Notices & Live Status)
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                // Render Notices
                if (marqueeTrack && data.notices) {
                    marqueeTrack.innerHTML = data.notices.map(notice => `
                        <span class="notice-item">
                            ${notice.isNew ? '<span class="badge new-badge">NEW</span>' : ''}
                            ${notice.text}
                        </span>
                    `).join('');
                }
            }).catch(e => console.warn('Data load failed:', e));


        // 10.2 Load Faculty (from faculty.json)
        fetch('faculty.json')
            .then(res => res.json())
            .then(data => {
                // Render Faculty (Now simplified to only leadership)
                const facultyData = data.leadership || data; // Handle both restructured and flat array
                if (facultyList && facultyData) {
                    facultyList.innerHTML = (Array.isArray(facultyData) ? facultyData : [facultyData]).map(member => `
                        <div class="leader-card glass-card reveal">
                            <div class="leader-img-wrapper">
                                <img src="${member.image}" alt="${member.name}" class="leader-img" loading="lazy" onerror="this.src='Images/annasr.jpg'">
                            </div>
                            <span class="leader-label">${member.role}</span>
                            <h3 class="leader-name">${member.name}</h3>
                            <p class="leader-bio">${member.bio}</p>
                        </div>
                    `).join('');
                }
                
                // Re-init reveal observer for new elements
                facultyList.querySelectorAll('.reveal').forEach(el => {
                    revealObserver.observe(el);
                    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('active');
                });
            }).catch(e => console.warn('Faculty load failed:', e));


    };

    loadDynamicData();





});
