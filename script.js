// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  themeToggle.querySelector('i').classList.toggle('fa-moon');
  themeToggle.querySelector('i').classList.toggle('fa-sun');
  localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') {
  themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

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