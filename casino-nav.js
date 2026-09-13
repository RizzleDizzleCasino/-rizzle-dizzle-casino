(() => {
  const lobby = document.getElementById('casinoLobby');
  const menus = [...document.querySelectorAll('.game-menu')];
  const views = [...document.querySelectorAll('.game-view')];

  function hideAll() {
    lobby.hidden = true;
    menus.forEach(menu => { menu.hidden = true; });
    views.forEach(view => { view.hidden = true; });
  }

  function show(element) {
    hideAll();
    element.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-open-menu]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.openMenu);
      if (target) show(target);
    });
  });

  document.querySelectorAll('[data-open-view]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.openView);
      if (target) show(target);
    }, true);
  });

  document.querySelectorAll('.modern-game-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = document.getElementById('modernSlots');
      if (target) show(target);
    }, true);
  });

  document.querySelectorAll('.back-lobby').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.machine,.modern-slots,.blackjack,.table-game');
      if (parent && (parent.id === 'classicReels' || parent.id === 'modernSlots')) {
        show(document.getElementById('pokiesMenu'));
      } else if (parent && ['blackjack','rouletteGame','highLowGame'].includes(parent.id)) {
        show(document.getElementById('tablesMenu'));
      } else {
        show(lobby);
      }
    });
  });
})();
