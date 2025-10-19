import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Clock, Search } from 'lucide-react';
import movieService from '../api/movieService';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [trendingRes, popularRes, recentRes] = await Promise.all([
        movieService.getTrending(),
        movieService.getPopular(),
        movieService.getRecent(),
      ]);

      setTrending(trendingRes.data);
      setPopular(popularRes.data);
      setRecent(recentRes.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${searchQuery}`;
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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Welcome to WatchMate
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Discover, rate, and track your favorite movies and TV shows
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="input-field pl-12 pr-4 py-4 text-lg"
            />
          </div>
        </form>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-primary-500" size={24} />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <Link
            to="/trending"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trending.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold">Popular</h2>
          </div>
          <Link
            to="/popular"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popular.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Recent Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="text-primary-500" size={24} />
            <h2 className="text-2xl font-bold">Recently Added</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recent.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;