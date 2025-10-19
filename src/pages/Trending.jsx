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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <TrendingUp className="text-primary-500" size={32} />
        <h1 className="text-3xl font-bold">Trending This Week</h1>
      </div>

      {movies.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <p>No trending movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;