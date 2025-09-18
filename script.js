// Utility: Debounce function for performance optimization
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

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

// FIXED: Theme toggle + save - Mobile defaults to light, desktop to dark
let themeToggle;
document.addEventListener('DOMContentLoaded', () => {
  themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Handle desktop theme toggle
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      // Swap icon and ARIA label
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', isDark);
        icon.classList.toggle('fa-sun', !isDark);
        themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'dark' : 'light'} theme`);
      }
      localStorage.setItem('site-theme', newTheme);
    });
  }

  // FIXED: Load saved theme with mobile/desktop detection
  const isMobile = window.innerWidth <= 768;
  const saved = localStorage.getItem('site-theme');
  const defaultTheme = isMobile ? 'light' : 'dark';
  const themeToUse = saved || defaultTheme;
  
  document.documentElement.setAttribute('data-theme', themeToUse);
  
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon', themeToUse === 'dark');
      icon.classList.toggle('fa-sun', themeToUse === 'light');
      themeToggle.setAttribute('aria-label', `Switch to ${themeToUse === 'dark' ? 'light' : 'dark'} theme`);
    }
  }
  
  // Listen for window resize to handle orientation changes
  window.addEventListener('resize', debounce(() => {
    const currentIsMobile = window.innerWidth <= 768;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('site-theme');
    const shouldBeMobileTheme = currentIsMobile ? 'light' : 'dark';
    
    if (!savedTheme && currentTheme !== shouldBeMobileTheme) {
      document.documentElement.setAttribute('data-theme', shouldBeMobileTheme);
      if (themeToggle && themeToggle.querySelector('i')) {
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon', shouldBeMobileTheme === 'dark');
        icon.classList.toggle('fa-sun', shouldBeMobileTheme === 'light');
        themeToggle.setAttribute('aria-label', `Switch to ${shouldBeMobileTheme === 'dark' ? 'light' : 'dark'} theme`);
      }
    }
  }, 250));

  // FIXED: Initialize mobile navigation
  initMobileNavigation();
  
  // FIXED: Initialize other interactions
  initNavigationLinks();
  initOverlays();
});

// FIXED: Complete Mobile Navigation System
function initMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navBurger = document.querySelector('.nav-burger');
  const navList = document.querySelector('.nav-list');
  
  if (!navToggle || !navBurger || !navList) return;

  // FIXED: Handle hamburger menu toggle
  navToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      // Open menu
      navList.style.right = '0';
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      document.documentElement.style.overflow = 'hidden';
      // Focus first nav item
      setTimeout(() => {
        const firstLink = navList.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
      }, 100);
    } else {
      // Close menu
      navList.style.right = '-100%';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });

  // FIXED: Handle dropdown toggles in mobile menu
  document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = button.closest('.dropdown');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          const otherButton = otherDropdown.querySelector('.dropdown-toggle');
          const otherMenu = otherDropdown.querySelector('.dropdown-menu');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          if (otherMenu) otherMenu.style.display = 'none';
        }
      });

      if (isExpanded) {
        // Close this dropdown
        button.setAttribute('aria-expanded', 'false');
        button.querySelector('i').style.transform = 'rotate(0deg)';
        if (menu) menu.style.display = 'none';
      } else {
        // Open this dropdown
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('i').style.transform = 'rotate(180deg)';
        if (menu) {
          menu.style.display = 'block';
          // Focus first item in dropdown
          setTimeout(() => {
            const firstDropdownLink = menu.querySelector('.nav-link');
            if (firstDropdownLink) firstDropdownLink.focus();
          }, 150);
        }
      }
    });
  });

  // FIXED: Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navToggle.checked && 
        !e.target.closest('.nav') && 
        !e.target.closest('.nav-burger') && 
        !e.target.closest('.dropdown')) {
      navToggle.checked = false;
      navList.style.right = '-100%';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      navBurger.querySelector('.fa-bars').style.display = 'inline';
      navBurger.querySelector('.nav-burger-close').style.display = 'none';
    }
  });

  // FIXED: Handle escape key to close mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.checked) {
      navToggle.checked = false;
      navList.style.right = '-100%';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      navBurger.querySelector('.fa-bars').style.display = 'inline';
      navBurger.querySelector('.nav-burger-close').style.display = 'none';
      navBurger.focus();
    }
  });

  // FIXED: Keyboard navigation for mobile menu
  navList.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navToggle.checked = false;
      navList.style.right = '-100%';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      navBurger.focus();
    }
  });
}

// FIXED: Navigation links handling
function initNavigationLinks() {
  document.querySelectorAll('.nav-link, .footer-link, .blog-content a[href*="#"], .blog-post-footer a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      
      // Handle resume download
      if (href && href.includes('resume.pdf')) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = href;
        link.download = 'Joseph_Okafor_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Close mobile menu
        closeMobileMenu();
        return;
      }
      
      // Handle internal anchor links
      if (href && href.includes('#')) {
        e.preventDefault();
        const [path, hash] = href.split('#');
        const target = hash ? document.querySelector(`#${hash}`) : null;
        
        if (target && (!path || path === '' || path === 'index.html')) {
          // Scroll to target
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          // Update active nav link
          if (a.classList.contains('nav-link')) {
            document.querySelectorAll('.nav-link').forEach(link => 
              link.removeAttribute('aria-current')
            );
            a.setAttribute('aria-current', 'page');
          }
        } else {
          // Navigate to external page
          window.location.href = href;
        }
        
        // Close mobile menu after navigation
        closeMobileMenu();
      }
      
      // Handle external links
      if (href && href !== '#' && !href.includes('#') && !href.includes('resume.pdf')) {
        if (href.includes('http') || href.includes('www')) {
          // External link - open in new tab
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          // Local link
          window.location.href = href;
        }
        closeMobileMenu();
      }
      
      // Handle placeholder project links
      if (href === '#') {
        e.preventDefault();
        alert('Project page coming soon! Please check back later.');
      }
    });
  });
}

