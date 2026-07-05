(() => {
  const wipe = document.getElementById('wipe');
  const clk = document.getElementById('clk');

  setInterval(() => {
    clk.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Skopje', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
  }, 1000);

  // reveal the page (uncover) right after load
  requestAnimationFrame(() => {
    wipe.className = 'wipe out';
    setTimeout(() => { wipe.className = 'wipe'; }, 650);
  });

  // cover the page before navigating away
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const href = el.getAttribute('href');
      wipe.className = 'wipe on';
      setTimeout(() => { window.location.href = href; }, 480);
    });
  });

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
  addEventListener('resize', () => { if (innerWidth > 900) closeMnav(); });
})();
