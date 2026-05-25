import { renderApp, addMovieToList, inputSearch, clearMoviesMarkup, triggerMode, showError, hideError } from './dom.js'

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
  movies.forEach(addMovieToList)
}

const inputSearchHandler = (event) => {
  debounce(async () => {
    const searchString = event.target.value.trim()

    if (searchString.length === 0) {
      searchLast = ''
      clearMoviesMarkup()
      hideError()
      return
    }

    if (searchString.length < MIN_SEARCH_LENGTH || searchString === searchLast) return

    searchLast = searchString
    hideError()

    if (activeRequest) {
      activeRequest.abort()
    }

    activeRequest = new AbortController()

    if (!triggerMode) {
      clearMoviesMarkup()
    }

    try {
      const movies = await getMovies(searchString, activeRequest.signal)
      renderMovies(movies)
    } catch (error) {
      if (error.name !== 'AbortError') {
        showError(error.message)
      }
    }
  }, DEBOUNCE_DELAY)
}

export const appInit = () => {
  renderApp()
  inputSearch.addEventListener('input', inputSearchHandler)
}
