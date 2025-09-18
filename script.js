// FIXED JavaScript - Better Mobile Support & Performance
document.addEventListener('DOMContentLoaded', function() {
  
  // Theme Toggle - FIXED for mobile
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('site-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    // Set initial icon
    if (icon) {
      if (savedTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      } else {
        icon.className = 'fa-solid fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      }
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      
      if (icon) {
        if (newTheme === 'dark') {
          icon.className = 'fa-solid fa-sun';
          themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
          icon.className = 'fa-solid fa-moon';
          themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
      }
    });
  }
  
  // FIXED: Better Mobile menu detection
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (navToggle && navList) {
    // Toggle menu
    navToggle.addEventListener('change', function() {
      if (this.checked) {
        navList.style.right = '0';
        document.body.style.overflow = 'hidden'; // FIXED: Prevent body scroll
      } else {
        navList.style.right = '-100%';
        document.body.style.overflow = ''; // FIXED: Restore body scroll
      }
    });
    
    // Close menu when clicking outside - FIXED for mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && navToggle.checked && 
          !navList.contains(e.target) && !document.querySelector('.nav-burger').contains(e.target)) {
        navToggle.checked = false;
        navList.style.right = '-100%';
        document.body.style.overflow = '';
      }
    });
    
    // FIXED: Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && navToggle.checked) {
        navToggle.checked = false;
        navList.style.right = '-100%';
        document.body.style.overflow = '';
      }
    });
  }
  
  // Smooth scrolling - FIXED for mobile
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // FIXED: Better mobile offset
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 
                           (window.innerWidth <= 768 ? 80 : 120);
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
        
        // Close mobile menu
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
          navList.style.right = '-100%';
          document.body.style.overflow = '';
        }
      }
    });
  });
  
  // Dropdown menus - FIXED for mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      const dropdown = this.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (menu) {
        if (!isExpanded) {
          menu.classList.add('active');
          // FIXED: Scroll to show full dropdown on mobile
          if (window.innerWidth <= 768) {
            menu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          menu.classList.remove('active');
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
      if (!dropdown.contains(e.target)) {
        const button = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (button) button.setAttribute('aria-expanded', 'false');
        if (menu) menu.classList.remove('active');
      }
    });
  });
  
  // Preloader - FIXED timing
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Show preloader for at least 800ms for better UX
    const startTime = Date.now();
    window.addEventListener('load', function() {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(800 - elapsed, 0);
      
      setTimeout(function() {
        preloader.classList.add('hidden');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 300);
      }, delay);
    });
    
    // Fallback after 5 seconds
    setTimeout(function() {
      if (preloader && preloader.style.display !== 'none') {
        preloader.classList.add('hidden');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 300);
      }
    }, 5000);
  }
  
  // Contact form - FIXED validation & mobile UX
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const errorDiv = document.getElementById('contact-form-error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // FIXED: Clear errors on input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('error');
        if (errorDiv) errorDiv.classList.remove('show');
      });
    });
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      let hasError = false;
      let errorMessages = [];
      
      if (!name || name.length < 2) {
        document.getElementById('name').classList.add('error');
        errorMessages.push('Name must be at least 2 characters');
        hasError = true;
      }
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { /* FIXED: Better email regex */
        document.getElementById('email').classList.add('error');
        errorMessages.push('Please enter a valid email');
        hasError = true;
      }
      
      if (!message || message.length < 10) {
        document.getElementById('message').classList.add('error');
        errorMessages.push('Message must be at least 10 characters');
        hasError = true;
      }
      
      if (hasError) {
        if (errorDiv) {
          errorDiv.innerHTML = errorMessages.join('<br>');
          errorDiv.classList.add('show');
        }
        // FIXED: Scroll to error on mobile
        if (window.innerWidth <= 768) {
          errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.classList.add('sending');
      }
      
      // Simulate sending with better timing
      setTimeout(function() {
        if (errorDiv) {
          errorDiv.innerHTML = 'Thank you! I\'ll get back to you within 24 hours.';
          errorDiv.classList.add('show', 'success');
        }
        contactForm.reset();
        
        setTimeout(function() {
          if (errorDiv) {
            errorDiv.innerHTML = '';
            errorDiv.classList.remove('show', 'success');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
            submitBtn.classList.remove('sending');
          }
        }, 4000);
      }, 1200);
    });
  }
  
  // Newsletter form - FIXED validation
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    const errorDiv = document.getElementById('newsletter-form-error');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const emailInput = newsletterForm.querySelector('input[name="email"]');
    
    // FIXED: Clear errors on input
    if (emailInput) {
      emailInput.addEventListener('input', function() {
        if (errorDiv) errorDiv.classList.remove('show');
      });
    }
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[name="email"]').value.trim();
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { /* FIXED: Better email regex */
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email address.';
          errorDiv.classList.add('show');
        }
        if (emailInput) {
          emailInput.classList.add('error');
        }
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.classList.add('sending');
      }
      
      // Simulate subscription
      setTimeout(function() {
        if (errorDiv) {
          errorDiv.textContent = 'Successfully subscribed! Welcome aboard.';
          errorDiv.classList.add('show', 'success');
        }
        newsletterForm.reset();
        
        setTimeout(function() {
          if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.remove('show', 'success');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Subscribe';
            submitBtn.classList.remove('sending');
          }
        }, 3000);
      }, 800);
    });
  }
  
  // Skip link - FIXED positioning
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('focus', function() {
      this.style.top = '10px';
      this.style.left = '10px';
      this.style.zIndex = '10001';
    });
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
      this.style.left = '6px';
      this.style.zIndex = '10000';
    });
  }
  
  // FIXED: Better scroll animations with mobile support
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: window.innerWidth <= 768 ? '0px 0px -50px 0px' : '0px 0px -100px 0px' // FIXED: Better mobile trigger
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.card, .project, .blog-post').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)'; // FIXED: Smaller animation distance
      el.style.transition = window.innerWidth <= 768 ? 
        'opacity 0.4s ease, transform 0.4s ease' : /* FIXED: Faster mobile animations */
        'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
  
  // FIXED: Performance - Remove unused event listeners on mobile
  if (window.innerWidth > 768) {
    // Desktop-only enhancements
    const cards = document.querySelectorAll('.card, .project, .blog-post');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }
  
});

// FIXED: Passive event listeners for better performance
document.addEventListener('touchstart', function() {}, { passive: true });
window.addEventListener('scroll', function() {}, { passive: true });