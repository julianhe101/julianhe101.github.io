// Serenius Butterfly non-invasive enhancements.
(function () {
  const subtitleText = "幸好，我依旧为生活的小事雀跃";
  const subtitleTyping = true;
  const musicEnable = true;
  const runtimeEnable = true;
  const runtimePublishDate = "4/6/2026 00:00:00";

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some((script) => script.src === src)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadCss(href) {
    if ([...document.styleSheets].some((sheet) => sheet.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function addHeaderWave() {
    const header = document.getElementById('page-header');
    if (!true || !header || header.classList.contains('full_page') || header.querySelector('.seren-header-wave')) return;
    const wave = document.createElement('div');
    wave.className = 'seren-header-wave';
    wave.innerHTML = '<svg class="seren-wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none"><defs><path id="seren-gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"></path></defs><g class="seren-wave-layers"><use href="#seren-gentle-wave" x="48" y="0"></use><use href="#seren-gentle-wave" x="48" y="3"></use><use href="#seren-gentle-wave" x="48" y="5"></use><use href="#seren-gentle-wave" x="48" y="7"></use></g></svg>';
    header.appendChild(wave);
  }

  async function ensureSubtitleTyping() {
    if (!subtitleTyping || !subtitleText) return;
    const target = document.getElementById('subtitle');
    if (!target) return;
    try {
      if (window.typed && typeof window.typed.destroy === 'function') window.typed.destroy();
      if (typeof window.Typed !== 'function') await loadScript('https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js');
      if (typeof window.Typed === 'function') {
        target.textContent = '';
        window.typed = new window.Typed('#subtitle', {
          strings: subtitleText.split('\n').filter(Boolean),
          startDelay: 260,
          typeSpeed: 86,
          backSpeed: 42,
          backDelay: 1600,
          loop: true
        });
      }
    } catch {
      target.textContent = subtitleText.split('\n')[0] || subtitleText;
    }
  }

  async function ensureMetingPlayer() {
    if (!musicEnable || (!document.querySelector('meting-js') && !document.querySelector('.aplayer[data-id]'))) return;
    window.setTimeout(async () => {
      if (window.aplayers && window.aplayers.length) return;
      try {
        loadCss('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css');
        if (typeof window.APlayer !== 'function') await loadScript('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js');
        if (typeof window.loadMeting !== 'function') await loadScript('https://cdn.jsdelivr.net/npm/butterfly-extsrc@1.1.6/metingjs/dist/Meting.min.js');
        if (typeof window.loadMeting !== 'function') await loadScript('https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js');
        if (typeof window.loadMeting === 'function') window.loadMeting();
      } catch {}
    }, 1400);
  }

  function formatRuntime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
  }

  function ensureRuntime() {
    if (!runtimeEnable || !runtimePublishDate) return;
    const footer = document.querySelector('#footer .footer-copyright') || document.querySelector('#footer');
    if (!footer) return;
    let target = footer.querySelector('.seren-runtime');
    if (!target) {
      target = document.createElement('span');
      target.className = 'seren-runtime';
      footer.appendChild(target);
    }
    const startedAt = new Date(runtimePublishDate.replace(/-/g, '/')).getTime();
    if (!Number.isFinite(startedAt)) return;
    const render = () => {
      target.textContent = `已运行 ${formatRuntime(Date.now() - startedAt)}`;
    };
    render();
    if (!window.serenRuntimeTimer) window.serenRuntimeTimer = window.setInterval(render, 1000);
  }

  function runEnhancements() {
    addHeaderWave();
    ensureSubtitleTyping();
    ensureMetingPlayer();
    ensureRuntime();
  }

  document.addEventListener('DOMContentLoaded', runEnhancements);
  document.addEventListener('pjax:complete', runEnhancements);
  window.setTimeout(runEnhancements, 900);
})();
