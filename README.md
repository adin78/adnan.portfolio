# Adnan – Mobile Performance Marketing Portfolio

A premium, static portfolio website for a Mobile Performance Marketing Specialist.
Dark gaming × Apple precision aesthetic. Zero frameworks. GitHub Pages ready.

## 📁 File Structure

```
/portfolio
├── index.html                  # Main HTML (single page)
├── styles.css                  # All styles (CSS variables, responsive)
├── script.js                   # Core JS (nav, particles, counters, form)
└── tools/
    └── keyword-gap-finder.js   # ★ Standalone ASO tool — modular & removable
```

## 🚀 GitHub Pages Setup

1. Create a new GitHub repository (e.g. `adnan-portfolio`)
2. Upload all files **maintaining the folder structure**
3. Go to **Settings → Pages**
4. Set Source: `Deploy from branch → main → / (root)`
5. Click **Save** — your site goes live at `https://yourusername.github.io/adnan-portfolio/`

## ✏️ Customization

### Contact Links
In `index.html`, update the `href` values in the **Contact** section:
- Email: `mailto:your@email.com`
- LinkedIn: `https://linkedin.com/in/yourprofile`
- WhatsApp: `https://wa.me/923XXXXXXXXX`

### Contact Form (Email Integration)
Replace the `setTimeout` mock in `script.js` (contact form handler) with:
```js
// EmailJS example:
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
  .then(() => { /* success */ }, (err) => { /* error */ });
```
Load EmailJS via: `<script src="https://cdn.emailjs.com/dist/email.min.js"></script>`

### Colors
In `styles.css`, edit the `:root` block:
```css
--cyan:   #00e5ff;   /* primary accent */
--purple: #a855f7;   /* secondary accent */
--green:  #22d3a0;   /* tertiary accent */
```

### Stats (Hero section)
Update `data-target` on `.stat-num` elements in `index.html`:
```html
<span class="stat-num" data-target="200">0</span>
```

## 🔧 Keyword Gap Finder Tool

The tool lives entirely in `tools/keyword-gap-finder.js`.

**To remove it:** Delete the file and remove `<script src="tools/keyword-gap-finder.js"></script>` from `index.html`. Nothing else breaks.

**To embed it standalone:** The tool looks for `#keywordGapTool` in the DOM. Drop that HTML block into any page and include the script.

**Logic overview:**
- Parses comma/newline-separated keyword lists
- Computes set difference (competitor minus yours = gaps)
- Scores each gap keyword with a heuristic priority (length, long-tail, high-value words)
- Exports results as CSV

## 📦 Performance Notes

- No npm, no bundler, no build step required
- All fonts loaded from Google Fonts (add `rel="preconnect"` already included)
- Particle canvas is lightweight (~80 points, RAF-based)
- Target load: < 1.5s on fast 3G
