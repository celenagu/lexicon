// wordcloud/render.js

export function renderWordcloudText(values) {
    const output = values
      .filter(v => v)   // remove empty strings
      .join('<br>');
    const container = document.querySelector('.left');
    if (container) container.innerHTML = output;
}

const words = [
    "Hello", "world", "normally", "you", "want", "more", "words", "than", "this", "React", "Canvas", "CSS", "HTML", "JavaScript"
  ].map(text => ({
    text,
    size: 10 + Math.random() * 60
  }));
  


function draw(words) {
    d3.select("body").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

  function drawToDOM(words) {
    console.log("Computed layout:", words);

    const container = document.querySelector(".wordcloud");
    container.innerHTML = "";
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
  
    words.forEach(d => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = d.text;
  
      span.style.fontSize = `${d.size}px`;
      span.style.left = `${d.x + centerX - d.width / 2}px`;
      span.style.top = `${d.y + centerY - d.height / 2}px`;
      span.style.transform = `rotate(${d.rotate}deg)`;
  
      span.addEventListener("click", () => {
        alert(`You clicked on: ${d.text}`);
      });
  
      container.appendChild(span);
    });
  }



export function renderWordcloud(words) {
    const container = document.querySelector(".wordcloud");
    const rect = container.getBoundingClientRect();

    console.log("Rendering word cloud...");
    let layout = d3.layout.cloud()
        .size([rect.width, rect.height])
        .words(words.map(text => ({text,size: 10 + Math.random() * 60})))
        .padding(5)
        .rotate(function () {return ~~(Math.random() * 2) * 90})
        .rotate(0)
        .font("Impact")
        .fontSize(d => d.size * 0.8)
        .on("end", drawToDOM)

    console.log("layout: ", layout);

    layout.start();
 
}