// FIXED: Close mobile menu utility
function closeMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navBurger = document.querySelector('.nav-burger');
  
  if (navToggle && navToggle.checked) {
    navToggle.checked = false;
    if (navList) navList.style.right = '-100%';
    if (navBurger) {
      navBurger.querySelector('.fa-bars').style.display = 'inline';
      navBurger.querySelector('.nav-burger-close').style.display = 'none';
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Ensure all dropdowns are closed when menu closes
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
      button.setAttribute('aria-expanded', 'false');
      const icon = button.querySelector('i');
      if (icon) icon.style.transform = 'rotate(0deg)';
      const dropdown = button.closest('.dropdown');
      const menu = dropdown ? dropdown.querySelector('.dropdown-menu') : null;
      if (menu) menu.style.display = 'none';
    });
  }
}

// FIXED: Project and Blog overlays - Mobile safe
function initOverlays() {
  document.querySelectorAll('.project, .blog-post').forEach(item => {
    const overlay = item.querySelector('.project-overlay, .blog-overlay');
    if (overlay) {
      if (window.innerWidth > 768) {
        // Desktop: hover effects
        item.addEventListener('mouseenter', () => {
          overlay.style.opacity = '1';
          overlay.style.visibility = 'visible';
        });
        
        item.addEventListener('mouseleave', () => {
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
        });
      } else {
        // Mobile: always hidden
        overlay.style.display = 'none';
      }
    }
  });
  
  // Re-check on resize
  window.addEventListener('resize', debounce(() => {
    document.querySelectorAll('.project, .blog-post').forEach(item => {
      const overlay = item.querySelector('.project-overlay, .blog-overlay');
      if (overlay) {
        if (window.innerWidth > 768) {
          overlay.style.display = 'flex';
        } else {
          overlay.style.display = 'none';
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
        }
      }
    });
  }, 250));
}

// FIXED: Hero parallax effect (disabled on mobile for stability)
window.addEventListener('scroll', debounce(() => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scrollPosition = window.scrollY;
    heroBg.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  }
}, 16));

