import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Camera, Save, Award, Calendar, Briefcase } from 'lucide-react';
import api from '../services/api';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || '',
        skills: user.skills || '',
      });
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        profileImage: profileImage || undefined,
      };
      const response = await api.put('/auth/profile', updateData);
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            {/* Profile Image */}
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-4xl font-bold">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials()
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {user?.subscription}
                </div>
                <div className="text-xs text-gray-600">Subscription</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {user?.role}
                </div>
                <div className="text-xs text-gray-600">Role</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-6 pt-6 border-t flex items-center justify-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <p className="text-gray-900 py-2 bg-gray-50 px-3 rounded-lg">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Tell us about yourself, your experience, and career goals..."
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.bio || 'No bio added yet'}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-2" />
                  Skills
                </label>
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="input"
                      placeholder="JavaScript, React, Python, Leadership, etc."
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.skills ? (
                      user.skills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setSuccess('');
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        bio: user?.bio || '',
                        skills: user?.skills || '',
                      });
                      setProfileImage(user?.profileImage || '');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
