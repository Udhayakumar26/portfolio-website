// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initTypewriter();
    initProjectFilter();
    initModalSystem();
    loadDynamicContent();
    initThemeSystem();
    initScrollProgress();
    
    console.log('Portfolio initialized successfully! 🚀');
});

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            isMenuOpen = false;
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                if (isMenuOpen) {
                    isMenuOpen = false;
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Scroll to target with offset for navbar
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`a[href="${targetId}"]`)?.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('skills-grid') || 
                    entry.target.classList.contains('projects-grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function animateGridItems(container) {
    const items = container.querySelectorAll('.skill-card, .project-card');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate-slideInUp');
        }, index * 100);
    });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
    const titles = [
        "AI & Data Science Student",
        "Machine Learning Enthusiast", 
        "Data Analytics Expert",
        "Problem Solver",
        "Future AI Engineer"
    ];
    
    let currentTitle = 0;
    let charIndex = 0;
    let isDeleting = false;
    const titleElement = document.querySelector('.hero h2');
    
    if (!titleElement) return;

    function typeTitle() {
        const currentText = titles[currentTitle];
        
        if (isDeleting) {
            titleElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            titleElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentTitle = (currentTitle + 1) % titles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(typeTitle, typeSpeed);
    }

    // Start typewriter effect after initial animation
    setTimeout(typeTitle, 3000);
}

// ===== PROJECT FILTER SYSTEM =====
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category')?.split(' ') || [];
                
                setTimeout(() => {
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                            card.classList.add('hidden');
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
}

// ===== MODAL SYSTEM =====
function initModalSystem() {
    // Create modal HTML
    const modalHTML = `
        <div id="projectModal" class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img id="modalImage" src="" alt="Project Image">
                    </div>
                    <div class="modal-info">
                        <h2 id="modalTitle"></h2>
                        <p id="modalDescription"></p>
                        <div class="modal-tech">
                            <h4>Technologies Used:</h4>
                            <div id="modalTech" class="skill-tags"></div>
                        </div>
                        <div class="modal-links">
                            <a id="modalGithub" href="#" target="_blank" class="btn btn-secondary">View Code</a>
                            <a id="modalDemo" href="#" target="_blank" class="btn btn-primary">Live Demo</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');

    // Close modal events
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add click events to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(card));
    });
}

function openProjectModal(card) {
    const modal = document.getElementById('projectModal');
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const image = card.querySelector('.project-image img')?.src || '';
    const tech = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
    const github = card.getAttribute('data-github') || '#';
    const demo = card.getAttribute('data-demo') || '#';

    // Populate modal content
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalGithub').href = github;
    document.getElementById('modalDemo').href = demo;

    // Populate technologies
    const modalTech = document.getElementById('modalTech');
    modalTech.innerHTML = tech.map(t => `<span class="tag">${t}</span>`).join('');

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== DYNAMIC CONTENT LOADING =====
function loadDynamicContent() {
    loadSkills();
    loadProjects();
    loadPersonalInfo();
}

async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        if (!response.ok) {
            console.log('Skills data not found, using default content');
            return;
        }
        
        const data = await response.json();
        renderSkills(data.categories);
    } catch (error) {
        console.log('Loading default skills content');
    }
}

function renderSkills(categories) {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid || !categories) return;

    skillsGrid.innerHTML = categories.map(category => `
        <div class="skill-card">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="skill-tags">
                ${category.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            console.log('Projects data not found, using default content');
            return;
        }
        
        const data = await response.json();
        renderProjects(data.projects);
    } catch (error) {
        console.log('Loading default projects content');
    }
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || !projects) return;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}" 
             data-github="${project.github}" data-demo="${project.demo}">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : project.icon}
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="skill-tags">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link">Code</a>
                    <a href="${project.demo}" target="_blank" class="project-link">Demo</a>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize project filter and modal for new content
    initProjectFilter();
    addProjectClickEvents();
}

function addProjectClickEvents() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(card));
    });
}

async function loadPersonalInfo() {
    try {
        const response = await fetch('data/personal.json');
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Update hero section
        if (data.name) document.getElementById('heroName').textContent = data.name;
        if (data.description) document.getElementById('heroDescription').textContent = data.description;
        
        // Update title and meta tags
        if (data.name) document.title = `${data.name} - AI & Data Science Portfolio`;
        
    } catch (error) {
        console.log('Personal info not found, using defaults');
    }
}

// ===== THEME SYSTEM =====
function initThemeSystem() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    // Add theme toggle to navigation
    document.querySelector('.nav-container').appendChild(themeToggle);
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.addEventListener('click', scrollToTop);
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollToTop);

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll event listener
const optimizedScroll = debounce(() => {
    updateActiveNavOnScroll();
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Preload images for better performance
function preloadImages() {
    const images = [
        'assets/images/profile/profile-pic.jpg',
        'assets/images/profile/hero-bg.jpg',
        // Add more image paths as needed
    ];
    
    images.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Export functions for external use if needed
window.PortfolioJS = {
    scrollToTop,
    openProjectModal,
    loadDynamicContent
};