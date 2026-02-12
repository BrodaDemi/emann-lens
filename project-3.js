(function () {
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
    'assets/star/hero.png',
    'assets/star/01.png',
    'assets/star/02.png',
    'assets/star/03.png',
    'assets/star/04.png',
    'assets/star/05.png',
    'assets/star/06.png',
    'assets/star/07.png',
    'assets/star/08.png',
    'assets/star/09.png',
    'assets/star/10.png',
    'assets/star/11.png',
    'assets/star/12.png',
    'assets/star/13.png',
    'assets/star/14.png',
    'assets/star/15.png'
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
