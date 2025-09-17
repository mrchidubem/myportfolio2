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

// Theme toggle + save
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
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

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('site-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-moon', saved === 'dark');
    icon.classList.toggle('fa-sun', saved === 'light');
    themeToggle.setAttribute('aria-label', `Switch to ${saved === 'dark' ? 'light' : 'dark'} theme`);
  }
});

// Smooth scroll for internal nav links, footer links, and blog links
document.querySelectorAll('.nav-link, .footer-link, .blog-content a[href*="#"], .blog-post-footer a[href*="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href.includes('resume.pdf')) {
      // Trigger download for resume
      const link = document.createElement('a');
      link.href = href;
      link.download = 'Joseph_Okafor_Resume.pdf';
      link.click();
    } else if (href.includes('#')) {
      // Handle internal anchor links
      const [path, hash] = href.split('#');
      const target = hash ? document.querySelector(`#${hash}`) : null;
      if (target && (!path || path === '../index.html' || path === 'index.html')) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Navigate to the correct page and then scroll
        window.location.href = href;
      }
      // Close mobile menu
      const navToggle = document.getElementById('nav-toggle');
      if (navToggle && navToggle.checked) navToggle.checked = false;
      // Update aria-current for nav links only
      if (a.classList.contains('nav-link')) {
        document.querySelectorAll('.nav-link').forEach(link => link.removeAttribute('aria-current'));
        a.setAttribute('aria-current', 'page');
      }
    } else {
      // Handle external navigation (e.g., blog or project pages)
      if (href === '#') {
        // Placeholder links for projects
        alert('Project page coming soon! Please check back later.');
      } else {
        try {
          window.location.href = href;
        } catch (error) {
          console.error(`Error navigating to ${href}:`, error);
          alert('Sorry, this page is not available. Please try again later.');
        }
      }
    }
  });
});

// Mobile menu focus management
document.getElementById('nav-toggle')?.addEventListener('change', e => {
  const navList = document.querySelector('.nav-list');
  if (e.target.checked) {
    navList.querySelector('.nav-link').focus();
  }
});

// Hero parallax effect (debounced, optimized for mobile)
window.addEventListener('scroll', debounce(() => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scrollPosition = window.scrollY;
    heroBg.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  }
}, 16));

// Project and Blog overlays
document.querySelectorAll('.project').forEach(project => {
  const overlay = project.querySelector('.project-overlay');
  if (overlay) {
    project.addEventListener('mouseenter', () => {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
    });
    project.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
    });
  }
});

document.querySelectorAll('.blog-post').forEach(post => {
  const overlay = post.querySelector('.blog-overlay');
  if (overlay) {
    post.addEventListener('mouseenter', () => {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
    });
    post.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
    });
  }
});

// Contact form: validation & UX
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  // Add ARIA live region for errors
  const errorContainer = document.createElement('div');
  errorContainer.id = 'contact-form-error';
  errorContainer.className = 'form-error';
  errorContainer.setAttribute('aria-live', 'polite');
  contactForm.insertBefore(errorContainer, contactForm.querySelector('.form-actions'));

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const btn = contactForm.querySelector('.btn.btn-primary');
    const errorEl = document.getElementById('contact-form-error');

    // Reset errors
    name.classList.remove('error');
    email.classList.remove('error');
    message.classList.remove('error');
    errorEl.classList.remove('show');
    errorEl.textContent = '';

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.classList.add('error');
      errorEl.textContent = 'Please enter a valid name (at least 2 characters).';
      errorEl.classList.add('show');
      name.focus();
      return;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      errorEl.textContent = 'Please enter a valid email.';
      errorEl.classList.add('show');
      email.focus();
      return;
    }

    if (message.value.trim().length < 10) {
      message.classList.add('error');
      errorEl.textContent = 'Message must be at least 10 characters.';
      errorEl.classList.add('show');
      message.focus();
      return;
    }

    btn.disabled = true;
    btn.classList.add('sending');
    btn.textContent = 'Sending...';

    try {
      // Simulated API call (replace with your API endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));
      errorEl.textContent = 'Message sent successfully!';
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
      btn.textContent = 'Send Message';
      btn.classList.remove('sending');
      btn.disabled = false;
    }
  });
}

// Newsletter form: validation & UX
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  // Add ARIA live region for errors
  const errorContainer = document.createElement('div');
  errorContainer.id = 'newsletter-form-error';
  errorContainer.className = 'form-error';
  errorContainer.setAttribute('aria-live', 'polite');
  newsletterForm.insertBefore(errorContainer, newsletterForm.querySelector('button'));

  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[name="email"]');
    const btn = newsletterForm.querySelector('.btn');
    const errorEl = document.getElementById('newsletter-form-error');

    // Reset errors
    email.classList.remove('error');
    errorEl.classList.remove('show');
    errorEl.textContent = '';

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      errorEl.textContent = 'Please enter a valid email.';
      errorEl.classList.add('show');
      email.focus();
      return;
    }

    btn.disabled = true;
    btn.classList.add('sending');
    btn.textContent = 'Subscribing...';

    try {
      // Simulated API call (replace with your API endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));
      errorEl.textContent = 'Subscribed successfully!';
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
      btn.textContent = 'Subscribe';
      btn.classList.remove('sending');
      btn.disabled = false;
    }
  });
}

// Keyboard navigation for accessibility
document.querySelectorAll('.nav-link, .footer-link, .btn, .social-link, .dropdown-toggle').forEach(element => {
  element.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      element.click();
    }
  });
});

// Update ARIA-expanded for dropdown
document.querySelectorAll('.dropdown-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    if (!expanded) {
      button.nextElementSibling.querySelector('.nav-link').focus();
    }
  });
});

// Highlight timeline markers on scroll
window.addEventListener('scroll', debounce(() => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}, 100));