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

    // 10. Load Dynamic Data from data.json (Notices, Faculty, Events)
    const loadDynamicData = async () => {
        const marqueeTrack = document.querySelector('.marquee-track');
        const facultyList = document.getElementById('faculty-list');
        const calendarTrack = document.getElementById('calendar-track');

        try {
            const response = await fetch('data.json');
            const data = await response.json();

            // Render Notices (Marquee)
            if (marqueeTrack && data.notices) {
                marqueeTrack.innerHTML = data.notices.map(notice => `
                    <span class="notice-item">
                        ${notice.isNew ? '<span class="badge new-badge">NEW</span>' : ''}
                        ${notice.text}
                    </span>
                `).join('');
            }

            // Render Faculty (Leadership)
            if (facultyList && data.faculty) {
                facultyList.innerHTML = data.faculty.map(member => `
                    <div class="leader-card glass-card reveal">
                        <div class="leader-img-wrapper">
                            <img src="${member.image}" alt="${member.name}" class="leader-img" loading="lazy">
                        </div>
                        <span class="leader-label">${member.role}</span>
                        <h3 class="leader-name">${member.name}</h3>
                        <p class="leader-bio">${member.bio}</p>
                    </div>
                `).join('');
                
                // Re-init reveal observer for new elements
                facultyList.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
            }

            // Render Event Calendar (from events.json)
            const eventResponse = await fetch('events.json');
            const eventData = await eventResponse.json();

            if (calendarTrack && eventData) {
                calendarTrack.innerHTML = eventData.map(event => {
                    const dateObj = new Date(event.date);
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleString('default', { month: 'short' });
                    return `
                        <div class="calendar-card reveal">
                            <div class="cal-date">
                                <span class="cal-day">${day}</span>
                                <span class="cal-month">${month}</span>
                            </div>
                            <div class="cal-info">
                                <h3>${event.title}</h3>
                                <div class="cal-meta">
                                    <span><i class="fa-regular fa-clock"></i> ${event.time}</span>
                                    <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                                </div>
                                <span class="cal-type">${event.type}</span>
                            </div>
                        </div>
                    `;
                }).join('');
                
                calendarTrack.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
            }

        } catch (error) {
            console.error('Error loading dynamic data:', error);
        }
    };

    loadDynamicData();

    // 11. Search Functionality
    const searchBtn = document.createElement('div');
    searchBtn.className = 'search-trigger';
    searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    searchBtn.style.cssText = 'color:white; cursor:pointer; font-size: 1.1rem; margin-right: 15px;';
    
    const langContainer = document.querySelector('.lang-switcher-container');
    if (langContainer) {
        langContainer.prepend(searchBtn);
    }

    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay glass-menu';
    searchOverlay.innerHTML = `
        <div class="search-container container">
            <input type="text" id="global-search" placeholder="Search institutions, events, or pages..." autocomplete="off">
            <div id="search-results"></div>
            <button class="close-search"><i class="fa-solid fa-times"></i></button>
        </div>
    `;
    document.body.appendChild(searchOverlay);

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.getElementById('global-search').focus();
    });

    searchOverlay.querySelector('.close-search').addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    const searchInput = document.getElementById('global-search');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            const results = data.institutions.filter(inst => 
                inst.name.toLowerCase().includes(query) || 
                inst.description.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                resultsContainer.innerHTML = results.map(inst => `
                    <a href="institutions.html?id=${inst.id}" class="search-result-item">
                        <img src="${inst.image}" alt="${inst.name}">
                        <div>
                            <h4>${inst.name}</h4>
                            <p>${inst.description.substring(0, 60)}...</p>
                        </div>
                    </a>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<p class="no-results">No matches found.</p>';
            }
        } catch (err) {
            console.error('Search error:', err);
        }
    });

    // 12. Interactive Map Hotspots
    const hotspots = document.querySelectorAll('.hotspot');
    const infoContent = document.getElementById('map-info-content');

    const updateMapInfo = (spot) => {
        const title = spot.getAttribute('data-title');
        const desc = spot.getAttribute('data-desc');
        
        if (infoContent) {
            // Remove class to restart animation
            infoContent.classList.remove('reveal');
            
            infoContent.innerHTML = `
                <h3>${title}</h3>
                <p>${desc}</p>
            `;
            
            // Force reflow for animation
            void infoContent.offsetWidth;
            infoContent.classList.add('reveal');
        }
    };

    hotspots.forEach(spot => {
        // Desktop Hover
        spot.addEventListener('mouseenter', () => updateMapInfo(spot));
        
        // Mobile Tap / Interaction
        spot.addEventListener('click', (e) => {
            e.stopPropagation();
            updateMapInfo(spot);
            
            // Highlight the selected spot
            hotspots.forEach(s => s.classList.remove('active-spot'));
            spot.classList.add('active-spot');
        });
    });

    // Reset when clicking outside hotspots
    document.addEventListener('click', () => {
        if (infoContent) {
            // Keep the last info or reset? User usually wants to keep the last one or reset.
            // Let's keep it for better UX.
        }
    });

});