# Music Information Retrieval Browswer Extension

## Project Overview
This project is a Google extension design to get music recomendations and informations retrieval based on what you currently listening to on Spotify using Spotify API and DeepSeek AI.

---

## Preview
### Extension Preview
![Extension Preview](preview/preview.JPG)

---

## How to Run the Project
Follow these instructions to use the extension:

**IMPORTANT**
You should get access to the Spotify API client ID and client secret and Open Router API key to use this extension. A simple Google search should be suffice on how to obtain them. 

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/nhatle102003/Who-Is-This-Artist.git
   cd path/to/your/cloned-repo
   ```

2. **Load the Extension onto the Chrome Browser**:  
   ```bash
   1. Go to chrome://extensions/
   2. Click "Load unpacked" on the upper-left corner
   3. Pin the extension into the extension bar in the top right of the web browser. 
   ```
---

## Addtional Information 
Before each run, one might need to refresh the page before the extension run to allow the page JavaScript to fully executed. Also, you will need to go to https://cors-anywhere.herokuapp.com/corsdemo to enable the CORS sever to handle API requests needed to run the application. You are welcome to play around with the source code here and make issues to the repo. 
