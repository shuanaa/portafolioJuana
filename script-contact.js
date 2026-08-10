/* ── CTA section: fade-up on scroll ──── */
(function () {
  'use strict';

  var ctaElements = document.querySelectorAll('.cta-impact, .cta-card');
  if (ctaElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('cta--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    ctaElements.forEach(function (el) {
      el.classList.add('cta--hidden');
      observer.observe(el);
    });
  }
})();
