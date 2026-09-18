(function () {
    let isRunning = false;
    let timerId = null;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Настоящий эмулятор клика мыши
    async function forceClick(element) {
        if (!element) return false;
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
        await sleep(250);
        return true;
    }

    // Поиск и клик по тексту
    async function clickByText(text, parent = document) {
        const elements = Array.from(parent.querySelectorAll('button, div, span, label, a, input, p'));
        const target = elements.reverse().find(el => {
            const elText = (el.innerText || el.textContent || '').trim().toLowerCase();
            return elText === text.toLowerCase() || elText.includes(text.toLowerCase());
        });

        if (target) {
            return await forceClick(target);
        }
        return false;
    }

    // Нормализация текста для защиты от обфускации
    function normalizeText(text) {
        return text
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[@$1!|i]/g, 'l')
            .replace(/[^a-z0-9]/g, '');
    }

    // ОБРАБОТЧИК МОДАЛЬНЫХ ОКОН (Гарантированное нажатие синей кнопки OK)
    async function handleModal(subCategoryText) {
        await sleep(400); // Ожидаем появления диалога

        // Ищем открытый Element UI диалог
        const dialogs = Array.from(document.querySelectorAll('.el-dialog, .el-message-box, div[role="dialog"]'));
        const activeDialog = dialogs.find(d => d.offsetWidth > 0 && d.offsetHeight > 0) || document;

        // Если передана подкатегория — выбираем её
        if (subCategoryText) {
            await clickByText(subCategoryText, activeDialog);
            await sleep(300);
        }

        // ТОЧНЫЙ ПОИСК СИНЕЙ КНОПКИ "OK" (Element UI Primary Button)
        let okBtn = activeDialog.querySelector('button.el-button--primary');

        if (!okBtn) {
            // Резервный поиск кнопки OK внутри активного диалогового окна
            const dialogButtons = Array.from(activeDialog.querySelectorAll('button, span'));
            okBtn = dialogButtons.reverse().find(el => {
                const txt = (el.innerText || el.textContent || '').trim().toUpperCase();
                return txt === 'OK';
            });
        }

        if (okBtn) {
            await forceClick(okBtn);
        } else {
            await clickByText('OK', activeDialog);
        }

        await sleep(600); // Ждем исчезновения окна
    }

    // Обработка верхней строки
    async function processTopRowOnly() {
        if (!isRunning) return;

        const table = document.querySelector('table, .el-table');
        if (!table) return;

        // Определяем индексы колонок
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim().toLowerCase());
        const countryIdx = headers.findIndex(h => h.includes('country')) + 1;
        const contentIdx = headers.findIndex(h => h.includes('content')) + 1;
        const opreateIdx = headers.findIndex(h => h.includes('opreate') || h.includes('operate')) + 1;

        const topRow = table.querySelector('tbody tr, .el-table__row');
        if (!topRow) return;

        const countryCell = topRow.querySelector(`td:nth-child(${countryIdx > 0 ? countryIdx : 4})`);
        const contentCell = topRow.querySelector(`td:nth-child(${contentIdx > 0 ? contentIdx : 5})`);
        const opreateArea = topRow.querySelector(`td:nth-child(${opreateIdx > 0 ? opreateIdx : 6})`) || topRow;

        if (!countryCell || !contentCell) return;

        const countryCode = countryCell.innerText.trim().toUpperCase();
        const rawContentText = contentCell.innerText;
        const contentText = rawContentText.toLowerCase();

        if (!countryCode && !contentText) return;

        const allowedCountries = ['UZ', 'RU', 'TM'];
        const profanityList = ['sik', 'macy', 'am', 'sikim', 'kunt', 'jelep', 'fuck', 'moterfucker', 'секс', 'сука','Залупа', 'Пиздализ', 'Хуесос', 'Хуйсос', 'Сиськи', 'Хуй', 'писюн', 'Жопа', 'попа', 'Ебашь', 'Ебанёт', 'Хуеешь', 'Ёб твою', 'Ёбырь', 'Ёбанный в рот', 'рот ебал', 'Сука', 'Сучка', 'Гавнюк', 'Заебал', 'Далбаеб', 'Гандон', 'Сирота', 'Потаскуха', 'Проститутка', 'путана', 'Шлюха', 'Ублюдок', 'Уёбок', 'Уёбище', 'Ебан', 'Ебанутый', 'Пидараз', 'пидор', 'Ахуел', 'ахуели', 'Иди Нахер', 'Иди Нахуй', 'Выебу', 'Канжик', 'Ташок', 'Етим', 'Етимни боласи', 'Кўт', 'Хует килопти', 'Хует кма', 'Эмчак', 'Ам', 'ом', 'Кутоқ', 'Жалап', 'джаляп', 'Онангни сикай', 'Оғзингга сикай', 'Амингга сикай', 'Сиквординг', 'Сиквордин', 'Кўтингни қис', 'Кўтингни қисиб юр', 'Кўтингни йиртвораман', 'Ам чикти', 'Сикаман', 'Фохша', 'Онени ами', 'Хароми', 'Харом', 'Харомзада', 'Жалаб', 'Хурлаб зурлаб siкаман','bitch', 'bitches', 'bitching', 'bastard', 'cunt','cock', 'cocksucker', 'faggot', 'fag', 'whore', 'slut','twat', 'prick', 'wanker', 'clit', 'boobs', 'tits', 'titties', 'tosser', 'scumbag', 'douche', 'douchebag', 'jackass', 'arse', 'arsehole', 'dipshit', 'dumbass'];
        const adultChatList = ['sex','🔞', '18+', 'seks', 'sekis','fuck', 'dick', 'pussy','cеkc', 'cэкc', 'сеkс', 'cеx', 'сeкc', 'cёkc','s.e.x.', 's*x', 'с*кс', 'с_е_к_с', 'с-е-к-с','porno', 'порно', 'п0рн0', 'p0rn','porn'];
        const sexyVariations = ['sexy', 'sexi', 'seksi', 'sex video', 'sexy video', 'sexy photo', 'sex photo'];

        // 1. СТРАНА не UZ, RU, TM -> Other language -> OK
        if (countryCode && !allowedCountries.includes(countryCode)) {
            if (await clickByText('Other language', opreateArea)) {
                await handleModal();
            }
            return;
        }

        // 2. Fraud / Infringement
        const isDirectMerchant = /\b(seller|reseller|merchant|merch|diller|diler)\b/i.test(contentText);
        const cleanContent = normalizeText(rawContentText);
        const fraudKeywords = ['dseller', 'dreseller', 'dmerchant', 'ddiller', 'ddiler', 'dmdagency', 'dagency', 'd@gency'];
        const isObfuscatedMerchant = fraudKeywords.some(keyword => cleanContent.includes(keyword));

        if (isDirectMerchant || isObfuscatedMerchant) {
            if (await clickByText('Fraud/Infringement', opreateArea)) {
                await handleModal('Pretending official');
            }
            return;
        }

        // 3. МАТ -> Abusing/Threatening -> Severe Abuse -> OK
        const hasProfanity = profanityList.some(word => 
            new RegExp(`\\b${word}\\b`, 'i').test(contentText)
        );

        if (hasProfanity) {
            if (await clickByText('Abusing/Threatening', opreateArea)) {
                await handleModal('Severe Abuse');
            }
            return;
        }

        // 4. SEXY + Media -> Pornography -> Sexual Innuendo -> OK
        const hasSexyWord = sexyVariations.some(w => contentText.includes(w));
        const hasMediaWord = contentText.includes('video') || contentText.includes('photo');
        if (hasSexyWord && hasMediaWord) {
            if (await clickByText('Pornography', opreateArea)) {
                await handleModal('Sexual Innuendo');
            }
            return;
        }

        // 5. Sexual Chat -> Pornography -> Sexual Chat -> OK
        const hasAdultChatContent = adultChatList.some(item => contentText.includes(item));
        if (hasAdultChatContent) {
            if (await clickByText('Pornography', opreateArea)) {
                await handleModal('Sexual Chat');
            }
            return;
        }

        // 6. ПРИВАТНЫЕ ДАННЫЕ (10+ цифр подряд) -> Private Information -> Contact info -> OK
        const hasPrivateInfo = /\d{10,}/.test(contentText);
        if (hasPrivateInfo) {
            if (await clickByText('Private Information', opreateArea)) {
                await handleModal('Contact info');
            }
            return;
        }

        // 7. НОМЕР + ВАТСАП -> Private Information -> Personal info -> OK
        const hasDigits = /\d{10,}/.test(contentText);
        const whatsappRegex = /wh?at?s?app|вац?апи?|ватцапи?|вацапп|ватсапп|watsap|vacap/i;
        const hasWhatsapp = whatsappRegex.test(contentText);

        if (hasDigits && hasWhatsapp) {
            if (await clickByText('Private Information', opreateArea)) {
                await handleModal('Personal info');
            }
            return;
        }



        // 6. ИГНОРИРОВАНИЕ -> Ignore -> OK
        if (await clickByText('Ignore', opreateArea)) {
            await handleModal(); // Обязательный клик по синей OK
        }
    }

    // Управление
    function startAutoRunner() {
        if (isRunning) return;
        isRunning = true;
        
        timerId = setInterval(async () => {
            if (isRunning) await processTopRowOnly();
        }, 2500);
    }

    function stopAutoRunner() {
        isRunning = false;
        if (timerId) clearInterval(timerId);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === '*' || e.code === 'NumpadMultiply') startAutoRunner();
        if (e.key === '/' || e.code === 'NumpadDivide') stopAutoRunner();
    });

})();