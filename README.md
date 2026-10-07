# Wow Now Cleaning — Website

Modern, responsive marketing site for **Wow Now Cleaning LLC** — ISSA-certified house and
commercial cleaning serving St. Petersburg and Pinellas County, Florida since 2021.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no environment variables.
Serve the directory with any static host; `index.html` is the entry point.

```
index.html      # single-page site (hero, services, why us, estimate, team,
                # areas, reviews, FAQ, contacts, footer)
styles.css      # design system + all section styles + responsive rules
script.js       # mobile nav, FAQ accordion, scroll reveal, form handling
favicon.svg     # favicon
robots.txt      # crawler directives
sitemap.xml     # sitemap
images/source/  # authentic photos carried over from the previous site
```

## Forms

Both forms (**Quote request** and **Contact**) POST to the LeadrVision endpoint:

```
https://vision.leadrai.com/api/forms/600da560d5dd6818fe6e34a4cf7e064e
```

- `script.js` enhances submission with `fetch()` to the same URL and shows an inline
  "Thanks, your message was sent." confirmation on `{"ok": true}`.
- Without JavaScript the plain HTML POST still works; the visitor returns with
  `?submitted=1` and the same confirmation is displayed.
- Each form carries hidden `_form`, `_page` (set to `window.location.href`) and a
  `_gotcha` honeypot field. No file uploads, no third-party form services.

## Business details

- **Phone (St. Petersburg):** (727) 353-0507
- **Email:** infostpete@wownowcleaning.com
- **Office:** 360 Central Ave, Suite 823, St. Petersburg, FL 33701
- **Hours:** Monday–Sunday, 8:00 AM – 6:00 PM
- **Other locations:** Tampa, South Tampa, Sarasota
