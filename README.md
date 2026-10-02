# Akansha Sharma - Quality Engineering Portfolio

Vanilla HTML, CSS, and JavaScript. No framework, build step, or runtime library.
Open `index.html` directly in a browser. All local asset paths are relative, so
the site also works under a GitHub Pages project path.

## Assumptions and accuracy

- The supplied current role overrides the earlier resume's current bank role:
  Quality Engineer II, Adobe (via Infinite Computer Solutions), March 2026 - Present.
- Adobe is the client engagement, not the employer. Infinite Computer Solutions
  is the employer of record. The Person schema names only that employer.
- The earlier resume is the source for the bank SDET role, July 2022 start date,
  Java, REST Assured, Naukri automation, Device Inventory, and certifications.
  The original website supplies teaching internships, Chemistry specialization,
  React experience, the portrait, and contact links.
- AI topics are a proposed learning direction. No completed AI project,
  AI certification, or in-progress course is claimed without confirmation.
- The PDF download is explicitly labeled as an earlier resume. Update it before
  using it as your current application resume.
- Public-safe experience summaries only; no client internals or invented metrics.

Headline alternatives:
1. Quality engineering for smarter tests and reliable AI.
2. Test automation today. AI-integrated quality next.

## Placeholders to replace

Search `index.html` for `[ADD` and `ADD metric`:

- Current-role achievements: action + what you built + tool + result.
- Bank role end date and any verified, shareable result metrics.
- Verified GitHub and live URLs for the existing projects; no guessed links.
- Mobile automation, CI platforms, cloud, and observability tools, if used.
- Exact certification titles, issue dates, and public verification links.
- Actual AI courses and mini-projects, with Done / In progress / Planned status.
- Deployment URL for canonical and Open Graph URL metadata.

Do not publish unfinished placeholders as final claims. Remove optional unknown
details rather than implying that a tool or achievement is verified. For a
verified project URL, replace its placeholder paragraph with a descriptive anchor.
Use `target="_blank" rel="noopener noreferrer"` if opening a new tab, and include
an accessible note that it opens in a new tab.

## Files and changes

- `index.html`: eight ordered sections, honest contractor context, verified
  experience and projects, metadata, Person JSON-LD, and labeled contact fields.
- `style.css`: token-based light/dark themes, single teal accent, responsive
  editorial layout, timeline, filters, focus states, and reduced-motion overrides.
- `script.js`: system-aware persisted theme, mobile navigation, active section,
  IntersectionObserver reveals, announced filters, typing, low-intensity canvas,
  scroll progress, and email-draft composition. Motion pauses in hidden tabs.
- `assets/`: resized, upright WebP portrait, resume PDF, favicon, and four local
  Lucide icons with their upstream license. Unused source images were removed from
  `images/`; the original resume PDF remains there.

## Deploy on GitHub Pages

1. Push the files and the entire `assets/` directory to your GitHub repository.
2. Open repository Settings > Pages. Choose Deploy from a branch, your actual
   publishing branch, and `/ (root)`. Save.
3. Once GitHub shows the deployed URL, replace the metadata comment in the head
   with `<link rel="canonical" href="YOUR_ACTUAL_HTTPS_URL">` and
   `<meta property="og:url" content="YOUR_ACTUAL_HTTPS_URL">`.
4. Verify relative assets, resume download, navigation, and contact links at that
   URL. Run Lighthouse on the published site; hosting and font delivery affect it.

No backend is needed. The contact form opens an email draft; it does not send
messages or guarantee that an email client is configured. For Formspree, obtain
your own verified endpoint, change the form action and method to POST, and replace
the mailto submit handler with a real submission flow and success/error states.
Do not label a message as sent until the service confirms it.

## Verification results

Local mobile Lighthouse audit: Performance 92, Accessibility 100,
Best Practices 100, SEO 100. Scores are a local snapshot, not a promise about
the deployed site. Axe WCAG A/AA checks found zero violations in both themes.
JavaScript syntax and editor diagnostics passed. Browser checks passed for
project/skill filters, empty AI categories, persisted theme, menu Escape/focus,
reduced motion, active navigation, image/icon loading, and zero observed runtime errors.
No horizontal overflow was found at 320, 390, 768, 1440, or 1920 pixels.

## Final verification checklist

- Accessibility: one h1; ordered headings; skip link; labeled fields and icon
  controls; visible focus; keyboard menu with Escape; aria-current navigation;
  filter announcements; image alt text; reduced-motion support; contrast in both themes.
- Responsiveness: test 320px, 390px, tablet, desktop, and wide desktop; test 200%
  zoom and longer placeholder replacements. Avoid oversized project descriptions.
- Performance: deferred JavaScript, no runtime libraries, lazy WebP portrait with
  dimensions, efficient font loading, DPR-capped canvas paused out of view.
  Downloaded PDF is loaded only when requested.
- Accuracy: Adobe plain text and prominent; employer smaller and explicit;
  March 2026 start; no direct-employee claim; AI learning visibly qualified;
  metrics and project links never guessed.
- Remaining manual checks: Safari, Firefox, and Edge, assistive technology,
  configured email-client handoff, and deployed canonical metadata.

## Credits

Visual inspiration: zachjordan.io and radnaabazar.com/en. No reference source,
copy, imagery, or exact layouts were reused. Font: Manrope via Google Fonts.
Control icons: Lucide 0.468.0; license included in `assets/lucide-LICENSE.txt`.