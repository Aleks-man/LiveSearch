# LiveSearch

Vanilla JavaScript movie search app built with the OMDb API.

## Demo

https://aleks-man.github.io/LiveSearch/

## Features

- Search movies by title
- Debounced input to reduce API requests
- Movie cards rendered with native DOM methods
- Clickable movie cards with a details modal
- Full movie details loaded by IMDb ID
- Favorite movies saved in localStorage
- Favorites view for saved movies
- Accessible modal closing by button, backdrop click, Escape key, and focus trap
- Loading, empty, and error UI states
- Responsive cinema-inspired layout without frameworks

## Tech Stack

- HTML
- CSS
- JavaScript ES Modules
- Fetch API
- AbortController
- localStorage
- OMDb API

## How To Run

Open the project through a local static server because ES modules do not work correctly from every browser when opened as a plain file.

```bash
node server.js
```

Then open `http://127.0.0.1:5500`.

## Project Structure

```text
.
|-- css/
|   `-- style.css
|-- image/
|-- src/
|   |-- api.js
|   |-- constants.js
|   |-- dom.js
|   |-- index.js
|   `-- movies.js
|-- favicon-cinema.svg
|-- index.html
|-- README.md
`-- server.js
```

## What This Project Shows

This project demonstrates working with plain JavaScript without frameworks: modular code, event handling, DOM rendering, debounced input, asynchronous API requests, request cancellation, clickable cards, modal UI, keyboard handling, focus management, localStorage persistence, and responsive styling.
