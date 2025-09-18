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
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
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
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth <= 768;
  const saved = localStorage.getItem('site-theme');
  
  // Mobile default: light theme, Desktop default: dark theme
  const defaultTheme = isMobile ? 'light' : 'dark';
  const themeToUse = saved || defaultTheme;
  
  document.documentElement.setAttribute('data-theme', themeToUse);
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-moon', themeToUse === 'dark');
    icon.classList.toggle('fa-sun', themeToUse === 'light');
    themeToggle.setAttribute('aria-label', `Switch to ${themeToUse === 'dark' ? 'light' : 'dark'} theme`);
  }
  
  // Listen for window resize to handle orientation changes
  window.addEventListener('resize', debounce(() => {
    const currentIsMobile = window.innerWidth <= 768;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const shouldBeMobileTheme = currentIsMobile ? 'light' : 'dark';
    
    if (!saved && currentTheme !== shouldBeMobileTheme) {
      document.documentElement.setAttribute('data-theme', shouldBeMobileTheme);
      if (icon) {
        icon.classList.toggle('fa-moon', shouldBeMobileTheme === 'dark');
        icon.classList.toggle('fa-sun', shouldBeMobileTheme === 'light');
        themeToggle.setAttribute('aria-label', `Switch to ${shouldBeMobileTheme === 'dark' ? 'light' : 'dark'} theme`);
      }
    }
  }, 250));

  // FIXED: Initialize mobile navigation
  initMobileNavigation();
});

// FIXED: Mobile Navigation Initialization
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
      navBurger.style.position = 'fixed';
      navBurger.style.right = '20px';
      navBurger.style.top = '20px';
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      // Focus first nav item
      const firstLink = navList.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    } else {
      // Close menu
      navList.style.right = '-100%';
      navBurger.style.position = 'absolute';
      navBurger.style.right = '20px';
      navBurger.style.top = '50%';
      document.body.style.overflow = '';
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
          otherButton.setAttribute('aria-expanded', 'false');
          otherMenu.style.display = 'none';
        }
      });

      if (isExpanded) {
        // Close this dropdown
        button.setAttribute('aria-expanded', 'false');
        if (menu) menu.style.display = 'none';
      } else {
        // Open this dropdown
        button.setAttribute('aria-expanded', 'true');
        if (menu) {
          menu.style.display = 'block';
          // Focus first item in dropdown
          const firstDropdownLink = menu.querySelector('.nav-link');
          if (firstDropdownLink) {
            setTimeout(() => firstDropdownLink.focus(), 100);
          }
        }
      }
    });
  });

  // FIXED: Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navToggle.checked && 
        !navList.contains(e.target) && 
        !navBurger.contains(e.target) && 
        !e.target.closest('.dropdown-toggle')) {
      navToggle.checked = false;
      navList.style.right = '-100%';
      navBurger.style.position = 'absolute';
      navBurger.style.right = '20px';
      navBurger.style.top = '50%';
      document.body.style.overflow = '';
    }
  });

  // FIXED: Handle escape key to close mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.checked) {
      navToggle.checked = false;
      navList.style.right = '-100%';
      navBurger.style.position = 'absolute';
      navBurger.style.right = '20px';
      navBurger.style.top = '50%';
      document.body.style.overflow = '';
      navBurger.focus();
    }
  });
}

// FIXED: Smooth scroll for internal nav links, footer links, and blog links
document.addEventListener('DOMContentLoaded', () => {
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
        
        // FIXED: Close mobile menu after navigation
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
          const navList = document.querySelector('.nav-list');
          const navBurger = document.querySelector('.nav-burger');
          if (navList) navList.style.right = '-100%';
          if (navBurger) {
            navBurger.style.position = 'absolute';
            navBurger.style.right = '20px';
            navBurger.style.top = '50%';
          }
          document.body.style.overflow = '';
        }
      }
      
      // Handle external links
      if (href && href !== '#' && !href.includes('#') && !href.includes('resume.pdf')) {
        if (href === 'project5.html') {
          // Handle local project page
          window.location.href = href;
        } else {
          // External link - open in new tab
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      }
      
      // Handle placeholder project links
      if (href === '#') {
        e.preventDefault();
        alert('Project page coming soon! Please check back later.');
      }
    });
  });
});

// FIXED: Hero parallax effect (disabled on mobile for stability)
window.addEventListener('scroll', debounce(() => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scrollPosition = window.scrollY;
    heroBg.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  }
}, 16));

// FIXED: Project and Blog overlays - Mobile safe
document.addEventListener('DOMContentLoaded', () => {
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
});

// FIXED: Contact form: validation & UX
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const btn = contactForm.querySelector('.btn.btn-primary');
    const errorEl = document.getElementById('contact-form-error');

    // Reset errors
    [name, email, message].forEach(field => field?.classList.remove('error'));
    errorEl?.classList.remove('show');
    errorEl.textContent = '';

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
      if (errorEl) {
        errorEl.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        errorEl.classList.add('show');
        errorEl.style.color = 'var(--theme-accent)';
        contactForm.reset();
        setTimeout(() => {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }, 5000);
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = 'Failed to send message. Please try again.';
        errorEl.classList.add('show');
      }
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
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[name="email"]');
    const btn = newsletterForm.querySelector('.btn');
    const errorEl = document.getElementById('newsletter-form-error') || 
                    newsletterForm.querySelector('.form-error');

    // Reset errors
    email?.classList.remove('error');
    if (errorEl) {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }

    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email?.classList.add('error');
      if (errorEl) {
        errorEl.textContent = 'Please enter a valid email.';
        errorEl.classList.add('show');
      }
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
      if (errorEl) {
        errorEl.textContent = 'Subscribed successfully! Check your email.';
        errorEl.classList.add('show');
        errorEl.style.color = 'var(--theme-accent)';
        newsletterForm.reset();
        setTimeout(() => {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }, 5000);
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = 'Failed to subscribe. Please try again.';
        errorEl.classList.add('show');
      }
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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link, .footer-link, .btn, .social-link, .dropdown-toggle').forEach(element => {
    element.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    });
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

// FIXED: Add click outside handler for dropdowns (desktop)
document.addEventListener('click', (e) => {
  if (window.innerWidth > 920) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        const button = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (button) button.setAttribute('aria-expanded', 'false');
        if (menu) menu.style.display = 'none';
      }
    });
  }
});