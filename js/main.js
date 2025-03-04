// Sample data structure for skills and achievements
let skills = [];
let achievements = [];

// DOM Elements
const skillsContainer = document.getElementById('skillsContainer');
const achievementsContainer = document.getElementById('achievementsContainer');
const addSkillForm = document.getElementById('addSkillForm');
const addAchievementForm = document.getElementById('addAchievementForm');
const editAboutForm = document.getElementById('editAboutForm');
const contactForm = document.getElementById('contactForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadSkills();
    loadAchievements();
    initializeEventListeners();
    animateSkillBars();
    initializeSkillForm();
});

// Initialize skill form
function initializeSkillForm() {
    const skillProficiency = document.getElementById('skillProficiency');
    const proficiencyValue = document.getElementById('proficiencyValue');
    
    if (skillProficiency && proficiencyValue) {
        skillProficiency.addEventListener('input', function() {
            proficiencyValue.textContent = this.value + '%';
        });
    }
}

// Event Listeners
function initializeEventListeners() {
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', handleAddSkill);
    }
    if (addAchievementForm) {
        addAchievementForm.addEventListener('submit', handleAddAchievement);
    }
    if (editAboutForm) {
        editAboutForm.addEventListener('submit', handleEditAbout);
    }
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

// Skills Management
function loadSkills() {
    // Load skills from localStorage or use default data
    skills = JSON.parse(localStorage.getItem('skills')) || [
        { 
            name: 'HTML/CSS',
            proficiency: 90,
            category: 'frontend',
            icon: 'fa-code',
            tags: ['Responsive', 'Bootstrap', 'SASS']
        },
        { 
            name: 'JavaScript',
            proficiency: 85,
            category: 'frontend',
            icon: 'fa-js',
            tags: ['ES6+', 'React', 'Vue']
        },
        { 
            name: 'Node.js',
            proficiency: 80,
            category: 'backend',
            icon: 'fa-node-js',
            tags: ['Express', 'API', 'MongoDB']
        }
    ];
    renderSkills();
}

