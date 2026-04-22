/**
 * Jamia Mahmoodiyya - Photo Gallery
 * Dynamic Category Loading & Filtering
 */

const renderGallery = async () => {
    const filterContainer = document.querySelector('.gallery-filters');
    if (!filterContainer) return;

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        if (data.gallery_categories) {
            filterContainer.innerHTML = data.gallery_categories.map(cat => `
                <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat.toLowerCase()}">${cat}</button>
            `).join('');

            // Re-attach filter listeners
            document.querySelectorAll(".filter-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    const filter = btn.getAttribute("data-filter");
                    const items = document.querySelectorAll(".gallery-item");
                    
                    items.forEach(item => {
                        const cat = item.getAttribute("data-category").toLowerCase();
                        if (filter === 'all' || cat === filter) {
                            item.style.display = "block";
                        } else {
                            item.style.display = "none";
                        }
                    });
                    
                    updateVisibleIndices();
                });
            });
        }
    } catch (err) {
        console.error('Error loading gallery categories:', err);
    }
};

// ── Image metadata (Synchronized with hardcoded HTML for now) ────────────────
const images = [
    { src: "Images/darimi-ustad.png",                  caption: "Nasrudheen Darimi Ustad",       category: "leadership" },
    { src: "Images/MAHARJAN 24.jpg",                   caption: "Maharjanul Mahabba 2024",       category: "events" },
    { src: "Images/maharjan a3.jpg",                   caption: "Maharjanul Mahabba",            category: "events" },
    { src: "Images/flag off final.jpg",                caption: "Flag Off Ceremony",             category: "events" },
    { src: "Images/rali3.jpg",                         caption: "Meelad Rali",                   category: "events" },
    { src: "Images/rali2.jpg",                         caption: "Rali Procession",               category: "events" },
    { src: "Images/rali 22.jpg",                       caption: "Annual Rali 2022",              category: "events" },
    { src: "Images/rali23.jpg",                        caption: "Annual Rali 2023",              category: "events" },
    { src: "Images/rali24.jpg",                        caption: "Annual Rali 2024",              category: "events" },
    { src: "Images/rali25.jpg",                        caption: "Rali Procession 2025",          category: "events" },
    { src: "Images/rali26.jpg",                        caption: "Rali 2026",                     category: "events" },
    { src: "Images/rali4.jpg",                         caption: "Meelad Rally Gathering",        category: "events" },
    { src: "Images/rali6.jpg",                         caption: "Community Rally",               category: "events" },
    { src: "Images/meelad rali and moulid copy5.jpg",  caption: "Meelad & Moulid",               category: "events" },
    { src: "Images/meelad rali and moulid-rali .jpg",  caption: "Moulid Celebration",            category: "events" },
    { src: "Images/moulid.jpg",                        caption: "Moulid Program",                category: "events" },
    { src: "Images/mushara.jpg",                       caption: "Mushara Program",               category: "events" },
    { src: "Images/mushara 2.jpg",                     caption: "Mushara Gathering",             category: "events" },
    { src: "Images/inagu main1.jpg",                   caption: "Inauguration Ceremony",         category: "academic" },
    { src: "Images/inagu main2.jpg",                   caption: "Inauguration — Main Stage",     category: "academic" },
    { src: "Images/inagu main3.jpg",                   caption: "Inauguration Highlights",       category: "academic" },
    { src: "Images/jm bg.jpg",                         caption: "Jamia Mahmoodiyya",             category: "campus" },
    { src: "Images/ppt 1.jpg",                         caption: "Educational Session",           category: "academic" },
    { src: "Images/ppt 2.jpg",                         caption: "Seminar Presentation",          category: "academic" },
    { src: "Images/ppt gen copy1.jpg",                 caption: "General Assembly",              category: "academic" },
    { src: "Images/ppt gen copy2.jpg",                 caption: "Student Gathering",             category: "academic" },
    { src: "Images/ppt gen copy3.jpg",                 caption: "Faculty Seminar",               category: "academic" },
    { src: "Images/ppt gen copy5.jpg",                 caption: "Annual Ceremony",               category: "academic" },
    { src: "Images/mahmoodiyya new building.jpg",      caption: "New Building",                  category: "campus" },
    { src: "Images/THADREES 1 2.jpg",                  caption: "Thadrees Session",              category: "academic" },
    { src: "Images/MAHMOODIYYA.jpg",                   caption: "Jamia Mahmoodiyya",             category: "campus" },
];

let currentIndex   = 0;
let visibleIndices = images.map((_, i) => i);
const modal        = document.getElementById("photoModal");

function updateVisibleIndices() {
    visibleIndices = [];
    document.querySelectorAll(".gallery-item").forEach(item => {
        if (item.style.display !== "none") {
            visibleIndices.push(parseInt(item.getAttribute("data-index")));
        }
    });
}

// ── Gallery Item Click → Open Modal ─────────────────────────────────────────
document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
        const idx = parseInt(item.getAttribute("data-index"));
        currentIndex = visibleIndices.indexOf(idx);
        if (currentIndex === -1) currentIndex = 0;
        openModal();
    });
});

// ── Modal ────────────────────────────────────────────────────────────────────
function openModal() {
    const img     = images[visibleIndices[currentIndex]];
    const counter = document.getElementById("modalCounter");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    
    modalImg.src = img.src;
    modalCaption.textContent = img.caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${visibleIndices.length}`;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    if (!history.state || !history.state.modalOpen) {
        history.pushState({ modalOpen: true }, "");
    }
}

function closeModal(fromHistory = false) {
    modal.style.display = "none";
    document.body.style.overflow = "";
    if (!fromHistory && history.state && history.state.modalOpen) {
        history.back();
    }
}

window.onpopstate = function(event) {
    if (modal.style.display === "block") {
        closeModal(true);
    }
};

function showNext() {
    currentIndex = (currentIndex + 1) % visibleIndices.length;
    updateModalContent();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + visibleIndices.length) % visibleIndices.length;
    updateModalContent();
}

function updateModalContent() {
    const img = images[visibleIndices[currentIndex]];
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const counter = document.getElementById("modalCounter");

    modalImg.src = img.src;
    modalCaption.textContent = img.caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${visibleIndices.length}`;
}

document.addEventListener("keydown", e => {
    if (modal.style.display !== "block") return;
    if (e.key === "Escape")     closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft")  showPrev();
});

modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

renderGallery();
