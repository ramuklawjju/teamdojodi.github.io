# DoJodi Events

A polished, fully static marketing site for **DoJodi**, a fictional full‑service
wedding & event‑planning studio. Built with plain HTML, CSS and vanilla
JavaScript on top of Bootstrap 5 — no build step, no framework, no backend.

🔗 **Live:** https://teamdojodi.github.io/

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero slideshow, how-we-work tabs, featured services |
| `about.html` | Studio story, team bios (modals) and client testimonials |
| `products.html` | Services — signature packages plus add-ons & extras |
| `product-detail.html` | Sample service page with live price total and cart modal |
| `faq.html` | Accordion FAQs covering services, booking and pricing |
| `contact.html` | Validated contact form and studio details |
| `sign-in.html` / `sign-up.html` | Validated account forms |

## Tech stack

- **HTML5 + Bootstrap 5** (`css/bootstrap.min.css`, bundle JS)
- **Custom CSS** — `css/dojodi.css` (design system documented at the top of the file)
- **Vanilla JS** (no jQuery of our own):
  - `js/includes.js` — injects shared partials, sets the active nav link and year, and lazy-loads only the scripts each page needs
  - `js/custom.js` — preloader, navbar (Headroom), carousels, favourite toggle
  - `js/forms.js` — accessible client-side form validation + success states
  - `js/cart.js` — quantity → live total and cart-modal population
- **Libraries:** jQuery + Slick (carousels, home/story only), Headroom.js, Bootstrap Icons, Google Fonts (Inter)
- Shared navbar & footer live once in `partials/` and are injected at runtime

## Run locally

The shared header/footer are fetched with `fetch()`, so the site **must be served
over HTTP** — opening the files directly with `file://` will block the request.

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

It's a static site: push to the default branch and enable **GitHub Pages**
(Settings → Pages → deploy from branch). No build is required.

## What's intentionally placeholder

- Photos are royalty-free — [Unsplash](https://unsplash.com/license) & [Pexels](https://www.pexels.com/license/); team headshots and client avatars are from [randomuser.me](https://randomuser.me/). Names, bios and testimonials are illustrative.
- Forms validate fully but have **no backend** — a valid submit shows a confirmation
  message instead of sending data.
- Service cards all open the same sample `product-detail.html` and are marked **“Demo.”**
  Prices are illustrative. The cart/checkout is a UI demo only.

## License

[MIT](LICENSE)
