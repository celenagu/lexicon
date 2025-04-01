// wordcloud/render.js

export function renderWordcloudText(values) {
    const output = values
      .filter(v => v)   // remove empty strings
      .join('<br>');
    const container = document.querySelector('.left');
    if (container) container.innerHTML = output;
}

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