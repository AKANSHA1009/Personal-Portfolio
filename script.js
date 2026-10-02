/* Shared preferences and progressive enhancement */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  root.classList.add('js');
  document.querySelector('#year').textContent = new Date().getFullYear();

  /* Theme: first-paint selection is in the document head */
  const themeButton = document.querySelector('#theme-toggle');
  let explicitTheme = false;
  try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme')); } catch {}
  function updateThemeButton() {
    const label = `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`;
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  }
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitTheme = true;
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
    updateThemeButton();
  });
  systemTheme.addEventListener('change', event => {
    if (!explicitTheme) { root.dataset.theme = event.matches ? 'dark' : 'light'; updateThemeButton(); }
  });

  /* Mobile menu: keyboard, outside click, and breakpoint handling */
  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#nav-links');
  function setMenu(open) {
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.title = open ? 'Close navigation' : 'Open navigation';
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
    setMenu(false);
    if (wasOpen) {
      const section = document.querySelector(link.getAttribute('href'));
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.nav')) setMenu(false); });
  matchMedia('(min-width: 960px)').addEventListener('change', () => setMenu(false));

  /* Scroll reveals: observe once; never hide focused content */
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('reveal-ready');
      revealObserver.observe(element);
      element.addEventListener('focusin', () => element.classList.add('is-visible'));
    });
  }

  /* Active section and scroll progress: one update per frame */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...navigation.querySelectorAll('a')];
  const progress = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  let scrollQueued = false;
  function updateScroll() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    backToTop.hidden = scrollY < 650;
    const offset = document.querySelector('.site-header').offsetHeight + 100;
    const visibleSections = sections.filter(section => section.offsetParent !== null);
    let activeId = visibleSections.length ? visibleSections[0].id : '';
    visibleSections.forEach(section => { if (section.getBoundingClientRect().top <= offset) activeId = section.id; });
    if (distance > 0 && scrollY >= distance - 5) activeId = 'contact';
    navLinks.forEach(link => {
      if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  function queueScroll() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  /* Work / Life view toggle: swap professional and personal content */
  const viewButtons = [...document.querySelectorAll('[data-view-btn]')];
  const revealIn = scope => scope.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  function countUp(element) {
    const target = Number(element.dataset.count) || 0;
    if (reducedMotion.matches) { element.textContent = String(target); return; }
    const start = performance.now();
    (function step(now) {
      const progressValue = Math.min(1, (now - start) / 1200);
      element.textContent = String(Math.round(target * (1 - Math.pow(1 - progressValue, 3))));
      if (progressValue < 1) requestAnimationFrame(step);
    })(start);
  }
  let countsDone = false;
  function runCounts() { if (!countsDone) { document.querySelectorAll('[data-count]').forEach(countUp); countsDone = true; } }
  function setView(view, userInitiated) {
    root.dataset.view = view;
    try { localStorage.setItem('portfolio-view', view); } catch {}
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewBtn === view)));
    setMenu(false);
    document.querySelectorAll(view === 'personal' ? '.personal-only' : '.professional-only').forEach(revealIn);
    if (view === 'personal') runCounts();
    if (userInitiated) scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    queueScroll();
  }
  viewButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.viewBtn === root.dataset.view));
    button.addEventListener('click', () => setView(button.dataset.viewBtn, true));
  });
  if (root.dataset.view === 'personal') { document.querySelectorAll('.personal-only').forEach(revealIn); runCounts(); }
  backToTop.addEventListener('click', event => { event.preventDefault(); scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }); });

  /* Filters: honest empty states and announced result counts */
  function setupFilter(buttonAttribute, itemAttribute, statusSelector, emptySelector) {
    const buttons = [...document.querySelectorAll(`[${buttonAttribute}]`)];
    const items = [...document.querySelectorAll(`[${itemAttribute}]`)];
    buttons.forEach(button => button.addEventListener('click', () => {
      const filter = button.getAttribute(buttonAttribute);
      let count = 0;
      buttons.forEach(sibling => {
        const active = sibling === button;
        sibling.classList.toggle('active', active);
        sibling.setAttribute('aria-pressed', String(active));
      });
      items.forEach(item => {
        const show = filter === 'all' || item.getAttribute(itemAttribute) === filter;
        item.hidden = !show;
        item.classList.remove('filter-enter');
        if (show) {
          count++;
          item.classList.add('is-visible');
          if (!reducedMotion.matches) { void item.offsetWidth; item.classList.add('filter-enter'); }
        }
      });
      document.querySelector(statusSelector).textContent = `${count} ${itemAttribute === 'data-skill' ? 'skill groups' : 'projects'} shown: ${button.textContent}.`;
      if (emptySelector) document.querySelector(emptySelector).hidden = count !== 0;
      queueScroll();
    }));
  }
  setupFilter('data-project-filter', 'data-project', '#project-status', '#project-empty');

  /* Contact: compose a mailto draft, without pretending it was sent */
  const contactForm = document.querySelector('#contact-form');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const fields = new FormData(contactForm);
    const name = String(fields.get('name')).trim();
    const email = String(fields.get('email')).trim();
    const message = String(fields.get('message')).trim();
    if (!name || !message) {
      document.querySelector('#form-status').textContent = 'Please enter your name and a message, not just spaces.';
      return;
    }
    const body = `Name: ${name}\nReply to: ${email}\n\n${message}`;
    const draft = `mailto:akanshasharma9710@gmail.com?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#form-status').textContent = 'Email draft requested. Send it in your email app; if no app opens, use the email link alongside this form.';
    location.href = draft;
  });

  /* Focus typing: learning qualifiers remain visible and in accessible copy */
  const focusText = document.querySelector('#typed-focus');
  const focusWords = ['Test Automation', 'AI-Assisted Testing', 'Testing AI Features', 'Quality at Scale'];
  let wordIndex = 0;
  let characterIndex = focusWords[0].length;
  let deleting = true;
  let typingTimer;
  function typeFocus() {
    if (document.hidden || reducedMotion.matches) return;
    const word = focusWords[wordIndex];
    characterIndex += deleting ? -1 : 1;
    focusText.textContent = word.slice(0, Math.max(0, characterIndex));
    let delay = deleting ? 35 : 65;
    if (deleting && characterIndex <= 0) { deleting = false; wordIndex = (wordIndex + 1) % focusWords.length; delay = 250; }
    else if (!deleting && characterIndex >= word.length) { deleting = true; delay = 2300; }
    typingTimer = setTimeout(typeFocus, delay);
  }
  function syncTyping() {
    clearTimeout(typingTimer);
    if (reducedMotion.matches) { focusText.textContent = 'Test Automation · AI-integrated testing'; return; }
    if (!document.hidden) typingTimer = setTimeout(typeFocus, 2300);
  }
  document.addEventListener('visibilitychange', syncTyping);
  reducedMotion.addEventListener('change', syncTyping);
  syncTyping();

  /* Low-intensity network: DPR-capped, hero-only, visibility-aware */
  const canvas = document.querySelector('#network');
  const context = canvas.getContext('2d');
  if (!context) return;
  const hero = document.querySelector('.hero');
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  let heroVisible = true;
  let points = [];
  function resizeCanvas() {
    width = hero.clientWidth; height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({ length: width < 600 ? 16 : 30 }, () => ({ x: Math.random() * width, y: Math.random() * height, velocityX: (Math.random() - .5) * .18, velocityY: (Math.random() - .5) * .18 }));
  }
  function drawNetwork(timestamp) {
    animationFrame = 0;
    if (document.hidden || reducedMotion.matches || !heroVisible) return;
    if (timestamp - lastFrame >= 33) {
      const elapsed = Math.min((timestamp - lastFrame) / 33, 2);
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);
      const color = getComputedStyle(root).getPropertyValue('--accent').trim();
      context.fillStyle = color; context.strokeStyle = color;
      points.forEach((point, index) => {
        point.x += point.velocityX * elapsed; point.y += point.velocityY * elapsed;
        if (point.x < 0 || point.x > width) point.velocityX *= -1;
        if (point.y < 0 || point.y > height) point.velocityY *= -1;
        context.globalAlpha = .3;
        context.beginPath(); context.arc(point.x, point.y, 1.4, 0, Math.PI * 2); context.fill();
        for (let next = index + 1; next < points.length; next++) {
          const neighbor = points[next];
          const distance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y);
          if (distance < 140) {
            context.globalAlpha = (1 - distance / 140) * .14;
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(neighbor.x, neighbor.y); context.stroke();
          }
        }
      });
      context.globalAlpha = 1;
    }
    animationFrame = requestAnimationFrame(drawNetwork);
  }
  function syncNetwork() {
    cancelAnimationFrame(animationFrame); animationFrame = 0;
    if (!document.hidden && !reducedMotion.matches && heroVisible) { lastFrame = 0; animationFrame = requestAnimationFrame(drawNetwork); }
    else context.clearRect(0, 0, width, height);
  }
  resizeCanvas();
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(hero);
  else addEventListener('resize', resizeCanvas, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; syncNetwork(); }).observe(hero);
  document.addEventListener('visibilitychange', syncNetwork);
  reducedMotion.addEventListener('change', syncNetwork);
  syncNetwork();
})();