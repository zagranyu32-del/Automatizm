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

document.addEventListener('keydown', (e) => {
if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

switch (e.key) {
case '.':
    e.preventDefault();
    clickByText('button span', 'Pornography')
    setTimeout(() => {
        clickByText('button span', 'Moaning (B)')
    }, 300)
break;

case '0':
    e.preventDefault();
    clickByText('button span', 'Abusing/Threatening');
    setTimeout(() => {
        clickByText('button span', 'Severe Abuse(C)');
    }, 300);
break;

case '1':
e.preventDefault();
clickByText('button span', 'ignore')
break;

case '2':
e.preventDefault();
clickByText('button span', 'Other Language(E)')
break;0

case '3':
e.preventDefault();
clickByText('button span', 'Pornography')
setTimeout(() =>{
    clickByText('button span', 'Sexual Chat (B)')
},300);
break;

}
});
})();