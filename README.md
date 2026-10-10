# kuisytihar.com

Vite static site for Kuisytihar Digital Hub (KDH).

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # writes dist/, multi-page
npm run preview
```

## Pages

Four hand-written HTML entries, wired in `vite.config.js`:

| File | Language | Purpose |
|---|---|---|
| `index.html` | BM | Landing page: services, process, working systems, fit check, contact |
| `about.html` | English | Who runs the business, when it started, what it does not claim |
| `facts.html` | English | Registration number, entity type, dates, domain details |
| `changelog.html` | English | Dated site and business history, newest first |

The three English pages exist so a crawler or an automated review system can
confirm the business and the site are real and how old they are. They carry
`Organization`, `AboutPage` and `WebPage` JSON-LD, and they are listed with
`lastmod` in `public/sitemap.xml`.

Facts on those pages must stay sourced. Current sources: SSM certificate
202403000557 (JM0997416-U), SSM renewal receipt 25 September 2025, domain
registration 16 March 2025, WordPress install 5 August 2026, static build
16 September 2026. Never invent or round a date to look older.

## Deploy

GitHub Actions builds and publishes `dist/` to GitHub Pages on every push to
`main` (`.github/workflows/deploy-pages.yml`). `dist/` is not committed.

Live: **https://kuisytihar.com/** (custom domain on the repo's Pages site)

TLS is a Let's Encrypt certificate for `kuisytihar.com`, issued by GitHub Pages
and auto-renewed. HTTPS is enforced: `http://` and both `www` forms 301 to
`https://kuisytihar.com/`.

Fallback: https://blackpanthera23.github.io/kuisytihar-site/ (301s to the domain)

### DNS

The zone lives in Cloudflare. Apex `kuisytihar.com` has four `A` records to the
GitHub Pages addresses (185.199.108-111.153), all **DNS only**. `www` is a
DNS-only `CNAME` to `blackpanthera23.github.io`. Both must stay DNS only, because
Cloudflare's proxy would intercept the certificate issuance and the Pages custom
domain check.

Mail records (MX `smtp.google.com`, SPF, DKIM, DMARC) and the five Google
Workspace `CNAME`s (`business`, `calendar`, `drive`, `g`, `sites`) are untouched.
A pre-cutover snapshot is in
`claude-outbox/kuisytihar/2026-10-11/dns-backup-pre-cutover-20261011.json`.

`base` is `./` in `vite.config.js` so the same build works at a domain root
and at a project subpath.

## Content integrity

The portfolio presents real KDH working systems. It does not claim client outcomes, certifications, testimonial quotes or performance figures. Replace the email CTA only with a confirmed, monitored destination.
