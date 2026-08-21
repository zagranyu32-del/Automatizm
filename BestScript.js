// ==========================================
  // НАСТРОЙКА ГОРЯЧИХ КЛАВИШ (ПОДДЕРЖКА ПОДКАТЕГОРИЙ)
  // ==========================================
  const HOTKEYS_MAP = {
    // Двухшаговые кнопки (Массив: ['Категория', 'Подкатегория'])
    '1': ['Abusing', 'Severe Abuse'],  // Нажмет Abusing -> затем Severe Abuse
    '2': ['Abusing', 'Mild Abuse'],    // Нажмет Abusing -> затем Mild Abuse
    
    // Одиночные кнопки (Обычная строка)
    '3': 'Noise&Cacaphony',
    '4': 'Ignore',
    '5': 'Other Language'
  };

  // Мгновенный клик (с поддержкой цепочек категорий и подкатегорий)
  function clickButtonImmediately(target) {
    // Если передана цепочка из двух кнопок (массив)
    if (Array.isArray(target)) {
      const [parentText, childText] = target;
      
      // Шаг 1: Нажимаем родительскую категорию (например, Abusing)
      const parentClicked = clickSingleElement(parentText);
      
      if (parentClicked) {
        // Шаг 2: Ждём 250 мс, пока сайт покажет подкатегории, и кликаем нужную
        setTimeout(() => {
          clickSingleElement(childText);
        }, 250);
      }
    } else {
      // Обычный одиночный клик
      clickSingleElement(target);
    }
  }

  // Вспомогательная функция поиска и клика по одной кнопке
  function clickSingleElement(targetText) {
    const elements = document.querySelectorAll('button, .btn, .ant-btn, a, [role="button"], div, span');
    for (const el of elements) {
      const text = (el.textContent || el.innerText || '').trim().toLowerCase();
      if (text.includes(targetText.toLowerCase())) {
        triggerHumanClick(el);
        console.log(`%c[AutoQA] Нажато: "${el.textContent.trim()}"`, 'color: #ff00ff; font-weight: bold;');
        return true;
      }
    }
    console.warn(`[AutoQA] Кнопка "${targetText}" не найдена на странице.`);
    return false;
  }