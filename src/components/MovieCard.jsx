import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-slate-800 relative overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <Star size={48} />
          </div>
        )}
        
        {/* Rating Badge */}
        {movie.avg_rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="text-yellow-500" size={16} fill="currentColor" />
            <span className="text-white text-sm font-semibold">
              {movie.avg_rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-slate-400">
          {movie.release_year && (
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{movie.release_year}</span>
            </div>
          )}

          {movie.platform && (
            <span className="text-primary-400 text-xs">
              {movie.platform}
            </span>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;