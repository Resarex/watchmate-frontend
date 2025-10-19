import { useState, useEffect } from 'react';
import { List, Trash2 } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <List className="text-primary-500" size={32} />
          <h1 className="text-3xl font-bold">My Watchlist</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All ({watchlist.length})
          </button>
          <button
            onClick={() => setFilter('want_to_watch')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'want_to_watch'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Want to Watch
          </button>
          <button
            onClick={() => setFilter('watching')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'watching'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Watching
          </button>
          <button
            onClick={() => setFilter('watched')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'watched'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Watched
          </button>
        </div>
      </div>

      {filteredWatchlist.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">
            {filter === 'all'
              ? 'Your watchlist is empty. Start adding movies!'
              : `No movies in "${filter.replace('_', ' ')}" category`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start gap-6">
                {/* Poster */}
                <Link
                  to={`/movie/${item.watchlist_detail.id}`}
                  className="flex-shrink-0 w-24 aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
                >
                  {item.watchlist_detail.poster ? (
                    <img
                      src={item.watchlist_detail.poster}
                      alt={item.watchlist_detail.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <List size={32} />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    to={`/movie/${item.watchlist_detail.id}`}
                    className="text-xl font-bold hover:text-primary-400 transition-colors"
                  >
                    {item.watchlist_detail.title}
                  </Link>

                  <p className="text-slate-400 mt-2 line-clamp-2">
                    {item.watchlist_detail.storyline}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    {item.watchlist_detail.release_year && (
                      <span className="text-sm text-slate-500">
                        {item.watchlist_detail.release_year}
                      </span>
                    )}

                    {item.watchlist_detail.platform && (
                      <span className="text-sm text-primary-400">
                        {item.watchlist_detail.platform}
                      </span>
                    )}

                    {item.watchlist_detail.avg_rating > 0 && (
                      <span className="text-sm text-yellow-500">
                        ⭐ {item.watchlist_detail.avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {item.watchlist_detail.genres && item.watchlist_detail.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.watchlist_detail.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value="want_to_watch">Want to Watch</option>
                    <option value="watching">Watching</option>
                    <option value="watched">Watched</option>
                  </select>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="btn-secondary py-2 px-4 flex items-center justify-center space-x-2 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
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