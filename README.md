# Ravi Raj — Portfolio

Personal portfolio of **Ravi Raj** — full-stack developer from Patna, India.

Live: [ravirajhere.vercel.app](https://ravirajhere.vercel.app)

**Companion projects:**
- [Author Website + Book Reader](https://github.com/ravirajhere/author-website) — for readers of "A Boy Who Never Thought"
- [Snake Game](https://github.com/ravirajhere/snake-game) — Nokia Snake, hand-written
- [CLI Portfolio](https://github.com/ravirajhere/cli-portfolio) — `npx ravirajhere`

---

## About

A hand-written portfolio for recruiters and collaborators. Built without frameworks — every line of HTML, CSS, and JavaScript written by hand. Now with a serverless backend for contact, PDF generation, and live GitHub stats.

**Built by hand. Since 2024.**

---

## Pages

| Page | Purpose |
|------|---------|
| [index.html](index.html) | Portfolio — hero, work, skills, currently, milestones, contact |
| [resume-pdf.html](resume-pdf.html) | Resume — print-optimized, ATS-friendly |
| [contact.html](contact.html) | Contact form — server-side |
| [404.html](404.html) | Custom 404 page |

**Related:**
- [Author website + book reader](https://ravirajhere-author.vercel.app) — separate project
- [Snake game](https://ravirajhere-snake.vercel.app) — separate project

---

## Tech Stack

### Frontend

- **HTML5** — hand-written, semantic
- **CSS3** — custom properties, no frameworks
- **JavaScript** — vanilla, no dependencies
- **No build step** — every line written by hand

### Backend (Serverless)

- **Vercel Functions** — 3 API endpoints
- **Resend** — email delivery (contact form)
- **Vercel Blob** — file storage (PDF cache)
- **Puppeteer + Chromium** — server-side PDF generation

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact` | POST | Contact form — rate-limited, honeypot-protected, sends via Resend |
| `/api/pdf` | POST | Resume PDF — Puppeteer + Blob cache |
| `/api/stats` | GET | Live GitHub commits — cached 10 min |

---

## Features

### For Recruiters

- **Live GitHub commits** — hero section shows "Committed today"
- **Server-side resume PDF** — ATS-friendly, consistent output
- **Contact form** — server-side, rate-limited, spam-protected
- **Command palette** — press `K` to navigate
- **Honest skill levels** — "Working" vs "Learning"

### Infrastructure

- **Custom 404** — playful error page (dark + amber theme)
- **SEO** — canonical tags, OG tags, Twitter cards, Schema.org JSON-LD (Person), sitemap.xml, robots.txt
- **Analytics** — Vercel Web Analytics (privacy-friendly, no cookies)
- **Accessibility** — skip links, focus states, ARIA labels, reduced-motion
- **Security** — server-side keys, rate limiting, honeypot, CORS headers
- **Social** — custom OG image (`og-cover.jpg`, 1200×630)

---

## Folder Structure

    /
    ├── index.html              # Portfolio
    ├── resume-pdf.html         # Resume (print-optimized)
    ├── contact.html            # Contact form
    ├── 404.html                # Custom 404
    ├── sitemap.xml             # SEO sitemap
    ├── robots.txt              # Crawler rules
    ├── package.json            # Backend dependencies
    ├── vercel.json             # Function config
    ├── api/                    # Serverless functions
    │   ├── contact.js
    │   ├── pdf.js
    │   └── stats.js
    ├── css/
    │   ├── style.css
    │   └── 404.css
    ├── js/
    │   └── script.js
    └── assets/
        ├── favicon.png
        └── images/
            ├── formal.jpg
            ├── casual.jpg
            ├── Singh_ravirajhere.jpeg
            └── og-cover.jpg    # Social share image (1200×630)

---

## Local Development

### Frontend only

No build step. Open any HTML file in a browser.

For best results, run a local server:

    python -m http.server 8000

Then open: http://localhost:8000

### With backend (API routes)

Backend functions need Vercel environment. Install dependencies first:

    npm install

Then run:

    vercel dev

Required environment variables:

    RESEND_API_KEY=re_xxxxx
    BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
    AWS_LAMBDA_JS_RUNTIME=nodejs22.x

---

## Deploy

Hosted on **Vercel**. Push to `main` branch — site updates automatically.

    git add .
    git commit -m "Update"
    git push origin main

Vercel auto-detects `api/` folder and deploys serverless functions.

---

## Environment Variables

Set in Vercel dashboard → Project → Settings → Environment Variables:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Email delivery (contact) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage access |
| `AWS_LAMBDA_JS_RUNTIME` | Chromium runtime compatibility |

---

## Related Projects

- **[Author Website](https://github.com/ravirajhere/author-website)** — `ravirajhere-author.vercel.app`
  - Author home, book reader (11 chapters, EN + HI), newsletter, custom 404
  - Serverless: newsletter + book PDF

- **[Book](https://ravirajhere-author.vercel.app/book.html)** — "A Boy Who Never Thought"
  - Bilingual memoir — 11 chapters so far

- **[Snake Game](https://github.com/ravirajhere/snake-game)** — `ravirajhere-snake.vercel.app`
  - Classic Nokia Snake rebuilt for the browser
  - HTML5 Canvas, vanilla JS, no frameworks

- **[CLI Portfolio](https://github.com/ravirajhere/cli-portfolio)** — `npx ravirajhere`
  - Terminal portfolio, zero dependencies
  - Node.js, ANSI colors, typewriter effect

---

## Contact

- **Email:** raviraj2k09@gmail.com
- **GitHub:** [@ravirajhere](https://github.com/ravirajhere)
- **LinkedIn:** [Ravirajhere](https://linkedin.com/in/Ravirajhere)

Or use the [contact form](contact.html).

---

## License

Content © 2026 Ravi Raj. All rights reserved.

Code is open for reference and learning.

---

**Made With ❤️ & Curiosity**
