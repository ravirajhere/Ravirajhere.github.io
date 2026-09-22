# Ravi Raj — Portfolio & Author Website

Personal website of **Ravi Raj Singh** — frontend developer and author from Patna, India.

Live: [ravirajhere.vercel.app](https://ravirajhere.vercel.app)

---

## Pages

| Page | Purpose |
|------|---------|
| [index.html](index.html) | Portfolio — for recruiters and collaborators |
| [author.html](author.html) | Author website — for readers |
| [book.html](book.html) | Book reader — 11 chapters, English + Hinglish |
| [resume-pdf.html](resume-pdf.html) | Resume — print-optimized, ATS-friendly |
| [contact.html](contact.html) | Contact form |
| [friends.html](friends.html) | Friends gallery |
| [404.html](404.html) | Custom 404 page |

---

## About the Book

**"A Boy Who Never Thought"** — Safar Se Safar Tak.

An 18-year journey from 2008 to 2026. Written in both **English** and **Hinglish**. Currently 11 chapters — the story continues.

Read free: [book.html](book.html)

---

## Tech Stack

### Frontend

- **HTML5** — hand-written, semantic
- **CSS3** — custom properties, no frameworks
- **JavaScript** — vanilla, no dependencies

### Backend (Serverless)

- **Vercel Functions** — 5 API endpoints
- **Resend** — email delivery (contact form, newsletter welcome)
- **Supabase** — Postgres database (newsletter subscribers)
- **Vercel Blob** — file storage (PDF cache)
- **Puppeteer + Chromium** — server-side PDF generation

No build step for frontend. Every line written by hand.

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact` | POST | Contact form — sends email via Resend |
| `/api/pdf` | POST | Resume PDF generation (Puppeteer + Blob cache) |
| `/api/subscribe` | POST | Newsletter signup (Supabase + welcome email) |
| `/api/stats` | GET | Live GitHub commits data |
| `/api/book-pdf` | POST | Book PDF generation (Chromium, in progress) |

---

## Features

### For Recruiters

- **Live GitHub commits** — hero section shows "Committed today"
- **Server-side resume PDF** — ATS-friendly, consistent output
- **Contact form** — server-side, rate-limited, honeypot-protected
- **Command palette** — press `K` to navigate
- **Honest skill levels** — "Working" vs "Learning"

### For Readers

- **Bilingual book reader** — English + Hinglish toggle
- **Reading progress** — saved across sessions
- **PDF export** — client-side (server-side in progress)
- **Newsletter** — subscribe for book updates
- **Author site** — dedicated space for the book

### Infrastructure

- **Custom 404** — playful error page
- **SEO** — canonical tags, OG tags, Schema.org JSON-LD
- **Accessibility** — skip links, focus states, ARIA labels, reduced-motion

---

## Folder Structure

    /
    ├── index.html
    ├── author.html
    ├── book.html
    ├── resume-pdf.html
    ├── contact.html
    ├── friends.html
    ├── 404.html
    ├── print.html              # Print route for book PDF
    ├── package.json            # Backend dependencies
    ├── vercel.json             # Function config
    ├── api/                    # Serverless functions
    │   ├── contact.js
    │   ├── pdf.js
    │   ├── subscribe.js
    │   ├── stats.js
    │   └── book-pdf.js
    ├── css/
    │   ├── style.css
    │   ├── author.css
    │   ├── book.css
    │   ├── print.css
    │   └── 404.css
    ├── js/
    │   ├── script.js
    │   ├── author.js
    │   ├── book.js
    │   ├── ebook.js            # Client-side PDF fallback
    │   └── print.js
    └── assets/
        ├── favicon.png
        └── images/

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
    SUPABASE_URL=https://xxxxx.supabase.co
    SUPABASE_ANON_KEY=sb_publishable_xxxxx
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
| `RESEND_API_KEY` | Email delivery (contact, newsletter) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public key |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage access |
| `AWS_LAMBDA_JS_RUNTIME` | Chromium runtime compatibility |

---

## Database Schema

### Supabase — `subscribers` table

    create table subscribers (
      id bigserial primary key,
      email text not null unique,
      source text default 'author',
      created_at timestamptz default now()
    );

Row Level Security enabled:
- Anonymous insert allowed (subscribe form)
- Anonymous reads blocked (privacy)

---

## Contact

- **Email:** raviraj2k09@gmail.com
- **GitHub:** [@ravirajhere](https://github.com/ravirajhere)
- **LinkedIn:** [Ravirajhere](https://linkedin.com/in/Ravirajhere)

Or use the [contact form](contact.html).

---

## License

Content © 2026 Ravi Raj Singh. All rights reserved.

Code is open for reference and learning.

---

**Made With ❤️ & Curiosity**
