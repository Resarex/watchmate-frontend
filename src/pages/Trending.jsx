import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import movieService from '../api/movieService';
import MovieCard from '../components/MovieCard';

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await movieService.getTrending();
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch trending movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 page-transition">
      <div className="flex items-center space-x-4 mb-8 md:mb-10">
        <div className="p-3 bg-primary-500/20 rounded-xl">
          <TrendingUp className="text-primary-500" size={36} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Trending This Week</h1>
          <p className="text-slate-400 mt-1">Most watched movies in the last 7 days</p>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="card text-center py-16">
          <TrendingUp size={64} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No trending movies found</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="animate-slide-up">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;