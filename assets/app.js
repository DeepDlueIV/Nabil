/* Progressive enhancement: the entire profile and all technology layers exist in HTML. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const config = JSON.parse($('#site-config').textContent);
  const careers = JSON.parse($('#career-config').textContent);
  const root = document.documentElement;
  root.classList.add('enhanced');

  // Native anchor navigation and an accessible mobile disclosure.
  const menu = $('.menu-toggle');
  const nav = $('#mobile-nav');
  function closeMenu(returnFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.hidden = true;
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.hidden = !open;
  });
  $$('a', nav).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!nav.hidden && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  matchMedia('(min-width:601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // An explicit motion control; reduced-motion always takes precedence.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = $('.motion-toggle');
  let userPaused = false;
  try { userPaused = localStorage.getItem('nabil-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
  const play = '<path d="M7 4l13 8-13 8z"/>';
  const pause = '<path d="M8 5v14M16 5v14"/>';
  function updateMotion() {
    const paused = userPaused || reduced.matches;
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    const text = reduced.matches ? 'Reduced motion is enabled by your system' : paused ? 'Resume animations' : 'Pause animations';
    motionButton.setAttribute('aria-label', text);
    motionButton.title = text;
    motionButton.disabled = reduced.matches;
    $('svg', motionButton).innerHTML = paused ? play : pause;
  }
  motionButton.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('nabil-motion-paused', String(userPaused)); } catch { /* Nonessential preference. */ }
    updateMotion();
  });
  reduced.addEventListener('change', updateMotion);
  updateMotion();

  const art = $('.hero-art');
  if (matchMedia('(pointer:fine)').matches) {
    art.addEventListener('pointermove', event => {
      if (root.classList.contains('motion-paused')) return;
      const box = art.getBoundingClientRect();
      art.style.setProperty('--art-x', `${((event.clientX-box.left)/box.width-.5)*8}px`);
      art.style.setProperty('--art-y', `${((event.clientY-box.top)/box.height-.5)*5}px`);
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--art-x', '0px'); art.style.setProperty('--art-y', '0px');
    });
  }
  let scrollPending = false;
  function drawProgress() {
    const total = root.scrollHeight - innerHeight;
    $('.reading-progress').style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0})`;
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(drawProgress); } }, { passive: true });
  addEventListener('resize', drawProgress, { passive: true });
  drawProgress();
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
    }), { threshold: .08 });
    $$('.section-top, .expertise-intro, .expertise-row, .systems-heading, .experience-heading, .stack-heading, .service').forEach(el => {
      el.classList.add('reveal'); reveals.observe(el);
    });
    const sections = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.desktop-nav a').forEach(link => {
            if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-10% 0px -65% 0px' });
    $$('main section[id]').forEach(section => sections.observe(section));
  }

  // Architecture explorer: schematic descriptions, never fake telemetry.
  let currentScenario = 0;
  const scenarioButtons = $$('[data-scenario]');
  function selectScenario(index) {
    currentScenario = index;
    const scenario = config.scenarios[index];
    scenarioButtons.forEach((button, i) => {
      button.classList.toggle('active', index === i);
      button.setAttribute('aria-pressed', String(index === i));
    });
    $('#scenario-eyebrow').textContent = scenario.eyebrow;
    $('#scenario-headline').textContent = scenario.headline;
    $('#scenario-description').textContent = scenario.description;
    $('#scenario-tags').replaceChildren(...scenario.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    $$('[data-node]').forEach((node, i) => { $('.node-label', node).textContent = scenario.nodes[i].label; node.classList.remove('selected'); });
    $('#node-detail').textContent = 'Select a component to inspect its role.';
  }
  scenarioButtons.forEach((button, i) => button.addEventListener('click', () => selectScenario(i)));
  $$('[data-node]').forEach((button, i) => {
    const inspect = () => {
      $$('[data-node]').forEach(node => node.classList.toggle('selected', node === button));
      $('#node-detail').textContent = config.scenarios[currentScenario].nodes[i].detail;
    };
    button.addEventListener('click', inspect);
    button.addEventListener('focus', inspect);
  });
  function arrowGroup(buttons) {
    buttons.forEach((button, i) => button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length-1;
      if (next !== undefined) { event.preventDefault(); buttons[next].focus(); buttons[next].click(); }
    }));
  }
  arrowGroup(scenarioButtons);

  const image = $('#experience-image');
  image.addEventListener('error', () => { image.style.opacity = '0'; });
  image.addEventListener('load', () => { image.style.opacity = '1'; });
  if (image.complete && image.naturalWidth === 0) image.style.opacity = '0';
  $$('.career-item').forEach((item, i) => item.addEventListener('toggle', () => {
    if (!item.open) return;
    $$('.career-item').forEach(other => { if (other !== item) other.open = false; });
    image.style.opacity = '0';
    image.alt = careers[i].alt;
    image.src = careers[i].image;
    if (image.complete && image.naturalWidth > 0) image.style.opacity = '1';
    $('#image-label').textContent = careers[i].label;
  }));

  const stackButtons = $$('[data-stack]');
  function selectStack(id) {
    stackButtons.forEach(button => { const active = button.dataset.stack === id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $$('.stack-panel').forEach(panel => { panel.hidden = panel.id !== `stack-${id}`; });
  }
  stackButtons.forEach(button => button.addEventListener('click', () => selectStack(button.dataset.stack)));
  arrowGroup(stackButtons);
  selectStack(stackButtons[0].dataset.stack);

  // Native dialog traps focus. Restore the actual triggering control on close.
  const dialog = $('.contact-dialog');
  let contactTrigger = null;
  $$('[data-open-contact]').forEach(button => button.addEventListener('click', () => {
    contactTrigger = button;
    $('#form-status').textContent = '';
    $('#copy-fallback').hidden = true;
    $('#brief-form').elements.engagement.value = button.dataset.subject || 'General architecture discussion';
    dialog.showModal();
    document.body.classList.add('modal-open');
    $('#brief-form').elements.name.focus();
  }));
  $('[data-close-contact]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); contactTrigger?.focus(); });
  for (const field of ['name', 'message']) {
    $('#brief-form').elements[field].addEventListener('input', event => event.target.setCustomValidity(''));
  }
  $('#brief-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    form.elements.name.setCustomValidity(form.elements.name.value.trim() ? '' : 'Please enter your name.');
    form.elements.message.setCustomValidity(form.elements.message.value.trim().length >= 10 ? '' : 'Please describe the challenge in at least 10 characters.');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const brief = `Architecture enquiry\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nEngagement: ${data.get('engagement')}\n\n${data.get('message')}`;
    if (config.email) {
      const subject = encodeURIComponent(`Architecture enquiry: ${data.get('engagement')}`);
      location.href = `mailto:${encodeURIComponent(config.email)}?subject=${subject}&body=${encodeURIComponent(brief)}`;
      $('#form-status').textContent = 'Email draft requested. Review and send it from your email app.';
      return;
    }
    try {
      await navigator.clipboard.writeText(brief);
      $('#form-status').textContent = 'Project brief copied. Nothing has been sent.';
      $('#copy-fallback').hidden = true;
    } catch {
      const fallback = $('#copy-fallback');
      fallback.value = brief; fallback.hidden = false; fallback.focus(); fallback.select();
      $('#form-status').textContent = 'Automatic copying is unavailable. Select and copy the brief below. Nothing has been sent.';
    }
  });
  $$('[data-channel]').forEach(button => button.addEventListener('click', () => {
    const labels = { email:'Email address', github:'GitHub profile', linkedin:'LinkedIn profile' };
    $('.contact-notice').textContent = `${labels[button.dataset.channel]} is not configured yet. The owner can add it in data/profile.mjs.`;
  }));
})();
