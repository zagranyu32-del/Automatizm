(function () {
  'use strict';

  // Карта клавиш и прямых путей (и текстов) для cs2.uz
  const NAVIGATION_MAP = {
    '1': { text: 'Reyting', path: '/leaderboard' },
    '2': { text: "Do'kon", path: '/store' },
    '3': { text: 'Skinlar', path: '/skins' }
  };

  function navigateTo(target) {
    // 1. Ищем ссылку <a> в меню по её тексту
    const links = document.querySelectorAll('a');
    
    for (const link of links) {
      const text = (link.textContent || link.innerText || '').trim().toLowerCase();
      const cleanTargetText = target.text.replace(/['`’]/g, '').toLowerCase();
      const cleanLinkText = text.replace(/['`’]/g, '');

      if (cleanLinkText.includes(cleanTargetText)) {
        console.log(`%c[Testing] Найдена ссылка: "${text}". Переходим...`, 'color: #00ff00; font-weight: bold;');
        
        // Кликаем по ссылке
        link.click();
        
        // Резервный переход, если клик не сработал из-за SPA-роутера
        if (link.href) {
          setTimeout(() => {
            window.location.href = link.href;
          }, 100);
        }
        return true;
      }
    }

    // 2. Если по тексту не нашли, переходим прямо по URL-адресу
    console.warn(`[Testing] Ссылка с текстом "${target.text}" не найдена. Переход по прямому пути: ${target.path}`);
    window.location.href = window.location.origin + target.path;
  }

  // Слушатель клавиш 1, 2, 3
  document.addEventListener('keydown', (event) => {
    // Не срабатывает, если вы печатаете в поиске или чате
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement.isContentEditable) {
      return;
    }

    const key = event.key;

    if (NAVIGATION_MAP[key]) {
      const target = NAVIGATION_MAP[key];
      console.log(`[Testing] Нажата клавиша [${key}] -> Навигация в "${target.text}"`);
      navigateTo(target);
    }
  });

  console.log('%c[TestingScript] Запущен для cs2.uz!', 'color: #ffff00; font-weight: bold;');
  console.log('[TestingScript] Нажмите: 1 = Reyting, 2 = Do\'kon, 3 = Skinlar');
})();