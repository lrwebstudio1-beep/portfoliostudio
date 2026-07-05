(() => {
  const pages = { home: document.getElementById('page-home'), work: document.getElementById('page-work'), services: document.getElementById('page-services'), contact: document.getElementById('page-contact') };
  const navBtns = { work: document.getElementById('navWork'), services: document.getElementById('navServices'), contact: document.getElementById('navContact') };
  const wipe = document.getElementById('wipe');

  let view = 'home';
  let busy = false;
  let io = null;

  function setNavActive() {
    Object.keys(navBtns).forEach(k => {
      navBtns[k].className = 'nl' + (view === k ? ' act' : '');
    });
  }

  function observeSection(name) {
    requestAnimationFrame(() => {
      if (!io) {
        io = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        }), { threshold: 0.12 });
      }
      pages[name].querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
    });
  }

  function goTo(v) {
    if (busy || v === view) return;
    busy = true;
    wipe.className = 'wipe on';
    setTimeout(() => {
      window.scrollTo(0, 0);
      pages[view].hidden = true;
      pages[v].querySelectorAll('.rv').forEach(el => el.classList.remove('in'));
      pages[v].hidden = false;
      view = v;
      setNavActive();
      wipe.className = 'wipe out';
      observeSection(view);
      bindMagnetic();
      setTimeout(() => { wipe.className = 'wipe'; busy = false; }, 650);
    }, 480);
  }

  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.view));
  });
  document.getElementById('navBrand').addEventListener('click', () => goTo('home'));

  // mobile burger menu
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  function closeMnav() {
    mnav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('noscroll');
  }
  function openMnav() {
    mnav.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('noscroll');
  }
  burger.addEventListener('click', () => { mnav.classList.contains('open') ? closeMnav() : openMnav(); });
  mnav.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', closeMnav));
  addEventListener('resize', () => { if (innerWidth > 900) closeMnav(); });

  function bindMagnetic() {
    document.querySelectorAll('.mag').forEach(el => {
      if (el._m) return;
      el._m = true;
      el.addEventListener('mousemove', e => {
        const b = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - b.left - b.width / 2) * 0.32) + 'px,' + ((e.clientY - b.top - b.height / 2) * 0.32) + 'px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 460);
      });
    });
  }

  // preloader
  const preEl = document.getElementById('pre');
  const pctEl = document.getElementById('pct');
  let n = 0;
  const preIv = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 7));
    pctEl.innerHTML = n + '<span class="acc">%</span>';
    if (n >= 100) {
      clearInterval(preIv);
      setTimeout(() => preEl.classList.add('done'), 150);
      setTimeout(() => { preEl.style.display = 'none'; }, 900);
    }
  }, 26);

  // live clock
  const clk = document.getElementById('clk');
  setInterval(() => {
    clk.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Skopje', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
  }, 1000);

  // click anywhere in a work row to reveal its screenshot inline, right in the row
  function closeRowimg(el) {
    el.style.height = el.scrollHeight + 'px';
    el.classList.remove('in');
    requestAnimationFrame(() => { el.style.height = '0px'; });
    setTimeout(() => el.remove(), 500);
  }
  document.querySelectorAll('.prow').forEach(row => {
    row.addEventListener('click', () => {
      const open = row.querySelector('.rowimg');
      if (open) { closeRowimg(open); return; }
      document.querySelectorAll('.rowimg').forEach(closeRowimg);
      const wrap = document.createElement('div');
      wrap.className = 'rowimg';
      const img = document.createElement('img');
      img.src = row.dataset.img;
      img.alt = row.dataset.ph || '';
      img.loading = 'lazy';
      wrap.appendChild(img);
      row.appendChild(wrap);
      const target = wrap.scrollHeight;
      requestAnimationFrame(() => {
        wrap.style.height = target + 'px';
        wrap.classList.add('in');
      });
    });
  });

  // custom cursor (desktop only)
  const cur = document.getElementById('cur');
  if (cur && matchMedia('(pointer:fine)').matches) {
    document.body.classList.add('hascur');
    addEventListener('mousemove', e => { cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; });
    document.addEventListener('mouseover', e => {
      cur.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,[data-h],.card,.prow,.trow')));
    });
  }

  // copy email
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard && navigator.clipboard.writeText('lrwebstudio1@gmail.com');
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => { copyBtn.textContent = 'Copy email ⧉'; }, 1600);
  });

  // cross-page transition (e.g. footer link to privacy.html)
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const href = el.getAttribute('href');
      wipe.className = 'wipe on';
      setTimeout(() => { window.location.href = href; }, 480);
    });
  });

  setNavActive();
  observeSection('home');
  bindMagnetic();
})();
