
let lastUrl = window.location.href;
setInterval(() => {
    const currentUrl = window.location.href;
    console.log(currentUrl);
    chrome.runtime.sendMessage({
        type: "UPDATE_URL",
        url: currentUrl
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Message send failed:", chrome.runtime.lastError.message);
        } else {
            console.log("Background responded:", response);
        }
    });

}, 500)
