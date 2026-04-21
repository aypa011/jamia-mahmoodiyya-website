// Get URL params
const params = new URLSearchParams(window.location.search);
const institutionId = params.get('id');

// Institution data
const institutions = {
    annasr: {
        name: "Annasr Global Academy - Da'wa college",
        img: "Images/annasr.jpg",
        desc: "Annasr Global Academy provides quality education that seamlessly integrates both essential Islamic teachings and comprehensive modern studies. Our Arabic Villa serves as the +1 and +2 boys campus.",
        features: ["Arabic Villa (+1 and +2 boys campus)", "Integrated Curriculum", "State-of-the-Art Classrooms", "Experienced Faculty"]
    },
    zawiya: {
        name: "Zawiyathul Qur'an - Hifz college",
        img: "Images/zawiyathul_quran.png",
        desc: "Zawiyathul Qur'an is an esteemed institution dedicated exclusively to the memorization and deep understanding of the Holy Qur'an. Students are guided by expert mentors to perfect their recitation.",
        features: ["Hifz Program", "Tajweed Mastery", "Spiritual Mentorship", "Islamic Studies"]
    },
    eduvillage: {
        name: "Edu Village - HS boys campus",
        img: "Images/edu_village.png",
        desc: "Edu Village is our dedicated HS boys campus combining rigorous academic curriculum with profound Islamic teaching to shape young minds in a collaborative, supportive environment.",
        features: ["High School Boys Campus", "Advanced Degree Programs", "Research Facilities", "Collaborative Campus"]
    },
    "women's": {
        name: "Women's College (+1 to UG)",
        img: "Images/womens_college.png",
        desc: "Our Women's College empowers female students through higher education from +1 to UG degrees in both Islamic and secular fields in a secure, supportive environment.",
        features: ["Exclusive Female Campus", "+1 to Undergraduate Programs", "Skill Development", "Safe Environment"]
    },
    olive_garden: {
        name: "Olive Garden HS Girls School",
        img: "Images/olive_garden.png",
        desc: "Olive Garden is our dedicated High School for girls, providing an empowering, secure environment combining modern education with core Islamic values.",
        features: ["High School Girls Campus", "Specialized Seminars", "Interactive Sessions", "Continuing Education"]
    },
    madrasa: {
        name: "Al Madrasathul Mahmoodiyya",
        img: "Images/madrasa.png",
        desc: "Al Madrasathul Mahmoodiyya focuses on nurturing young minds with core moral values and academic excellence. It serves as the starting point for children to understand the fundamental principles of Islam.",
        features: ["Basic Islamic Education", "Moral Guidance", "Interactive Learning", "Community Engagement"]
    },
    cbse: {
        name: "Mahmoodiyya English School - CBSE school",
        img: "Images/logo eng schl.jpg",
        desc: "Mahmoodiyya English School follows the CBSE curriculum, offering a competitive, high-standard secular education within a safe, Islamic environment.",
        features: ["CBSE Curriculum", "Modern Laboratories", "Sports Facilities", "Holistic Development"]
    },
    thibyan: {
        name: "Thibyan Pre School",
        img: "Images/annasr.jpg", // Setting placeholder
        desc: "Thibyan Pre School creates a nurturing beginning for the youngest members of our community, instilling early Islamic morals with modern play-based learning.",
        features: ["Early Childhood Education", "Play-based Learning", "Safe Environment", "Core Values"]
    },
    smart_seed: {
        name: "Smart Seed Premium Preschool",
        img: "Images/smart_seed.png",
        desc: "Smart Seed Premium Preschool provides a nurturing, playful, and high-end early childhood education experience. We focus on building a strong intellectual and moral foundation for toddlers.",
        features: ["Premium Play-based Learning", "Safe & Aesthetic Environment", "Early Moral Values", "Dedicated Child Experts"]
    },
    ibes: {
        name: "IBES",
        img: "Images/annasr.jpg", // setting placeholder
        desc: "IBES provides advanced educational services and structured learning environments to promote excellence across varied academic pursuits.",
        features: ["Advanced Studies", "Research Excellence", "Expert Faculty", "Integrated Approach"]
    },
    masajid: {
        name: "Masajid",
        img: "Images/masajid.png",
        desc: "The heart of our institution, the Masajid (Masjid Swahaba, Mahmoodiyya Juma Masjid Moonnupeedika, Masjid Hamdha wa Avathif), provide a serene and spiritual environment for daily prayers and community gatherings.",
        features: ["Masjid Swahaba", "Mahmoodiyya Juma Masjid", "Masjid Hamdha wa Avathif", "Community Hub"]
    },
};

// Get the institution details
const institution = institutions[institutionId];

if (institution) {
    // Generate feature list
    let featuresHTML = '';
    if (institution.features) {
        featuresHTML = '<div class="features-grid">';
        institution.features.forEach(feature => {
            featuresHTML += `<div class="feature-item"><i class="fa-solid fa-check-circle"></i> ${feature}</div>`;
        });
        featuresHTML += '</div>';
    }

    // Create institution details dynamically
    document.getElementById('institution-container').innerHTML = `
        <div class="institution-detail">
            <h2>${institution.name}</h2>
            <div class="inst-img-container">
                <img src="${institution.img}" alt="${institution.name}" class="inst-img">
            </div>
            <div class="inst-content-wrapper">
                <p class="inst-description">${institution.desc}</p>
                
                <h3 class="features-title">Key Features</h3>
                ${featuresHTML}
                
                <div class="inst-actions">
                    ${institutionId !== 'masajid' ? `
                    <a href="${institutionId === 'cbse' ? 'https://mahmoodiyyaschool.com/' : 'admissions.html?institution=' + institutionId}" class="btn btn-primary action-btn" target="${institutionId === 'cbse' ? '_blank' : '_self'}">
                        <i class="fa-solid ${institutionId === 'cbse' ? 'fa-globe' : 'fa-graduation-cap'}"></i> ${institutionId === 'cbse' ? 'Go to Site' : 'Apply Now'}
                    </a>
                    ` : ''}
                    <a href="index.html#our-institutions" class="btn btn-outline action-btn">
                        <i class="fa-solid fa-arrow-left"></i> Back to Institutions
                    </a>
                </div>
            </div>
        </div>
    `;
} else {
    // Show error if institution not found
    document.getElementById('institution-container').innerHTML = `
        <div class="institution-detail error-state">
            <i class="fa-solid fa-triangle-exclamation error-icon"></i>
            <h2>Institution Not Found</h2>
            <p>The educational initiative you are looking for doesn't exist or may have been moved.</p>
            <a href="index.html#our-institutions" class="btn btn-primary action-btn">
                <i class="fa-solid fa-home"></i> Back to Home
            </a>
        </div>
    `;
}