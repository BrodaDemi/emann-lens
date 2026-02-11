(function () {
  /* When embedded in overlay iframe, Close and logo should tell parent to close overlay */
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

  var projects = [
    { category: 'Interior', images: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80&fit=crop'
    ]},
    { category: 'Portrait', images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop'
    ]},
    { category: 'Street', images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop'
    ]},
    { category: 'Landscape', images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=80&fit=crop'
    ]},
    { category: 'Portrait', images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop'
    ]},
    { category: 'Editorial', images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop'
    ]},
    { category: 'Portrait', images: [
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop'
    ]},
    { category: 'Street', images: [
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop'
    ]},
    { category: 'Landscape', images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&fit=crop'
    ]},
    { category: 'Portrait', images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1cbe2659293?w=1200&q=80&fit=crop'
    ]},
    { category: 'Editorial', images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&fit=crop'
    ]},
    { category: 'Street', images: [
      'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&fit=crop'
    ]}
  ];

  var params = new URLSearchParams(window.location.search);
  var index = Math.max(0, Math.min(parseInt(params.get('p'), 10) - 1, projects.length - 1));
  if (isNaN(index) || index < 0) index = 0;
  var project = projects[index];

  var heroImg = document.getElementById('project-hero-img');
  var thumbsStrip = document.getElementById('project-thumbs');
  var thumbsScroll = document.getElementById('project-thumbs-scroll');

  if (!heroImg || !thumbsStrip || !thumbsScroll || !project.images.length) return;

  var images = project.images;
  var gsap = window.gsap;
  var currentActiveIndex = 0;

  heroImg.style.backgroundImage = "url('" + images[0] + "')";

  project.images.forEach(function (url, i) {
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

  var observerOptions = {
    root: thumbsScroll,
    threshold: 0.5,
    rootMargin: '-45% 0% -45% 0%'
  };

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = parseInt(entry.target.getAttribute('data-index'), 10);
        if (!isNaN(index)) setActive(index);
      });
    },
    observerOptions
  );

  thumbs.forEach(function (t) {
    observer.observe(t);
  });

  if (window.Lenis && thumbsScroll && thumbsStrip) {
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
