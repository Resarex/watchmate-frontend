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
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="input-field pl-12 pr-4 py-4 text-lg"
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div>
          {query && (
            <h2 className="text-2xl font-bold mb-6">
              Search results for "{query}"
              <span className="text-slate-500 text-lg ml-2">
                ({movies.length} {movies.length === 1 ? 'result' : 'results'})
              </span>
            </h2>
          )}

          {movies.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <SearchIcon size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {query ? `No movies found for "${query}"` : 'Search for movies to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 