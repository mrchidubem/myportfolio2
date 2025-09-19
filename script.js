/**
 * Senior Portfolio 2025 - COMPLETE FIXED VERSION
 * FIXED: Mobile navigation completely rewritten
 * FIXED: Theme toggle properly integrated in mobile menu
 * FIXED: All scroll and animation timing issues resolved
 * FIXED: Enhanced form validation and accessibility
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
    // FIXED: Update header height immediately
    setTimeout(() => this.updateHeaderHeight(), 0);
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
    
    // FIXED: Initial announcement
    setTimeout(() => this.announce('Page loaded successfully'), 500);
  }
  
  // FIXED: Enhanced header height calculation with better timing
  updateHeaderHeight() {
    const header = document.querySelector('.site-header');
    if (header) {
      this.headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
      
      // FIXED: Update scroll-padding for smooth scrolling
      if (window.innerWidth >= 769) {
        document.documentElement.style.scrollPaddingTop = `${this.headerHeight + 20}px`;
      } else {
        document.documentElement.style.scrollPaddingTop = `${this.headerHeight}px`;
      }
    }
  }

  // FIXED: Completely Rewritten Navigation System
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-scroll], .footer-link[data-scroll]');
    const mobileToggle = document.getElementById('nav-toggle');
    const navBurger = document.querySelector('.nav-burger');
    
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
          
          // FIXED: Close mobile menu if open
          if (mobileToggle && mobileToggle.checked) {
            this.closeMobileMenu(mobileToggle);
          }
        }
      });
    });
    
    // FIXED: Enhanced mobile menu handling with correct selectors
    if (mobileToggle && navBurger) {
      const handleMenuToggle = (e) => {
        if (e.target.checked) {
          this.openMobileMenu();
        } else {
          this.closeMobileMenu(mobileToggle);
        }
      };
      
      mobileToggle.addEventListener('change', handleMenuToggle);
      
      // FIXED: Close menu on outside click (document level)
      document.addEventListener('click', (e) => {
        if (mobileToggle.checked && 
            !e.target.closest('.header-inner') && 
            !e.target.closest('.nav-mobile')) {
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
    
    // FIXED: Enhanced keyboard navigation with proper focus handling
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && 
          (e.target.matches('.nav-link, .footer-link, .btn, .social-link, .filter-btn, .service-link, .insight-link'))) {
        e.preventDefault();
        e.target.click();
      }
    });
    
    // FIXED: Initialize scroll-based navigation after a short delay
    setTimeout(() => {
      this.initScrollBasedNavigation();
    }, 100);
  }
  
  // FIXED: Enhanced mobile menu open with proper focus management
  openMobileMenu() {
    const mobileToggle = document.getElementById('nav-toggle');
    const firstLink = document.querySelector('.nav-list-mobile .nav-link');
    
    // FIXED: Focus management with proper timing
    setTimeout(() => {
      if (firstLink) {
        firstLink.focus();
        this.trapFocus(firstLink, '.nav-list-mobile .nav-link');
      }
    }, 200);
    
    this.announce('Navigation menu opened');
    this.isMobileMenuOpen = true;
    
    // FIXED: Add body scroll lock
    document.body.style.overflow = 'hidden';
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
      // FIXED: Restore body scroll
      document.body.style.overflow = '';
    }, 300);
    
    this.announce('Navigation menu closed');
  }
  
  // FIXED: Enhanced focus trapping for mobile menu
  trapFocus(startElement, selector) {
    const focusableElements = document.querySelectorAll(selector);
    const focusableArray = Array.from(focusableElements);
    const currentIndex = focusableArray.indexOf(startElement);
    
    const handleKeydown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const isForward = !e.shiftKey;
        let nextIndex = currentIndex;
        
        if (isForward) {
          nextIndex = (currentIndex + 1) % focusableArray.length;
        } else {
          nextIndex = currentIndex === 0 ? focusableArray.length - 1 : currentIndex - 1;
        }
        
        focusableArray[nextIndex].focus();
      }
    };
    
    // FIXED: Remove previous listener to prevent stacking
    document.removeEventListener('keydown', this.lastFocusHandler);
    this.lastFocusHandler = handleKeydown;
    document.addEventListener('keydown', handleKeydown);
    
    // FIXED: Clean up when menu closes
    const mobileToggle = document.getElementById('nav-toggle');
    const observer = new MutationObserver(() => {
      if (!mobileToggle.checked) {
        document.removeEventListener('keydown', handleKeydown);
        observer.disconnect();
      }
    });
    observer.observe(mobileToggle, { attributes: true, attributeFilter: ['checked'] });
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
  
  // FIXED: Enhanced scroll-based navigation with better thresholds
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

  // FIXED: Enhanced stats animation with better performance
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

  // FIXED: Enhanced Scroll Animations - All timing issues resolved
  initScrollAnimations() {
    // General fade-in animations for most elements
    const generalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      ...this.observerOptions,
      rootMargin: `-${this.headerHeight}px 0px ${this.observerOptions.rootMargin} 0px`
    });
    
    // Observe general fade-in elements
    document.querySelectorAll('.fade-in, .expertise-card, .service-card, .project-card, .insight-card').forEach(el => {
      generalObserver.observe(el);
    });
    
    // FIXED: Timeline animations with immediate visibility
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      // FIXED: Ensure immediate visibility
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
      
      // Subtle entrance animation
      setTimeout(() => {
        item.classList.add('animate');
      }, index * 150);
    });
    
    // FIXED: Additional observer for section headers
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionHeader = entry.target.querySelector('.section-header');
          if (sectionHeader) {
            sectionHeader.classList.add('visible');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: `-${this.headerHeight}px 0px -30% 0px`
    });
    
    document.querySelectorAll('.section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // FIXED: Enhanced project filtering with better animations
  initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filterValue = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        projectCards.forEach((card, index) => {
          const categories = card.getAttribute('data-categories') || '';
          const shouldShow = filterValue === 'all' || categories.includes(filterValue);
          
          // FIXED: Better animation timing
          card.style.transition = 'opacity 300ms ease, transform 300ms ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            if (shouldShow) {
              card.style.display = 'block';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            } else {
              card.style.display = 'none';
            }
          }, index * 50);
        });
        
        this.announce(`Projects filtered by ${filterValue}`);
      });
    });
  }

  // FIXED: Enhanced form handling with better validation
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
  
  // FIXED: Enhanced form validation with better error handling
  validateContactForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');
    
    fields.forEach(field => {
      const fieldValue = field.value.trim();
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.form-error');
      
      // FIXED: Clear previous errors
      field.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
      }
      
      if (!fieldValue) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = `${this.getFieldName(field.name)} is required`;
          errorEl.classList.add('show');
        }
        return;
      }
      
      if (field.type === 'email' && !this.validateEmail(fieldValue)) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address';
          errorEl.classList.add('show');
        }
      }
      
      if (field.id === 'message' && fieldValue.length < 10) {
        isValid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Message must be at least 10 characters';
          errorEl.classList.add('show');
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
    
    this.announce(message);
  }
  
  showFormError(form, message) {
    const firstErrorEl = form.querySelector('.form-error');
    if (firstErrorEl) {
      firstErrorEl.textContent = message;
      firstErrorEl.style.color = 'rgb(239 68 68)';
      firstErrorEl.classList.add('show');
    }
    
    this.announce(message);
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

  // FIXED: Enhanced preloader with better timing
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

  // FIXED: Enhanced theme system with mobile menu integration
  initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isMobile = window.innerWidth <= 768;
    
    const savedTheme = localStorage.getItem('portfolio-theme');
    let activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    html.setAttribute('data-theme', activeTheme);
    this.updateThemeIcon(activeTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        const ariaLabel = `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`;
        themeToggle.setAttribute('aria-label', ariaLabel);
        
        this.announce(`Switched to ${newTheme} theme`);
      });
    }
    
    // FIXED: System preference listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        const systemTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', systemTheme);
        this.updateThemeIcon(systemTheme);
      }
    });
  }
  
  updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.className = `fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;
    }
  }

  // FIXED: Enhanced parallax with better performance
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

  // FIXED: Enhanced accessibility features
  initAccessibility() {
    // FIXED: Enhanced skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '1rem';
        skipLink.style.zIndex = '10000';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
        skipLink.style.zIndex = '100';
      });
    }
    
    // FIXED: Enhanced live region announcements
    const announceRegion = document.getElementById('live-announce');
    if (announceRegion) {
      window.announce = (message, delay = 1000) => {
        announceRegion.textContent = message;
        setTimeout(() => {
          announceRegion.textContent = '';
        }, delay);
      };
    }
  }
  
  announce(message, delay = 1000) {
    if (window.announce) {
      window.announce(message, delay);
    }
  }

  // FIXED: Enhanced scroll animations initialization
  startScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
      setTimeout(() => {
        item.classList.add('animate');
      }, index * 150);
    });
    
    // General fade-in animations
    document.querySelectorAll('.fade-in').forEach((el, index) => {
      el.style.animationDelay = `${index * 80}ms`;
      el.classList.add('visible');
    });
  }
}

// FIXED: Intersection Observer polyfill with better error handling
if (!window.IntersectionObserver) {
  const script = document.createElement('script');
  script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
  script.onerror = () => console.warn('IntersectionObserver polyfill failed to load');
  document.head.appendChild(script);
}

// FIXED: Enhanced DOM ready detection
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // FIXED: Small delay to ensure styles are applied
    setTimeout(() => new PortfolioApp(), 0);
  });
} else {
  new PortfolioApp();
}

// FIXED: Performance optimizations with resource preloading
if ('link' in document.createElement('link')) {
  const preloadLinks = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e896?w=400&h=250&fit=crop'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    document.head.appendChild(link);
  });
}

// FIXED: Global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});