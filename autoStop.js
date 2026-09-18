//7-актив 4-деактив

(function() {
    let isActive = false;
    let timer = null;

    function checkAndStop() {
        if (!isActive) return;

        const pageText = document.body.innerText || "";
        const hasHighRisk = pageText.includes("High risk content");
        
        if (hasHighRisk) {
            const buttons = Array.from(document.querySelectorAll("button, input[type='button'], a"));
            const stopButton = buttons.find(el => el.textContent.trim().toLowerCase() === "stop" || el.value?.toLowerCase() === "stop");

            if (stopButton) {
                stopButton.click();
            }
        }
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "7") {
            isActive = true;
            if (!timer) {
                timer = setInterval(checkAndStop, 5000);
            }
        } else if (event.key === "4") {
            isActive = false;
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    });
})();