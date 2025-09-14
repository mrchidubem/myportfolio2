// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply theme
function applyTheme() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const savedTheme = localStorage.getItem('theme');
  // Default to dark for mobile, otherwise use saved theme or light
  const theme = isMobile ? (savedTheme || 'dark') : (savedTheme || 'light');

  body.setAttribute('data-theme', theme);
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon', 'fa-sun');
      icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    }
  }
}

// Apply theme on page load
document.addEventListener('DOMContentLoaded', applyTheme);

// Re-apply theme on window resize
window.addEventListener('resize', applyTheme);

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

// Contact Form Handling (Placeholder)
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Replace with your actual API endpoint
    await fetch('https://your-api-endpoint.com/send-email', {
      method: 'POST',
      body: formData,
    });
    alert('Message sent successfully! Thanks for reaching out.');
    e.target.reset();
  } catch (error) {
    alert('Oops! Something went wrong. Try emailing directly.');
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
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}