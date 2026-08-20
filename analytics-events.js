(function () {
  'use strict';

  var offerVersion = document.body.dataset.offerVersion || 'unknown';
  var startedForms = new WeakSet();

  function emit(name, details) {
    var event = Object.assign({
      event: name,
      site: 'rpv51-yar.ru',
      offer_version: offerVersion,
      page_path: window.location.pathname
    }, details || {});

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    window.dispatchEvent(new CustomEvent('rpv51:analytics', { detail: event }));
  }

  function trackingDetails(element) {
    return {
      action: element.dataset.track || 'unknown',
      placement: element.dataset.placement || 'unknown'
    };
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-track],a[href^="tel:"],a[href*="yandex.ru/maps"],a[href*="vk.com/rpv51"]');
    if (!target) return;

    var details = trackingDetails(target);
    if (details.action === 'unknown') {
      if (target.matches('a[href^="tel:"]')) details.action = 'phone';
      else if (target.href.includes('yandex.ru/maps')) details.action = 'route';
      else if (target.href.includes('vk.com/rpv51')) details.action = 'vk';
    }
    emit('rpv51_cta_click', details);
  }, true);

  document.addEventListener('focusin', function (event) {
    var form = event.target.closest('form');
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    emit('rpv51_form_start', { form_id: form.id || 'unknown' });
  }, true);

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    emit('rpv51_form_attempt', { form_id: form.id || 'unknown' });
  }, true);
}());
