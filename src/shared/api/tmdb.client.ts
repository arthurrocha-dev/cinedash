import axios from 'axios'

const BASE_URL = import.meta.env['VITE_TMDB_BASE_URL'] ?? 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env['VITE_TMDB_API_KEY'] ?? ''

export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
})

tmdbClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { status_message?: string })?.status_message
        ?? error.message
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  },
)
