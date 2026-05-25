import {
  renderApp,
  addMovieToList,
  inputSearch,
  clearSearchButton,
  clearMoviesMarkup,
  triggerMode,
  showError,
  hideError,
  setStatusMessage,
  hideStatusMessage,
  setClearButtonVisibility
} from './dom.js'

const API_KEY = 'ca956212'
const API_URL = 'https://www.omdbapi.com/'
const MIN_SEARCH_LENGTH = 4
const DEBOUNCE_DELAY = 700

export let searchLast = ''

let activeRequest = null

const debounce = (() => {
  let timer = null

  return (callback, ms) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

const getMovies = async (searchString, signal) => {
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchString)}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error('Search service is unavailable. Please try again later.')
  }

  const data = await response.json()

  if (data.Response === 'False') {
    throw new Error(`'${searchString}' is not found. Please try again.`)
  }

  return data.Search
}

const renderMovies = (movies) => {
  hideStatusMessage()
  movies.forEach(addMovieToList)
}

const resetSearch = () => {
  if (activeRequest) {
    activeRequest.abort()
    activeRequest = null
  }

  searchLast = ''
  inputSearch.value = ''
  clearMoviesMarkup()
  hideError()
  setClearButtonVisibility(false)
  setStatusMessage('Start typing a movie title')
  inputSearch.focus()
}

const inputSearchHandler = (event) => {
  debounce(async () => {
    const searchString = event.target.value.trim()

    setClearButtonVisibility(searchString.length > 0)

    if (searchString.length === 0) {
      searchLast = ''
      clearMoviesMarkup()
      hideError()
      setStatusMessage('Start typing a movie title')
      return
    }

    if (searchString.length < MIN_SEARCH_LENGTH) {
      clearMoviesMarkup()
      hideError()
      setStatusMessage(`Enter at least ${MIN_SEARCH_LENGTH} characters`)
      return
    }

    if (searchString === searchLast) return

    searchLast = searchString
    hideError()

    if (activeRequest) {
      activeRequest.abort()
    }

    activeRequest = new AbortController()

    if (!triggerMode) {
      clearMoviesMarkup()
    }

    setStatusMessage('Searching...')

    try {
      const movies = await getMovies(searchString, activeRequest.signal)
      renderMovies(movies)
    } catch (error) {
      if (error.name !== 'AbortError') {
        clearMoviesMarkup()
        setStatusMessage('Nothing to show yet')
        showError(error.message)
      }
    }
  }, DEBOUNCE_DELAY)
}

export const appInit = () => {
  renderApp()
  inputSearch.addEventListener('input', inputSearchHandler)
  clearSearchButton.addEventListener('click', resetSearch)
}
