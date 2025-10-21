import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, PlayCircle, Plus, Check, Users, AlertCircle } from 'lucide-react';
import movieService from '../api/movieService';
import useAuthStore from '../store/authStore';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await movieService.getMovieById(id);
      setMovie(response.data);
    } catch (error) {
      console.error('Failed to fetch movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await movieService.getReviews(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      await movieService.createReview(id, {
        rating,
        description: reviewText,
        is_spoiler: isSpoiler,
      });
      
      setReviewText('');
      setRating(5);
      setIsSpoiler(false);
      fetchReviews();
      fetchMovieDetails();
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      await movieService.addToWatchlist({
        watchlist_id: id,
        status: 'want_to_watch',
      });
      setInWatchlist(true);
      alert('Added to watchlist!');
    } catch (error) {
      alert('Failed to add to watchlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="card text-center py-16 mx-4">
        <AlertCircle size={64} className="mx-auto text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 page-transition">
      {/* Movie Header */}
      <div className="card card-hover">
        <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr] gap-8">
          {/* Poster */}
          <div className="aspect-[2/3] bg-dark-400 rounded-xl overflow-hidden shadow-2xl hover-lift relative group">
            {movie.poster ? (
              <>
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Star size={64} />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-400">
              {movie.release_year && (
                <div className="flex items-center space-x-2 bg-secondary-500/20 px-3 py-1.5 rounded-lg">
                  <Calendar size={18} />
                  <span className="font-medium">{movie.release_year}</span>
                </div>
              )}
              
              {movie.duration && (
                <div className="flex items-center space-x-2 bg-secondary-500/20 px-3 py-1.5 rounded-lg">
                  <Clock size={18} />
                  <span className="font-medium">{movie.duration} min</span>
                </div>
              )}

              {movie.avg_rating > 0 && (
                <div className="flex items-center space-x-2 bg-primary-500/20 px-3 py-1.5 rounded-lg border border-primary-500/30">
                  <Star size={18} fill="currentColor" className="text-primary-500" />
                  <span className="font-bold text-primary-500">{movie.avg_rating.toFixed(1)}</span>
                  <span className="text-slate-500">({movie.number_rating} reviews)</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 rounded-full text-sm font-medium border border-primary-500/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Storyline */}
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{movie.storyline}</p>

            {/* Platform */}
            {movie.platform && (
              <div className="mb-6 flex items-center space-x-2">
                <span className="text-slate-400">Available on:</span>
                <span className="text-primary-400 font-semibold">{movie.platform}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {movie.trailer_url && (
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlayCircle size={20} />
                  <span>Watch Trailer</span>
                </a>
              )}

              {isAuthenticated && (
                <button
                  onClick={handleAddToWatchlist}
                  disabled={inWatchlist}
                  className={inWatchlist ? 'btn-secondary flex items-center space-x-2 opacity-75' : 'btn-outline flex items-center space-x-2'}
                >
                  {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              )}
            </div>

            {/* Cast & Directors */}
            {(movie.actors?.length > 0 || movie.directors?.length > 0) && (
              <div className="mt-8 space-y-4 pt-6 border-t border-secondary-500/30">
                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center space-x-2">
                      <Users size={16} />
                      <span>Directors</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.directors.map((credit) => (
                        <span key={credit.id} className="px-3 py-1.5 bg-secondary-500/20 text-slate-300 rounded-lg text-sm">
                          {credit.person.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {movie.actors && movie.actors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center space-x-2">
                      <Users size={16} />
                      <span>Cast</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.actors.map((credit) => (
                        <span key={credit.id} className="px-3 py-1.5 bg-secondary-500/20 text-slate-300 rounded-lg text-sm">
                          {credit.person.name}
                          {credit.character_name && (
                            <span className="text-slate-500"> • {credit.character_name}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">Reviews</h2>

        {/* Submit Review Form */}
        {isAuthenticated ? (
          <div className="card card-hover">
            <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-300">Your Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={star <= rating ? 'text-primary-500 fill-current' : 'text-slate-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="input-field h-32 resize-none"
                  placeholder="Share your thoughts about this movie..."
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="spoiler"
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                  className="w-4 h-4 rounded border-secondary-500/30 bg-dark-400 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="spoiler" className="text-sm text-slate-400 cursor-pointer">
                  Contains spoilers
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-slate-400 text-lg">
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium underline">
                Login
              </Link>{' '}
              to write a review
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="card text-center py-12">
              <Star size={64} className="mx-auto text-slate-600 mb-4 opacity-50" />
              <p className="text-slate-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="card card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{review.review_user[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{review.review_user}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? 'text-primary-500 fill-current'
                                  : 'text-slate-600'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.created).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.is_spoiler && (
                    <span className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 font-medium">
                      Spoiler
                    </span>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed">{review.description}</p>

                {review.helpful_count > 0 && (
                  <p className="text-sm text-slate-500 mt-3 flex items-center space-x-1">
                    <span>👍</span>
                    <span>{review.helpful_count} people found this helpful</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;