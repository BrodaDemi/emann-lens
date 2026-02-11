(function () {
  var loadingScreen = document.getElementById('loading-screen');
  var mainPage = document.getElementById('main-page');
  if (!loadingScreen || !mainPage) return;

  var savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  var content = loadingScreen.querySelector('.loading-screen__content');
  var durationMs = 4300;

  function showMainPage() {
    if (content) content.classList.add('slide-away');
    loadingScreen.classList.add('is-done');
    mainPage.classList.add('is-visible');
    mainPage.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('loaderSeen', '1');
  }

  var navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
  var isReload = (navEntries && navEntries[0] && navEntries[0].type === 'reload') ||
    (performance.navigation && performance.navigation.type === 1);
  var skipLoader = !isReload && sessionStorage.getItem('loaderSeen');

  if (skipLoader) {
    loadingScreen.classList.add('is-done');
    mainPage.classList.add('is-visible');
    mainPage.setAttribute('aria-hidden', 'false');
  } else {
    setTimeout(showMainPage, durationMs);
  }

  function setActiveNavLink() {
    var hash = window.location.hash || '#work';
    var navLinks = document.querySelectorAll('.main-nav__link');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === hash);
    });
  }
  setActiveNavLink();
  window.addEventListener('hashchange', setActiveNavLink);

  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    function updateAria() {
      var theme = document.documentElement.getAttribute('data-theme') || 'dark';
      themeToggle.setAttribute('aria-checked', theme === 'dark');
    }
    updateAria();
    themeToggle.addEventListener('click', function () {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateAria();
    });
  }

  var cells = document.querySelectorAll('.portfolio-cell');
  var offsetX = 16;
  var offsetY = 8;
  var rippleTurb = document.getElementById('image-ripple-turb');
  var rippleSeed = 0;
  var rippleRaf = null;
  var hoveredCount = 0;

  function runImageRipple() {
    if (!rippleTurb || hoveredCount === 0) return;
    rippleSeed = (rippleSeed + 1.1) % 100;
    rippleTurb.setAttribute('seed', rippleSeed);
    rippleRaf = requestAnimationFrame(runImageRipple);
  }

  /* Project slide-up transition: intercept project links and open in overlay */
  var projectOverlay = null;

  function openProjectOverlay(url) {
    if (projectOverlay) return;
    projectOverlay = document.createElement('div');
    projectOverlay.className = 'project-overlay';
    projectOverlay.setAttribute('role', 'dialog');
    projectOverlay.setAttribute('aria-modal', 'true');
    projectOverlay.setAttribute('aria-label', 'Project');
    var backdrop = document.createElement('div');
    backdrop.className = 'project-overlay__backdrop';
    projectOverlay.appendChild(backdrop);
    var panel = document.createElement('div');
    panel.className = 'project-overlay__panel';
    var iframe = document.createElement('iframe');
    iframe.title = 'Project';
    iframe.className = 'project-overlay__iframe';
    panel.appendChild(iframe);
    projectOverlay.appendChild(panel);
    document.body.appendChild(projectOverlay);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        projectOverlay.classList.add('is-visible');
      });
    });
    iframe.src = url;
  }

  function closeProjectOverlay() {
    if (!projectOverlay) return;
    var mainPage = document.getElementById('main-page');
    var reveal = document.createElement('div');
    reveal.className = 'project-overlay__reveal';
    if (mainPage) {
      var clone = mainPage.cloneNode(true);
      clone.id = '';
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('is-visible', 'project-overlay__reveal-content');
      reveal.appendChild(clone);
    }
    projectOverlay.appendChild(reveal);
    reveal.offsetHeight;
    requestAnimationFrame(function () {
      projectOverlay.classList.add('is-closing');
    });
    function removeOverlay(e) {
      if (e && e.propertyName && e.propertyName !== 'transform') return;
      reveal.removeEventListener('transitionend', removeOverlay);
      if (projectOverlay && projectOverlay.parentNode) {
        projectOverlay.parentNode.removeChild(projectOverlay);
      }
      projectOverlay = null;
    }
    reveal.addEventListener('transitionend', removeOverlay);
  }

  window.addEventListener('message', function (e) {
    if (e.data === 'closeProjectOverlay') closeProjectOverlay();
  });

  /* Contact overlay: open from nav link, close with button or backdrop */
  var contactOverlay = document.getElementById('contact-overlay');
  var contactCloseBtn = contactOverlay && contactOverlay.querySelector('.contact-overlay__close');
  var contactBackdrop = contactOverlay && contactOverlay.querySelector('.contact-overlay__backdrop');

  function openContactOverlay() {
    if (!contactOverlay) return;
    contactOverlay.setAttribute('aria-hidden', 'false');
    contactOverlay.offsetHeight;
    requestAnimationFrame(function () {
      contactOverlay.classList.add('is-visible');
    });
    window.location.hash = '#contact';
  }

  function closeContactOverlay() {
    if (!contactOverlay) return;
    contactOverlay.classList.remove('is-visible');
    contactOverlay.setAttribute('aria-hidden', 'true');
    window.location.hash = '#work';
  }

  document.querySelectorAll('.main-nav__link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === '#contact') {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openContactOverlay();
      });
    }
  });

  if (contactCloseBtn) contactCloseBtn.addEventListener('click', closeContactOverlay);
  if (contactBackdrop) contactBackdrop.addEventListener('click', closeContactOverlay);

  var contactForm = contactOverlay && contactOverlay.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      /* TODO: send form (e.g. to Formspree or your backend) */
    });
  }

  cells.forEach(function (cell) {
    var link = cell.getAttribute('href') || '';
    if (link.indexOf('project.html') !== -1) {
      cell.addEventListener('click', function (e) {
        e.preventDefault();
        openProjectOverlay(link);
      });
    }
    var title = cell.querySelector('.portfolio-cell__title');
    var ripple = cell.querySelector('.portfolio-cell__ripple');
    if (!title) return;
    cell.addEventListener('mouseenter', function () {
      title.classList.add('is-visible');
      hoveredCount++;
      if (hoveredCount === 1 && rippleRaf === null) rippleRaf = requestAnimationFrame(runImageRipple);
    });
    cell.addEventListener('mousemove', function (e) {
      var rect = cell.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      title.style.left = (x + offsetX) + 'px';
      title.style.top = (y + offsetY) + 'px';
      if (ripple) {
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
      }
    });
    cell.addEventListener('mouseleave', function () {
      title.classList.remove('is-visible');
      hoveredCount--;
      if (hoveredCount <= 0) {
        hoveredCount = 0;
        if (rippleRaf !== null) cancelAnimationFrame(rippleRaf);
        rippleRaf = null;
      }
    });
  });

})();
