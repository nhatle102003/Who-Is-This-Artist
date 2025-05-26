let url = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_URL") {
        url = message.url;
        console.log("URL updated in background:", url);
        return; 
    }

    if (message.type === "GET_URL") {
        console.log("Sending stored URL:", url);
        sendResponse({ url });
        return true; 
    }
});

// Setup side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Side panel error:", error));