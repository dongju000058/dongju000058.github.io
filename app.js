(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const category = button.dataset.filter;
    let count = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = `${button.textContent.trim()}: ${count}개의 프로젝트`;
  }));

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activateTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !selected;
        if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
      }
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });

  const film = document.querySelector('#kirby-film');
  if (film) {
    const chapters = [...document.querySelectorAll('[data-seek]')];
    const jump = async button => {
      const time = Number(button.dataset.seek);
      try {
        if (film.readyState < 1) {
          film.load();
          await new Promise((resolve, reject) => {
            film.addEventListener('loadedmetadata', resolve, {once:true});
            film.addEventListener('error', reject, {once:true});
          });
        }
        film.currentTime = Math.min(time, film.duration || time);
        await film.play();
      } catch {
        document.querySelector('#film-status').textContent = '영상의 재생 버튼을 눌러 감상해 주세요.';
      }
    };
    chapters.forEach(button => button.addEventListener('click', () => jump(button)));
    film.addEventListener('timeupdate', () => {
      const current = [...chapters].reverse().find(button => film.currentTime >= Number(button.dataset.seek));
      chapters.forEach(button => {
        button.classList.toggle('is-active', button === current);
        button.setAttribute('aria-pressed', String(button === current));
      });
    });
  }
})();
