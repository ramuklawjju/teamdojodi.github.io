/*
 * custom.js — shared page behaviour for DoJodi.
 * Loaded last by includes.js, after the shared partials are injected and the
 * required libraries (Bootstrap everywhere; jQuery + Slick on carousel pages)
 * are available.
 */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar ----------------------------------------------------------------
   * On the home page the navbar floats transparently over the hero and turns
   * solid once you scroll past it. Inner pages just gain a subtle shadow. */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    var hero = document.querySelector('.slick-slideshow');
    var transparent = !!hero;
    if (transparent) navbar.classList.add('navbar--transparent');

    // Solidify the navbar early so cream-on-image text never loses contrast.
    var onScroll = function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu: collapse it after a link is tapped. */
  document.querySelectorAll('.navbar-collapse a').forEach(function (link) {
    link.addEventListener('click', function () {
      var open = document.querySelector('.navbar-collapse.show');
      if (open && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(open).hide();
      }
    });
  });

  /* Favourite toggle (demo) on service cards. */
  document.querySelectorAll('.product-icon').forEach(function (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var saved = btn.classList.toggle('is-saved');
      btn.classList.toggle('bi-heart-fill', saved);
      btn.classList.toggle('bi-heart', !saved);
      btn.setAttribute('aria-pressed', String(saved));
    });
  });

  /* Carousels (Slick — only present on home + story). */
  if (window.jQuery && window.jQuery.fn.slick) {
    var $ = window.jQuery;
    if ($('.slick-slideshow').length) {
      $('.slick-slideshow').slick({
        autoplay: true, autoplaySpeed: 5500, speed: 900,
        infinite: true, arrows: false, fade: true, dots: true, pauseOnHover: true
      });
    }
    if ($('.slick-testimonial').length) {
      $('.slick-testimonial').slick({
        autoplay: true, autoplaySpeed: 6500, speed: 700,
        arrows: false, dots: true, adaptiveHeight: true
      });
    }
  }

  /* Scroll reveal --------------------------------------------------------
   * Fade-and-rise content as it enters the viewport. Skipped entirely when
   * the user prefers reduced motion or IntersectionObserver is unavailable. */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var groups = [
      ['.site-header h1', false], ['.site-header .lead', false],
      ['main h2:not(.slick-title)', false], ['.section-padding .lead', false],
      ['.front-product .row > div', true], ['.product-thumb', true],
      ['.team-thumb', true], ['.stat', true], ['.about .tab-content', false],
      ['.skill-thumb', false], ['.faq .accordion', false], ['.faq .lead', false],
      ['.contact-form', false], ['.contact-info .row > div', true],
      ['.product-detail .row > div', true], ['.product-includes', false],
      ['.demo-note', false]
    ];
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.setAttribute('data-reveal', '');
        if (g[1]) el.style.transitionDelay = (i % 3) * 0.09 + 's';
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  /* Preloader: fade out once everything is ready (run last so the reveal
   * state is set before the page is revealed). Because this script is injected
   * dynamically the load event may have fired already, so hide immediately. */
  function hidePreloader() {
    var pre = document.querySelector('.preloader');
    if (!pre) return;
    pre.style.transition = 'opacity 0.5s ease';
    pre.style.opacity = '0';
    setTimeout(function () { pre.style.display = 'none'; }, 500);
  }
  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader);
})();
