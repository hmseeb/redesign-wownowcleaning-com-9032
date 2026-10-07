/* ==========================================================================
   Wow Now Cleaning — site scripts
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/600da560d5dd6818fe6e34a4cf7e064e';

  /* ---------- current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- hidden _page fields ---------- */
  function stampPageFields() {
    var fields = document.querySelectorAll('[data-page-field]');
    for (var i = 0; i < fields.length; i++) fields[i].value = window.location.href;
  }
  stampPageFields();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------- header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('is-stuck');
      else header.classList.remove('is-stuck');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- FAQ: only one open at a time ---------- */
  var faqItems = document.querySelectorAll('.faq-list details');
  for (var f = 0; f < faqItems.length; f++) {
    faqItems[f].addEventListener('toggle', function () {
      if (!this.open) return;
      for (var j = 0; j < faqItems.length; j++) {
        if (faqItems[j] !== this) faqItems[j].open = false;
      }
    });
  }

  /* ---------- forms ---------- */
  var FORMS = [
    { form: 'quoteForm', note: 'quoteThanks' },
    { form: 'contactForm', note: 'contactThanks' }
  ];

  function showNote(note, isError, title, detail) {
    if (!note) return;
    note.hidden = false;
    note.classList.toggle('is-error', !!isError);
    var strong = note.querySelector('strong');
    var span = note.querySelector('span');
    if (strong) strong.textContent = title;
    if (span) span.textContent = detail;
  }

  function validate(form) {
    var ok = true;
    var fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      var valid = el.value.trim() !== '' && el.checkValidity();
      el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid && ok) {
        ok = false;
        try { el.focus(); } catch (e) {}
      }
    }
    return ok;
  }

  FORMS.forEach(function (cfg) {
    var form = document.getElementById(cfg.form);
    var note = document.getElementById(cfg.note);
    if (!form) return;

    // Clear invalid state as the visitor types.
    form.addEventListener('input', function (e) {
      if (e.target && e.target.getAttribute('aria-invalid') === 'true') {
        if (e.target.value.trim() !== '' && e.target.checkValidity()) {
          e.target.setAttribute('aria-invalid', 'false');
        }
      }
    });

    form.addEventListener('submit', function (e) {
      // Keep the _page value fresh at submit time.
      stampPageFields();

      if (!validate(form)) {
        e.preventDefault();
        showNote(note, true, 'Please check the highlighted fields.',
          'A few required details are missing or incomplete.');
        return;
      }

      // Progressive enhancement: if fetch is unavailable, let the plain
      // HTML POST to the same action URL go through untouched.
      if (typeof window.fetch !== 'function') return;

      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var btnText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var payload = {};
      var data = new FormData(form);
      data.forEach(function (value, key) { payload[key] = value; });
      payload._page = window.location.href;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: res.ok }; });
        })
        .then(function (json) {
          if (json && json.ok) {
            showNote(note, false, 'Thanks, your message was sent.',
              "We'll be in touch shortly — usually within one business day.");
            form.reset();
            stampPageFields();
            if (note && note.scrollIntoView) {
              note.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            throw new Error('Submission rejected');
          }
        })
        .catch(function () {
          showNote(note, true, "Sorry, that didn't send.",
            'Please try again, or call us at (727) 353-0507.');
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
    });
  });

  /* ---------- plain-submission confirmation (?submitted=1) ---------- */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      var target = document.getElementById('quoteThanks') || document.getElementById('contactThanks');
      if (target) {
        showNote(target, false, 'Thanks, your message was sent.',
          "We'll be in touch shortly — usually within one business day.");
        if (target.scrollIntoView) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  } catch (e) { /* URLSearchParams unsupported — plain form still works */ }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var targets = document.querySelectorAll(
      '.svc, .member, .why-list li, .rev, .loc, .ccard, .faq-list details'
    );
    for (var t = 0; t < targets.length; t++) {
      targets[t].style.opacity = '0';
      targets[t].style.transform = 'translateY(16px)';
      targets[t].style.transition = 'opacity .5s ease, transform .5s ease';
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, Math.min(i * 55, 220));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var k = 0; k < targets.length; k++) io.observe(targets[k]);
  }
})();
