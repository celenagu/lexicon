import {initGapiClient, fetchSheetValues, loadGapiScript} from './sheets-api.js';
import {renderWordcloudText} from './wordcloud/render.js';
// import { startScene } from './wordcloud/behaviour.js';

function convertDate(date) {
    const newDate = new Date(date);

    const formatted = `${newDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} at ${newDate.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })}`;

    return(formatted.toLowerCase());
}

function collapseElement(element, hideAfter = true, duration = 500) {
    const fullHeight = element.scrollHeight;
    element.style.transition = 'none';
    element.style.maxHeight = fullHeight + "px";

    // trigger animation
    element.style.transition = '';   // reset to original CSS-defined 
    element.style.maxHeight = "0px";
    element.classList.add('fade-out');

    if (hideAfter) {
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}

function secondaryTransition(button) {
    const blurbContainer = document.querySelector('.blurb-container');
    button.style.fontSize = "40px";
    blurbContainer.classList.add('fade-in');

}


function waitForTransition(element) {
    return new Promise(resolve => {
      const onEnd = (e) => {
        if (e.target === element) {
          element.removeEventListener('transitionend', onEnd);
          console.log("transitioned");
          resolve();
        }
      };
      element.addEventListener('transitionend', onEnd);
    });
  }

async function main() { 
    const primaryHeader = document.querySelector('.primary-header');
    const primaryContainer = document.querySelector('.primary-container');
    const definition = document.querySelector('.definition');
    const button = document.getElementById('start-btn');

    // startScene();
    
    button.addEventListener('click', async() => {
        collapseElement(primaryHeader, true, 2600);
        collapseElement(definition, true, 2600);
        button.classList.add('clicked');

        // render secondary page
        await waitForTransition(button);
        secondaryTransition(button);

    });






    try{
        await loadGapiScript();

        gapi.load('client', async () => {
            await initGapiClient();
            const rows = await fetchSheetValues();
            const values = rows.map(row => row.value);

            renderWordcloudText(values);

            const lastDate = convertDate(rows[rows.length-1].date);

            console.log(lastDate);
            const dateContainer = document.querySelector('.last-updated');
            if (dateContainer) dateContainer.innerHTML = 'last updated ' + lastDate;
        });
    } catch (err) {
        console.error("Error: ", err);
        const container = document.querySelector('.left');
        if (container) container.innerText = 'Failed to load.';
    }
}

main();