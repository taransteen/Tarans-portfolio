/* Rolig parallax og innfading. Slås av ved "redusert bevegelse". */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var root = document.documentElement;
  root.classList.add('motion');

  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('main');
    if (!main) return;

    /* 1. Innfading: hver seksjon som inneholder et bilde */
    var targets = [];
    Array.prototype.forEach.call(main.children, function (el) {
      if (el.querySelector && el.querySelector('img') && !el.classList.contains('site-header')) {
        el.classList.add('reveal');
        targets.push(el);
      }
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(function (t) { io.observe(t); });
    } else {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
    }

    /* Sikkerhetsnett: aldri la innhold bli skjult */
    setTimeout(function () {
      targets.forEach(function (t) {
        var r = t.getBoundingClientRect();
        if (r.top < window.innerHeight) t.classList.add('is-visible');
      });
    }, 1800);

    /* 2. Parallax: bildet beveger seg litt langsommere enn siden */
    var imgs = Array.prototype.slice.call(main.querySelectorAll('.band:not(.still) img'));
    var items = imgs.map(function (img) {
      var wrap = document.createElement('div');
      wrap.className = 'parallax';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      return { wrap: wrap, img: img };
    });

    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.wrap.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2); /* -1 .. 1 */
        p = Math.max(-1, Math.min(1, p));
        it.img.style.transform = 'translate3d(0,' + (-p * r.height * 0.05).toFixed(1) + 'px,0) scale(1.12)';
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', update);
    update();
  });
})();

/* E-post: adressen står ikke i klartekst i HTML-en, men settes sammen når siden åpnes */
(function () {
  function setup() {
    var links = document.querySelectorAll('a[data-mail-u]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      a.href = 'mailto:' + a.getAttribute('data-mail-u') + '@' + a.getAttribute('data-mail-d');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
