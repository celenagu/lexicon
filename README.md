# lexicon

Small web experiment built with vanilla HTML, CSS, and Javascript.

- Physics-based word cloud that responds to mouse movements, toggleable between static and in motion
- Words scale based on recency: newer entries appear larger
- Expandable entries: words are clickable to reveal related notes and timestamps
- Live-updating content: words are pulled from a connected Google Sheet
- Fun buttons!

## Background

I realized recently that I don't really know the ins and outs of my mind. 

In reality, I'd love to create a 1:1 linked database of my brain, but unfortunately, I don't quite have the means nor the time to accomplish that... So this project is a mini representation of that idea, a collection of words, objects, and phrases that stick with me. 

## Implementation Notes

This project utilizes a modified version of Jason Davies' Word Cloud Layout algorithm [d3-cloud](https://github.com/jasondavies/d3-cloud) to calculate word positions within the layout. Unlike Davies' original project, which renders SVG `<text>` elements, this iteration uses `<span>` elements, allowing for more flexible styling and physics-based mouse interactions using DOM manipulation. 

Words and their associated metadata (notes, timestamps) are pulled from a connected Google Sheet using the Google Sheets API (via the GAPI client). This makes the content easy to update via a Google Form without the need to touch code. 

The particles (words) animate, react to cursor movement, and can be toggled between drifting and stillness. 

## Motivation
- Get back into my creative endeavours
- Improve webdev skills
- Practice working with APIs
- Explore DOM-based animation

## In the future
- Link in personal website
- Time-dependent background and theme rendering