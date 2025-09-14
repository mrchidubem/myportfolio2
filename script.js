// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to determine and set theme
function setThemeBasedOnScreen() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const savedTheme = localStorage.getItem('theme');
  // Set dark theme as default for mobile if no saved theme, otherwise use saved theme
  const defaultTheme = isMobile && !savedTheme ? 'dark' : (savedTheme || 'light');

  body.setAttribute('data-theme', defaultTheme);
  themeToggle.querySelector('i').classList.remove('fa-moon', 'fa-sun');
  themeToggle.querySelector('i').classList.add(defaultTheme === 'dark' ? 'fa-sun' : 'fa-moon');
}

// Set theme on initial load
setThemeBasedOnScreen();

// Update theme on window resize
window.addEventListener('resize', setThemeBasedOnScreen);

// Theme toggle button click handler
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  themeToggle.querySelector('i').classList.remove('fa-moon', 'fa-sun');
  themeToggle.querySelector('i').classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
  localStorage.setItem('theme', newTheme);
});

// Blog Toggle Functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('read-more')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    
    // Hide teaser, show full
    card.querySelector('.blog-content').style.display = 'none';
    fullArticle.style.display = 'block';
    
    // Scroll to top of article
    fullArticle.scrollIntoView({ behavior: 'smooth' });
  } else if (e.target.classList.contains('back-link')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');
    const fullArticle = document.getElementById(`blog-${targetId}`);
    const card = e.target.closest('.blog-card');
    
    // Hide full, show teaser
    fullArticle.style.display = 'none';
    card.querySelector('.blog-content').style.display = 'block';
    
    // Scroll back to grid
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
      likes = Math.max(0, likes - 1); // Prevent negative likes
      likeBtn.classList.remove('liked');
    } else {
      likes += 1;
      likeBtn.classList.add('liked');
    }

    likeCountSpan.textContent = likes;
    localStorage.setItem(`likes-${blogId}`, likes);

    // Sync like state across teaser and full article
    document.querySelectorAll(`.like-btn[data-blog-id="${blogId}"]`).forEach(btn => {
      btn.querySelector('.like-count').textContent = likes;
      if (isLiked) {
        btn.classList.remove('liked');
      } else {
        btn.classList.add('liked');
      }
    });
  }
});

// Initialize like counts from localStorage
document.querySelectorAll('.like-btn').forEach(btn => {
  const blogId = btn.getAttribute('data-blog-id');
  const likes = parseInt(localStorage.getItem(`likes-${blogId}`)) || 0;
  btn.querySelector('.like-count').textContent = likes;
  if (likes > 0) {
    btn.classList.add('liked');
  }
});

// Contact Form Handling (Placeholder - replace with your backend endpoint)
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Placeholder: Send to your API (e.g., EmailJS or Netlify)
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

// Observe sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// Lazy load images with fallback
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