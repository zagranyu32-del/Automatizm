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
        await sleep(300);
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
            await sleep(300);
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

    // БЕЗОПАСНЫЙ ПОИСК СЛОВ (Исключает баны за подстроки вроде massage, musika, class)
    function containsExactWord(text, wordList) {
        return wordList.some(word => {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Проверяет, что вокруг слова НЕТ других букв или цифр
            const regex = new RegExp(`(?:^|[^a-zA-Z0-9а-яА-ЯёЁўЎқҚғҒҳҲäçžýñöüşÄÇŽÝÑÖÜŞ])${escaped}(?:$|[^a-zA-Z0-9а-яА-ЯёЁўЎқҚғҒҳҲäçžýñöüşÄÇŽÝÑÖÜŞ])`, 'i');
            return regex.test(text);
        });
    }

    // ОПРЕДЕЛЕНИЕ ПРИНАДЛЕЖНОСТИ ТЕКСТА К НАШИМ ЯЗЫКАМ (RU, UZ, TM, EN)
    function isOurLanguage(rawText) {
        const text = rawText.trim();
        if (!text) return true;

        // 1. Кириллица
        if (/[\u0400-\u04FF]/.test(text)) {
            return true;
        }

        // 2. Специфичные туркменские буквы
        if (/[äçžýñöüşÄÇŽÝÑÖÜŞ]/.test(text)) {
            return true;
        }

        // 3. Узбекские латинские маркеры (o', g', oʻ, gʻ, o’, g’)
        if (/[ogOG][`''ʻʼ]/i.test(text)) {
            return true;
        }

        // 4. Проверка на чистую латиницу и перевод (EN)
        const hasLatin = /[a-zA-Z]/.test(text);
        const translateMatch = text.match(/translate\s*\[en\]\s*:\s*([^\n]+)/i);
        const hasValidTranslation = translateMatch && translateMatch[1].trim().length > 0;

        if (hasLatin && hasValidTranslation) {
            return true;
        }

        return false;
    }

    // ОБРАБОТЧИК МОДАЛЬНЫХ ОКОН
    async function handleModal(subCategoryText) {
        await sleep(500);

        const dialogs = Array.from(document.querySelectorAll('.el-dialog, .el-message-box, div[role="dialog"]'));
        const activeDialog = dialogs.find(d => d.offsetWidth > 0 && d.offsetHeight > 0) || document;

        if (subCategoryText) {
            await clickByText(subCategoryText, activeDialog);
            await sleep(400);
        }

        let okBtn = activeDialog.querySelector('button.el-button--primary');

        if (!okBtn) {
            const dialogButtons = Array.from(activeDialog.querySelectorAll('button, span'));
            okBtn = dialogButtons.reverse().find(el => {
                const txt = (el.innerText || el.textContent || '').trim().toUpperCase();
                return txt === 'OK';
            });
        }

        if (okBtn) {
            await sleep(300);
            await forceClick(okBtn);
        } else {
            await clickByText('OK', activeDialog);
        }

        await sleep(600);
    }

    // Обработка верхней строки
    async function processTopRowOnly() {
        if (!isRunning) return;

        const table = document.querySelector('table, .el-table');
        if (!table) return;

        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim().toLowerCase());
        const contentIdx = headers.findIndex(h => h.includes('content')) + 1;
        const opreateIdx = headers.findIndex(h => h.includes('opreate') || h.includes('operate')) + 1;

        const topRow = table.querySelector('tbody tr, .el-table__row');
        if (!topRow) return;

        const contentCell = topRow.querySelector(`td:nth-child(${contentIdx > 0 ? contentIdx : 5})`);
        const opreateArea = topRow.querySelector(`td:nth-child(${opreateIdx > 0 ? opreateIdx : 6})`) || topRow;

        if (!contentCell) return;

        const rawContentText = contentCell.innerText;
        const contentText = rawContentText.toLowerCase();

        if (!contentText) return;

        // СПИСКИ
        const profanityList = ['sikerim','sik', 'macy', 'sikim', 'kunt', 'jelep', 'fuck', 'moterfucker', 'секс', 'сука','Залупа', 'Пиздализ', 'Хуесос', 'Хуйсос', 'Сиськи', 'Хуй', 'писюн', 'Жопа', 'попа', 'Ебашь', 'Ебанёт', 'Хуеешь', 'Ёб твою', 'Ёбырь', 'Ёбанный в рот', 'рот ебал', 'Сука', 'Сучка', 'Гавнюк', 'Заебал', 'Далбаеб', 'Гандон', 'Сирота', 'Потаскуха', 'Проститутка', 'путана', 'Шлюха', 'Ублюдок', 'Уёбок', 'Уёбище', 'Ебан', 'Ебанутый', 'Пидараз', 'пидор', 'Ахуел', 'ахуели', 'Иди Нахер', 'Иди Нахуй', 'Выебу', 'Канжик', 'Ташок', 'Етим', 'Етимни боласи', 'Кўт', 'Хует килопти', 'Хует кма', 'Эмчак', 'Ам', 'ом', 'Кутоқ', 'Жалап', 'джаляп', 'Онангни сикай', 'Оғзингга сикай', 'Амингга сикай', 'Сиквординг', 'Сиквордин', 'Кўтингни қис', 'Кўтингни қисиб юр', 'Кўтингни йиртвораман', 'Ам чикти', 'Сикаман', 'Фохша', 'Онени ами', 'Хароми', 'Харом', 'Харомзада', 'Жалаб', 'Хурлаб зурлаб siкаман','bitch', 'bitches', 'bitching', 'bastard', 'cunt','cock', 'cocksucker', 'faggot', 'fag', 'whore', 'slut','twat', 'prick', 'wanker', 'clit', 'boobs', 'tits', 'titties', 'tosser', 'scumbag', 'douche', 'douchebag', 'jackass', 'arse', 'arsehole', 'dipshit', 'dumbass'];
        
        // Взрослый чат: разделяем на завуалированные символы (ищем везде) и слова (только целиком)
        const adultChatSubstrings = ['🔞', '18+', 's.e.x.', 'с_е_к_с', 'с-е-к-с', 'p0rn', 'п0рн0'];
        const adultChatWords = ['sex', 'seks', 'sekis', 'ass', 'dick', 'pussy', 'cekc', 'cэкc', 'сеkс', 'cex', 'сeкc', 'cёkc', 'porno', 'порно', 'porn'];
        
        const sexyVariations = ['sexy', 'sexi', 'seksi', 'sex video', 'sexy video', 'sexy photo', 'sex photo'];

        const cleanContent = normalizeText(rawContentText);

        // 1. SEXUAL CHAT (Защищено)
        const hasAdultSubstring = adultChatSubstrings.some(s => contentText.includes(s));
        const hasAdultWord = containsExactWord(contentText, adultChatWords);
        if (hasAdultSubstring || hasAdultWord) {
            if (await clickByText('Pornography', opreateArea)) {
                await handleModal('Sexual Chat');
            }
            return;
        }

        // 2. FRAUD / INFRINGEMENT
        const isDirectMerchant = /\b(seller|reseller|merchant|merch|diller|diler)\b/i.test(contentText);
        const fraudKeywords = ['dseller', 'dreseller', 'dmerchant', 'ddiller', 'ddiler', 'dmdagency', 'dagency', 'd@gency'];
        const isObfuscatedMerchant = fraudKeywords.some(keyword => cleanContent.includes(keyword));

        if (isDirectMerchant || isObfuscatedMerchant) {
            if (await clickByText('Fraud/Infringement', opreateArea)) {
                await handleModal('Pretending Offical(B)');
            }
            return;
        }

        // 3. МАТ (Защищено: больше не забанит за "musika", "amigo", "tam")
        if (containsExactWord(contentText, profanityList)) {
            if (await clickByText('Abusing/Threatening', opreateArea)) {
                await handleModal('Severe Abuse');
            }
            return;
        }

        // 4. SEXY + Media (Защищено)
        const hasSexyWord = containsExactWord(contentText, sexyVariations) || sexyVariations.some(w => contentText.includes(w));
        const hasMediaWord = containsExactWord(contentText, ['video', 'photo']) || contentText.includes('video') || contentText.includes('photo');
        if (hasSexyWord && hasMediaWord) {
            if (await clickByText('Pornography', opreateArea)) {
                await handleModal('Sexual Innuendo');
            }
            return;
        }

        // 5. ПРИВАТНЫЕ ДАННЫЕ
        const hasPrivateInfo = /\d{10,}/.test(contentText);
        if (hasPrivateInfo) {
            if (await clickByText('Private Information', opreateArea)) {
                await handleModal('Contact info');
            }
            return;
        }

        // 6. НОМЕР + ВАТСАП
        const hasDigits = /\d{10,}/.test(contentText);
        const whatsappRegex = /wh?at?s?app|вац?апи?|ватцапи?|вацапп|ватсапп|watsap|vacap/i;
        const hasWhatsapp = whatsappRegex.test(contentText);

        if (hasDigits && hasWhatsapp) {
            if (await clickByText('Private Information', opreateArea)) {
                await handleModal('Personal info');
            }
            return;
        }

        // 7. ПРОВЕРКА ЯЗЫКА
        if (!isOurLanguage(rawContentText)) {
            if (await clickByText('Other language', opreateArea)) {
                await handleModal();
            }
            return;
        }

        // 8. ИГНОРИРОВАНИЕ
        if (await clickByText('Ignore', opreateArea)) {
            await handleModal();
        }
    }

    // Управление
    function startAutoRunner() {
        if (isRunning) return;
        isRunning = true;
        
        timerId = setInterval(async () => {
            if (isRunning) await processTopRowOnly();
        }, 3000);
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