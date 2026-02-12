(function () {
  if (window.self === window.top) {
    var base = window.location.pathname.replace(/\/[^/]+$/, '') || '';
    var indexUrl = (base ? base + '/' : '') + 'index.html?project=project-1.html';
    window.location.replace(indexUrl);
    return;
  }
  if (window.self !== window.top) {
    function closeOverlay(e) {
      e.preventDefault();
      window.parent.postMessage('closeProjectOverlay', '*');
    }
    var closeEl = document.querySelector('.project-close');
    if (closeEl) closeEl.addEventListener('click', closeOverlay);
    var logoEl = document.querySelector('.project-logo');
    if (logoEl) logoEl.addEventListener('click', closeOverlay);
  }

  var images = [
    'assets/portraits/hero.png',
    'assets/portraits/01.png',
    'assets/portraits/02.png',
    'assets/portraits/03.png',
    'assets/portraits/04.png',
    'assets/portraits/05.png',
    'assets/portraits/06.png',
    'assets/portraits/07.png',
    'assets/portraits/08.png',
    'assets/portraits/09.png',
    'assets/portraits/10.png',
    'assets/portraits/11.png',
    'assets/portraits/12.png',
    'assets/portraits/13.png',
    'assets/portraits/14.png',
    'assets/portraits/15.png',
    'assets/portraits/16.png',
    'assets/portraits/17.png',
    'assets/portraits/18.png',
    'assets/portraits/19.png',
    'assets/portraits/20.png',
    'assets/portraits/21.png'
  ];

  var heroImg = document.getElementById('project-hero-img');
  var thumbsStrip = document.getElementById('project-thumbs');
  var thumbsScroll = document.getElementById('project-thumbs-scroll');

  if (!heroImg || !thumbsStrip || !thumbsScroll || !images.length) return;

  var gsap = window.gsap;
  var currentActiveIndex = 0;

  heroImg.style.backgroundImage = "url('" + images[0] + "')";

  images.forEach(function (url, i) {
    var thumb = document.createElement('div');
    thumb.className = 'project-thumb' + (i === 0 ? ' is-active' : '');
    thumb.style.backgroundImage = "url('" + url + "')";
    thumb.setAttribute('role', 'img');
    thumb.setAttribute('aria-label', 'Image ' + (i + 1));
    thumb.setAttribute('data-index', i);
    thumbsStrip.appendChild(thumb);
  });

  var thumbs = thumbsStrip.querySelectorAll('.project-thumb');

  function setActive(index) {
    index = Math.max(0, Math.min(index, images.length - 1));
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;
    thumbs.forEach(function (t, i) {
      t.classList.toggle('is-active', i === index);
    });
    var url = images[index];
    if (gsap) {
      gsap.to(heroImg, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.inOut',
        onComplete: function () {
          heroImg.style.backgroundImage = "url('" + url + "')";
          gsap.to(heroImg, { opacity: 1, duration: 0.25, ease: 'power2.inOut' });
        }
      });
    } else {
      heroImg.style.backgroundImage = "url('" + url + "')";
    }
  }

  var mediaQuery = window.matchMedia('(max-width: 900px)');

  function getObserverOptions() {
    var isHorizontal = mediaQuery.matches;
    return {
      root: thumbsScroll,
      threshold: 0.5,
      rootMargin: isHorizontal ? '0% -45% 0% -45%' : '-45% 0% -45% 0%'
    };
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = parseInt(entry.target.getAttribute('data-index'), 10);
        if (!isNaN(index)) setActive(index);
      });
    },
    getObserverOptions()
  );

  thumbs.forEach(function (t) {
    observer.observe(t);
  });

  mediaQuery.addEventListener('change', function () {
    observer.disconnect();
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(index)) setActive(index);
        });
      },
      getObserverOptions()
    );
    thumbs.forEach(function (t) {
      observer.observe(t);
    });
  });

  var useLenis = window.Lenis && thumbsScroll && thumbsStrip && !mediaQuery.matches;
  if (useLenis) {
    var lenis = new window.Lenis({
      wrapper: thumbsScroll,
      content: thumbsStrip,
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
})();
