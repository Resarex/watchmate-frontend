import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, PlayCircle, Plus, Check } from 'lucide-react';
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
      fetchMovieDetails(); // Refresh to update rating
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Movie Header */}
      <div className="card">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Poster */}
          <div className="aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Star size={64} />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-400">
              {movie.release_year && (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>{movie.release_year}</span>
                </div>
              )}
              
              {movie.duration && (
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{movie.duration} min</span>
                </div>
              )}

              {movie.avg_rating > 0 && (
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="font-semibold">{movie.avg_rating.toFixed(1)}</span>
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
                    className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Storyline */}
            <p className="text-slate-300 mb-6">{movie.storyline}</p>

            {/* Platform */}
            {movie.platform && (
              <div className="mb-6">
                <span className="text-slate-400">Available on: </span>
                <span className="text-primary-400 font-medium">{movie.platform}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
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
                  className="btn-secondary flex items-center space-x-2"
                >
                  {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              )}
            </div>

            {/* Cast & Directors */}
            {(movie.actors?.length > 0 || movie.directors?.length > 0) && (
              <div className="mt-6 space-y-4">
                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Directors</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.directors.map((credit) => (
                        <span key={credit.id} className="text-slate-300">
                          {credit.person.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {movie.actors && movie.actors.length > 0 && (
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Cast</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.actors.map((credit) => (
                        <span key={credit.id} className="text-slate-300">
                          {credit.person.name}
                          {credit.character_name && (
                            <span className="text-slate-500"> as {credit.character_name}</span>
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
        <h2 className="text-2xl font-bold">Reviews</h2>

        {/* Submit Review Form */}
        {isAuthenticated ? (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? 'text-yellow-500 fill-current' : 'text-slate-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="spoiler"
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="spoiler" className="text-sm text-slate-400">
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
          <div className="card text-center">
            <p className="text-slate-400">
              <Link to="/login" className="text-primary-400 hover:underline">
                Login
              </Link>{' '}
              to write a review
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="card text-center text-slate-400">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{review.review_user}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
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

                  {review.is_spoiler && (
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                      Spoiler
                    </span>
                  )}
                </div>

                <p className="text-slate-300">{review.description}</p>

                {review.helpful_count > 0 && (
                  <p className="text-sm text-slate-500 mt-2">
                    {review.helpful_count} people found this helpful
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