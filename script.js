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

    // 1. Splash Screen & Initial Transitions (Once per session)
    const splash = document.getElementById('splash-screen');
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (splash) {
        if (hasSeenSplash) {
            // Already seen in this session, skip animation
            splash.style.display = 'none';
            document.body.classList.add('loaded');
        } else {
            // First time this session
            setTimeout(() => {
                splash.classList.add('fade-out');
                sessionStorage.setItem('hasSeenSplash', 'true');
            }, 1500); 
            
            document.body.classList.add('page-transition');
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        }
    } else {
        // If no splash screen div exists on the page
        document.body.classList.add('loaded');
    }

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






    // 12. Institutional AI Chatbot Logic
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const quickBtns = document.querySelectorAll('.quick-btn');

    if (chatbotBubble) {
        chatbotBubble.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        const addMessage = (text, sender) => {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${sender}`;
            msg.innerText = text;
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
        };



        const getBotResponse = async (query) => {
            const lowerQuery = query.toLowerCase().trim();
            
            // Fetch data if not already present
            let data = {};
            try {
                const res = await fetch('data.json');
                data = await res.json();
            } catch (e) { console.error('Chatbot data fetch failed'); }

            // 0. Simple Greetings
            if (lowerQuery === 'hi' || lowerQuery === 'hello' || lowerQuery === 'hey' || lowerQuery === 'assalamu alaikum') {
                return "Assalamu Alaikum! Greeting back to you. How can I assist you today?";
            }

            // 1. Admissions
            if (lowerQuery.includes('admission') || lowerQuery.includes('apply') || lowerQuery.includes('join')) {
                return "Admissions for 2026-2027 are currently open! You can apply for Hifz College, Edu Village, and other institutions through our Admission Portal. Would you like the link to the form?";
            }

            // 2. Institutions General
            if (lowerQuery.includes('institution') || lowerQuery.includes('campus') || lowerQuery.includes('college')) {
                const names = data.institutions ? data.institutions.map(i => i.name).slice(0, 5).join(', ') : 'various schools and colleges';
                return `We have several esteemed institutions including ${names}, and more. Which one would you like to know more about?`;
            }

            // 3. Gender Specific
            if (lowerQuery.includes('boy') || lowerQuery.includes('male') || lowerQuery.includes('son')) {
                return "For boys, we have Annasr Global Academy (Arabic Villa for +1/+2), Zawiyathul Qur'an (Hifz), and Edu Village (HS Boys Campus).";
            }
            if (lowerQuery.includes('girl') || lowerQuery.includes('female') || lowerQuery.includes('daughter') || lowerQuery.includes('women')) {
                return "For girls, we offer the Women's College (+1 to UG) and Olive Garden HS Girls School. Both provide secure, high-quality Islamic and secular education.";
            }

            // 4. Specific Schools
            if (lowerQuery.includes('hifz') || lowerQuery.includes('quran')) {
                return "Zawiyathul Qur'an is our dedicated Hifz College. It focuses on the memorization and deep understanding of the Holy Qur'an with expert mentorship.";
            }
            if (lowerQuery.includes('cbse') || lowerQuery.includes('english school')) {
                return "Mahmoodiyya English School follows the CBSE curriculum, offering a competitive secular education within a safe, Islamic environment.";
            }
            if (lowerQuery.includes('preschool') || lowerQuery.includes('kindergarten') || lowerQuery.includes('toddler')) {
                return "We have two excellent preschools: Smart Seed Premium Preschool and Thibyan Pre School, both focusing on early moral and intellectual foundations.";
            }

            // 5. Contact & Location
            if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('call')) {
                return "You can reach us at +91 95 786 313 01 or email mahamoodiya@gmail.com. Our office is open from 9:00 AM to 5:00 PM.";
            }
            if (lowerQuery.includes('location') || lowerQuery.includes('where') || lowerQuery.includes('address') || lowerQuery.includes('map')) {
                return "Jamia Mahmoodiyya is located in Perinjanam, Thrissur, Kerala. We are easily accessible via the main road.";
            }

            // 6. Support & Donation
            if (lowerQuery.includes('donate') || lowerQuery.includes('support') || lowerQuery.includes('help') || lowerQuery.includes('charity')) {
                return "Thank you for your interest in supporting our mission! You can donate via the 'Donate' button on our website or visit our office for more details on ongoing projects.";
            }

            // 7. Notices & News
            if (lowerQuery.includes('notice') || lowerQuery.includes('news') || lowerQuery.includes('update')) {
                const latestNotice = data.notices ? data.notices[0].text : "Please check the scrolling notice bar on our homepage for the latest updates.";
                return `Latest Notice: "${latestNotice}"`;
            }
            
            return "I'm sorry, I didn't quite catch that. Could you please ask about our institutions, admissions, donations, or contact details? Or try one of the quick buttons!";
        };

        const handleSend = async () => {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            // Bot Typing effect
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-msg bot';
            typingMsg.innerText = '...';
            chatBody.appendChild(typingMsg);

            const response = await getBotResponse(text);
            
            setTimeout(() => {
                typingMsg.innerText = response;
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 600);
        };

        if (chatSend) {
            chatSend.addEventListener('click', handleSend);
        }
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                chatInput.value = btn.innerText;
                handleSend();
            });
        });
    }

});
