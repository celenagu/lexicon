import {initGapiClient, fetchSheetValues, loadGapiScript} from './sheets-api.js';
import {renderWordcloudText} from './wordcloud/render.js';

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
    console.log(fullHeight);
    console.log('Is visible?', getComputedStyle(element).display !== 'none');

    console.log(getComputedStyle(element).transition);
    element.style.transition = 'none';
    console.log(getComputedStyle(element).transition);
    element.style.maxHeight = fullHeight + "px";

    console.log('Setting max-height to:', element.style.maxHeight);

    // force reflow to ensure browser registers max height
    const reflow = element.offsetHeight;
    console.log('Reflow triggered with offsetHeight:', reflow);

    // trigger animation
    element.style.transition = '';   // reset to original CSS-defined 
    console.log(getComputedStyle(element).transition);
    element.classList.add('fade-out');

    console.log('ClassList after fade-out:', element.classList.value);

    if (hideAfter) {
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}

async function main() { 
    const primaryHeader = document.querySelector('.primary-header');
    const definition = document.querySelector('.definition');
    const button = document.getElementById('start-btn');
    
    button.addEventListener('click', () => {
        collapseElement(primaryHeader);
        collapseElement(definition);
        primaryHeader.classList.add('fade-out');
        definition.classList.add('fade-out');
        button.classList.add('move-button');



        // setTimeout(() => {
        //     button.classList.add('active-style');
        // }, 500)

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