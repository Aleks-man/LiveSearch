# LiveSearch

Vanilla JavaScript movie search app built with the OMDb API.

## Features

- Search movies by title
- Debounced input to reduce API requests
- Movie cards rendered with native DOM methods
- Optional mode for appending new results to the existing list
- Empty result and network error handling
- Responsive layout without frameworks

## Tech Stack

- HTML
- CSS
- JavaScript ES Modules
- Fetch API
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
├── css/
│   └── style.css
├── image/
├── src/
│   ├── dom.js
│   ├── index.js
│   └── movies.js
└── index.html
```

## What This Project Shows

This project demonstrates working with plain JavaScript without frameworks: modular code, event handling, DOM rendering, debounced input, asynchronous API requests, request cancellation, and basic UI states.
