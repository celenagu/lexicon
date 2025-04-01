import {initGapiClient, fetchSheetValues, loadGapiScript} from './sheets-api.js';
import {renderWordcloudText} from './wordcloud/render.js';

async function main() {
    try{
        await loadGapiScript();

        gapi.load('client', async () => {
            await initGapiClient();
            const values = await fetchSheetValues();
            renderWordcloudText(values);
        });
    } catch (err) {
        console.error("Error: ", err);
        const container = document.querySelector('.left');
        if (container) container.innerText = 'Failed to load.';
    }
}

main();