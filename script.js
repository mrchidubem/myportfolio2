// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply theme
function applyTheme() {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const savedTheme = localStorage.getItem('theme');
  const theme = isMobile ? (savedTheme || 'dark') : (savedTheme || 'light');

  body.setAttribute('data-theme', theme);
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon', 'fa-sun');
      icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear saved theme on mobile to enforce dark default
  if (window.matchMedia("(max-width: 767px)").matches) {
    localStorage.removeItem('theme');
  }
  applyTheme();

  // Handle image loading with fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      console.error('Failed to load image:', img.src);
      img.src = 'public/fallback.jpg'; // Ensure fallback image exists
      img.alt = 'Fallback image';
    });
    img.addEventListener('load', () => {
      console.log('Image loaded successfully:', img.src);
    });
  });

  // Ensure sidebar is visible on desktop
  const sidebar = document.querySelector('.sidebar');
  if (window.matchMedia("(min-width: 768px)").matches && sidebar) {
    sidebar.style.transform = 'translateX(0)';
  }
});

// Handle window resize for theme and sidebar
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    applyTheme();
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (sidebar && mobileMenuToggle) {
      if (window.matchMedia("(min-width: 768px)").matches) {
        sidebar.style.transform = 'translateX(0)';
        mobileMenuToggle.checked = false;
      } else {
        sidebar.style.transform = 'translateX(-100%)';
        mobileMenuToggle.checked = false;
      }
    }
  }, 100);
});

// Theme toggle button handler
if (themeToggle) {
  themeToggle.setAttribute('tabindex', '0');
  themeToggle.setAttribute('role', 'button');
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon', 'fa-sun');
      icon.classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
      themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    }
  });
  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeBtn = document.querySelector('.close-btn');

if (mobileMenuToggle && sidebar && sidebarOverlay && mobileMenuBtn && closeBtn) {
  // Accessibility attributes
  mobileMenuBtn.setAttribute('tabindex', '0');
  mobileMenuBtn.setAttribute('role', 'button');
  mobileMenuBtn.setAttribute('aria-label', 'Open menu');
  closeBtn.setAttribute('tabindex', '0');
  closeBtn.setAttribute('role', 'button');
  closeBtn.setAttribute('aria-label', 'Close menu');

  // Function to close sidebar
  function closeSidebar() {
    mobileMenuToggle.checked = false;
    sidebar.style.transform = 'translateX(-100%)';
    sidebarOverlay.style.display = 'none';
    sidebarOverlay.style.opacity = '0';
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
    mobileMenuBtn.focus();
  }

  // Handle checkbox toggle
  mobileMenuToggle.addEventListener('change', () => {
    const isOpen = mobileMenuToggle.checked;
    sidebar.style.transform = isOpen ? 'translateX(0)' : 'translateX(-100%)';
    sidebarOverlay.style.display = isOpen ? 'block' : 'none';
    sidebarOverlay.style.opacity = isOpen ? '1' : '0';
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (isOpen) {
      sidebar.focus();
    } else {
      mobileMenuBtn.focus();
    }
  });

  // Close sidebar via close button
  closeBtn.addEventListener('click', closeSidebar);

  // Close sidebar via overlay click
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Keyboard support for mobile menu button
  mobileMenuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      mobileMenuToggle.checked = !mobileMenuToggle.checked;
      mobileMenuToggle.dispatchEvent(new Event('change'));
    }
  });

  // Keyboard support for close button
  closeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeSidebar();
    }
  });

  // Focus trap in sidebar and Escape key support
  sidebar.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && mobileMenuToggle.checked) {
      const focusableElements = sidebar.querySelectorAll('a, button, [tabindex="0"]');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    if (e.key === 'Escape' && mobileMenuToggle.checked) {
      closeSidebar();
    }
  });
}

// Blog Toggle Functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('read-more')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    if (card && fullArticle) {
      card.querySelector('.blog-content').style.display = 'none';
      fullArticle.style.display = 'block';
      setTimeout(() => {
        fullArticle.classList.add('active');
        fullArticle.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    }
  } else if (e.target.classList.contains('back-link')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    if (card && fullArticle) {
      fullArticle.classList.remove('active');
      setTimeout(() => {
        fullArticle.style.display = 'none';
        card.querySelector('.blog-content').style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }
});

// Like Button Functionality
document.addEventListener('click', (e) => {
  const likeBtn = e.target.closest('.like-btn');
  if (likeBtn) {
    likeBtn.setAttribute('tabindex', '0');
    likeBtn.setAttribute('role', 'button');
    const blogId = likeBtn.getAttribute('data-blog-id');
    const likeCountSpan = likeBtn.querySelector('.like-count');
    let likes = parseInt(localStorage.getItem(`likes-${blogId}`)) || 0;
    const isLiked = likeBtn.classList.contains('liked');
    if (isLiked) {
      likes = Math.max(0, likes - 1);
      likeBtn.classList.remove('liked');
    } else {
      likes += 1;
      likeBtn.classList.add('liked');
    }
    likeCountSpan.textContent = likes;
    localStorage.setItem(`likes-${blogId}`, likes);
    document.querySelectorAll(`.like-btn[data-blog-id="${blogId}"]`).forEach(btn => {
      btn.querySelector('.like-count').textContent = likes;
      btn.classList.toggle('liked', !isLiked);
    });
  }
});

document.querySelectorAll('.like-btn').forEach(btn => {
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('role', 'button');
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
  const blogId = btn.getAttribute('data-blog-id');
  const likes = parseInt(localStorage.getItem(`likes-${blogId}`)) || 0;
  btn.querySelector('.like-count').textContent = likes;
  if (likes > 0) {
    btn.classList.add('liked');
  }
});

// Contact Form Handling
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('#email').value;
    const message = e.target.querySelector('#message').value;
    const submitBtn = e.target.querySelector('.submit-btn');

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      submitBtn.classList.add('error');
      showNotification('Please enter a valid email address.', 'error');
      setTimeout(() => submitBtn.classList.remove('error'), 2000);
      return;
    }

    // Validate message length
    if (message.trim().length < 10) {
      submitBtn.classList.add('error');
      showNotification('Message must be at least 10 characters long.', 'error');
      setTimeout(() => submitBtn.classList.remove('error'), 2000);
      return;
    }

    // Simulate form submission
    try {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('success');
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();
      setTimeout(() => {
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
      }, 2000);
    } catch (error) {
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('error');
      showNotification('Failed to send message. Please try again.', 'error');
      setTimeout(() => {
        submitBtn.classList.remove('error');
        submitBtn.disabled = false;
      }, 2000);
    }
  });
}