// wordcloud/render.js

import { convertDate } from "../main.js";

// ===========
// Wordcloud
// ===========

// For debug
export function renderWordcloudText(values) {
    const output = values
      .filter(v => v)   // remove empty strings
      .join('<br>');
    const container = document.querySelector('.left');
    if (container) container.innerHTML = output;
}

// ensure duplicate word entries are consolidated
function preprocessWords(data) {
    const wordMap = {};

    data.forEach(row => {
        const text = row.value.trim().toLowerCase();    // normalize text
        const date = row.date;
        const description = row.description;

        // if word is unique
        if (!wordMap[text]) {
            wordMap[text] = {
                text,
                entries: [],            // array of {date, description}
                mostRecentDate: date    // to be displayed
            }                           // since array is in order of least->most recent, last processed word is most recent
        }

        // update entries
        wordMap[text].entries.push({date, description});

        // Update most recent date for visuals
        if (new Date(date) > new Date(wordMap[text].mostRecentDate)) {
            wordMap[text].mostRecentDate = date;
        } 
    });

    const grouped = Object.values(wordMap);
    return grouped;
}

// compute date-dependent text styling
function mapVisuals(data) {
    // sorted in order of newest -> oldest
    const sorted = [...data].sort((a, b) => new Date(b.mostRecentDate) - new Date(a.mostRecentDate))

    // number of elements
    let length = sorted.length;

    // define styling
    const minSize = 12;
    const maxSize = 60;

    const minOpacity = 0.3;
    const maxOpacity = 1.0;


    const mapped = sorted.map((word, index) => {
        const freshness = 1 - index / (length - 1);

        return {
            ...word,
            size: minSize + freshness * (maxSize - minSize),
            opacity: minOpacity + freshness * (maxOpacity - minOpacity)
        };
    });

    return mapped;

}

// draw wordcloud to DOM
function drawToDOM(data) {
    console.log("Computed layout:", data);

    const container = document.querySelector(".wordcloud");
    container.innerHTML = "";

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    data.forEach(d => {
        const span = document.createElement("span");
        span.className = "word";
        span.id = d.text;
        span.textContent = d.text;

        span.style.fontSize = `${d.size}px`;
        span.style.left = `${d.x + centerX - d.width / 2}px`;
        span.style.top = `${d.y + centerY - d.height / 2}px`;
        span.style.transform = `rotate(${d.rotate}deg)`;
        span.style.font = d.font;
        span.style.opacity = d.opacity;

        // if word is clicked
        span.addEventListener("click", () => {
            console.log(d);
            openEntriesContainer(d);
        
        });

        container.appendChild(span);
    });
}


// determine word placements
export function renderWordcloud(data) {
    const container = document.querySelector(".wordcloud");
    const rect = container.getBoundingClientRect();

    const rows = preprocessWords(data);
    const visualWords = mapVisuals(rows);

    console.log("Rendering word cloud...");
    let layout = d3.layout.cloud()
        .size([rect.width, rect.height])
        .words(visualWords)   // default smallest size
        .padding(5)
        .rotate(function () {return ~~(Math.random() * 2) * 90})
        .rotate(0)
        .font("Impact")
        .fontSize(d => d.size )
        .on("end", drawToDOM)
    
    layout.start();
}

// ==========
// Entries block
// ==========

function openEntriesContainer(word){
    const container = document.getElementById('word-entries-container');
    const title = document.getElementById('word-title');
    const entries = document.getElementById('word-entries');


    title.textContent = word.text;  
    entries.innerHTML = word.entries.map(e => (
        `<strong>${convertDate(e.date)}</strong><br>${e.description}`
      )).join("<br><br>");    
    container.classList.remove("hidden");
}