/* ==========================================================================
   Hero Scroll Interaction (Vanilla JS)
   Scroll-driven: left word moves left, right word moves right, dash expands via scaleX.
   Per-char hover handled by CSS only.
   ========================================================================== */

(function () {
    'use strict';

    var hero      = document.querySelector('.hero');
    var dash      = document.querySelector('.hero__dash');
    var wordLeft  = document.querySelector('.hero__word--left');
    var wordRight = document.querySelector('.hero__word--right');

    if (!hero || !dash || !wordLeft || !wordRight) return;

    function getCSSVar(name) {
        return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    var ticking = false;

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    function update() {
        ticking = false;
        var heroH = hero.offsetHeight;
        var scrollY = window.scrollY || window.pageYOffset;
        var raw = clamp(scrollY / heroH, 0, 1);
        var progress = easeOutCubic(raw);

        var offsetMax  = getCSSVar('--word-offset-max');
        var scaleMax   = getCSSVar('--dash-scale-max');

        var offset = progress * offsetMax;
        wordLeft.style.transform  = 'translateX(' + (-offset) + 'px)';
        wordRight.style.transform = 'translateX(' + (offset) + 'px)';
        dash.style.transform      = 'scaleX(' + (1 + progress * (scaleMax - 1)) + ')';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

})();

/* ==========================================================================
   Signature SVG — measure each path and set stroke-dasharray/offset
   ========================================================================== */
(function () {
    'use strict';

    var paths = document.querySelectorAll('.sig-path');
    if (!paths.length) return;

    paths.forEach(function (path) {
        var len = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.setProperty('--path-len', len);
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

})();

/* ==========================================================================
   Terminal Scramble / Decode Reveal  +  Scroll Reveal  +  Signature Trigger
   ========================================================================== */
(function () {
    'use strict';

    /* ---- Tunables ---- */
    var SCRAMBLE_DURATION = 2000;  /* ms per line                           */
    var LINE_STAGGER     = 150;   /* ms between consecutive lines          */
    var SCRAMBLE_WIDTH   = 3;     /* chars of "noise zone" ahead of cursor */
    var SIG_DELAY        = 300;   /* ms after last line → signature fires  */
    var SCRAMBLE_CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789░▒▓@#$*';

    /* ---- 1. Fill every .term-text with X placeholders on load ---- */
    var allTexts = document.querySelectorAll('.term-text');
    allTexts.forEach(function (el) {
        var final = el.getAttribute('data-final') || '';
        el.textContent = new Array(final.length + 1).join('X');
    });

    /* ---- 2. Scramble algorithm (left-to-right decode) ---- */
    function scrambleReveal(element, duration, callback) {
        var finalText = element.getAttribute('data-final') || '';
        var len       = finalText.length;
        if (!len) { if (callback) callback(); return; }

        var totalSteps = len + SCRAMBLE_WIDTH;
        var startTime  = performance.now();

        function tick(now) {
            var elapsed     = now - startTime;
            var progress    = Math.min(elapsed / duration, 1);
            var revealIndex = Math.floor(progress * totalSteps);
            var result      = '';

            for (var i = 0; i < len; i++) {
                if (i < revealIndex - SCRAMBLE_WIDTH) {
                    /* fully decoded */
                    result += finalText[i];
                } else if (finalText[i] === ' ') {
                    result += ' ';
                } else if (i < revealIndex) {
                    /* noise zone */
                    result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                } else {
                    /* still placeholder */
                    result += 'X';
                }
            }

            element.textContent = result;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = finalText;
                element.classList.add('revealed');
                if (callback) callback();
            }
        }

        requestAnimationFrame(tick);
    }

    /* ---- 3. Kick off the full terminal reveal sequence for one card ---- */
    function startTerminalReveal(card) {
        var lines     = card.querySelectorAll('.term-text');
        var icons     = card.querySelectorAll('.term-icon');
        var lastIndex = lines.length - 1;

        lines.forEach(function (line, i) {
            setTimeout(function () {
                /* fade in the icon */
                if (icons[i]) icons[i].classList.add('revealed');

                /* scramble the text */
                scrambleReveal(line, SCRAMBLE_DURATION, function () {
                    /* after the LAST line finishes → trigger signature */
                    if (i === lastIndex) {
                        setTimeout(function () {
                            card.classList.add('sig-animate');
                        }, SIG_DELAY);
                    }
                });
            }, i * LINE_STAGGER);
        });
    }

    /* ---- 4. IntersectionObserver: card reveal + scramble trigger ---- */
    var cards = document.querySelectorAll('.reveal-card');
    if (!cards.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                startTerminalReveal(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    cards.forEach(function (card) {
        observer.observe(card);
    });

})();



