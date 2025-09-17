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

// Smooth scroll for internal nav links
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href === './public/resume.pdf') {
      // Trigger download for resume
      const link = document.createElement('a');
      link.href = href;
      link.download = 'Joseph_Okafor_Resume.pdf';
      link.click();
    } else if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu
      const navToggle = document.getElementById('nav-toggle');
      if (navToggle && navToggle.checked) navToggle.checked = false;
    } else {
      // Navigate to blog post pages with error handling
      try {
        const response = await fetch(href, { method: 'HEAD' });
        if (response.ok) {
          window.location.href = href;
        } else {
          console.error(`Failed to load ${href}: ${response.status}`);
          alert('Sorry, this blog post is not available. Please try another.');
        }
      } catch (error) {
        console.error(`Error navigating to ${href}:`, error);
        alert('Sorry, this blog post is not available. Please try another.');
      }
    }
    // Update aria-current
    document.querySelectorAll('.nav-link').forEach(link => link.removeAttribute('aria-current'));
    if (href.startsWith('#')) a.setAttribute('aria-current', 'page');
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
  if (heroBg && window.innerWidth > 768) {
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
      // Replace with your API endpoint (e.g., Formspree, Netlify Forms)
      /*
      const response = await fetch('https://your-api-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
        }),
      });
      if (!response.ok) throw new Error('Network error');
      */
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      errorEl.textContent = 'Message sent successfully!';
      errorEl.classList.add('show');
      errorEl.style.color = 'var(--theme-accent)';
      contactForm.reset();
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
      // Replace with your API endpoint (e.g., Mailchimp, Netlify Forms)
      /*
      const response = await fetch('https://your-api-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim() }),
      });
      if (!response.ok) throw new Error('Network error');
      */
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      errorEl.textContent = 'Subscribed successfully!';
      errorEl.classList.add('show');
      errorEl.style.color = 'var(--theme-accent)';
      newsletterForm.reset();
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
document.querySelectorAll('.nav-link, .btn, .social-link, .dropdown-toggle').forEach(element => {
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