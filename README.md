# Personal Portfolio Website

![Portfolio Screenshot](assets/screenshot.png)

A modern, responsive personal portfolio website built to showcase my skills, projects, experiences, and interests. This project features a clean design with a sidebar navigation, dark/light mode toggle, and interactive elements like blog post likes and a contact form. It is optimized for both desktop and mobile devices, ensuring a seamless user experience.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **Responsive Design**: Adapts seamlessly to mobile and desktop with a fixed sidebar on desktop and a hamburger menu on mobile.
- **Consistent Layout**: All sections (Home, About, Education, Skills, Experience, Testimonials, Projects, Blog, Interests, Contact) and footer use `max-width: 1200px`, centered on mobile, and right-aligned on desktop (`margin-right: 2rem` to respect the sidebar).
- **Dark/Light Mode**: Toggle between themes with dark mode default on mobile, stored in `localStorage` for persistence.
- **Mobile-Friendly Navigation**: Theme toggle button positioned at `right: 3rem` on mobile to avoid overlap with the hamburger icon (`right: 1rem`).
- **Interactive Blog Section**: Includes "Read More" toggles and like buttons with persistent counts using `localStorage`.
- **Contact Form**: Submits data to a configurable endpoint (e.g., Formspree) with loading states and error handling.
- **Lazy-Loaded Images**: Uses Intersection Observer for efficient image loading.
- **Smooth Animations**: Fade-in effects for sections and hover interactions for cards, buttons, and links.
- **Accessible Design**: Assumes semantic HTML, ARIA attributes, and keyboard navigation (ensure HTML includes these).
- **Customizable Styling**: Uses CSS custom properties (`--primary-color`, `--gradient-primary`, etc.) for easy theme adjustments.

## Technologies
- **HTML5**: Semantic structure for accessibility and SEO.
- **CSS3**: Custom styles with Flexbox, Grid, CSS variables, and responsive media queries.
- **JavaScript (ES6)**: Handles interactivity, theme toggling, blog functionality, and form submission.
- **Font Awesome**: Icons for navigation, skills, and social links.
- **Google Fonts**: Quicksand and Asap fonts for typography.
- **Formspree** (optional): For contact form submissions (replace placeholder URL in `script.js`).
- **Intersection Observer API**: For lazy loading images and section animations.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-portfolio.git
   cd your-portfolio

Install Dependencies:
No external dependencies are required, but a local server is recommended for testing. Install Live Server (VS Code extension) or use:bash

npm install -g live-server

Set Up Contact Form:Replace the placeholder Formspree URL in script.js with your actual endpoint:javascript

await fetch('https://formspree.io/f/your-actual-form-id', {

Sign up at Formspree to get your form ID.

Add Assets:Place images (e.g., profile picture, project images, screenshot) in the assets/ folder.
Update paths in your HTML, e.g.:html

<img src="assets/profile.jpg" alt="Profile" class="profile-image">

Add a screenshot to assets/screenshot.png for the README header.

Run Locally:Open index.html in a browser or start a local server:bash

live-server

UsageNavigation: Use the sidebar (desktop) or hamburger menu (mobile, at right: 1rem) to access sections like About, Projects, and Contact.
Theme Toggle: Click the sun/moon icon (at right: 3rem on mobile, near "DubicVentures" logo) to switch themes.
Blog Interaction: Click "Read More" to expand blog posts and use like buttons to increment counts (saved in localStorage).
Contact Form: Fill out and submit the form (configure the endpoint first).
Responsive Testing: Verify layout on various screen sizes. Sections and footer are constrained to max-width: 1200px, centered on mobile, and right-aligned on desktop (margin-right: 2rem).

CustomizationChange Colors:
Modify CSS custom properties in :root of style.css:css

:root {
  --primary-color: #your-color;
  --gradient-primary: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

Update Content:
Edit HTML to update section content, e.g., for Projects:html

<div class="project-card">
  <img src="assets/your-project.jpg" alt="Project Name" class="project-image">
  <div class="project-content">
    <h3 class="project-title">Your Project</h3>
    <p class="project-description">Description here.</p>
  </div>
</div>

Adjust Layout:Change max-width: 1200px in .section, .footer, and specific section selectors to adjust content width.
Update margin-right: 2rem in desktop media queries (min-width: 768px) for sidebar spacing.

Add Fonts/Icons:
Replace Google Fonts or Font Awesome in your HTML <head>:html

<link href="https://fonts.googleapis.com/css2?family=Your-Font&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/your-kit-id.js" crossorigin="anonymous"></script>

File Structure

your-portfolio/
├── assets/                # Images and static assets
│   ├── profile.jpg
│   ├── project1.jpg
│   ├── screenshot.png
│   └── ...
├── index.html             # Main HTML file
├── style.css              # Styles with responsive design and theme support
├── script.js              # JavaScript for interactivity and form handling
└── README.md              # This file

ContributingContributions are welcome! To contribute:Fork the repository.
Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Open a pull request.

Ensure code follows existing styles (e.g., CSS variables, semantic HTML) and includes tests for new features.LicenseThis project is licensed under the MIT License. See the LICENSE file for details.ContactEmail: mrchidubem8@gmail.com
GitHub: your-username
Portfolio: your-portfolio-url



### How to Use
1. **Copy the README**:
   - Click the copy button in the code block above or select and copy the entire Markdown text.
   - Create or open `README.md` in your project’s root directory (e.g., `your-portfolio/README.md`).
   - Paste the content and save.

2. **Personalize Placeholders**:
   - Replace `your-username` with your GitHub username (e.g., `mrchidubem`).
   - Update `your-portfolio-url` with your deployed portfolio URL (e.g., `https://dubicventures.com`).
   - Replace `mrchidubem8@gmail.com` with your email.
   - Update `assets/screenshot.png` with the path to an actual screenshot of your portfolio (place it in the `assets/` folder).
   - Replace the Formspree URL placeholder (`your-actual-form-id`) in the Installation section with your actual Formspree ID.

3. **Add a Screenshot**:
   - Take a screenshot of your portfolio using browser tools or a tool like [Screencapture](https://www.screencapture.com/).
   - Save it as `assets/screenshot.png` or update the path in the README if different.
   - If you need help generating a screenshot, let me know, and I can guide you.

4. **Test the README**:
   - Push the `README.md` to your GitHub repository.
   - View it on GitHub to ensure Markdown renders correctly (check links, formatting, and the screenshot).
   - Test installation instructions locally to confirm they work.

5. **Additional Notes**:
   - The README reflects the latest fixes: theme toggle at `right: 3rem` on mobile (near "DubicVentures" logo, clear of the hamburger icon at `right: 1rem`) and consistent `max-width: 1200px` for sections and footer.
   - If your HTML header differs (e.g., logo class isn’t `.logo` or additional elements exist), the positioning instructions may need tweaking. Share your HTML header for precise adjustments.
   - For deployment instructions (e.g., hosting on Netlify/Vercel) or additional sections (e.g., demo link, badges), let me know, and I can expand the README.

If you encounter issues with the README rendering, need help with personalization, or want further enhancements (e.g., adding a live demo link or specific project details), please let me know. I’m happy to assist, and I apologize again for the earlier oversight with the theme toggle positioning. Thank you for your patience!