// FIXED: Contact form: validation & UX
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Ensure error container exists
    let errorEl = document.getElementById('contact-form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.id = 'contact-form-error';
      errorEl.className = 'form-error';
      errorEl.setAttribute('aria-live', 'polite');
      contactForm.insertBefore(errorEl, contactForm.querySelector('.form-actions'));
    }

    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const btn = contactForm.querySelector('.btn.btn-primary');

      // Reset errors
      [name, email, message].forEach(field => field?.classList.remove('error'));
      errorEl.classList.remove('show');
      errorEl.textContent = '';
      errorEl.style.color = '';

      // Validation
      if (!name?.value.trim() || name.value.trim().length < 2) {
        name?.classList.add('error');
        errorEl.textContent = 'Please enter a valid name (at least 2 characters).';
        errorEl.classList.add('show');
        name?.focus();
        return;
      }

      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email?.classList.add('error');
        errorEl.textContent = 'Please enter a valid email.';
        errorEl.classList.add('show');
        email?.focus();
        return;
      }

      if (message?.value.trim().length < 10) {
        message?.classList.add('error');
        errorEl.textContent = 'Message must be at least 10 characters.';
        errorEl.classList.add('show');
        message?.focus();
        return;
      }

      // Submit
      if (btn) {
        btn.disabled = true;
        btn.classList.add('sending');
        btn.textContent = 'Sending...';
      }

      try {
        // Simulated API call (replace with your API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000));
        errorEl.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        errorEl.classList.add('show');
        errorEl.style.color = 'var(--theme-accent)';
        contactForm.reset();
        setTimeout(() => {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }, 5000);
      } catch (error) {
        errorEl.textContent = 'Failed to send message. Please try again.';
        errorEl.classList.add('show');
      } finally {
        if (btn) {
          btn.textContent = 'Send Message';
          btn.classList.remove('sending');
          btn.disabled = false;
        }
      }
    });
  }

  // FIXED: Newsletter form: validation & UX
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    let errorEl = document.getElementById('newsletter-form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.id = 'newsletter-form-error';
      errorEl.className = 'form-error';
      errorEl.setAttribute('aria-live', 'polite');
      newsletterForm.insertBefore(errorEl, newsletterForm.querySelector('button'));
    }

    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[name="email"]');
      const btn = newsletterForm.querySelector('.btn');

      // Reset errors
      email?.classList.remove('error');
      errorEl.classList.remove('show');
      errorEl.textContent = '';
      errorEl.style.color = '';

      if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email?.classList.add('error');
        errorEl.textContent = 'Please enter a valid email.';
        errorEl.classList.add('show');
        email?.focus();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.classList.add('sending');
        btn.textContent = 'Subscribing...';
      }

      try {
        // Simulated API call (replace with your API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000));
        errorEl.textContent = 'Subscribed successfully! Check your email.';
        errorEl.classList.add('show');
        errorEl.style.color = 'var(--theme-accent)';
        newsletterForm.reset();
        setTimeout(() => {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }, 5000);
      } catch (error) {
        errorEl.textContent = 'Failed to subscribe. Please try again.';
        errorEl.classList.add('show');
      } finally {
        if (btn) {
          btn.textContent = 'Subscribe';
          btn.classList.remove('sending');
          btn.disabled = false;
        }
      }
    });
  }

  // FIXED: Keyboard navigation for accessibility
  document.querySelectorAll('.nav-link, .footer-link, .btn:not([disabled]), .social-link, .dropdown-toggle').forEach(element => {
    element.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !element.disabled) {
        e.preventDefault();
        element.click();
      }
    });
  });

  // FIXED: Highlight timeline markers on scroll - Mobile safe
  window.addEventListener('scroll', debounce(() => {
    if (window.innerWidth > 768) {
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }, 100));

  // FIXED: Prevent mobile overscroll on specific elements
  document.addEventListener('touchstart', e => {
    const target = e.target.closest('.blog-post, .project, .card');
    if (target) {
      target.style.overscrollBehavior = 'contain';
    }
  }, { passive: true });

  // FIXED: Desktop dropdown click outside handler
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 920) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          const button = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (button) {
            button.setAttribute('aria-expanded', 'false');
            button.querySelector('i').style.transform = 'rotate(0deg)';
          }
          if (menu) menu.style.display = 'none';
        }
      });
    }
  });
});

// FIXED: Intersection Observer for staggered animations
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
}