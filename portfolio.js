// Portfolio JavaScript

class Portfolio {
    constructor() {
        this.isDarkMode = false;
        this.activeSection = '';
        this.init();
    }

    init() {
        this.initTheme();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.classList.add('dark');
            this.updateThemeIcons(true);
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        
        if (this.isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        
        this.updateThemeIcons(this.isDarkMode);
    }

    updateThemeIcons(isDark) {
        const heroToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-theme-toggle');
        
        const iconClass = isDark ? 'fa-sun' : 'fa-moon';
        
        if (heroToggle) {
            heroToggle.querySelector('i').className = `fas ${iconClass}`;
        }
        if (navToggle) {
            navToggle.querySelector('i').className = `fas ${iconClass}`;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle buttons
        const heroToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-theme-toggle');
        
        if (heroToggle) {
            heroToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Navbar visibility on scroll
        this.setupNavbarScrollBehavior();
    }

    // Smooth Scrolling
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbar = document.getElementById('navbar');
            const headerHeight = navbar ? navbar.offsetHeight : 0;
            const offsetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling is handled by CSS scroll-behavior: smooth
        // This method can be extended for additional smooth scrolling features
    }

    // Navbar Scroll Behavior
    setupNavbarScrollBehavior() {
        const navbar = document.getElementById('navbar');
        const heroSection = document.getElementById('hero');
        
        if (!navbar || !heroSection) return;

        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            // Add/remove scrolled class based on scroll position
            if (currentScrollY > heroHeight * 0.1) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    this.activeSection = entry.target.id;
                    
                    // Animate skill bars when skills section is visible
                    if (entry.target.id === 'skills') {
                        this.animateSkillBars(entry.target);
                    }
                } else {
                    // Reset skill bars when section is out of view
                    if (entry.target.id === 'skills') {
                        this.resetSkillBars(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in sections except about (which is visible by default)
        document.querySelectorAll('.fade-in:not(#about)').forEach(section => {
            observer.observe(section);
        });
    }

    // Skill Bar Animations
    animateSkillBars(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-bar[data-width]');
        
        skillBars.forEach((skillBar, index) => {
            const targetWidth = skillBar.getAttribute('data-width');
            
            // Reset width first
            skillBar.style.width = '0%';
            
            // Animate with staggered delay
            setTimeout(() => {
                if (targetWidth) {
                    skillBar.style.width = targetWidth;
                }
            }, 100 + (index * 100));
        });
    }

    resetSkillBars(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-bar[data-width]');
        skillBars.forEach(skillBar => {
            skillBar.style.width = '0%';
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    // Performance optimization for scroll events
    setupOptimizedScrollHandlers() {
        const debouncedScroll = this.debounce(() => {
            // Additional scroll-based animations can be added here
        }, 10);
        
        window.addEventListener('scroll', debouncedScroll);
    }
}

// Global scroll function for button onclick
function scrollToSection(sectionId) {
    if (window.portfolioInstance) {
        window.portfolioInstance.scrollToSection(sectionId);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioInstance = new Portfolio();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations if needed
    } else {
        // Page is visible, resume animations if needed
    }
});

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}