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
  // Swap icon
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-moon', isDark);
    icon.classList.toggle('fa-sun', !isDark);
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
  }
});

// Smooth scroll for internal nav links
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href === 'public/resume.pdf') {
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
      // Navigate to blog post pages
      window.location.href = href;
    }
  });
});

// Hero parallax effect (debounced)
window.addEventListener('scroll', debounce(() => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const scrollPosition = window.scrollY;
    heroBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
  }
}, 16));

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
      // Simulated API call (replace with real API call in production)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Example real API call (uncomment and customize):
      /*
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, message: message.value })
      });
      if (!response.ok) throw new Error('Failed to send message');
      */

      errorEl.textContent = 'Message sent successfully!';
      errorEl.classList.add('show');
      errorEl.style.color = 'var(--accent)';
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
      // Simulated API call (replace with real API call in production)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Example real API call (uncomment and customize):
      /*
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value })
      });
      if (!response.ok) throw new Error('Failed to subscribe');
      */

      errorEl.textContent = 'Subscribed successfully!';
      errorEl.classList.add('show');
      errorEl.style.color = 'var(--accent)';
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