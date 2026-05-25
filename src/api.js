const API_KEY = 'ca956212'
const API_URL = 'https://www.omdbapi.com/'

const createApiError = (message, code) => {
  const error = new Error(message)
  error.code = code
  return error
}

export const searchMovies = async (searchString, signal) => {
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchString)}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw createApiError('Search service is unavailable. Please try again later.', 'SERVICE_ERROR')
  }

  const data = await response.json()

  if (data.Response === 'False') {
    throw createApiError('No matches found. Try another title or check the spelling.', 'MOVIE_NOT_FOUND')
  }

  return data.Search
}

export const getMovieDetails = async (imdbID, signal) => {
  const url = `${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw createApiError('Movie details are unavailable. Please try again later.', 'SERVICE_ERROR')
  }

  const data = await response.json()

  if (data.Response === 'False') {
    throw createApiError('Movie details are not found. Please try another title.', 'MOVIE_DETAILS_NOT_FOUND')
  }

  return data
}
