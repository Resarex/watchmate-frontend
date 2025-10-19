import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.username}</h1>
              <p className="text-slate-400 flex items-center space-x-2">
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
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </>
            ) : (
              <>
                <Edit2 size={18} />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input-field h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-slate-300">
                {profile?.bio || 'No bio added yet'}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              {editing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Your location"
                  />
                </div>
              ) : (
                <p className="text-slate-300 flex items-center space-x-2">
                  <MapPin size={16} className="text-slate-500" />
                  <span>{profile?.location || 'Not specified'}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Birth Date</label>
              {editing ? (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              ) : (
                <p className="text-slate-300 flex items-center space-x-2">
                  <Calendar size={16} className="text-slate-500" />
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
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-500">
              {statistics.total_reviews}
            </p>
            <p className="text-slate-400 mt-2">Reviews Written</p>
          </div>

          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-500">
              {statistics.watchlist?.total || 0}
            </p>
            <p className="text-slate-400 mt-2">Movies in Watchlist</p>
          </div>

          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-500">
              {statistics.average_rating.toFixed(1)}
            </p>
            <p className="text-slate-400 mt-2">Average Rating</p>
          </div>
        </div>
      )}

      {/* Watchlist Breakdown */}
      {statistics?.watchlist && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Watchlist Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">
                {statistics.watchlist.want_to_watch}
              </p>
              <p className="text-sm text-slate-400 mt-1">Want to Watch</p>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">
                {statistics.watchlist.watching}
              </p>
              <p className="text-sm text-slate-400 mt-1">Watching</p>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-green-400">
                {statistics.watchlist.watched}
              </p>
              <p className="text-sm text-slate-400 mt-1">Watched</p>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Genres */}
      {statistics?.favorite_genres && statistics.favorite_genres.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Favorite Genres</h2>
          <div className="flex flex-wrap gap-3">
            {statistics.favorite_genres.map((genre, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full"
              >
                {genre.name} ({genre.count})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;