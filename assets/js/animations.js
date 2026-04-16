// ===== ANIMATION CONTROLLER =====

document.addEventListener('DOMContentLoaded', function() {
    initParticleSystem();
    initCursorEffect();
    initTextAnimations();
    initInteractiveElements();
    console.log('Animations initialized! ✨');
});

// ===== PARTICLE SYSTEM =====
function initParticleSystem() {
    const bgAnimation = document.getElementById('bgAnimation');
    if (!bgAnimation) return;
    
    const particleCount = window.innerWidth > 768 ? 50 : 25; // Reduce particles on mobile
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(bgAnimation, particles);
    }
    
    // Animate particles
    animateParticles(particles);
    
    // Add mouse interaction
    addParticleMouseInteraction(particles);
    
    // Handle resize
    window.addEventListener('resize', debounce(() => {
        const newParticleCount = window.innerWidth > 768 ? 50 : 25;
        adjustParticleCount(bgAnimation, particles, newParticleCount);
    }, 250));
}

function createParticle(container, particlesArray) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random initial position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation properties
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (3 + Math.random() * 6) + 's';
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    container.appendChild(particle);
    
    // Store particle data
    particlesArray.push({
        element: particle,
        x: parseFloat(particle.style.left),
        y: parseFloat(particle.style.top),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: size,
        baseOpacity: parseFloat(particle.style.opacity)
    });
}

function animateParticles(particles) {
    function animate() {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= 100) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= 100) particle.vy *= -1;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(100, particle.x));
            particle.y = Math.max(0, Math.min(100, particle.y));
            
            // Update element position
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function addParticleMouseInteraction(particles) {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
        
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 15) {
                // Repel particles from mouse
                const force = (15 - distance) / 15;
                particle.vx -= (dx / distance) * force * 0.1;
                particle.vy -= (dy / distance) * force * 0.1;
                
                // Increase opacity when near mouse
                particle.element.style.opacity = Math.min(1, particle.baseOpacity + force);
            } else {
                // Return to base opacity
                particle.element.style.opacity = particle.baseOpacity;
            }
        });
    });
}

function adjustParticleCount(container, particles, targetCount) {
    const currentCount = particles.length;
    
    if (currentCount < targetCount) {
        // Add particles
        for (let i = currentCount; i < targetCount; i++) {
            createParticle(container, particles);
        }
    } else if (currentCount > targetCount) {
        // Remove excess particles
        for (let i = targetCount; i < currentCount; i++) {
            container.removeChild(particles[i].element);
        }
        particles.splice(targetCount);
    }
}

// ===== CURSOR EFFECT =====
function initCursorEffect() {
    if (window.innerWidth <= 768) return; // Skip on mobile devices
    
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursor.className = 'custom-cursor';
    cursorFollower.className = 'cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Animate follower with delay
    function animateFollower() {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        
        followerX += dx * 0.1;
        followerY += dy * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

// ===== TEXT ANIMATIONS =====
function initTextAnimations() {
    // Animate stats numbers
    animateStatsNumbers();
}


function animateStatsNumbers() {
    const statsNumbers = document.querySelectorAll('.stat-item h3');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.8 });
    
    statsNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateNumber(element) {
    const finalNumber = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    let currentNumber = 0;
    const increment = finalNumber / 100;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber) + suffix;
    }, 20);
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Button ripple effect
    addRippleEffect();
    
    // Card tilt effect
    addCardTiltEffect();
    
    // Magnetic effect for buttons
    addMagneticEffect();
}

function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function addCardTiltEffect() {
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn-primary, .social-link');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}


// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Progress bars animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.animationPlayState = 'running';
                }
            }
        });
    }, { threshold: 0.8 });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
}

// ===== PERFORMANCE OPTIMIZATION =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== REDUCED MOTION SUPPORT =====
function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable complex animations
        document.documentElement.style.setProperty('--animation-duration', '0ms');
        
        // Remove particle system
        const bgAnimation = document.getElementById('bgAnimation');
        if (bgAnimation) bgAnimation.style.display = 'none';
        
        // Remove cursor effects
        const customCursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (customCursor) customCursor.remove();
        if (cursorFollower) cursorFollower.remove();
    }
}

// Initialize reduced motion check
document.addEventListener('DOMContentLoaded', respectReducedMotion);

// Export animation functions
window.AnimationController = {
    initParticleSystem,
    initCursorEffect,
    initTextAnimations,
    initInteractiveElements,
    animateTextReveal,
    animateNumber
};