// wordcloud/render.js

export function renderWordcloudText(values) {
    const output = values
      .filter(v => v)   // remove empty strings
      .join('<br>');
    const container = document.querySelector('.left');
    if (container) container.innerHTML = output;
}

const words = [
    { text: 'JavaScript', size: 40 },
    { text: 'CSS', size: 30 },
    { text: 'Particles', size: 25 },
    { text: 'React', size: 20 },
    { text: 'Node.js', size: 35 },
    { text: 'D3', size: 45 },
];




export function renderWordcloud(values) {

    anychart.onDocumentReady( function() {
        var data = values;

        // create word cloud chart
        var chart = anychart.tagCloud(data);
        chart.angles([0]);
        chart.colorRange(true);
        chart.colorRange().length('80%');

        // display word cloud chart
        chart.container("wordcloud-container");
        chart.draw;
    });

}