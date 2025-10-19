import api from './axios';

export const movieService = {
  // Get all movies with filters
  getMovies: (params = {}) => api.get('/watch/list/', { params }),

  // Get movie details
  getMovieById: (id) => api.get(`/watch/${id}/`),

  // Get similar movies
  getSimilarMovies: (id) => api.get(`/watch/${id}/similar/`),

  // Get trending movies
  getTrending: () => api.get('/watch/trending/'),

  // Get popular movies
  getPopular: () => api.get('/watch/popular/'),

  // Get recent movies
  getRecent: () => api.get('/watch/recent/'),

  // Get top rated movies
  getTopRated: () => api.get('/watch/top-rated/'),

  // Get genres
  getGenres: () => api.get('/watch/genres/'),

  // Get platforms
  getPlatforms: () => api.get('/watch/stream/'),

  // Reviews
  getReviews: (movieId) => api.get(`/watch/${movieId}/reviews/`),
  createReview: (movieId, data) => api.post(`/watch/${movieId}/reviews/create/`, data),
  updateReview: (reviewId, data) => api.put(`/watch/reviews/${reviewId}/`, data),
  deleteReview: (reviewId) => api.delete(`/watch/reviews/${reviewId}/`),
  markReviewHelpful: (reviewId) => api.post(`/watch/reviews/${reviewId}/helpful/`),

  // User watchlist
  getMyWatchlist: () => api.get('/watch/my-watchlist/'),
  addToWatchlist: (data) => api.post('/watch/my-watchlist/', data),
  updateWatchlistStatus: (id, data) => api.put(`/watch/my-watchlist/${id}/`, data),
  removeFromWatchlist: (id) => api.delete(`/watch/my-watchlist/${id}/`),

  // Statistics
  getStatistics: () => api.get('/watch/statistics/'),
  getMyStatistics: () => api.get('/watch/my-statistics/'),

  // Profile
  getMyProfile: () => api.get('/watch/profile/me/'),
  updateMyProfile: (data) => api.put('/watch/profile/me/', data),
  getUserProfile: (username) => api.get(`/watch/profile/${username}/`),

  // Search
  searchMovies: (query) => api.get('/watch/list/', { params: { search: query } }),
};

export default movieService;