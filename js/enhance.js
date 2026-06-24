/*
 * enhance.js — premium micro-interactions (progressive enhancement).
 * Animated stat counters, magnetic buttons and a hero cursor glow.
 * Every effect no-ops under prefers-reduced-motion or on coarse/touch pointers.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  /* Animated number counters (home stats) -------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1700, startTime = null;
    function frame(ts) {
      if (startTime === null) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);            // easeOutCubic
      el.textContent = (eased * target).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* Magnetic buttons ----------------------------------------------------- */
  if (fine && !reduce) {
    document.querySelectorAll('.custom-btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.3;
        var my = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + (my - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* Hero cursor glow ----------------------------------------------------- */
  var hero = document.querySelector('.hero');
  if (hero && fine && !reduce) {
    var glow = document.createElement('div');
    glow.className = 'hero-cursor';
    glow.setAttribute('aria-hidden', 'true');
    hero.appendChild(glow);
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.opacity = '1';
      glow.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)';
    });
    hero.addEventListener('pointerleave', function () { glow.style.opacity = '0'; });
  }
})();
