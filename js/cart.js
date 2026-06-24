/*
 * cart.js — product/service detail page.
 * Wires the quantity selector to a live price total, and fills the cart modal
 * with the service, quantity and total that were actually selected.
 * Demo only: there is no real cart or checkout backend.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-product]');
  if (!root) return;

  var unitPrice = parseFloat(root.getAttribute('data-price')) || 0;
  var productName = root.getAttribute('data-product');
  var qtySelect = document.getElementById('product-qty');
  var lineTotalEl = document.querySelector('[data-line-total]');

  function currency(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function quantity() {
    return Math.max(1, parseInt(qtySelect && qtySelect.value, 10) || 1);
  }

  function refreshLineTotal() {
    if (lineTotalEl) lineTotalEl.textContent = currency(unitPrice * quantity());
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  // Keep the visible total in sync with the chosen quantity.
  if (qtySelect) qtySelect.addEventListener('change', refreshLineTotal);
  refreshLineTotal();

  // Populate the cart modal from the current selection when "Add to cart" runs.
  var addBtn = document.querySelector('[data-add-to-cart]');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var qty = quantity();
      setText('[data-cart-name]', productName);
      setText('[data-cart-price]', currency(unitPrice));
      setText('[data-cart-qty]', String(qty));
      setText('[data-cart-total]', currency(unitPrice * qty));
    });
  }
})();
