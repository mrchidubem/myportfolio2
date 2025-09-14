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
    }
  }

  // Adjust header-controls positioning on mobile to be closer to logo
  const headerControls = document.querySelector('.header-controls');
  if (isMobile && headerControls) {
    headerControls.style.right = '3rem'; // Adjusted to be closer to logo, clear of hamburger
  } else if (headerControls) {
    headerControls.style.right = '1.5rem'; // Default for desktop
  }
}

// Apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear saved theme on mobile to ensure dark default
  if (window.matchMedia("(max-width: 767px)").matches) {
    localStorage.removeItem('theme');
  }
  applyTheme();

  // Log profile image loading status
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.addEventListener('error', () => {
      console.error('Failed to load profile image:', profileImage.src);
    });
    profileImage.addEventListener('load', () => {
      console.log('Profile image loaded successfully:', profileImage.src);
    });
  }

  // Ensure sidebar is visible on desktop
  const sidebar = document.querySelector('.sidebar');
  if (window.matchMedia("(min-width: 768px)").matches) {
    sidebar.style.transform = 'translateX(0)';
  }
});

// Re-apply theme and sidebar visibility on resize
window.addEventListener('resize', () => {
  applyTheme();
  const sidebar = document.querySelector('.sidebar');
  if (window.matchMedia("(min-width: 768px)").matches) {
    sidebar.style.transform = 'translateX(0)';
  } else {
    sidebar.style.transform = 'translateX(-100%)';
  }
});

// Theme toggle button click handler
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon', 'fa-sun');
      icon.classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
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
    card.querySelector('.blog-content').style.display = 'none';
    fullArticle.style.display = 'block';
    fullArticle.scrollIntoView({ behavior: 'smooth' });
  } else if (e.target.classList.contains('back-link')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    fullArticle.style.display = 'none';
    card.querySelector('.blog-content').style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth' });
  }
});

// Like Button Functionality
document.addEventListener('click', (e) => {
  if (e.target.closest('.like-btn')) {
    const likeBtn = e.target.closest('.like-btn');
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

// Initialize like counts
document.querySelectorAll('.like-btn').forEach(btn => {
  const blogId = btn.getAttribute('data-blog-id');
  const likes = parseInt(localStorage.getItem(`likes-${blogId}`)) || 0;
  btn.querySelector('.like-count').textContent = likes;
  if (likes > 0) {
    btn.classList.add('liked');
  }
});

// Contact Form Handling
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  try {
    // Replace with your actual API endpoint (e.g., Formspree, Netlify Forms)
    await fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    alert('Message sent successfully! Thanks for reaching out.');
    e.target.reset();
  } catch (error) {
    console.error('Form submission error:', error);
    alert('Oops! Something went wrong. Try emailing directly at mrchidubem8@gmail.com.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
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
        }
      }
    });
  });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}