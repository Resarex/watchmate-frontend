import { useState, useEffect } from 'react';
import { List, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import movieService from '../api/movieService';

const MyWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await movieService.getMyWatchlist();
      setWatchlist(response.data);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await movieService.updateWatchlistStatus(id, { status: newStatus });
      fetchWatchlist();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Remove this movie from your watchlist?')) {
      try {
        await movieService.removeFromWatchlist(id);
        fetchWatchlist();
      } catch (error) {
        alert('Failed to remove from watchlist');
      }
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusCount = (status) => {
    if (status === 'all') return watchlist.length;
    return watchlist.filter((item) => item.status === status).length;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-500/20 rounded-xl">
            <List className="text-primary-500" size={36} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">My Watchlist</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-secondary-500/20 text-slate-400 hover:bg-secondary-500/30 border border-secondary-500/30'
            }`}
          >
            All ({getStatusCount('all')})
          </button>
          <button
            onClick={() => setFilter('want_to_watch')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'want_to_watch'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-secondary-500/20 text-slate-400 hover:bg-secondary-500/30 border border-secondary-500/30'
            }`}
          >
            Want to Watch ({getStatusCount('want_to_watch')})
          </button>
          <button
            onClick={() => setFilter('watching')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'watching'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-secondary-500/20 text-slate-400 hover:bg-secondary-500/30 border border-secondary-500/30'
            }`}
          >
            Watching ({getStatusCount('watching')})
          </button>
          <button
            onClick={() => setFilter('watched')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'watched'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-secondary-500/20 text-slate-400 hover:bg-secondary-500/30 border border-secondary-500/30'
            }`}
          >
            Watched ({getStatusCount('watched')})
          </button>
        </div>
      </div>

      {filteredWatchlist.length === 0 ? (
        <div className="card text-center py-16">
          <List size={64} className="mx-auto text-slate-600 mb-4 opacity-50" />
          <p className="text-slate-400 text-lg">
            {filter === 'all'
              ? 'Your watchlist is empty. Start adding movies!'
              : `No movies in "${filter.replace('_', ' ')}" category`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="card card-hover animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Poster */}
                <Link
                  to={`/movie/${item.watchlist_detail.id}`}
                  className="flex-shrink-0 w-full sm:w-32 aspect-[2/3] bg-dark-400 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all shadow-lg group"
                >
                  {item.watchlist_detail.poster ? (
                    <>
                      <img
                        src={item.watchlist_detail.poster}
                        alt={item.watchlist_detail.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent opacity-60" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <List size={32} />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/movie/${item.watchlist_detail.id}`}
                    className="text-xl md:text-2xl font-bold hover:text-primary-400 transition-colors block mb-2"
                  >
                    {item.watchlist_detail.title}
                  </Link>

                  <p className="text-slate-400 line-clamp-2 mb-4">
                    {item.watchlist_detail.storyline}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {item.watchlist_detail.release_year && (
                      <span className="text-sm text-slate-500 bg-secondary-500/20 px-3 py-1 rounded-lg">
                        {item.watchlist_detail.release_year}
                      </span>
                    )}

                    {item.watchlist_detail.platform && (
                      <span className="text-sm text-primary-400 font-medium bg-primary-500/10 px-3 py-1 rounded-lg border border-primary-500/30">
                        {item.watchlist_detail.platform}
                      </span>
                    )}

                    {item.watchlist_detail.avg_rating > 0 && (
                      <span className="text-sm flex items-center space-x-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg border border-yellow-500/30">
                        <Star size={14} fill="currentColor" />
                        <span className="font-semibold">{item.watchlist_detail.avg_rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {item.watchlist_detail.genres && item.watchlist_detail.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.watchlist_detail.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="text-xs px-2.5 py-1 bg-secondary-500/20 text-slate-400 rounded-full border border-secondary-500/30"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-3 sm:w-48">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="input-field py-2.5 text-sm flex-1 sm:flex-none"
                  >
                    <option value="want_to_watch">Want to Watch</option>
                    <option value="watching">Watching</option>
                    <option value="watched">Watched</option>
                  </select>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="btn-secondary py-2.5 px-4 flex items-center justify-center space-x-2 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWatchlist;