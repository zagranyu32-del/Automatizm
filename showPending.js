(function() {
    'use strict';

    // ===== НАСТРОЙКИ =====
    const INTERVAL_MS = 35000;          // 45 секунд
    const BUTTON_SELECTOR = 'span.count'; // селектор кнопки
    const READ_DELAY_MS = 2000;          // пауза после клика перед чтением (2 сек)
    // =====================

    // 1. Контейнер для больших цифр
    const display = document.createElement('div');
    display.id = 'my-big-counter';
    display.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.85);
        color: #F6343E;
        font-size: 48px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        pointer-events: none;
        user-select: none;
    `;
    display.textContent = '...';
    document.body.appendChild(display);

    // 2. Чтение цифр
    function readCounter() {
        const el = document.querySelector(BUTTON_SELECTOR);
        if (el) {
            const text = el.textContent.trim();
            display.textContent = text;
        } else {
        }
    }

    // 3. Полноценный клик (mousedown + mouseup + click)
    function clickButton() {
        const el = document.querySelector(BUTTON_SELECTOR);
        if (!el) {
            return;
        }

        // Пробуем кликнуть по родителю-ссылке/кнопке, если есть
        const target = el.closest('a, button, [role="button"]') || el;

        // Эмулируем все события мыши
        const opts = { bubbles: true, cancelable: true, view: window };
        target.dispatchEvent(new MouseEvent('mousedown', opts));
        target.dispatchEvent(new MouseEvent('mouseup', opts));
        target.dispatchEvent(new MouseEvent('click', opts));

        // На всякий случай — обычный click()
        if (typeof target.click === 'function') target.click();

    }

    // 4. Цикл: клик → пауза → чтение
    function tick() {
        clickButton();
        setTimeout(readCounter, READ_DELAY_MS);
    }

    // 5. Запуск
    tick();
    setInterval(tick, INTERVAL_MS);
})();