
//refrenced by Google Chrome offical documentations

const buttonPrompt = document.body.querySelector("#button-prompt")
const buttonReset = document.body.querySelector("#button-reset");
const elementResponse = document.body.querySelector("#response");
const elementLoading = document.body.querySelector("#loading");
const elementError = document.body.querySelector('#error');

const TEMPERATURE = 0.7;
const TOP_K = 20;
let session;

//**MACROS */

async function reset() {
    if (session) {
        session.destroy();
    }
    session = null;
}

async function show (element){
    element.removeAttribute("hidden");
}

async function hide(element){
    element.setAttribute("hidden", "");
}

function showLoading(){
    buttonReset.removeAttribute('disabled');
    hide(elementResponse);
    hide(elementError);
    show(elementLoading);
}

function showError(error){
    show(elementError);
    hide(elementResponse);
    hide(elementLoading);
    elementError.textContent = error;
}

function showResponse(response){
    hide(elementLoading);
    show(elementResponse);
    elementResponse.innerHTML = (marked.parse(response));
}

function extractIDFromUrl(url){
    const match = url.match(/spotify\.com\/(artist|track|album)\/([a-zA-Z0-9]+)/);
    if (!match) return [null, null];
    
    const type = match[1]; // 'artist', 'track', or 'album'
    const id = match[2];   // the actual Spotify ID
    return [type, id];
}

//**END MACROS SECTION */

async function runPrompt(prompt){
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR-OPENROUTER-API}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "tngtech/deepseek-r1t-chimera:free",
            messages: [
                {
                    role: "system",
                    content: "You are a music expert and friendly music connoisseur. Give short bios and genre info for artists. Do not show that you are an AI, straight to the points and do not present your thinking process as the final output."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    });

    const data = await response.json();
    if (!response.ok) {
        reset();
        throw new Error(data.error?.message || "Failed to get a response"); 
    }
    return data.choices[0].message.content;
}

async function initDefaults() {
    
    buttonPrompt.removeAttribute('disabled');
}

initDefaults();

buttonReset.addEventListener('click', () => {
    hide(elementLoading);
    hide(elementError);
    hide(elementResponse);
    reset();
    buttonReset.setAttribute('disabled', '');
});


buttonPrompt.addEventListener('click', async () =>{
    const url = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "GET_URL" }, (response) => {
            if (chrome.runtime.lastError || !response?.url) {
                reject(chrome.runtime.lastError || new Error("No URL received"));
            } else {
                resolve(response.url);
            }
        });
    });
    const [type, id] = extractIDFromUrl(url);

    const base64 = btoa("YOUR-SPOTIFY-CLIENT-ID:YOUR-SPOTIFY-CLIENT-ID-SECRET");

    const fetch_token = await fetch('https://cors-anywhere.herokuapp.com/' + "https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Authorization': `Basic ${base64}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=YOUR-SPOTIFY-CLIENT-ID&client_secret=YOUR-SPOTIFY-CLIENT-ID-SECRET"
        }).catch(error => console.error('Error:', error));
    
    const data = await fetch_token.json();
    const access_token = data.access_token;
    console.log(type, id);

    const response = await fetch('https://cors-anywhere.herokuapp.com/' +  `https://api.spotify.com/v1/${type+"s"}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Origin': `chrome://extensions/${chrome.runtime.id}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    }).catch(error => console.error('Error:', error));

    const information = await response.json();
    console.log(information)
    const prompt = `Can you give me some information regrading this artist/band based on this Spotify data "${information.name}"? Please keep them short and consice, really highlight the genre and give some of their best tracks/albums recommendation.`;
    prompt.trim();
    showLoading();
    try {
        const response = await runPrompt(prompt);
        showResponse(response);
    }catch (e) {
        showError(e)
    }
});