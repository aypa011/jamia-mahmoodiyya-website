// Get URL params
const params = new URLSearchParams(window.location.search);
const institutionId = params.get('id');

const renderInstitution = async () => {
    const container = document.getElementById('institution-container');
    if (!container) return;

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const inst = data.institutions.find(i => i.id === institutionId);

        if (inst) {
            // Document title update
            document.title = `${inst.name} - Jamia Mahmoodiyya`;

            container.innerHTML = `
                <div class="institution-detail">
                    <div class="inst-hero">
                        <img src="${inst.image}" alt="${inst.name}" class="inst-hero-img">
                        <div class="inst-hero-overlay">
                            <h1>${inst.name}</h1>
                        </div>
                    </div>

                    <div class="inst-grid grid-2-col">
                        <div class="inst-main-content">
                            <div class="inst-card about-card">
                                <h3>About the Institution</h3>
                                <p>${inst.description}</p>
                            </div>

                            <div class="inst-card features-card">
                                <h3>Key Features</h3>
                                <ul class="feature-list">
                                    ${inst.features.map(f => `<li><i class="fa-solid fa-check-circle"></i> ${f}</li>`).join('')}
                                </ul>
                            </div>
                        </div>

                        <div class="inst-sidebar">
                            <div class="inst-card stats-card">
                                <h3>Quick Stats</h3>
                                <div class="stat-mini">
                                    <span class="stat-val">${inst.facultyCount}+</span>
                                    <span class="stat-lab">Expert Faculty</span>
                                </div>
                                <div class="stat-mini">
                                    <span class="stat-val">${inst.studentCount}+</span>
                                    <span class="stat-lab">Enrolled Students</span>
                                </div>
                            </div>

                            <div class="inst-card facilities-card">
                                <h3>Facilities</h3>
                                <ul class="facility-list">
                                    ${inst.facilities.map(f => `<li><i class="fa-solid fa-building"></i> ${f}</li>`).join('')}
                                </ul>
                            </div>

                            <div class="inst-actions">
                                ${inst.id !== 'masajid' ? `
                                <a href="${inst.id === 'cbse' ? 'https://mahmoodiyyaschool.com/' : 'admissions.html?institution=' + inst.id}" 
                                   class="btn btn-primary action-btn" 
                                   target="${inst.id === 'cbse' ? '_blank' : '_self'}">
                                    <i class="fa-solid ${inst.id === 'cbse' ? 'fa-globe' : 'fa-graduation-cap'}"></i> 
                                    ${inst.id === 'cbse' ? 'Official Site' : 'Apply Now'}
                                </a>
                                ` : ''}
                                <a href="index.html#our-institutions" class="btn btn-outline action-btn">
                                    <i class="fa-solid fa-arrow-left"></i> All Institutions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h2>Institution Not Found</h2>
                    <p>We couldn't find the page you're looking for.</p>
                    <a href="index.html" class="btn btn-primary">Back to Home</a>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error loading institution data:', err);
    }
};

renderInstitution();