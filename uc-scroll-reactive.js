/* ==========================================================================
   UC — Scroll-Reactive Preview  (solo Proyecto Tres)
   ──────────────────────────────────────────────────────────────────────────
   Micro-animación en la imagen del preview:
     • Tilt   (rotateZ ±0.6deg)  — proporcional a velocidad de scroll
     • Nudge  (translateY ±6px)  — dirección del scroll
     • Zoom   (scale 1 → 1.02)  — intensidad del scroll
   
   Todo con damping suave: cuando el scroll para, vuelve a reposo (0).
   Hover suma un scale extra (1.02 → 1.04).
   IntersectionObserver pausa RAF cuando la card sale del viewport.
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1. DOM refs
       ------------------------------------------------------------------ */
    var card = document.getElementById('uc-card-4');
    if (!card) return;

    var img = card.querySelector('.uc-img');
    if (!img) return;

    /* ------------------------------------------------------------------
       2. Tunables
       ------------------------------------------------------------------ */

    // Tilt (rotateZ)
    var TILT_FACTOR = 0.6;      // max deg (±)
    var TILT_DAMP   = 0.08;     // lerp factor por frame

    // Nudge (translateY)
    var NUDGE_FACTOR = 6;       // max px (±)
    var NUDGE_DAMP   = 0.08;

    // Zoom (scale)
    var ZOOM_SCROLL  = 0.02;    // extra scale durante scroll (1 → 1.02)
    var ZOOM_HOVER   = 0.04;    // extra scale en hover (1.02 → 1.04 si scrolleando)
    var ZOOM_DAMP    = 0.08;

    // Velocidad de scroll
    var VEL_SMOOTHING = 0.15;   // lerp para suavizar velocity raw

    /* ------------------------------------------------------------------
       3. State
       ------------------------------------------------------------------ */
    var lastScrollY    = window.scrollY;
    var lastScrollTime = performance.now();
    var vSmooth        = 0;       // velocidad normalizada (suavizada)

    // Current interpolated values
    var tilt  = 0;    // deg
    var nudge = 0;    // px
    var zoom  = 0;    // extra scale (0 = sin zoom)

    // Targets
    var tiltTarget  = 0;
    var nudgeTarget = 0;
    var zoomTarget  = 0;

    // Hover
    var isHovered = false;

    // Visibility
    var isVisible = false;
    var animId    = null;

    /* ------------------------------------------------------------------
       4. Helpers
       ------------------------------------------------------------------ */
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    /* ------------------------------------------------------------------
       5. Scroll listener — calcular velocidad
       ------------------------------------------------------------------ */
    function onScroll() {
        var now = performance.now();
        var dt  = (now - lastScrollTime) / 1000;
        if (dt < 0.005) return;  // evitar div/0

        var sy     = window.scrollY;
        var rawVel = (sy - lastScrollY) / dt;

        // Normalizar (~1000px/s = scroll normal → 1.0)
        var normalized = rawVel / 1000;

        // Suavizar
        vSmooth = lerp(vSmooth, normalized, VEL_SMOOTHING);

        lastScrollY    = sy;
        lastScrollTime = now;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ------------------------------------------------------------------
       6. Hover listeners
       ------------------------------------------------------------------ */
    card.addEventListener('mouseenter', function () { isHovered = true; });
    card.addEventListener('mouseleave', function () { isHovered = false; });

    /* ------------------------------------------------------------------
       7. Animation loop
       ------------------------------------------------------------------ */
    function animate() {
        animId = requestAnimationFrame(animate);

        // Decaer velocidad suavizada → 0 cuando no hay scroll
        vSmooth = lerp(vSmooth, 0, TILT_DAMP);

        // Calcular targets
        tiltTarget  = clamp(vSmooth * TILT_FACTOR,  -TILT_FACTOR,  TILT_FACTOR);
        nudgeTarget = clamp(vSmooth * NUDGE_FACTOR, -NUDGE_FACTOR, NUDGE_FACTOR);

        // Zoom: magnitud de velocidad (absoluto)
        var absV = Math.abs(vSmooth);
        var scrollZoom = clamp(absV * ZOOM_SCROLL * 50, 0, ZOOM_SCROLL);  // escalar para que sea visible
        var hoverZoom  = isHovered ? ZOOM_HOVER : 0;
        zoomTarget = scrollZoom + hoverZoom;

        // Interpolar con damping
        tilt  = lerp(tilt,  tiltTarget,  TILT_DAMP);
        nudge = lerp(nudge, nudgeTarget, NUDGE_DAMP);
        zoom  = lerp(zoom,  zoomTarget,  ZOOM_DAMP);

        // Aplicar transform (GPU-friendly, solo transform)
        var s = 1 + zoom;
        img.style.transform =
            'scale(' + s.toFixed(4) + ') ' +
            'translateY(' + nudge.toFixed(2) + 'px) ' +
            'rotate(' + tilt.toFixed(3) + 'deg)';
    }

    /* ------------------------------------------------------------------
       8. IntersectionObserver — pausar cuando no está en viewport
       ------------------------------------------------------------------ */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (!isVisible) {
                    isVisible = true;
                    animate();
                }
            } else {
                isVisible = false;
                if (animId) {
                    cancelAnimationFrame(animId);
                    animId = null;
                }
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '100px'
    });

    observer.observe(card);

})();
