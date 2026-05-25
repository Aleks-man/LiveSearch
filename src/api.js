const API_KEY = 'ca956212'
const API_URL = 'https://www.omdbapi.com/'

export const searchMovies = async (searchString, signal) => {
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
