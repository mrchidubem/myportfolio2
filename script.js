/**
 * Senior Portfolio 2025 - Refined Interactive JavaScript
 * Optimized for smaller fonts and cleaner navigation
 */

class PortfolioApp {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    this.initPreloader();
    this.initThemeSystem();
    this.initNavigation();
    this.initScrollAnimations();
    this.initProjectFilter();
    this.initForms();
    this.initStatsAnimation();
    this.initParallax();
    this.initAccessibility();
  }

  // Preloader with refined animation
  initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Simulate loading progress
    const progressFill = document.querySelector('.progress-fill');
    let progress = 0;
    const increment = 1.5;
    
    const updateProgress = () => {
      if (progress < 100) {
        progress += increment;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
        requestAnimationFrame(updateProgress);
      } else {
        // Hide preloader after animation
        setTimeout(() => {
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
            this.startScrollAnimations();
          }, 250);
        }, 400);
      }
    };
    
    // Start progress after a short delay
    setTimeout(updateProgress, 150);
  }

  // Theme system with system preference detection
  initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isMobile = window.innerWidth <= 768;
    
    // Load saved theme or use intelligent default
    const savedTheme = localStorage.getItem('portfolio-theme');
    let activeTheme = savedTheme || (isMobile ? 'light' : 'dark');
    
    // Apply theme
    html.setAttribute('data-theme', activeTheme);
    this.updateThemeIcon(activeTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Update ARIA label
        themeToggle.setAttribute('aria-label', 
          `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`
        );
      });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', systemTheme);
        this.updateThemeIcon(systemTheme);
      }
    });
  }
  
  updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-moon theme-icon' : 'fas fa-sun theme-icon';
    }
  }

  // Navigation with hamburger only on mobile
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-scroll], .footer-link[data-scroll]');
    const mobileToggle = document.getElementById('nav-toggle');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('data-scroll');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Update active nav state
          this.updateActiveNav(link);
          
          // Close mobile menu
          if (mobileToggle && mobileToggle.checked) {
            mobileToggle.checked = false;
          }
        }
      });
    });
    
    // Handle external links
    document.querySelectorAll('a[href*="#"]:not([data-scroll]), a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Close mobile menu for external navigation
        if (mobileToggle && mobileToggle.checked) {
          mobileToggle.checked = false;
        }
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && 
          (e.target.matches('.nav-link, .footer-link, .btn, .social-link'))) {
        e.preventDefault();
        e.target.click();
      }
    });
  }
  
  updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
    });
    
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
      activeLink.classList.add('active');
    }
  }

  // Intersection Observer for scroll animations
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, this.observerOptions);
    
    // Observe all animation targets
    document.querySelectorAll('.fade-in, .timeline-item, .expertise-card, .service-card').forEach(el => {
      observer.observe(el);
    });
    
    // Timeline specific observer for staggered entrance
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 150);
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
      timelineObserver.observe(item);
    });
  }
  
  startScrollAnimations() {
    // Trigger initial animations after preloader
    document.querySelectorAll('.fade-in').forEach((el, index) => {
      el.style.animationDelay = `${index * 80}ms`;
      el.classList.add('visible');
    });
  }

  // Project filtering
  initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        projectCards.forEach((card, index) => {
          const categories = card.getAttribute('data-categories');
          const shouldShow = filterValue === 'all' || categories.includes(filterValue);
          
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            if (shouldShow) {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          }, index * 40);
        });
      });
    });
  }

  // Form handling
  initForms() {
    this.initContactForm();
    this.initNewsletterForm();
  }
  
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Disable form during submission
      this.setFormState(form, false, 'Sending...');
      
      try {
        // Client-side validation
        const isValid = this.validateContactForm(form);
        if (!isValid) {
          this.setFormState(form, true, originalText);
          return;
        }
        
        // Simulate API call
        await this.simulateApiCall(1200, 1800);
        
        // Success feedback
        this.showFormSuccess(form, 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        this.showFormError(form, 'Sorry, something went wrong. Please try again.');
      } finally {
        this.setFormState(form, true, originalText);
      }
    });
  }
  
  initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[name="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Validate email
      const email = emailInput.value.trim();
      if (!this.validateEmail(email)) {
        this.showFieldError(emailInput, 'Please enter a valid email address');
        return;
      }
      
      this.setFormState(form, false, 'Subscribing...');
      
      try {
        await this.simulateApiCall(800, 1200);
        this.showFormSuccess(form, 'Welcome! You\'ve been subscribed to monthly insights.');
        form.reset();
      } catch (error) {
        this.showFormError(form, 'Subscription failed. Please try again.');
      } finally {
        this.setFormState(form, true, originalText);
      }
    });
  }
  
  validateContactForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');
    
    fields.forEach(field => {
      const fieldValue = field.value.trim();
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.form-error');
      
      // Clear previous errors
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
      
      // Validate required fields
      if (!fieldValue) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = `${this.getFieldName(field.name)} is required`;
        }
        return;
      }
      
      // Email validation
      if (field.type === 'email' && !this.validateEmail(fieldValue)) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address';
        }
      }
      
      // Message length validation
      if (field.id === 'message' && fieldValue.length < 10) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Message must be at least 10 characters';
        }
      }
    });
    
    return isValid;
  }
  
  getFieldName(fieldName) {
    const names = {
      'name': 'Name',
      'email': 'Email',
      'service': 'Service',
      'message': 'Message'
    };
    return names[fieldName] || fieldName;
  }
  
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  setFormState(form, enabled, buttonText) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.disabled = !enabled;
    });
    
    submitBtn.disabled = !enabled;
    submitBtn.innerHTML = buttonText;
  }
  
  showFormSuccess(form, message) {
    const firstErrorEl = form.querySelector('.form-error');
    if (firstErrorEl) {
      firstErrorEl.textContent = message;
      firstErrorEl.style.color = 'rgb(34 197 94)';
      firstErrorEl.classList.add('show');
      
      // Auto-hide success message
      setTimeout(() => {
        firstErrorEl.classList.remove('show');
        firstErrorEl.textContent = '';
      }, 4000);
    }
  }
  
  showFormError(form, message) {
    const firstErrorEl = form.querySelector('.form-error');
    if (firstErrorEl) {
      firstErrorEl.textContent = message;
      firstErrorEl.style.color = 'rgb(239 68 68)';
      firstErrorEl.classList.add('show');
    }
  }
  
  showFieldError(field, message) {
    const container = field.closest('.form-group');
    const errorEl = container.querySelector('.form-error');
    
    field.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }
  
  simulateApiCall(minDelay, maxDelay) {
    return new Promise((resolve, reject) => {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      
      setTimeout(() => {
        if (Math.random() > 0.05) { // 5% failure rate for testing
          resolve();
        } else {
          reject(new Error('API Error'));
        }
      }, delay);
    });
  }

  // Stats counter
  initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateStats = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 80;
        let current = 0;
        
        const updateStat = () => {
          if (current < target) {
            current += increment;
            stat.textContent = current < 10 ? Math.ceil(current) : Math.floor(current);
            requestAnimationFrame(updateStat);
          } else {
            stat.textContent = target;
          }
        };
        
        updateStat();
      });
    };
    
    // Trigger animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // Subtle parallax effect
  initParallax() {
    if (window.innerWidth <= 768 || 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const heroBg = document.querySelector('.hero-bg');
      
      if (heroBg) {
        const speed = scrolled * -0.3;
        heroBg.style.transform = `translateY(${speed}px)`;
      }
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Accessibility enhancements
  initAccessibility() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to content';
    skipLink.className = 'skip-link';
    document.body.prepend(skipLink);
    
    // Focus management for mobile menu
    const mobileToggle = document.getElementById('nav-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          // Focus first nav link when menu opens
          setTimeout(() => {
            const firstLink = document.querySelector('.nav-list .nav-link');
            if (firstLink) firstLink.focus();
          }, 100);
        }
      });
    }
    
    // Announce dynamic content changes
    const announceRegion = document.createElement('div');
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.className = 'sr-only';
    document.body.appendChild(announceRegion);
    
    window.announce = (message) => {
      announceRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announceRegion.textContent = '';
      }, 1000);
    };
  }
}

// Intersection Observer polyfill for older browsers
if (!window.IntersectionObserver) {
  const script = document.createElement('script');
  script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
  document.head.appendChild(script);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
} else {
  new PortfolioApp();
}

// Performance optimizations
// Preload critical resources
if ('link' in document.createElement('link')) {
  const preloadLinks = [
    './public/dube.jpg'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    document.head.appendChild(link);
  });
}