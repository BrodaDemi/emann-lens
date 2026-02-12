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
    var absoluteUrl = new URL(url, window.location.href).href;
    var sep = absoluteUrl.indexOf('?') >= 0 ? '&' : '?';
    absoluteUrl = absoluteUrl + sep + '_=' + Date.now();
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
    projectOverlay.offsetHeight;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        projectOverlay.classList.add('is-visible');
      });
    });
    iframe.src = absoluteUrl;
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
      clearTimeout(removeOverlayFallback);
      if (projectOverlay && projectOverlay.parentNode) {
        projectOverlay.parentNode.removeChild(projectOverlay);
      }
      projectOverlay = null;
    }
    reveal.addEventListener('transitionend', removeOverlay);
    var removeOverlayFallback = setTimeout(removeOverlay.bind(null, { propertyName: 'transform' }), 2000);
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
    var col = contactOverlay.querySelector('.contact-form-col');
    var fb = contactOverlay.querySelector('#contact-feedback');
    var form = contactOverlay.querySelector('.contact-form');
    if (col) col.classList.remove('is-success');
    if (fb) fb.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
    contactOverlay.setAttribute('aria-hidden', 'false');
    contactOverlay.offsetHeight;
    requestAnimationFrame(function () {
      contactOverlay.classList.add('is-visible');
    });
    window.location.hash = '#contact';
  }

  function closeContactOverlay() {
    if (!contactOverlay) return;
    var mainPage = document.getElementById('main-page');
    var reveal = document.createElement('div');
    reveal.className = 'contact-overlay__reveal';
    if (mainPage) {
      var clone = mainPage.cloneNode(true);
      clone.id = '';
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('is-visible', 'contact-overlay__reveal-content');
      reveal.appendChild(clone);
    }
    contactOverlay.appendChild(reveal);
    reveal.offsetHeight;
    requestAnimationFrame(function () {
      contactOverlay.classList.add('is-closing');
    });
    function onRevealDone(e) {
      if (e && e.propertyName && e.propertyName !== 'transform') return;
      reveal.removeEventListener('transitionend', onRevealDone);
      if (reveal.parentNode) reveal.parentNode.removeChild(reveal);
      contactOverlay.classList.remove('is-closing');
      contactOverlay.classList.remove('is-visible');
      contactOverlay.setAttribute('aria-hidden', 'true');
      window.location.hash = '#work';
    }
    reveal.addEventListener('transitionend', onRevealDone);
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
  var contactFormCol = contactOverlay && contactOverlay.querySelector('.contact-form-col');
  var contactFeedback = contactOverlay && contactOverlay.querySelector('#contact-feedback');
  /* Replace YOUR_FORM_ID with your Formspree form ID from https://formspree.io (after creating a form for emannlens@gmail.com) */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  if (contactForm && contactFormCol && contactFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            contactForm.reset();
            contactFormCol.classList.add('is-success');
            contactFeedback.setAttribute('aria-hidden', 'false');
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (contactFeedback) {
            var msg = contactFeedback.querySelector('.contact-feedback__message');
            if (msg) msg.textContent = 'Something went wrong. Please try again or email emannlens@gmail.com directly.';
            contactFormCol.classList.add('is-success');
            contactFeedback.setAttribute('aria-hidden', 'false');
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        });
    });
  }

  cells.forEach(function (cell) {
    var link = cell.getAttribute('href') || '';
    if (link.indexOf('project.html') !== -1 || link.indexOf('project-1.html') !== -1 || link.indexOf('project-2.html') !== -1 || link.indexOf('project-3.html') !== -1 || link.indexOf('project-4.html') !== -1) {
      cell.addEventListener('click', function (e) {
        e.preventDefault();
        if (link.indexOf('project-1.html') === -1 && link.indexOf('project-2.html') === -1 && link.indexOf('project-3.html') === -1 && link.indexOf('project-4.html') === -1) {
          var match = link.match(/[?&]p=(\d+)/);
          var p = match ? parseInt(match[1], 10) : 1;
          try { sessionStorage.setItem('projectIndex', String(Math.max(0, p - 1))); } catch (err) {}
        }
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
