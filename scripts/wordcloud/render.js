// wordcloud/render.js

export function renderWordcloudText(values) {
    const output = values
      .filter(row => row[0])
      .map(row => row.join(','))
      .join('<br>');
    const container = document.querySelector('.left');
    if (container) container.innerHTML = output;
}