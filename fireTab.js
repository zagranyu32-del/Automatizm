// ==UserScript==
// @name Voice Audit Keyboard Shortcuts
// @description Keyboard shortcuts for play audio, ignore, and other language buttons + forward/backward
// @version 1.1.1
// @match https://global-oss-sg.uhgzgnb.com/*
// @grant none
// ==/UserScript==

(function () {
'use strict';

function clickByText(tag, text) {
const elements = [...document.querySelectorAll(tag)];
const el = elements.find(e => e.innerText.trim() === text);
if (el) el.click();
}

function playPauseAudio() {
const playBtn = document.querySelector(
'.custom-audio-wrap .anticon-caret-right, .custom-audio-wrap .anticon-pause'
);
if (playBtn) playBtn.closest('a')?.click();
}

function clickForward() {
const forwardBtn = document.querySelector('.btn-forward');
if (forwardBtn) forwardBtn.click();
}

function clickBackward() {
const backwardBtn = document.querySelector('.btn-backward');
if (backwardBtn) backwardBtn.click();
}

document.addEventListener('keydown', (e) => {
if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

switch (e.key) {
case '+':
e.preventDefault();
playPauseAudio();
break;
case '.':
e.preventDefault();
clickByText('button span', 'ignore');
break;
case '0':
e.preventDefault();
clickByText('button span', 'Other Language(E)');
break;
case '1':
e.preventDefault();
clickBackward();
break;
case '3':
e.preventDefault();
clickForward();
break;
}
});
})();