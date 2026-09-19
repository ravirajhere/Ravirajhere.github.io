# Ravi Raj — Portfolio

> Developer who writes. Author who builds.

A hand-written portfolio for **Ravi Raj** — frontend developer and author from Begusarai, Bihar. No frameworks. No build step. Just HTML, CSS, and a small amount of JavaScript.

**Live:** [ravirajhere.github.io](https://ravirajhere.github.io/)

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Design System](#design-system)
3. [File Structure](#file-structure)
4. [Sections Overview](#sections-overview)
5. [Features](#features)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Local Development](#local-development)
8. [Deployment](#deployment)
9. [Editing Guide](#editing-guide)
10. [Changelog](#changelog)
11. [Credits](#credits)

---

## Philosophy

This site follows three rules:

1. **Content first.** Design exists to serve the writing, not the other way around.
2. **No frameworks.** Hand-written HTML and CSS. No React, no Tailwind, no build tools.
3. **Accessible by default.** Semantic markup, ARIA labels, focus management, reduced-motion support.

The site has **two worlds** — a dark "developer" world and a light "author" world — joined by a transition section. This reflects Ravi's dual identity.

---

## Design System

### Color Tokens

| Token | Value | Use |
|---|---|---|
| `--dark-bg` | `#0a0a0a` | Developer world background |
| `--dark-text` | `#ededed` | Developer world text |
| `--light-bg` | `#faf8f4` | Author world background (warm off-white) |
| `--light-text` | `#1a1614` | Author world text |
| `--accent` | `#b45309` | Amber — links, highlights, author feel |
| `--live` | `#16a34a` | Status dot (available for work) |

### Typography

| Role | Font | Use |
|---|---|---|
| Sans | **Inter** | Body text, UI |
| Serif | **Source Serif 4** | Headings, prose, book-feel |
| Mono | **JetBrains Mono** | Code, labels, metadata |

Fonts loaded from Google Fonts with `preconnect` and `display=swap`.

### Spacing Scale

Uses a `--space-*` scale from `0.25rem` to `8rem`. All spacing in the layout references these tokens — no magic numbers.

### Radius

Maximum radius is **6px** (`--r-lg`). Pills use `999px` only for status badges and skill levels.

### Shadows

Very subtle. Two shadows max:
- `--shadow-dark` for dark world
- `--shadow-light` for light world

No glow, no gradient, no drop shadow excess.

---

## File Structure

```
/
├── index.html                    # Main portfolio page
├── autobiography.html            # Full book (11 chapters)
├── blog.html                     # Blog / thoughts archive
├── friends.html                  # Friends gallery
├── resume-pdf.html               # Printable resume
│
├── css/
│   └── style.css                 # All styling (single file, ~1400 lines)
│
├── js/
│   ├── script.js                 # Main site script
│   ├── autobiography.js          # Book reader logic
│   └── ebook.js                  # PDF generator (book)
│
├── assets/
│   ├── favicon.png
│   ├── images/
│   │   ├── formal.jpg            # Hero portrait
│   │   ├── bookcover.JPG         # Autobiography cover
│   │   └── og-cover.jpg          # Social share image (1200×630)
│   └── press-kit.zip             # Logos, bio, photos (for media)
│
├── feed.xml                      # RSS feed for blog
└── README.md                     # This file
```

---

## Sections Overview

| # | Section | ID | World | Purpose |
|---|---|---|---|---|
| — | Hero | `#hero` | Dark | Positioning, dual identity |
| 01 | Work | `#work` | Dark | Case studies (Problem → Approach → Result) |
| 02 | Skills | `#skills` | Dark | Honest skill matrix with proof |
| — | Transition | — | Dark | Bridge between worlds |
| 03 | Writing | `#writing` | Light | Book + essays |
| 04 | Story | `#story` | Light | Timeline / storyline |
| 05 | Process | `#process` | Light | How Ravi works |
| 06 | Clarity | `#clarity` | Light | Boundaries — what he won't do |
| 07 | Contact | `#contact` | Light | Multi-channel contact |

---

## Features

### Design
- ✅ Two-world color system (dark → light as you scroll)
- ✅ Serif + sans + mono typography
- ✅ Fluid typography with `clamp()`
- ✅ Responsive: 960px, 720px, 400px breakpoints
- ✅ Print styles for resume
- ✅ Reduced-motion support

### Interaction
- ✅ Command palette (press **K**)
- ✅ Mobile slide-in navigation with focus trap
- ✅ Copy-to-clipboard email
- ✅ Smooth scroll with header offset
- ✅ Active nav highlight on scroll
- ✅ Header adapts when over light sections
- ✅ Scroll cue fades

### Accessibility
- ✅ Semantic HTML5 (`<article>`, `<aside>`, `<dl>`, `<time>`, `<figure>`)
- ✅ Skip-to-content link
- ✅ ARIA labels on all interactive elements
- ✅ Focus trap in modals
- ✅ `aria-expanded`, `aria-current`, `aria-selected` state
- ✅ Keyboard shortcuts (K, ESC, arrows)
- ✅ WCAG AA contrast
- ✅ `prefers-reduced-motion` respected

### SEO
- ✅ Full meta tags (Open Graph, Twitter)
- ✅ JSON-LD structured data (Person schema)
- ✅ Canonical URL
- ✅ RSS feed link
- ✅ `theme-color` for mobile browsers

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `K` | Open command palette |
| `↑` `↓` | Navigate palette items |
| `Enter` | Jump to selected item |
| `Esc` | Close palette or mobile menu |
| `Tab` | Normal focus navigation (trapped in modals) |

---

## Local Development

**No build step.** Open `index.html` directly, or run a local server:

```bash
# Python 3
python -m http.server 8000

# or Node.js (if installed)
npx serve

# then visit
http://localhost:8000
```

**Why a server?** Some features (clipboard API, fetch for RSS) require `https://` or `localhost`. Opening via `file://` will break those.

---

## Deployment

### GitHub Pages (recommended)

1. Push all files to a GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from branch**
4. Branch: `main` / `root`
5. Save — site goes live at `https://<username>.github.io/<repo>/`

### Custom Domain

1. Add a file called `CNAME` in the root with your domain
2. Point DNS A records to GitHub's IPs
3. Enable HTTPS in Pages settings

### Checklist Before Deploy

- [ ] `favicon.png` present in `/assets/`
- [ ] `formal.jpg`, `bookcover.JPG` present in `/assets/images/`
- [ ] `og-cover.jpg` (1200×630) present for social previews
- [ ] All internal links resolve (`resume-pdf.html`, `autobiography.html`, etc.)
- [ ] Email address correct everywhere
- [ ] Social URLs correct in footer
- [ ] `canonical` URL matches live domain
- [ ] RSS `feed.xml` exists
- [ ] Test on mobile + desktop
- [ ] Test with **K** key
- [ ] Run Lighthouse (aim for 95+ on all metrics)

---

## Editing Guide

### Common Changes

**Update the year in hero** — search for `2026` in `index.html` and change.

**Update availability status** — search for `Available for internships` in `index.html` and edit.

**Change the accent color** — in `css/style.css`, change `--accent` value.

**Add a project** — copy a `<article class="work-item">` block and edit.

**Add an essay** — copy a `<a class="writing-row">` block and edit.

**Change fonts** — update the `<link>` in `<head>` and the `--font-*` tokens in `css/style.css`.

### Conventions

- **Section numbers** — `01 / Work`, `02 / Skills` — increment as you add sections
- **Eyebrows** — short labels above headings, in mono font
- **Case study format** — always Problem → Approach → Result
- **Honest language** — never claim more than is true

---

## Changelog

### v3.0 — January 2026
**Complete rebuild.**

- Rewrote HTML with semantic structure
- New "two worlds" design (dark → light)
- New color system: amber accent instead of blue
- Removed: loader, custom cursor, greeting box, sidebar recruiter box
- Removed: emoji headers, gradient skill bars, duplicate CTAs
- Added: command palette (K), copy email, press kit link
- Added: book cover feature with 3D hover
- Added: "Currently" section, "Process" section, "Clarity" section
- Added: RSS feed support, calendar booking link
- Rewritten CSS: mobile-first, `clamp()`, focus trap
- Rewritten JS: no dependencies, ~230 lines

### v2.0 — 2024
First serious iteration with theme toggle, sidebar, interest cards.

### v1.0 — 2023
Initial HTML page.

---

## Credits

- **Design & Code** — Ravi Raj
- **Typography** — Inter, Source Serif 4, JetBrains Mono (Google Fonts)
- **Icons** — Inline SVG (no icon library)
- **Inspiration** — Linear, Vercel, Lee Robinson, Dan Abramov

---

## License

All content (text, images, book) © Ravi Raj. All rights reserved.

The **code structure** may be used as a reference for learning. Please don't copy the personal content.

---

## Contact

- **Email** — rravirajhere@gmail.com
- **GitHub** — [github.com/ravirajhere](https://github.com/ravirajhere)
- **LinkedIn** — [linkedin.com/in/Ravirajhere](https://linkedin.com/in/Ravirajhere)
- **Instagram** — [instagram.com/rravirajhere](https://instagram.com/rravirajhere)
- **YouTube** — [youtube.com/@Ravirajhere](https://youtube.com/@Ravirajhere)

---

*Written by hand in Begusarai.*
