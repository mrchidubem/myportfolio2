// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply theme
function applyTheme() {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const savedTheme = localStorage.getItem('theme');
  // Force dark theme on mobile unless a saved theme exists
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

// Apply theme and sidebar visibility on page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear saved theme on mobile to ensure dark default
  if (window.matchMedia("(max-width: 767px)").matches) {
    localStorage.removeItem('theme');
  }
  applyTheme();

  // Log profile image loading status
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      console.error('Failed to load image:', img.src);
      img.src = 'public/fallback.jpg'; // Ensure fallback image exists
    });
    img.addEventListener('load', () => {
      console.log('Image loaded successfully:', img.src);
    });
  });

  // Ensure sidebar is visible on desktop
  const sidebar = document.querySelector('.sidebar');
  if (window.matchMedia("(min-width: 768px)").matches) {
    sidebar.style.transform = 'translateX(0)';
  }
});

// Re-apply theme and sidebar visibility on resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    applyTheme();
    const sidebar = document.querySelector('.sidebar');
    if (window.matchMedia("(min-width: 768px)").matches) {
      sidebar.style.transform = 'translateX(0)';
    } else {
      sidebar.style.transform = 'translateX(-100%)';
    }
  }, 100);
});

// Theme toggle button click handler
if (themeToggle) {
  themeToggle.setAttribute('tabindex', '0');
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
const closeBtn = document.querySelector('.close-btn');

if (mobileMenuToggle && sidebar && sidebarOverlay && closeBtn) {
  mobileMenuToggle.addEventListener('change', () => {
    sidebar.style.transform = mobileMenuToggle.checked ? 'translateX(0)' : 'translateX(-100%)';
    sidebarOverlay.style.display = mobileMenuToggle.checked ? 'block' : 'none';
  });

  closeBtn.addEventListener('click', () => {
    mobileMenuToggle.checked = false;
    sidebar.style.transform = 'translateX(-100%)';
    sidebarOverlay.style.display = 'none';
  });

  sidebarOverlay.addEventListener('click', () => {
    mobileMenuToggle.checked = false;
    sidebar.style.transform = 'translateX(-100%)';
    sidebarOverlay.style.display = 'none';
  });
}

// Blog Toggle Functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('read-more')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    card.querySelector('.blog-content').style.display = 'none';
    fullArticle.classList.add('active');
    fullArticle.scrollIntoView({ behavior: 'smooth' });
  } else if (e.target.classList.contains('back-link')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    fullArticle.classList.remove('active');
    setTimeout(() => {
      fullArticle.style.display = 'none';
      card.querySelector('.blog-content').style.display = 'block';
      card.scrollIntoView({ behavior: 'smooth' });
    }, 500); // Match CSS transition duration
  }
});

// Like Button Functionality
document.addEventListener('click', (e) => {
  if (e.target.closest('.like-btn')) {
    const likeBtn = e.target.closest('.like-btn');
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

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('#email').value;
  const message = e.target.querySelector('#message').value;
  const submitBtn = e.target.querySelector('.submit-btn');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    submitBtn.classList.add('error');
    showNotification('Please enter a valid email address.', 'error');
    setTimeout(() => submitBtn.classList.remove('error'), 2000);
    return;
  }
  if (message.trim().length < 10) {
    submitBtn.classList.add('error');
    showNotification('Message must be at least 10 characters long.', 'error');
    setTimeout(() => submitBtn.classList.remove('error'), 2000);
    return;
  }
  const formData = new FormData(e.target);
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  try {
    const response = await fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    submitBtn.classList.add('success');
    showNotification('Message sent successfully! Thanks for reaching out.');
    e.target.reset();
  } catch (error) {
    submitBtn.classList.add('error');
    showNotification(`Failed to send message: ${error.message}. Try emailing mrchidubem8@gmail.com.`, 'error');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    setTimeout(() => submitBtn.classList.remove('success', 'error'), 2000);
  }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        } else {
          console.warn('Image missing data-src:', img);
          img.src = 'public/fallback.jpg'; // Ensure fallback image exists
        }
      }
    });
  });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Disable background animation for reduced motion
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelector('.bg-animation').style.animation = 'none';
}