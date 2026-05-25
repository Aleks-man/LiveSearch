let moviesList = null
let errorTimeout = null
let errorHideTimeout = null

export let inputSearch = null
export let triggerMode = false

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

  createElement({
    tag: 'img',
    attrs: {
      class: 'body__image',
      src: 'image/movie1.jpg',
      alt: ''
    },
    container: document.body
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

  const checkBox = createElement({
    attrs: { class: 'search__group search__group--checkbox' },
    container: searchBox
  })

  createElement({
    tag: 'input',
    attrs: {
      class: 'search__checkbox',
      id: 'checkbox',
      type: 'checkbox'
    },
    container: checkBox,
    event: 'change',
    handler: (event) => {
      triggerMode = event.target.checked
    }
  })

  createElement({
    tag: 'label',
    attrs: {
      class: 'search__label-checkbox',
      for: 'checkbox'
    },
    textContent: 'Add movies to the list',
    container: checkBox
  })

  createElement({
    tag: 'div',
    attrs: { class: 'error-message', hidden: '' },
    container
  })

  moviesList = createElement({
    attrs: { class: 'movies', 'aria-live': 'polite' },
    container
  })

  createElement({
    tag: 'footer',
    attrs: { class: 'footer' },
    textContent: 'Alex Manuilov, 2024',
    container: document.body
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

export const addMovieToList = (movie) => {
  const item = createElement({
    attrs: { class: 'movie' },
    container: moviesList,
    position: 'prepend'
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

export const clearMoviesMarkup = () => {
  if (moviesList) {
    moviesList.textContent = ''
  }
}

export const renderApp = () => {
  createMarkup()
}