function renderSkills() {
    if (!skillsContainer) return;

    // Group skills by category
    const skillsByCategory = {
        frontend: { name: 'Frontend', icon: 'fa-laptop-code', skills: [] },
        backend: { name: 'Backend', icon: 'fa-server', skills: [] },
        tools: { name: 'Tools & Others', icon: 'fa-tools', skills: [] }
    };

    skills.forEach(skill => {
        const category = skill.category || 'tools';
        skillsByCategory[category].skills.push(skill);
    });

    // Generate HTML for each category
    const categoriesHtml = Object.entries(skillsByCategory).map(([categoryKey, category]) => {
        if (category.skills.length === 0) return '';

        const skillsHtml = category.skills.map((skill, index) => `
            <div class="skill-item" data-progress="${skill.proficiency}">
                <div class="skill-header">
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percentage">${skill.proficiency}%</span>
                    </div>
                    <button class="delete-skill-btn" onclick="deleteSkill('${categoryKey}', ${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="skill-progress">
                    <div class="progress-bar"></div>
                </div>
                ${skill.tags ? `
                <div class="skill-tags">
                    ${skill.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>` : ''}
            </div>
        `).join('');

        return `
            <div class="col-lg-4">
                <div class="skill-category ${categoryKey}-skills">
                    <div class="category-header">
                        <div class="header-icon">
                            <i class="fas ${category.icon}"></i>
                        </div>
                        <h3>${category.name}</h3>
                    </div>
                    <div class="skill-list">
                        ${skillsHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    skillsContainer.innerHTML = categoriesHtml;
    animateSkillBars();
}

function deleteSkill(category, index) {
    // Find the actual index in the main skills array
    let globalIndex = 0;
    let foundIndex = -1;
    
    for (let i = 0; i < skills.length; i++) {
        if (skills[i].category === category) {
            if (globalIndex === index) {
                foundIndex = i;
                break;
            }
            globalIndex++;
        }
    }
    
    if (foundIndex !== -1) {
        const skillName = skills[foundIndex].name;
        skills.splice(foundIndex, 1);
        localStorage.setItem('skills', JSON.stringify(skills));
        renderSkills();
        showToast(`${skillName} has been removed`);
    }
}

function handleAddSkill(e) {
    e.preventDefault();
    const name = document.getElementById('skillName').value;
    const proficiency = parseInt(document.getElementById('skillProficiency').value);
    
    // Determine category based on skill name
    let category = 'tools';
    const frontendKeywords = ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'frontend', 'ui', 'ux'];
    const backendKeywords = ['node', 'python', 'java', 'php', 'database', 'sql', 'backend', 'server'];
    
    const lowercaseName = name.toLowerCase();
    if (frontendKeywords.some(keyword => lowercaseName.includes(keyword))) {
        category = 'frontend';
    } else if (backendKeywords.some(keyword => lowercaseName.includes(keyword))) {
        category = 'backend';
    }
    
    // Add new skill
    skills.push({ 
        name, 
        proficiency,
        category,
        icon: category === 'frontend' ? 'fa-code' : category === 'backend' ? 'fa-server' : 'fa-tools',
        tags: generateTags(name, category)
    });
    
    localStorage.setItem('skills', JSON.stringify(skills));
    renderSkills();
    
    // Close modal and reset form
    $('#addSkillModal').modal('hide');
    e.target.reset();
    
    // Show success message
    showToast('Skill added successfully!');
}

function generateTags(skillName, category) {
    const tags = [];
    const lowercaseName = skillName.toLowerCase();
    
    // Frontend tags
    if (category === 'frontend') {
        if (lowercaseName.includes('html') || lowercaseName.includes('css')) {
            tags.push('Responsive', 'Web Design');
        }
        if (lowercaseName.includes('javascript')) {
            tags.push('ES6+', 'DOM');
        }
        if (lowercaseName.includes('react')) {
            tags.push('Hooks', 'Redux');
        }
        if (lowercaseName.includes('vue')) {
            tags.push('Vue.js', 'Vuex');
        }
    }
    
    // Backend tags
    if (category === 'backend') {
        if (lowercaseName.includes('node')) {
            tags.push('Express', 'API');
        }
        if (lowercaseName.includes('python')) {
            tags.push('Django', 'Flask');
        }
        if (lowercaseName.includes('java')) {
            tags.push('Spring', 'JVM');
        }
        if (lowercaseName.includes('database') || lowercaseName.includes('sql')) {
            tags.push('Database', 'SQL');
        }
    }
    
    // Tools tags
    if (category === 'tools') {
        if (lowercaseName.includes('git')) {
            tags.push('Version Control', 'GitHub');
        }
        if (lowercaseName.includes('docker')) {
            tags.push('Containers', 'DevOps');
        }
        if (lowercaseName.includes('aws')) {
            tags.push('Cloud', 'DevOps');
        }
    }
    
    return tags.length > 0 ? tags : ['New Skill'];
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-item');
    skillBars.forEach(skillBar => {
        const progress = skillBar.dataset.progress;
        const progressBar = skillBar.querySelector('.progress-bar');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = `${progress}%`;
            }, 200);
        }
    });
}

// Achievements Management
function loadAchievements() {
    // Load achievements from localStorage or use default data
    achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    renderAchievements();
}

function renderAchievements() {
    achievementsContainer.innerHTML = achievements.map((achievement, index) => `
        <div class="col-md-4">
            <div class="achievement-card">
                <img src="${achievement.image}" alt="${achievement.title}">
                <div class="card-body">
                    <h5>${achievement.title}</h5>
                    <p>${achievement.description}</p>
                    <button class="btn btn-danger btn-sm" onclick="deleteAchievement(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleAddAchievement(e) {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    const file = e.target[2].files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            achievements.push({
                title,
                description,
                image: event.target.result
            });
            localStorage.setItem('achievements', JSON.stringify(achievements));
            renderAchievements();
        };
        reader.readAsDataURL(file);
    }
    
    $('#addAchievementModal').modal('hide');
    e.target.reset();
}

function deleteAchievement(index) {
    achievements.splice(index, 1);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    renderAchievements();
}

// About Section Management
function handleEditAbout(e) {
    e.preventDefault();
    const aboutText = e.target[0].value;
    const file = e.target[1].files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.querySelector('#about img').src = event.target.result;
            localStorage.setItem('profileImage', event.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    document.querySelector('#about p').textContent = aboutText;
    localStorage.setItem('aboutText', aboutText);
    
    $('#editAboutModal').modal('hide');
    e.target.reset();
}

// Contact Form
function handleContact(e) {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;
    
    // Here you would typically send this data to a server
    alert(`Thank you ${name}! Your message has been sent.`);
    e.target.reset();
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active Link Handling
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.parentElement.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
