import {initGapiClient, fetchSheetValues, loadGapiScript} from './sheets-api.js';
import {renderWordcloud } from './wordcloud/render.js';
import { animateParticles, trackMouse, togglePhysics } from './wordcloud/behaviour.js';

export function convertDate(date) {
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

function setDynamicMaxHeight(el) {
    const fullHeight = el.scrollHeight;
    const originalStyles = el.style.transition;
    console.log(originalStyles);
    el.style.transition = 'none';
    el.style.maxHeight = fullHeight + "px";
    el.style.transition = originalStyles;
}

function collapseElement(element, hideAfter = true, duration = 500) {
    // Get full height (scrollHeight by itself does not include margins)
    const style = getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    const fullHeight = element.scrollHeight + marginTop + marginBottom;

    element.style.transition = 'none';
    element.style.maxHeight = fullHeight + "px";

    // trigger animation
    element.style.transition = '';
    element.style.maxHeight = "0px";
    element.classList.add('fade-out');

    if (hideAfter) {
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}

function secondaryTransition(button) {
    return new Promise(resolve => {
        const blurbContainer = document.querySelector('.blurb-container');
        const cloudContainer = document.querySelector('.left');
    
        button.style.fontSize = "4vh"; // transition button to 2ndary title
        // button.style.paddingTop = "10vh";
    
        setTimeout(() => {
            blurbContainer.classList.add('fade-in');
            cloudContainer.classList.add('fade-in');

            // cloud visibility
            setTimeout(() => {
                const cloud = document.getElementById('cloud-sentient');
                const cloudText1 = document.getElementById('text-1');
                cloud.style.cursor = "pointer";
                cloud.style.pointerEvents = "all";
                cloudText1.classList.remove('hidden');

            }, 5000)

            console.log("done");
            resolve();
        }, 2000);
    });
}

function waitForTransition(element, property) {
    return new Promise(resolve => {
      const onEnd = (e) => {
        console.log(e.propertyName);
        if (e.target === element && e.propertyName === property) {
          element.removeEventListener('transitionend', onEnd);
          console.log("transitioned");
          resolve();
        }
      };
      element.addEventListener('transitionend', onEnd);
    });
}

var isPhysicsOn = true;

function toggleWords() {
    isPhysicsOn = !isPhysicsOn;
    togglePhysics(isPhysicsOn);

    const wordSpans = document.querySelectorAll('.word');
    const cloudBlush = document.querySelector('.blush');
    const cloudText1 = document.getElementById('text-1');
    const cloudText2 = document.getElementById('text-2');
    console.log(cloudBlush);

    if (!isPhysicsOn ) {
        cloudText1.classList.add('hidden');
        cloudText2.classList.remove('hidden');
        cloudBlush.classList.remove('hidden');
    }

    wordSpans.forEach(word => {
        if (isPhysicsOn) {
            word.classList.add('disabled');
        } 
        else {
            word.classList.remove('disabled');
        }
    });
}

function backgroundClick(el, img1Src, img2Src, time, sound) {
    el.addEventListener("click", () => {
        console.log("click")
        sound.play();

        el.style.transition = "transform 0.1s ease";

        el.style.setProperty('--scale-clicked', 1.3);
        el.src = img2Src;

        setTimeout(() => {
            el.style.transition = "transform 0.2s ease";
            el.style.setProperty('--scale-clicked', 1);
            el.src =img1Src;
            el.style.transition = "";
        }, time);
    });

}

async function main() { 
    const primaryHeader = document.querySelector('.primary-header');
    const definition = document.querySelector('.definition');
    const primaryContent = document.querySelector('.primary-content');
    const button = document.getElementById('start-btn');
    const toggle = document.querySelector('.toggle-cloud');
    const cloudGlow = document.querySelector('.cloud.glow');
    console.log("CloudGLow", cloudGlow);

    const bird = document.querySelector('.bird');
    const cloud1 = document.querySelector('.cloud1');
    const cloud2 = document.querySelector('.cloud2');
    const cloud3 = document.querySelector('.cloud3');

    const duck = document.querySelector('.bird-audio');
    const cloud1Audio = document.querySelector('.cloud1-audio');
    const cloud2Audio = document.querySelector('.cloud2-audio');
    const cloud3Audio = document.querySelector('.cloud3-audio');


    setDynamicMaxHeight(primaryContent);
    setDynamicMaxHeight(primaryHeader);
    setDynamicMaxHeight(definition);

    // Listen for clicks to background assets
    backgroundClick(bird, "./assets/images/bird.png", "./assets/images/bird-clicked.png", 400, duck);
    backgroundClick(cloud1, "./assets/images/cloud1.png", "./assets/images/cloud1-clicked.png", 500, cloud1Audio);
    backgroundClick(cloud2, "./assets/images/cloud2.png", "./assets/images/cloud2-clicked.png", 400, cloud2Audio);
    backgroundClick(cloud3, "./assets/images/cloud3.png", "./assets/images/cloud3-clicked.png", 400, cloud3Audio);
    
    try{
        await loadGapiScript();

        gapi.load('client', async () => {
            await initGapiClient();
            const rows = await fetchSheetValues();

            // listen for clicks to "celena's lexicon"
            button.addEventListener('click', async() => {
                collapseElement(primaryContent, true, 10000)
                button.classList.add('clicked');

                // render secondary page    
                await waitForTransition(button, "background-color");    
                await secondaryTransition(button);

                renderWordcloud(rows);
                trackMouse();  
                animateParticles();

            });


            // recompute wordcloud when vp resizes
            window.addEventListener('resize', function() {
                if (!primaryHeader.classList.contains('fade-out')){

                    setDynamicMaxHeight(primaryHeader);
                    setDynamicMaxHeight(definition);
                }

                renderWordcloud(rows);
                trackMouse();           // start tracking the mouse

                const wordSpans = document.querySelectorAll('.word');
                wordSpans.forEach(word => {
                    if (isPhysicsOn) {
                        word.classList.add('disabled');
                    } 
                    else {
                        word.classList.remove('disabled');
                    }
                });
            })

            // Sentient cloud events
            toggle.addEventListener('mouseenter', () => {
                console.log("mouse enter");
                cloudGlow.classList.remove('hidden');
            });

            toggle.addEventListener('mouseleave', () => {
                console.log("mouse leave")
                cloudGlow.classList.add('hidden');
            });

            // if the toggle button is clicked, reduce physics, allow words to be clicked
            toggle.addEventListener('click', () => {
                toggle
                toggleWords();
            });
            
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