import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, Home, TrendingUp, Star, List } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors">
            <Film size={28} />
            <span className="text-xl font-bold">WatchMate</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/trending"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <TrendingUp size={18} />
              <span>Trending</span>
            </Link>

            <Link
              to="/popular"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Star size={18} />
              <span>Popular</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-watchlist"
                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
              >
                <List size={18} />
                <span>My List</span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span>{user?.username || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;