// авто паниш
// Клавиши управления: ']' — старт, '[' — стоп
const CHECK_INTERVAL = 5000;
const KEY_START = ']';
const KEY_STOP = '[';

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
  const startButton = buttons.find(btn => btn.textContent.trim().toLowerCase() === 'Punish');

  if (startButton) {
    startButton.click();
  }
}, CHECK_INTERVAL);