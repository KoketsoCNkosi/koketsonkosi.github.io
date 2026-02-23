// Main Application Class
class PortfolioApp {
    constructor() {
        this.currentFilter = 'all';
        this.theme = localStorage.getItem('theme') || 'light';
        this.revealObserver = null;
        this.smoothReveal = null;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize theme
        this.initTheme();
        
        // Initialize animations
        this.initAnimations();
        
        // Initialize navigation
        this.initNavigation();
        
        // Load projects
        this.loadProjects();
        
        // Initialize form
        this.initContactForm();
        
        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize Easter eggs
        this.initEasterEggs();
        
        console.log('🚀 Portfolio loaded successfully!');
        console.log('💡 Try the theme toggle in the navigation bar!');
    }

    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        themeToggle.addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
            
            // Add bounce animation
            themeToggle.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 300);
        });
    }

    // Animation Initialization
    initAnimations() {
        // Initialize animation observer
        new AnimationObserver();
        
        // Initialize parallax effect
        new ParallaxEffect();
        
        // Initialize smooth reveal — store on instance so renderProjects() can use it
        this.smoothReveal = new SmoothReveal();

        // Set up the reveal observer — only observe skill cards here
        // because project cards don't exist in the DOM yet
        this.revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.smoothReveal.reveal([entry.target]);
                }
            });
        }, { threshold: 0.1 });

        // Skill cards are already in the HTML so observe them now
        document.querySelectorAll('.skill-card').forEach(card => {
            this.revealObserver.observe(card);
        });
    }

    // Navigation
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.getElementById('navLinks');
        const links = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active link highlighting
            this.highlightActiveSection();
        });

        // Mobile menu toggle
        if (mobileMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Update aria-expanded
                const isExpanded = navLinks.classList.contains('active');
                mobileMenu.setAttribute('aria-expanded', isExpanded);
            });
        }

        // Smooth scrolling
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            });
        });
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Projects
    loadProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        this.renderProjects(projects);
        this.initProjectFilters();
    }

    renderProjects(projectsToRender) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';

        projectsToRender.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);

            // Now that the card is in the DOM, register it with the observer
            if (this.revealObserver) {
                this.revealObserver.observe(projectCard);
            }
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);

        const tags = project.tags.map(tag => 
            `<span class="tech-tag">${tag}</span>`
        ).join('');

        const liveLink = project.liveUrl ? 
            `<a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer">
                🌐 Live Demo
            </a>` : '';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
                <div class="project-overlay"></div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${tags}
                </div>
                <div class="project-links">
                    ${liveLink}
                    <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer">
                        📂 GitHub
                    </a>
                </div>
            </div>
        `;

        return card;
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.currentFilter = filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        try {
            await this.simulateFormSubmission(data);
            this.showToast('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
            form.reset();
        } catch (error) {
            this.showToast('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            this.showToast('Please enter your name', 'error');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            this.showToast('Please enter a valid email address', 'error');
            return false;
        }

        if (!data.subject.trim()) {
            this.showToast('Please enter a subject', 'error');
            return false;
        }

        if (data.message.trim().length < 10) {
            this.showToast('Please enter a message with at least 10 characters', 'error');
            return false;
        }

        return true;
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form Data:', data);
            setTimeout(resolve, 2000);
        });
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? '✅' : 
                     type === 'error' ? '❌' : 'ℹ️';

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0 0.5rem;
            ">×</button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Loading Screen
    initLoadingScreen() {
        const loading = document.getElementById('loading');
        if (!loading) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loading.classList.add('fade-out');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Easter Eggs
    initEasterEggs() {
        // Konami Code
        this.initKonamiCode();
        
        // Secret clicks on logo
        this.initLogoClicks();
    }

    initKonamiCode() {
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.triggerRainbowMode();
            }
        });
    }

    initLogoClicks() {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        let clickCount = 0;
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                this.showToast('🎉 You found a secret! Keep exploring!', 'success');
                const glitch = new GlitchEffect(logo);
                glitch.trigger(2000);
                clickCount = 0;
            }
        });
    }

    triggerRainbowMode() {
        this.showToast('🎉 Konami Code activated! Rainbow mode enabled!', 'success');
        document.body.style.animation = 'rainbow 3s linear';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);

        // Add rainbow animation if not exists
        if (!document.getElementById('rainbow-animation')) {
            const style = document.createElement('style');
            style.id = 'rainbow-animation';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the app
const app = new PortfolioApp();

// Make app globally accessible for debugging
window.portfolioApp = app;
