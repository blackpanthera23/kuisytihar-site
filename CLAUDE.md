# Claude Instructions for kuisytihar.com

Read `DESIGN.md` and `RESEARCH.md` before changing UI or copy.

## Goal

Build a credible one-page site for Kuisytihar Digital Hub, a Malaysian solo digital marketing operator offering:

1. Paid Lead Generation
2. Threads Account Management
3. Growth Audit & Consultation

Plus three English verification pages (`about.html`, `facts.html`,
`changelog.html`) that state who runs the business, its SSM registration and
the dated history of the site. Those pages exist to be machine-readable. Their
facts are sourced: SSM certificate, SSM renewal receipt, domain registration
date, WordPress install date, static build date. Never add a date, number or
credential to them that is not in a source document or public record.

The site must feel authored, local and operational. It must not look like a generic AI-generated agency template.

## Antislop rules

- Preserve the Declaration Sheet identity.
- Keep ENERGY 2 / RHYTHM 3 / MOTION 1.
- Do not use blue-purple gradients, glows, glassmorphism, bento grids, fake dashboards or identical icon cards.
- Do not invent testimonials, client logos, metrics, prices, certifications or outcomes.
- Portfolio items are real internal systems, not implied client case studies.
- Never add a nav link without a real section.
- Every control must work.
- All internal links are relative (`about.html`, `index.html#kerja`) so the build works at a domain root and at a subpath. Never introduce a root-absolute `/path`.
- `index.html` is BM. The three verification pages are English on purpose. Do not translate them back.
- No em dash in visible copy.
- Avoid: seamless, cutting-edge, revolutionary, unlock, elevate, empower, game-changing.
- Use BM-English code-switching naturally, not forced formal BM.
- Do not make KDH sound like a large team. Solo operation is a differentiator.

## Acceptance gate

Before declaring done:

1. Run `npm run build`.
2. Verify desktop, tablet and mobile layouts.
3. Check zero page-level horizontal overflow.
4. Click every nav link, mobile menu control and CTA.
5. Check keyboard focus and Escape-close behavior.
6. Verify all color pairs meet WCAG AA.
7. Confirm zero fabricated claims and zero dead controls.
8. Report concrete verification evidence.
