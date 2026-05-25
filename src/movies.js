import {
  renderApp,
  addMovieToList,
  inputSearch,
  clearSearchButton,
  favoriteMoviesButton,
  clearMoviesMarkup,
  showError,
  hideError,
  setStatusMessage,
  hideStatusMessage,
  setClearButtonVisibility,
  showMovieDetailsLoading,
  renderMovieDetails,
  renderMovieDetailsError,
  setMovieFavoriteState,
  removeMovieFromList,
  setFavoriteMoviesButtonCount
} from './dom.js'
import { getMovieDetails, searchMovies } from './api.js'

const MIN_SEARCH_LENGTH = 4
const DEBOUNCE_DELAY = 700
const MOVIE_NOT_FOUND_ERROR = 'MOVIE_NOT_FOUND'
const FAVORITES_STORAGE_KEY = 'liveSearchFavorites'

export let searchLast = ''

let activeRequest = null
let activeDetailsRequest = null
let favoriteMovies = new Map()
let isShowingFavorites = false

const debounce = (() => {
  let timer = null

  return (callback, ms) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

const loadFavoriteMovies = () => {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || []
    favoriteMovies = new Map(savedFavorites.map((movie) => [movie.imdbID, movie]))
  } catch {
    favoriteMovies = new Map()
  }
}

const saveFavoriteMovies = () => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteMovies.values()]))
  setFavoriteMoviesButtonCount(favoriteMovies.size)
}

const normalizeFavoriteMovie = (movie) => ({
  imdbID: movie.imdbID,
  Title: movie.Title,
  Year: movie.Year,
  Poster: movie.Poster,
  Type: movie.Type
})

const isFavoriteMovie = (imdbID) => favoriteMovies.has(imdbID)

const toggleFavoriteMovie = (movie) => {
  const isFavorite = isFavoriteMovie(movie.imdbID)

  if (isFavorite) {
    favoriteMovies.delete(movie.imdbID)
  } else {
    favoriteMovies.set(movie.imdbID, normalizeFavoriteMovie(movie))
  }

  saveFavoriteMovies()
  setMovieFavoriteState(movie.imdbID, !isFavorite)

  if (isFavorite && isShowingFavorites) {
    removeMovieFromList(movie.imdbID)

    if (favoriteMovies.size === 0) {
      setStatusMessage('No favorite movies yet')
    }
  }

  return !isFavorite
}

const renderMovies = (movies) => {
  hideStatusMessage()
  movies.forEach((movie) => addMovieToList(movie, handleMovieSelect, isFavoriteMovie(movie.imdbID)))
}

const handleMovieSelect = async (movie) => {
  if (activeDetailsRequest) {
    activeDetailsRequest.abort()
  }

  activeDetailsRequest = new AbortController()
  showMovieDetailsLoading(movie.Title)

  try {
    const movieDetails = await getMovieDetails(movie.imdbID, activeDetailsRequest.signal)
    renderMovieDetails(movieDetails, isFavoriteMovie(movieDetails.imdbID), toggleFavoriteMovie)
  } catch (error) {
    if (error.name !== 'AbortError') {
      renderMovieDetailsError(error.message)

      if (error.code !== MOVIE_NOT_FOUND_ERROR) {
        showError(error.message)
      }
    }
  } finally {
    activeDetailsRequest = null
  }
}

const resetSearch = () => {
  if (activeRequest) {
    activeRequest.abort()
    activeRequest = null
  }

  searchLast = ''
  isShowingFavorites = false
  inputSearch.value = ''
  clearMoviesMarkup()
  hideError()
  setClearButtonVisibility(false)
  setStatusMessage('Start typing a movie title')
  inputSearch.focus()
}

const showFavoriteMovies = () => {
  isShowingFavorites = true
  searchLast = ''
  inputSearch.value = ''
  clearMoviesMarkup()
  hideError()
  setClearButtonVisibility(false)

  const favorites = [...favoriteMovies.values()]

  if (favorites.length === 0) {
    setStatusMessage('No favorite movies yet')
    inputSearch.focus()
    return
  }

  renderMovies(favorites)
}

const inputSearchHandler = (event) => {
  debounce(async () => {
    const searchString = event.target.value.trim()

    isShowingFavorites = false
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

    clearMoviesMarkup()

    setStatusMessage('Searching...')

    try {
      const movies = await searchMovies(searchString, activeRequest.signal)
      renderMovies(movies)
    } catch (error) {
      if (error.name !== 'AbortError') {
        clearMoviesMarkup()

        if (error.code === MOVIE_NOT_FOUND_ERROR) {
          setStatusMessage(error.message)
          return
        }

        setStatusMessage('Search is temporarily unavailable')
        showError(error.message)
      }
    }
  }, DEBOUNCE_DELAY)
}

export const appInit = () => {
  loadFavoriteMovies()
  renderApp()
  setFavoriteMoviesButtonCount(favoriteMovies.size)
  inputSearch.addEventListener('input', inputSearchHandler)
  clearSearchButton.addEventListener('click', resetSearch)
  favoriteMoviesButton.addEventListener('click', showFavoriteMovies)
}
