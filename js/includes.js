/*
 * includes.js — DoJodi shared-component loader (zero dependencies)
 * --------------------------------------------------------------------------
 * Keeps this a pure static GitHub Pages site while removing the navbar/footer
 * duplication that used to live in all eight HTML files. (The preloader stays
 * inline in each page so it paints instantly and masks the partial injection.)
 *
 *   1. Injects the shared partials into every <div data-include="…"> slot.
 *   2. Marks the current page's nav link as active.
 *   3. Stamps the current year into [data-year] elements.
 *   4. Loads only the libraries each page actually needs, in dependency order.
 *
 * Heads-up: partials are fetched over HTTP, so the site must be served by a web
 * server (GitHub Pages, or `python3 -m http.server` locally). Opening the files
 * directly via file:// will block fetch() and the layout will not appear.
 */
(function () {
  'use strict';

  /* 1. Fetch each partial and replace its placeholder element. */
  function injectPartials() {
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(slots.map(function (slot) {
      var name = slot.getAttribute('data-include');
      return fetch('partials/' + name + '.html')
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + name);
          return res.text();
        })
        .then(function (html) { slot.outerHTML = html; })
        .catch(function (err) { console.error('[includes] could not load partial:', err.message); });
    }));
  }

  /* 2. Highlight the link that matches the current file name. */
  function setActiveNav() {
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
      if (link.getAttribute('href') === page) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* 3. Keep the footer copyright year current automatically. */
  function setYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
  }

  /* 4a. Promise-based single-script loader. */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('failed to load ' + src)); };
      document.body.appendChild(s);
    });
  }

  /* 4b. Run an array of scripts strictly in order. */
  function loadInOrder(list) {
    return list.reduce(function (chain, src) {
      return chain.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  /* 4c. Decide which scripts this page needs, then load them in order. */
  function loadPageScripts() {
    // Bootstrap is needed everywhere; jQuery + Slick only where a carousel is.
    var hasCarousel = document.querySelector('.slick-slideshow, .slick-testimonial');
    var libs = hasCarousel
      ? ['js/jquery.min.js', 'js/bootstrap.bundle.min.js', 'js/slick.min.js']
      : ['js/bootstrap.bundle.min.js'];
    libs.push('js/custom.js'); // shared behaviour — must run after the libs above

    return loadInOrder(libs).then(function () {
      var extra = ['js/enhance.js'];                // premium micro-interactions
      if (document.querySelector('form[data-validate]')) extra.push('js/forms.js');
      if (document.querySelector('#cart-modal')) extra.push('js/cart.js');
      return Promise.all(extra.map(loadScript));
    });
  }

  /* Safety net: never let the preloader trap the page if a script fails. */
  function hidePreloaderFallback() {
    var pre = document.querySelector('.preloader');
    if (pre) { pre.style.opacity = '0'; pre.style.display = 'none'; }
  }

  function boot() {
    injectPartials().then(function () {
      setActiveNav();
      setYear();
      return loadPageScripts();
    }).catch(function (err) {
      console.error('[includes] boot error:', err);
      hidePreloaderFallback();
    });
    setTimeout(hidePreloaderFallback, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
