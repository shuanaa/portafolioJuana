/* Nav Center Visibility Controller — only visible in hero section */
(function () {
    'use strict';

    var navCenter = document.querySelector('.nav__center');
    var hero = document.querySelector('.hero');

    if (!navCenter || !hero) return;

    navCenter.style.transition = 'opacity 0.4s ease';

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        var heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight - 100) {
            navCenter.style.opacity = '1';
        } else {
            navCenter.style.opacity = '0';
        }
    }

    window.addEventListener('scroll', onScroll);
})();
