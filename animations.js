// Animation Observer for scroll-triggered animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        // Set up Intersection Observer for AOS-like animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(element => {
            this.observer.observe(element);
        });

        // Also observe stat numbers and skill cards
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => this.observer.observe(stat));

        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => this.observer.observe(card));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        if (!target || element.classList.contains('counted')) return;
        
        element.classList.add('counted');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    animateSkillBar(skillCard) {
        const skillBar = skillCard.querySelector('.skill-bar');
        if (!skillBar) return;

        const level = skillBar.getAttribute('data-level');
        setTimeout(() => {
            skillBar.style.width = level + '%';
        }, 100);
    }
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.orbs = document.querySelectorAll('.gradient-orb');
        this.init();
    }

    init() {
        if (!this.heroContent) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const speed = 0.5;

            // Move hero content
            if (this.heroContent) {
                this.heroContent.style.transform = `translateY(${scrolled * speed}px)`;
            }

            // Move orbs at different speeds
            this.orbs.forEach((orb, index) => {
                const orbSpeed = 0.2 + (index * 0.1);
                orb.style.transform = `translate(${scrolled * orbSpeed}px, ${scrolled * orbSpeed}px)`;
            });
        });
    }
}

// Smooth reveal animations
class SmoothReveal {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.skill-card, .project-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        });
    }

    reveal(elements) {
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}

// Cursor trail effect (optional, can be enabled)
class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 20;
        this.isActive = false;
    }

    init() {
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / this.trailLength};
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            this.trail.push(dot);
        }

        document.addEventListener('mousemove', (e) => {
            if (!this.isActive) return;
            
            this.trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.left = e.clientX + 'px';
                    dot.style.top = e.clientY + 'px';
                }, index * 20);
            });
        });
    }

    enable() {
        this.isActive = true;
        this.trail.forEach(dot => dot.style.display = 'block');
    }

    disable() {
        this.isActive = false;
        this.trail.forEach(dot => dot.style.display = 'none');
    }
}

// Typing effect for text
class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.element.textContent = '';
        this.index = 0;
        this.type();
    }
}

// Glitch effect (for special occasions)
class GlitchEffect {
    constructor(element) {
        this.element = element;
    }

    trigger(duration = 2000) {
        this.element.style.animation = `glitch 0.3s ease-in-out ${duration / 300}`;
        
        setTimeout(() => {
            this.element.style.animation = '';
        }, duration);
    }
}

// Add glitch animation to document
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
`;
document.head.appendChild(glitchStyle);

// Text scramble effect
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        this.element.innerText = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Export for use in app.js
window.AnimationObserver = AnimationObserver;
window.ParallaxEffect = ParallaxEffect;
window.SmoothReveal = SmoothReveal;
window.CursorTrail = CursorTrail;
window.TypingEffect = TypingEffect;
window.GlitchEffect = GlitchEffect;
window.TextScramble = TextScramble;
