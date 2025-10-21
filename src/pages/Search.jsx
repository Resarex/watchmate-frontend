import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import movieService from '../api/movieService';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      searchMovies(searchQuery);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const searchMovies = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await movieService.searchMovies(searchQuery);
      setMovies(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query);
      window.history.pushState({}, '', `?q=${query}`);
    }
  };

  return (
    <div className="px-4 page-transition">
      {/* Search Bar */}
      <div className="mb-8 md:mb-10">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={22} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="input-field pl-14 pr-6 py-5 text-lg rounded-2xl shadow-lg shadow-primary-500/10 focus:shadow-primary-500/30"
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="loading-spinner rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 animate-spin"></div>
        </div>
      ) : (
        <div>
          {query && (
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Search results for{' '}
              <span className="text-gradient">"{query}"</span>
              <span className="text-slate-500 text-lg md:text-xl ml-3">
                ({movies.length} {movies.length === 1 ? 'result' : 'results'})
              </span>
            </h2>
          )}

          {movies.length === 0 ? (
            <div className="card text-center py-16">
              <SearchIcon size={64} className="mx-auto text-slate-600 mb-4 opacity-50" />
              <p className="text-slate-400 text-lg">
                {query ? `No movies found for "${query}"` : 'Search for movies to get started'}
              </p>
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
      )}
    </div>
  );
};

export default Search;