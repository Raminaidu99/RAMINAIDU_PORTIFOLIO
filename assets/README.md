# Portfolio Assets

This directory contains static assets for the portfolio.

## Structure

```
assets/
├── resume.pdf        ← Place your resume PDF here for the "Download Resume" buttons to work
└── images/           ← Place any project images or profile images here
    └── (empty)
```

## Instructions

1. **Resume**: Copy your resume PDF file into this folder and rename it to `resume.pdf`.
   All "Download Resume" buttons across the site (Navbar, Hero, Contact) link to `assets/resume.pdf`.

2. **Images**: If you add project images, update the project cards in `index.html` with:
   ```html
   <img src="assets/images/project-name.png" alt="Project Name Screenshot" loading="lazy" />
   ```
