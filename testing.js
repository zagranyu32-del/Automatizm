(function () {
  'use strict';

  // Сопоставление клавиш и текста на кнопках
  const HOTKEYS_MAP = {
    '1': 'Reyting',
    '2': "Do'kon",
    '3': 'Skinlar'
  };

  // Эмуляция естественного человеческого клика
  function triggerHumanClick(element) {
    if (!element) return;

    const mouseOptions = { bubbles: true, cancelable: true, view: window };

    element.dispatchEvent(new MouseEvent('pointerdown', mouseOptions));
    element.dispatchEvent(new MouseEvent('mousedown', mouseOptions));
    element.dispatchEvent(new MouseEvent('pointerup', mouseOptions));
    element.dispatchEvent(new MouseEvent('mouseup', mouseOptions));
    element.dispatchEvent(new MouseEvent('click', mouseOptions));

    element.click(); // Резервный вызов
  }

  // Поиск кнопки по части текста и клик
  function clickButtonByText(targetText) {
    const elements = document.querySelectorAll('button, .btn, .ant-btn, a, [role="button"], div, span');
    
    for (const el of elements) {
      const text = (el.textContent || el.innerText || '').trim().toLowerCase();
      
      // includes позволяет находить кнопки, даже если в них есть лишние пробелы или спецсимволы
      if (text.includes(targetText.toLowerCase())) {
        triggerHumanClick(el);
        console.log(`%c[TestingScript] Нажата кнопка: "${el.textContent.trim()}"`, 'color: #00ff00; font-weight: bold;');
        return true;
      }
    }
    
    console.warn(`[TestingScript] Кнопка с текстом "${targetText}" не найдена на странице.`);
    return false;
  }

  // Слушатель нажатий клавиатуры
  document.addEventListener('keydown', (event) => {
    // Не срабатывает, если вы печатаете текст в поле ввода
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement.isContentEditable) {
      return;
    }

    const key = event.key;

    if (HOTKEYS_MAP[key]) {
      const buttonText = HOTKEYS_MAP[key];
      console.log(`[TestingScript] Нажата [${key}] -> Нажимаем "${buttonText}"`);
      clickButtonByText(buttonText);
    }
  });

  console.log('%c[TestingScript] Успешно запущен!', 'color: #ffff00; font-weight: bold;');
  console.log('[TestingScript] Назначения: 1 = Reyting, 2 = Do\'kon, 3 = Skinlar');
})();