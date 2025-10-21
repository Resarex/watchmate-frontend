import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Clock, Search, Sparkles } from 'lucide-react';
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
      navigate(`/search?q=${searchQuery}`);
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
    <div className="space-y-12 md:space-y-16 page-transition">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-primary-500 mr-2" size={32} />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient">
              Welcome to WatchMate
            </h1>
            <Sparkles className="text-primary-500 ml-2" size={32} />
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 md:mb-10">
            Discover, rate, and track your favorite movies and TV shows
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="input-field pl-14 pr-6 py-5 text-lg rounded-2xl shadow-lg shadow-primary-500/10 focus:shadow-primary-500/30"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Trending Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <TrendingUp className="text-primary-500" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <Link
            to="/trending"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors flex items-center space-x-1 group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="movie-grid">
          {trending.slice(0, 6).map((movie) => (
            <div key={movie.id} className="animate-slide-up">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="text-yellow-500" size={28} fill="currentColor" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Popular</h2>
          </div>
          <Link
            to="/popular"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors flex items-center space-x-1 group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="movie-grid">
          {popular.slice(0, 6).map((movie) => (
            <div key={movie.id} className="animate-slide-up">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Section */}
      <section className="px-4 pb-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Clock className="text-primary-500" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Recently Added</h2>
          </div>
        </div>
        <div className="movie-grid">
          {recent.slice(0, 6).map((movie) => (
            <div key={movie.id} className="animate-slide-up">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;