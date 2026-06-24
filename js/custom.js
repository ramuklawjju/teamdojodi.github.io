/*
 * custom.js — shared page behaviour for DoJodi.
 * Loaded last by includes.js, after jQuery, Bootstrap, Headroom and (where
 * needed) Slick are available and the shared partials have been injected.
 */
(function () {
  'use strict';

  /* Preloader -------------------------------------------------------------
   * Fade out the loading overlay once the page is ready. Because this file is
   * injected dynamically, the window 'load' event may have already fired — so
   * if the document is complete we hide it immediately instead of waiting. */
  function hidePreloader() {
    var pre = document.querySelector('.preloader');
    if (!pre) return;
    pre.style.transition = 'opacity 0.4s ease';
    pre.style.opacity = '0';
    setTimeout(function () { pre.style.display = 'none'; }, 400);
  }
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  /* Navbar scroll behaviour ----------------------------------------------
   * Headroom hides the fixed navbar when scrolling down and reveals it when
   * scrolling back up, so it never covers content while reading. */
  var navbar = document.querySelector('.navbar');
  if (navbar && window.jQuery && window.jQuery.fn.headroom) {
    window.jQuery(navbar).headroom();
  }

  /* Mobile menu ----------------------------------------------------------
   * Collapse the expanded mobile menu after a link is tapped. */
  document.querySelectorAll('.navbar-collapse a').forEach(function (link) {
    link.addEventListener('click', function () {
      var open = document.querySelector('.navbar-collapse.show');
      if (open && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(open).hide();
      }
    });
  });

  /* Favourite toggle -----------------------------------------------------
   * Demo-only "save to favourites" heart on service cards: toggles the filled
   * state and keeps aria-pressed in sync for assistive tech. */
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

  /* Carousels ------------------------------------------------------------
   * Slick powers the hero slideshow (home) and the testimonial slider
   * (story). It requires jQuery, which is only loaded on those two pages. */
  if (window.jQuery && window.jQuery.fn.slick) {
    var $ = window.jQuery;
    if ($('.slick-slideshow').length) {
      $('.slick-slideshow').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        arrows: false,
        fade: true,
        dots: true,
        pauseOnHover: true
      });
    }
    if ($('.slick-testimonial').length) {
      $('.slick-testimonial').slick({
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: false,
        dots: true,
        adaptiveHeight: true
      });
    }
  }
})();
