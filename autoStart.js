// Клавиши управления: '9' — старт, '8' — стоп
const CHECK_INTERVAL = 5000;
const KEY_START = '9';
const KEY_STOP = '8';

let isActive = false;

window.addEventListener('keydown', (event) => {
  if (event.key === KEY_START && !isActive) {
    isActive = true;
  } else if (event.key === KEY_STOP && isActive) {
    isActive = false;
  }
});

const clickerTimer = setInterval(() => {
  if (!isActive) return;

  const buttons = Array.from(document.querySelectorAll('button'));
  const startButton = buttons.find(btn => btn.textContent.trim().toLowerCase() === 'start');

  if (startButton) {
    startButton.click();
  }
}, CHECK_INTERVAL);