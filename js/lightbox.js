/*
 * lightbox.js — accessible image lightbox for the gallery.
 * Progressive enhancement: each gallery item is a real <a href="full.jpg">, so
 * with JS off the image still opens. With JS on we intercept and show an
 * in-page viewer with keyboard support (Esc / ← / →), a focus trap and
 * backdrop-click to close.
 */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (!items.length) return;

  var index = 0;
  var lastFocus = null;

  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close viewer">&times;</button>' +
    '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(lb);

  var img = lb.querySelector('.lightbox-img');
  var cap = lb.querySelector('.lightbox-caption');
  var btnClose = lb.querySelector('.lightbox-close');
  var btnPrev = lb.querySelector('.lightbox-prev');
  var btnNext = lb.querySelector('.lightbox-next');
  var focusable = [btnPrev, btnNext, btnClose];

  function render(i) {
    index = (i + items.length) % items.length;
    var el = items[index];
    var caption = el.getAttribute('data-caption') || '';
    img.src = el.getAttribute('href');
    img.alt = caption;
    cap.textContent = caption;
  }

  function open(i) {
    lastFocus = document.activeElement;
    render(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    btnClose.focus();
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') render(index - 1);
    else if (e.key === 'ArrowRight') render(index + 1);
    else if (e.key === 'Tab') {
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  items.forEach(function (el, i) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { render(index - 1); });
  btnNext.addEventListener('click', function () { render(index + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox-figure')) close(); });
})();
