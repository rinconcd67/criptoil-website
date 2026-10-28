/* CRIPTOIL: menú móvil, recuerdo de idioma, mapa de hubs y selector de la mesa comercial */
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // idioma elegido: lo recuerda la raíz del sitio
    var lang = document.querySelector('a.lang');
    if (lang) lang.addEventListener('click', function () {
      try { localStorage.setItem('criptoil-lang', lang.getAttribute('hreflang')); } catch (e) {}
    });

    // menú móvil
    var mb = document.getElementById('menuBtn'), nav = document.getElementById('mainNav');
    if (mb && nav) mb.addEventListener('click', function () {
      nav.classList.toggle('open');
      mb.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    // mapa: pulsar un punto abre su ficha en la lista
    var pins = document.querySelectorAll('.hubmap .pin');
    function openHub(id, scroll) {
      document.querySelectorAll('.hub').forEach(function (d) { d.open = (d.id === 'hub-' + id); });
      pins.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-hub') === id); });
      var d = document.getElementById('hub-' + id);
      if (d && scroll) d.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    pins.forEach(function (p) {
      p.addEventListener('click', function (e) { e.preventDefault(); openHub(p.getAttribute('data-hub'), true); });
    });
    document.querySelectorAll('.hub').forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) openHub(d.id.replace('hub-', ''), false); });
    });

    // mesa comercial: pestañas A y B (sin JS se ven las dos)
    var tabs = document.querySelectorAll('.selector [role="tab"]');
    function select(id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('aria-controls') === id;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
    if (tabs.length) {
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t.getAttribute('aria-controls')); });
        t.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          select(n.getAttribute('aria-controls')); n.focus(); e.preventDefault();
        });
      });
      select(location.hash === '#projects' ? 'projects' : 'commodities');
    }
  });
})();
