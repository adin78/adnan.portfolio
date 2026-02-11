# Adnan Afzal - Portfolio Website

A modern, responsive, static HTML portfolio website designed for a Mobile Growth Manager.

## Features
- **Modern Design**: Dark theme with glassmorphism effects and gradient accents.
- **Responsive**: Fully functional on desktop, tablet, and mobile devices.
- **Animations**: Smooth scrolling and fade-in effects.
- **Easy Customization**: Built with clean HTML, CSS, and vanilla JavaScript. No complex build tools required.

## Project Structure
```
d:/Adnan Afzal Portfolio/
├── assets/              # Images and icons (SVGs generated)
├── css/
│   └── style.css        # Main stylesheet
├── js/
│   └── main.js          # JavaScript functionality
├── index.html           # Main HTML file
└── README.md            # This file
```

## How to Customize

### 1. Content
Open `index.html` in any text editor (Notepad, VS Code, etc.).
- **Text**: Search for "Adnan Afzal" or "About Me" and replace the text with your own.
- **Links**: Update `href="#"` in the Contact section with your real social media profiles.

### 2. Images
1. **Prepare your images**:
   - **Profile Photo**: A square photo of yourself (e.g., `my-photo.jpg`).
   - **Hero Background**: A high-quality abstract or office background (e.g., `background.jpg`).
   - **Project Thumbnails**: Screenshots of your work (e.g., `dashboard.png`).

2. **Move images**: Copy your images into the `assets/` folder.

3. **Update code**:
   - Open `index.html`.
   - Find the image tags (search for `<img`).
   - Change the `src` attribute to match your new filename.
   - *Example*: Change `src="assets/profile-placeholder.svg"` to `src="assets/my-photo.jpg"`.

### 3. Colors
Open `css/style.css`.
At the top, you will find the `:root` variables:
```css
:root {
    --primary-color: #3b82f6; /* Blue */
    --secondary-color: #ec4899; /* Pink */
    /* Change these hex codes to your preferred brand colors */
}
```

## Hosting on GitHub Pages
1. Create a new repository on GitHub.
2. Upload all files from this folder to the repository.
3. Go to **Settings** > **Pages**.
4. Under **Source**, select `main` branch and `/root` folder.
5. Click **Save**. Your site will be live in a few minutes!
