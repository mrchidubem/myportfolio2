// Simple JavaScript for Dubicventures Portfolio
// Only essential functionality - no errors

document.addEventListener('DOMContentLoaded', function() {
  
  // Theme Toggle
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
    themeToggle.addEventListener('click', function() {
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
  
  // Mobile menu
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (navToggle && navList) {
    navToggle.addEventListener('change', function() {
      if (this.checked) {
        navList.style.right = '0';
      } else {
        navList.style.right = '-100%';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && navToggle.checked && 
          !navList.contains(e.target) && !document.querySelector('.nav-burger').contains(e.target)) {
        navToggle.checked = false;
        navList.style.right = '-100%';
      }
    });
  }
  
  // Smooth scrolling
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Close mobile menu
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
          navList.style.right = '-100%';
        }
      }
    });
  });
  
  // Dropdown menus
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
  
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.classList.add('hidden');
      setTimeout(function() {
        preloader.style.display = 'none';
      }, 500);
    });
  }
  
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const errorDiv = document.getElementById('contact-form-error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      let hasError = false;
      
      if (!name || name.length < 2) {
        document.getElementById('name').classList.add('error');
        hasError = true;
      }
      
      if (!email || !email.includes('@')) {
        document.getElementById('email').classList.add('error');
        hasError = true;
      }
      
      if (!message || message.length < 10) {
        document.getElementById('message').classList.add('error');
        hasError = true;
      }
      
      if (hasError) {
        if (errorDiv) {
          errorDiv.textContent = 'Please fix the errors above.';
          errorDiv.classList.add('show');
        }
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      // Simulate sending
      setTimeout(function() {
        if (errorDiv) {
          errorDiv.textContent = 'Thank you! I\'ll get back to you soon.';
          errorDiv.classList.add('show', 'success');
        }
        contactForm.reset();
        
        setTimeout(function() {
          if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.remove('show', 'success');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        }, 3000);
      }, 1500);
    });
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    const errorDiv = document.getElementById('newsletter-form-error');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[name="email"]').value.trim();
      
      if (!email || !email.includes('@')) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email address.';
          errorDiv.classList.add('show');
        }
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
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
            submitBtn.textContent = 'Subscribe';
          }
        }, 3000);
      }, 1000);
    });
  }
  
  // Skip link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('focus', function() {
      this.style.top = '10px';
    });
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
  }
  
});

// Simple scroll animations
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.card, .project, .blog-post').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}