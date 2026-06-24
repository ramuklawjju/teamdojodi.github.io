/*
 * forms.js — accessible client-side validation for the contact, sign-in and
 * sign-up forms. This is a static demo with no backend, so a valid submit
 * shows a confirmation message instead of sending data anywhere.
 *
 * Validation runs on blur (once a field has been touched) and again on submit.
 * Errors are announced via aria-describedby / aria-live for screen readers.
 */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function label(field) {
    return field.getAttribute('data-label') || 'This field';
  }

  function validateField(field) {
    var value = field.value.trim();
    var msg = '';

    if (field.hasAttribute('required') && !value) {
      msg = label(field) + ' is required.';
    } else if (value && field.type === 'email' && !EMAIL_RE.test(value)) {
      msg = 'Please enter a valid email address.';
    } else if (value && field.getAttribute('data-match')) {
      var other = document.getElementById(field.getAttribute('data-match'));
      if (other && other.value !== value) msg = 'Passwords do not match.';
    } else if (value && field.hasAttribute('minlength') && value.length < +field.getAttribute('minlength')) {
      msg = label(field) + ' must be at least ' + field.getAttribute('minlength') + ' characters.';
    } else if (value && field.hasAttribute('pattern') &&
               !new RegExp('^(?:' + field.getAttribute('pattern') + ')$').test(value)) {
      msg = field.getAttribute('data-error') || 'Please match the requested format.';
    }

    setFieldState(field, msg);
    return !msg;
  }

  function setFieldState(field, msg) {
    var holder = field.closest('.form-floating') || field.parentNode;
    var err = holder.querySelector('.form-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-error';
      err.id = (field.id || field.name) + '-error';
      err.setAttribute('aria-live', 'polite');
      holder.appendChild(err);
    }
    if (msg) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', err.id);
      err.textContent = msg;
    } else {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      err.textContent = '';
    }
  }

  function showSuccess(form) {
    var box = document.createElement('div');
    box.className = 'form-success';
    box.setAttribute('role', 'status');
    box.setAttribute('tabindex', '-1');
    box.innerHTML =
      '<i class="bi-check-circle-fill" aria-hidden="true"></i>' +
      '<div><strong>' + (form.getAttribute('data-success-title') || 'Thank you!') + '</strong>' +
      '<p class="mb-0">' + (form.getAttribute('data-success-message') ||
        'We have received your details and will be in touch shortly.') + '</p></div>';
    form.replaceWith(box);
    box.focus();
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      // Re-validate as the user types, but only after the first error appears.
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (field) { if (!validateField(field)) valid = false; });
      if (!valid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      showSuccess(form);
    });
  });
})();
