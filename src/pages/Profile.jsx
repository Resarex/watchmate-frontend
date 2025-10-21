import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, TrendingUp, Star, List as ListIcon } from 'lucide-react';
import movieService from '../api/movieService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    birth_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStatistics();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await movieService.getMyProfile();
      setProfile(response.data);
      setFormData({
        bio: response.data.bio || '',
        location: response.data.location || '',
        birth_date: response.data.birth_date || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await movieService.getMyStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await movieService.updateMyProfile(formData);
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto px-4 space-y-6 page-transition">
      {/* Profile Header */}
      <div className="card card-hover">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/50">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">{profile?.username}</h1>
              <p className="text-slate-400 flex items-center space-x-2 mt-2">
                <Mail size={16} />
                <span>{profile?.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            {editing ? (
              <>
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </>
            ) : (
              <>
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Bio</label>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input-field h-28 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-slate-300 text-lg leading-relaxed bg-secondary-500/10 rounded-lg p-4 border border-secondary-500/20">
                {profile?.bio || 'No bio added yet'}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Location</label>
              {editing ? (
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="Your location"
                  />
                </div>
              ) : (
                <p className="text-slate-300 flex items-center space-x-3 bg-secondary-500/10 rounded-lg p-3 border border-secondary-500/20">
                  <MapPin size={18} className="text-primary-500" />
                  <span>{profile?.location || 'Not specified'}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Birth Date</label>
              {editing ? (
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="input-field pl-12"
                  />
                </div>
              ) : (
                <p className="text-slate-300 flex items-center space-x-3 bg-secondary-500/10 rounded-lg p-3 border border-secondary-500/20">
                  <Calendar size={18} className="text-primary-500" />
                  <span>
                    {profile?.birth_date
                      ? new Date(profile.birth_date).toLocaleDateString()
                      : 'Not specified'}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card card-hover text-center bg-gradient-to-br from-primary-500/10 to-primary-600/10 border-primary-500/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Star size={32} className="text-primary-500" />
              </div>
            </div>
            <p className="text-4xl font-bold text-primary-500 mb-2">
              {statistics.total_reviews}
            </p>
            <p className="text-slate-400">Reviews Written</p>
          </div>

          <div className="card card-hover text-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <ListIcon size={32} className="text-yellow-500" />
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-500 mb-2">
              {statistics.watchlist?.total || 0}
            </p>
            <p className="text-slate-400">Movies in Watchlist</p>
          </div>

          <div className="card card-hover text-center bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp size={32} className="text-green-500" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-500 mb-2">
              {statistics.average_rating.toFixed(1)}
            </p>
            <p className="text-slate-400">Average Rating</p>
          </div>
        </div>
      )}

      {/* Watchlist Breakdown */}
      {statistics?.watchlist && (
        <div className="card card-hover">
          <h2 className="text-2xl font-bold mb-6 text-gradient">Watchlist Status</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/30 hover-lift">
              <p className="text-3xl font-bold text-blue-400 mb-2">
                {statistics.watchlist.want_to_watch}
              </p>
              <p className="text-sm text-slate-400">Want to Watch</p>
            </div>
            <div className="text-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/30 hover-lift">
              <p className="text-3xl font-bold text-yellow-400 mb-2">
                {statistics.watchlist.watching}
              </p>
              <p className="text-sm text-slate-400">Currently Watching</p>
            </div>
            <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/30 hover-lift">
              <p className="text-3xl font-bold text-green-400 mb-2">
                {statistics.watchlist.watched}
              </p>
              <p className="text-sm text-slate-400">Watched</p>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Genres */}
      {statistics?.favorite_genres && statistics.favorite_genres.length > 0 && (
        <div className="card card-hover">
          <h2 className="text-2xl font-bold mb-6 text-gradient">Favorite Genres</h2>
          <div className="flex flex-wrap gap-3">
            {statistics.favorite_genres.map((genre, index) => (
              <div
                key={index}
                className="px-5 py-3 bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 rounded-full border border-primary-500/30 font-medium hover-lift"
              >
                {genre.name} <span className="text-slate-500">({genre.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;