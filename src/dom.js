let moviesList = null
let statusMessage = null
let detailsModal = null
let detailsContent = null
let detailsCloseButton = null
let lastFocusedElement = null
let errorTimeout = null
let errorHideTimeout = null

export let inputSearch = null
export let clearSearchButton = null
export let favoriteMoviesButton = null

const createElement = ({
  tag = 'div',
  attrs = {},
  textContent = '',
  container = null,
  position = 'append',
  event = null,
  handler = null
}) => {
  const element = document.createElement(tag)

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  if (textContent) {
    element.textContent = textContent
  }

  if (container && position === 'prepend') {
    container.prepend(element)
  }

  if (container && position === 'append') {
    container.append(element)
  }

  if (event && typeof handler === 'function') {
    element.addEventListener(event, handler)
  }

  return element
}

const createMarkup = () => {
  const container = createElement({
    attrs: { class: 'container' },
    container: document.body,
    position: 'prepend'
  })

  const heading = createElement({
    tag: 'h1',
    textContent: 'Movies search tool',
    container
  })

  createElement({
    tag: 'img',
    attrs: {
      class: 'heading__image',
      src: 'image/icon-film.png',
      alt: ''
    },
    container: heading
  })

  const searchBox = createElement({
    attrs: { class: 'search' },
    container
  })

  const inputBox = createElement({
    attrs: { class: 'search__group search__group--input' },
    container: searchBox
  })

  createElement({
    tag: 'label',
    attrs: {
      class: 'search__label-input',
      for: 'search'
    },
    textContent: 'Movies search',
    container: inputBox
  })

  inputSearch = createElement({
    tag: 'input',
    attrs: {
      class: 'search__input',
      id: 'search',
      type: 'search',
      placeholder: 'Enter movie title...',
      autocomplete: 'off'
    },
    container: inputBox
  })

  clearSearchButton = createElement({
    tag: 'button',
    attrs: {
      class: 'search__clear',
      type: 'button',
      hidden: ''
    },
    textContent: 'Clear',
    container: inputBox
  })

  favoriteMoviesButton = createElement({
    tag: 'button',
    attrs: {
      class: 'search__favorites',
      type: 'button'
    },
    textContent: 'Favorites (0)',
    container: searchBox
  })

  createElement({
    tag: 'div',
    attrs: { class: 'error-message', hidden: '' },
    container
  })

  statusMessage = createElement({
    tag: 'p',
    attrs: { class: 'status-message' },
    textContent: 'Start typing a movie title',
    container
  })

  moviesList = createElement({
    attrs: { class: 'movies', 'aria-live': 'polite' },
    container
  })

  createElement({
    tag: 'footer',
    attrs: { class: 'footer' },
    textContent: 'Alex Manuilov, 2026',
    container: document.body
  })

  createMovieDetailsModal()
}

const createMovieDetailsModal = () => {
  detailsModal = createElement({
    attrs: {
      class: 'movie-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'movie-modal-title',
      hidden: ''
    },
    container: document.body,
    event: 'click',
    handler: (event) => {
      if (event.target === detailsModal) {
        closeMovieDetails()
      }
    }
  })

  const modalPanel = createElement({
    attrs: { class: 'movie-modal__panel' },
    container: detailsModal
  })

  detailsCloseButton = createElement({
    tag: 'button',
    attrs: {
      class: 'movie-modal__close',
      type: 'button',
      'aria-label': 'Close movie details'
    },
    textContent: 'Close',
    container: modalPanel,
    event: 'click',
    handler: closeMovieDetails
  })

  detailsContent = createElement({
    attrs: { class: 'movie-modal__content' },
    container: modalPanel
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailsModal && !detailsModal.hidden) {
      closeMovieDetails()
    }
  })
}

export const showError = (message) => {
  const errorContainer = document.querySelector('.error-message')

  if (!errorContainer) return

  clearTimeout(errorTimeout)
  clearTimeout(errorHideTimeout)

  errorContainer.textContent = message
  errorContainer.hidden = false
  errorContainer.style.transition = ''
  errorContainer.style.opacity = '1'

  errorTimeout = setTimeout(() => {
    hideError()
  }, 4000)
}

export const hideError = () => {
  const errorContainer = document.querySelector('.error-message')

  if (!errorContainer || errorContainer.hidden) return

  errorContainer.style.transition = 'opacity 0.3s'
  errorContainer.style.opacity = '0'

  errorHideTimeout = setTimeout(() => {
    errorContainer.textContent = ''
    errorContainer.hidden = true
    errorContainer.style.transition = ''
  }, 300)
}

export const addMovieToList = (movie, onSelect, isFavorite = false) => {
  const item = createElement({
    attrs: {
      class: isFavorite ? 'movie movie--favorite' : 'movie',
      role: 'button',
      tabindex: '0',
      'data-imdb-id': movie.imdbID,
      'aria-label': `Open details for ${movie.Title}`
    },
    container: moviesList,
    position: 'prepend',
    event: 'click',
    handler: () => {
      onSelect(movie)
    }
  })

  const favoriteBadge = createElement({
    tag: 'span',
    attrs: { class: 'movie__favorite-badge' },
    textContent: 'Saved',
    container: item
  })

  favoriteBadge.hidden = !isFavorite

  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(movie)
    }
  })

  createElement({
    tag: 'img',
    attrs: {
      class: 'movie__image',
      src: /^https?:\/\//i.test(movie.Poster) ? movie.Poster : 'image/no-imeg.jpg',
      alt: `${movie.Title} ${movie.Year}`,
      title: `${movie.Title} ${movie.Year}`,
      loading: 'lazy'
    },
    container: item
  })

  createElement({
    tag: 'p',
    attrs: { class: 'movie__image-description' },
    textContent: `${movie.Title}, ${movie.Year}`,
    container: item
  })
}

