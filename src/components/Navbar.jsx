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
    <nav className="bg-secondary-500/20 backdrop-blur-md border-b border-secondary-500/30 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-all duration-200 group"
          >
            <Film size={32} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              WatchMate
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="nav-link flex items-center space-x-2"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/trending"
              className="nav-link flex items-center space-x-2"
            >
              <TrendingUp size={18} />
              <span>Trending</span>
            </Link>

            <Link
              to="/popular"
              className="nav-link flex items-center space-x-2"
            >
              <Star size={18} />
              <span>Popular</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-watchlist"
                className="nav-link flex items-center space-x-2"
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
                  className="hidden md:flex items-center space-x-2 text-slate-300 hover:text-primary-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="font-medium">{user?.username || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-primary-500 font-medium transition-colors"
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

        {/* Mobile Nav Links */}
        <div className="md:hidden flex items-center justify-around py-3 border-t border-secondary-500/30">
          <Link to="/" className="nav-link flex flex-col items-center space-y-1">
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/trending" className="nav-link flex flex-col items-center space-y-1">
            <TrendingUp size={20} />
            <span className="text-xs">Trending</span>
          </Link>
          <Link to="/popular" className="nav-link flex flex-col items-center space-y-1">
            <Star size={20} />
            <span className="text-xs">Popular</span>
          </Link>
          {isAuthenticated && (
            <Link to="/my-watchlist" className="nav-link flex flex-col items-center space-y-1">
              <List size={20} />
              <span className="text-xs">My List</span>
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/profile" className="nav-link flex flex-col items-center space-y-1">
              <User size={20} />
              <span className="text-xs">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;