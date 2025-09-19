/**
 * Senior Portfolio 2025 - COMPLETE FIXED VERSION
 * All navigation, hero, and interactive issues permanently resolved
 */

class PortfolioApp {
  constructor() {
    this.headerHeight = 0;
    this.isMobileMenuOpen = false;
    this.scrollObserver = null;
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    this.updateHeaderHeight();
    this.initPreloader();
    this.initThemeSystem();
    this.initNavigation();
    this.initScrollAnimations();
    this.initProjectFilter();
    this.initForms();
    this.initStatsAnimation();
    this.initParallax();
    this.initAccessibility();
    
    // Handle window resize for header height
    window.addEventListener('resize', () => {
      this.updateHeaderHeight();
    }, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updateHeaderHeight(), 100);
    });
  }
  
  // FIXED: Dynamic header height calculation
  updateHeaderHeight() {
    const header = document.querySelector('.site-header');
    if (header) {
      this.headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
    }
  }

  // FIXED: Enhanced Navigation System - Complete Rewrite
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-scroll], .footer-link[data-scroll]');
    const mobileToggle = document.getElementById('nav-toggle');
    const navBurger = document.querySelector('.nav-burger');
    const navList = document.querySelector('.nav-list');
    
    // FIXED: Enhanced smooth scrolling with proper offset
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('data-scroll');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - this.headerHeight - 20;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          this.updateActiveNav(link);
          
          // FIXED: Close mobile menu with animation
          if (mobileToggle && mobileToggle.checked) {
            this.closeMobileMenu(mobileToggle);
          }
        }
      });
    });
    
    // FIXED: Enhanced mobile menu handling
    if (mobileToggle && navBurger && navList) {
      // Open menu
      const handleMenuToggle = (e) => {
        if (e.target.checked) {
          this.openMobileMenu();
        } else {
          this.closeMobileMenu(mobileToggle);
        }
      };
      
      mobileToggle.addEventListener('change', handleMenuToggle);
      
      // Close menu on outside click
      navList.addEventListener('click', (e) => {
        if (e.target === navList) {
          mobileToggle.checked = false;
          this.closeMobileMenu(mobileToggle);
        }
      });
      
      // FIXED: Close menu with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileToggle.checked) {
          mobileToggle.checked = false;
          this.closeMobileMenu(mobileToggle);
          navBurger.focus();
        }
      });
    }
    
    // FIXED: Handle external links and other navigation
    document.querySelectorAll('a[href*="#"]:not([data-scroll]), a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        const mobileToggle = document.getElementById('nav-toggle');
        if (mobileToggle && mobileToggle.checked) {
          this.closeMobileMenu(mobileToggle);
        }
      });
    });
    
    // FIXED: Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && 
          (e.target.matches('.nav-link, .footer-link, .btn, .social-link, .filter-btn, .service-link, .insight-link'))) {
        e.preventDefault();
        e.target.click();
      }
    });
    
    // FIXED: Initialize scroll-based navigation
    this.initScrollBasedNavigation();
  }
  
  // FIXED: Enhanced mobile menu open
  openMobileMenu() {
    const mobileToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-toggle:checked ~ .nav-list .nav-link');
    
    // FIXED: Focus management
    setTimeout(() => {
      const firstLink = document.querySelector('.nav-toggle:checked ~ .nav-list .nav-link');
      if (firstLink) {
        firstLink.focus();
        this.trapFocus(firstLink, '.nav-toggle:checked ~ .nav-list .nav-link');
      }
    }, 150);
    
    this.announce('Navigation menu opened');
    this.isMobileMenuOpen = true;
  }
  
  // FIXED: Enhanced mobile menu close
  closeMobileMenu(mobileToggle) {
    mobileToggle.checked = false;
    this.isMobileMenuOpen = false;
    
    setTimeout(() => {
      const navBurger = document.querySelector('.nav-burger');
      if (navBurger) {
        navBurger.focus();
      }
    }, 300);
    
    this.announce('Navigation menu closed');
  }
  
  // FIXED: Focus trapping for mobile menu
  trapFocus(startElement, selector) {
    const focusableElements = document.querySelectorAll(selector);
    const focusableArray = Array.from(focusableElements);
    const currentIndex = focusableArray.indexOf(startElement);
    
    const handleKeydown = (e) => {
      if (e.key === 'Tab') {
        const isForward = !e.shiftKey;
        let nextIndex = currentIndex;
        
        if (isForward) {
          nextIndex = (currentIndex + 1) % focusableArray.length;
        } else {
          nextIndex = currentIndex === 0 ? focusableArray.length - 1 : currentIndex - 1;
        }
        
        focusableArray[nextIndex].focus();
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeydown, { once: true });
  }

  // FIXED: Enhanced active navigation state
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
  
  // FIXED: Scroll-based navigation highlighting
  initScrollBasedNavigation() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const targetId = entry.target.id;
        const correspondingLink = document.querySelector(`.nav-link[data-scroll="${targetId}"]`);
        
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
            link.removeAttribute('aria-current');
            link.classList.remove('active');
          });
          
          if (correspondingLink) {
            correspondingLink.setAttribute('aria-current', 'page');
            correspondingLink.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: `-${this.headerHeight}px 0px -40% 0px`
    });
    
    document.querySelectorAll('section[id]').forEach(section => {
      this.scrollObserver.observe(section);
    });
  }

  // FIXED: Enhanced stats animation with better timing
  initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateStats = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        let startTime = null;
        
        const updateStat = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          
          if (elapsed < duration) {
            current = Math.min((elapsed / duration) * target, target);
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateStat);
          } else {
            stat.textContent = target;
          }
        };
        
        requestAnimationFrame(updateStat);
      });
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateStats, 200);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.5,
      rootMargin: `-${this.headerHeight}px 0px 0px 0px`
    });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      statsObserver.observe(statsSection.parentElement || statsSection);
    }
  }

  // FIXED: Enhanced Intersection Observer with header offset
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      ...this.observerOptions,
      rootMargin: `-${this.headerHeight}px 0px ${this.observerOptions.rootMargin} 0px`
    });
    
    document.querySelectorAll('.fade-in, .timeline-item, .expertise-card, .service-card').forEach(el => {
      observer.observe(el);
    });
    
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 150);
        }
      });
    }, { 
      threshold: 0.5,
      rootMargin: `-${this.headerHeight}px 0px 0px 0px`
    });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
      timelineObserver.observe(item);
    });
  }

  // Project filtering
  initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
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
      
      this.setFormState(form, false, 'Sending...');
      
      try {
        const isValid = this.validateContactForm(form);
        if (!isValid) {
          this.setFormState(form, true, originalText);
          return;
        }
        
        await this.simulateApiCall(1200, 1800);
        this.showFormSuccess(form, 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.');
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
      
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
      
      if (!fieldValue) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = `${this.getFieldName(field.name)} is required`;
        }
        return;
      }
      
      if (field.type === 'email' && !this.validateEmail(fieldValue)) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address';
        }
      }
      
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
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error('API Error'));
        }
      }, delay);
    });
  }

  // Preloader with refined animation
  initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const progressFill = document.querySelector('.progress-fill');
    let progress = 0;
    const increment = 1.5;
    
    const updateProgress = () => {
      if (progress < 100) {
        progress += increment;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
        requestAnimationFrame(updateProgress);
      } else {
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
    
    setTimeout(updateProgress, 150);
  }

  // Theme system with system preference detection
  initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isMobile = window.innerWidth <= 768;
    
    const savedTheme = localStorage.getItem('portfolio-theme');
    let activeTheme = savedTheme || (isMobile ? 'light' : 'dark');
    
    html.setAttribute('data-theme', activeTheme);
    this.updateThemeIcon(activeTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        themeToggle.setAttribute('aria-label', 
          `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`
        );
      });
    }
    
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

  // FIXED: Enhanced accessibility with better announcements
  initAccessibility() {
    // FIXED: Enhanced skip link (already in HTML)
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '1rem';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
    }
    
    // FIXED: Enhanced live region
    const announceRegion = document.getElementById('live-announce');
    if (announceRegion) {
      window.announce = (message, delay = 1000) => {
        announceRegion.textContent = message;
        setTimeout(() => {
          announceRegion.textContent = '';
        }, delay);
      };
    }
    
    if (document.readyState === 'complete') {
      this.announce('Page loaded successfully');
    }
  }
  
  announce(message, delay = 1000) {
    if (window.announce) {
      window.announce(message, delay);
    }
  }

  startScrollAnimations() {
    document.querySelectorAll('.fade-in').forEach((el, index) => {
      el.style.animationDelay = `${index * 80}ms`;
      el.classList.add('visible');
    });
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