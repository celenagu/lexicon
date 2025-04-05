// wordcloud/render.js

import { convertDate } from "../main.js";
import { registerParticle} from "./behaviour.js";

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

// Randomize fonts
const fonts = [ "Times New Roman", "Jetbrains Mono", "Lucinda Console", "Monaco", "Garamond"];

// compute date-dependent text styling
function mapVisuals(data) {
    // sorted in order of newest -> oldest
    const sorted = [...data].sort((a, b) => new Date(b.mostRecentDate) - new Date(a.mostRecentDate))

    // number of elements
    let length = sorted.length;

    // define styling

    // screen based font scaling
    const screenWidth = window.innerWidth;
    const minSize = Math.max(12, screenWidth * 0.01);
    const maxSize = Math.min(140, screenWidth * 0.06); 

    const minOpacity = 0.5;
    const maxOpacity = 1.0;


    const mapped = sorted.map((word, index) => {
        const freshness = 1 - index / (length - 1);

        return {
            ...word,
            size: minSize + freshness * (maxSize - minSize),
            opacity: minOpacity + freshness * (maxOpacity - minOpacity),
            fontFamily: fonts[Math.floor(Math.random()*fonts.length)]
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
        span.className = "word disabled";
        span.id = d.text;
        span.textContent = d.text;

        span.style.fontSize = `${d.size}px`;
        span.style.left = `${d.x + centerX - d.width / 2}px`;
        span.style.top = `${d.y + centerY - d.height / 2}px`;
        span.style.transform = `rotate(${d.rotate}deg)`;
        span.style.fontFamily = d.font;
        span.style.opacity = d.opacity;

        // register each particle for movement
        const x = d.x + centerX - d.width / 2;
        const y = d.y + centerY - d.height / 2;
        registerParticle(span, x, y);

        // if word is clicked
        span.addEventListener("click", (e) => {
            e.stopPropagation(); // so clicking the word doesn't count as "outside"
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
        .font(d => d.fontFamily)
        .fontSize(d => d.size )
        .on("end", drawToDOM)
    
    layout.start();
}

// ==========
// Entries block
// ==========

// Handles the entries block collapsing upon clicking outside
function onClickOut(event) {
    const container = document.querySelector(".entries-container");
  
    if (container && !container.contains(event.target)) {
      // Clicked outside the container
      console.log("Description box hidden");
      container.classList.add("hidden");
    }
  }

// render entries block upon clicking
export function openEntriesContainer(word){
    const container = document.getElementById('word-entries-container');
    const title = document.getElementById('word-title');
    const entries = document.getElementById('word-entries');

    // populates the block with information
    title.textContent = word.text;  
    entries.innerHTML = word.entries.map(e => (
        `<strong>${convertDate(e.date)}</strong><br>${e.description}`
      )).join("<br><br>");    
    container.classList.remove("hidden");
    
    window.addEventListener("click", onClickOut);
}

