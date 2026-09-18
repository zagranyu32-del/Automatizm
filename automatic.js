// ==UserScript==
// @name Voice Audit Auto-Pilot (Flexible Selector)
// @description Auto decision bot with DOM text parsing
// @version 3.2.0
// @match https://global-oss-sg.uhgzgnb.com/*
// @grant none
// ==/UserScript==

(function () {
'use strict';

let isRunning = false;
let isProcessing = false;

// 1. Визуальный индикатор
const statusWidget = document.createElement('div');
statusWidget.style.cssText = `
  position: fixed; top: 10px; right: 10px; z-index: 99999;
  padding: 8px 14px; border-radius: 6px; font-weight: bold;
  font-family: sans-serif; font-size: 13px; color: #fff;
  background: #ff4d4f; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;
statusWidget.innerText = 'AUTOPILOT: OFF (Press * to START)';
document.body.appendChild(statusWidget);

function updateStatusUI() {
  if (isRunning) {
    statusWidget.style.background = '#52c41a';
    statusWidget.innerText = 'AUTOPILOT: ON (Press / to STOP)';
  } else {
    statusWidget.style.background = '#ff4d4f';
    statusWidget.innerText = 'AUTOPILOT: OFF (Press * to START)';
  }
}

// 2. Методы кликов
function confirmOK() {
  setTimeout(() => {
    const elements = document.querySelectorAll('.ant-btn-primary');
    elements.forEach(el => {
      if (el.textContent.trim() === "OK") {
        el.click();
      }
    });
  }, 900);
}

function iIgnor() {
  const btn = document.querySelector('.one-line-btn');
  if (btn) {
    btn.click();
  }
  confirmOK();
}

function BanOther() {
  const buttons = document.querySelectorAll('.mb10');
  if (buttons[12]) {
    buttons[12].click();
  }
  confirmOK();
}

// 3. Гибкое извлечение значений
function extractValue(labelPattern) {
  // Находим элемент, содержащий метку (например "User Country")
  const elements = Array.from(document.querySelectorAll('*')).filter(el => 
    el.children.length === 0 && labelPattern.test(el.textContent)
  );

  for (const el of elements) {
    // 1. Проверяем сам элемент и его родителя
    const parentText = el.parentElement ? el.parentElement.innerText : '';
    const match = parentText.match(new RegExp(labelPattern.source + `\\s*[:\\s]?\\s*([A-Za-z]+)`, 'i'));
    if (match && match[1]) return match[1].toUpperCase();

    // 2. Если значение лежит в соседнем теге (nextElementSibling)
    if (el.nextElementSibling) {
      const nextText = el.nextElementSibling.innerText.trim();
      const codeMatch = nextText.match(/^([A-Za-z]+)/);
      if (codeMatch) return codeMatch[1].toUpperCase();
    }
  }

  // 3. Запасной вариант: регулярный поиск по всему дженерейту страницы
  const fullText = document.body.innerText || "";
  const fallbackMatch = fullText.match(new RegExp(labelPattern.source + `[\\s\\S]{0,30}?([A-Z]{2,3})`, 'i'));
  return fallbackMatch ? fallbackMatch[1].toUpperCase() : null;
}

function getPageData() {
  const bodyText = document.body.innerText || "";
  const hasHighRisk = bodyText.toLowerCase().includes('high risk content');

  const country = extractValue(/User\s*Country/i);
  const language = extractValue(/Language\s*Code/i);

  return { hasHighRisk, country, language };
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 4. Логика принятия решений
async function evaluateRules() {
  if (!isRunning || isProcessing) return;
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  const data = getPageData();

  if (data.hasHighRisk) {
    return;
  }

  if (!data.country || !data.language) {
    return;
  }

  isProcessing = true;

  const randomDelay = Math.floor(Math.random() * (7500 - 5500 + 1)) + 5500;
  await sleep(randomDelay);

  if (!isRunning) {
    isProcessing = false;
    return;
  }

  const validCountries = ['RU', 'UZ'];
  const validLanguages = ['RU', 'UZ'];

  if (validCountries.includes(data.country)) {
    if (validLanguages.includes(data.language)) {
      iIgnor();
    } else {
      BanOther();
    }
  } else {
    BanOther();
  }

  await sleep(5000);
  isProcessing = false;
}

// 5. Горячие клавиши
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  if (e.key === '*') {
    isRunning = true;
    updateStatusUI();
  } else if (e.key === '/') {
    isRunning = false;
    updateStatusUI();
  }
});

setInterval(evaluateRules, 2500);

})();