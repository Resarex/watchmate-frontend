import { Link } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block bg-secondary-500/10 backdrop-blur-sm rounded-xl overflow-hidden border border-secondary-500/20 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-dark-400 relative overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-500">
            <Star size={48} />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        {movie.avg_rating > 0 && (
          <div className="absolute top-3 right-3 bg-dark-500/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center space-x-1 border border-primary-500/30">
            <Star className="text-primary-500" size={14} fill="currentColor" />
            <span className="text-white text-sm font-bold">
              {movie.avg_rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Duration Badge */}
        {movie.duration && (
          <div className="absolute bottom-3 left-3 bg-dark-500/90 backdrop-blur-sm px-2 py-1 rounded flex items-center space-x-1">
            <Clock size={12} className="text-slate-400" />
            <span className="text-slate-300 text-xs">{movie.duration}m</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-xs md:text-sm text-slate-400 mb-2">
          {movie.release_year && (
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{movie.release_year}</span>
            </div>
          )}

          {movie.platform && (
            <span className="text-primary-400 text-xs font-medium">
              {movie.platform}
            </span>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 py-0.5 bg-secondary-500/30 text-slate-300 rounded-full border border-secondary-500/40"
              >
                {genre.name}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-xs px-2 py-0.5 text-slate-500">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;