const getMoviePoster = (poster) => (/^https?:\/\//i.test(poster) ? poster : 'image/no-imeg.jpg')

const isUsefulValue = (value) => value && value !== 'N/A'

const openMovieDetails = () => {
  if (detailsModal.hidden) {
    lastFocusedElement = document.activeElement
  }

  detailsModal.hidden = false
  document.body.classList.add('modal-open')
  detailsCloseButton.focus()
}

export const showMovieDetailsLoading = (title) => {
  if (!detailsContent) return

  detailsContent.textContent = ''

  createElement({
    tag: 'p',
    attrs: { class: 'movie-modal__loading' },
    textContent: `Loading details for ${title}...`,
    container: detailsContent
  })

  openMovieDetails()
}

const setFavoriteButtonState = (button, isFavorite) => {
  button.classList.toggle('movie-modal__favorite--active', isFavorite)
  button.textContent = isFavorite ? 'Remove from favorites' : 'Add to favorites'
  button.setAttribute('aria-pressed', String(isFavorite))
}

export const renderMovieDetails = (movie, isFavorite = false, onFavoriteToggle = null) => {
  if (!detailsContent) return

  detailsContent.textContent = ''

  const poster = createElement({
    tag: 'img',
    attrs: {
      class: 'movie-modal__poster',
      src: getMoviePoster(movie.Poster),
      alt: `${movie.Title} poster`
    },
    container: detailsContent
  })

  const info = createElement({
    attrs: { class: 'movie-modal__info' },
    container: detailsContent
  })

  createElement({
    tag: 'h2',
    attrs: { id: 'movie-modal-title', class: 'movie-modal__title' },
    textContent: movie.Title,
    container: info
  })

  const meta = createElement({
    tag: 'p',
    attrs: { class: 'movie-modal__meta' },
    textContent: [movie.Year, movie.Rated, movie.Runtime, movie.imdbRating && `IMDb ${movie.imdbRating}`]
      .filter(isUsefulValue)
      .join(' / '),
    container: info
  })

  if (!meta.textContent) {
    meta.hidden = true
  }

  const actions = createElement({
    attrs: { class: 'movie-modal__actions' },
    container: info
  })

  const favoriteButton = createElement({
    tag: 'button',
    attrs: {
      class: 'movie-modal__favorite',
      type: 'button'
    },
    container: actions,
    event: 'click',
    handler: () => {
      if (typeof onFavoriteToggle !== 'function') return

      const nextState = onFavoriteToggle(movie)
      setFavoriteButtonState(favoriteButton, nextState)
    }
  })

  setFavoriteButtonState(favoriteButton, isFavorite)

  createElement({
    tag: 'p',
    attrs: { class: 'movie-modal__plot' },
    textContent: isUsefulValue(movie.Plot) ? movie.Plot : 'Plot description is not available.',
    container: info
  })

  const facts = createElement({
    tag: 'dl',
    attrs: { class: 'movie-modal__facts' },
    container: info
  })

  ;[
    ['Genre', movie.Genre],
    ['Director', movie.Director],
    ['Actors', movie.Actors],
    ['Type', movie.Type],
    ['Language', movie.Language],
    ['Awards', movie.Awards]
  ]
    .filter(([, value]) => isUsefulValue(value))
    .forEach(([label, value]) => {
      createElement({
        tag: 'dt',
        textContent: label,
        container: facts
      })

      createElement({
        tag: 'dd',
        textContent: value,
        container: facts
      })
    })

  poster.addEventListener('error', () => {
    poster.src = 'image/no-imeg.jpg'
  })

  openMovieDetails()
}

export const setMovieFavoriteState = (imdbID, isFavorite) => {
  document.querySelectorAll('.movie').forEach((movieCard) => {
    if (movieCard.dataset.imdbId !== imdbID) return

    const favoriteBadge = movieCard.querySelector('.movie__favorite-badge')

    movieCard.classList.toggle('movie--favorite', isFavorite)

    if (favoriteBadge) {
      favoriteBadge.hidden = !isFavorite
    }
  })
}

export const removeMovieFromList = (imdbID) => {
  document.querySelectorAll('.movie').forEach((movieCard) => {
    if (movieCard.dataset.imdbId === imdbID) {
      movieCard.remove()
    }
  })
}

export const renderMovieDetailsError = (message) => {
  if (!detailsContent) return

  detailsContent.textContent = ''

  createElement({
    tag: 'p',
    attrs: { class: 'movie-modal__loading' },
    textContent: message,
    container: detailsContent
  })

  openMovieDetails()
}

export const closeMovieDetails = () => {
  if (!detailsModal || detailsModal.hidden) return

  detailsModal.hidden = true
  document.body.classList.remove('modal-open')

  if (lastFocusedElement) {
    lastFocusedElement.focus()
  }
}

export const setStatusMessage = (message) => {
  if (statusMessage) {
    statusMessage.textContent = message
    statusMessage.hidden = false
  }
}

export const hideStatusMessage = () => {
  if (statusMessage) {
    statusMessage.hidden = true
  }
}

export const setClearButtonVisibility = (isVisible) => {
  if (clearSearchButton) {
    clearSearchButton.hidden = !isVisible
  }
}

export const setFavoriteMoviesButtonCount = (count) => {
  if (favoriteMoviesButton) {
    favoriteMoviesButton.textContent = `Favorites (${count})`
  }
}

export const clearMoviesMarkup = () => {
  if (moviesList) {
    moviesList.textContent = ''
  }
}

export const renderApp = () => {
  createMarkup()
}
