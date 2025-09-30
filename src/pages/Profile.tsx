import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  User, 
  Edit, 
  Save, 
  Mail, 
  Briefcase, 
  DollarSign, 
  Building, 
  TrendingUp,
  Target,
  Users,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { startups, jobs } = useData();
  const { addNotification } = useNotifications();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    bio: '',
    location: {
      city: user?.location?.city || '',
      country: user?.location?.country || ''
    },
    // Job seeker specific
    skills: [] as string[],
    desiredSalary: 0,
    education: [] as Array<{
      degree: string;
      field: string;
      institution: string;
      graduationYear: string;
      gpa: string;
    }>,
    experience: [] as Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
      current: boolean;
    }>,
    certifications: [] as string[],
    languages: [] as string[],
    // Investor specific
    investmentRange: '',
    sectors: [] as string[],
    geography: [] as string[]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-[#B8860B] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please log in</h2>
          <p className="text-gray-300">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userStartup = startups.find(s => s.founderId === user.id);
  const userJobs = jobs.filter(j => j.startupId === userStartup?.id);

  const handleSaveProfile = async () => {
    try {
      await updateUser({
        name: editedProfile.name,
        location: editedProfile.location.city ? editedProfile.location : undefined
      });
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully!'
      });
      
      setIsEditing(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update your profile. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-300 capitalize">{user.role} Profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#B8860B] hover:text-[#A67C00] transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="+20 (123) 456-7890"
                    />
                  ) : (
                    <p className="text-white">{editedProfile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedProfile.linkedin}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  ) : (
                    <p className="text-white">{editedProfile.linkedin || 'Not provided'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editedProfile.location.city}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value }
                        }))}
                        className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={editedProfile.location.country}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          location: { ...prev.location, country: e.target.value }
                        }))}
                        className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                  ) : (
                    <p className="text-white">
                      {editedProfile.location.city && editedProfile.location.country 
                        ? `${editedProfile.location.city}, ${editedProfile.location.country}`
                        : 'Not provided'
                      }
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white">{editedProfile.bio || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Role-specific content */}
            {user.role === 'startup' && userStartup && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Startup Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {userStartup.name.charAt(0)}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{userStartup.name}</h4>
                    <p className="text-gray-300 text-sm">{userStartup.sector}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-[#B8860B] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{userStartup.teamSize}</p>
                    <p className="text-gray-300 text-sm">Team Size</p>
                  </div>
                  <div className="text-center">
                    <Briefcase className="w-8 h-8 text-[#B8860B] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{userJobs.length}</p>
                    <p className="text-gray-300 text-sm">Job Postings</p>
                  </div>
                </div>
              </div>
            )}

            {/* Job Seeker specific content */}
            {user.role === 'job_seeker' && (
              <div className="space-y-6">
                {/* Skills Section */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => setEditedProfile(prev => ({
                              ...prev,
                              skills: prev.skills.filter(s => s !== skill)
                            }))}
                            className="text-[#B8860B] hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setEditedProfile(prev => ({
                          ...prev,
                          skills: [...prev.skills, newSkill.trim()]
                        })), setNewSkill(''))}
                      />
                      <button
                        onClick={() => {
                          if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
                            setEditedProfile(prev => ({
                              ...prev,
                              skills: [...prev.skills, newSkill.trim()]
                            }));
                            setNewSkill('');
                          }
                        }}
                        className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Desired Salary */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Desired Salary</h3>
                  {isEditing ? (
                    <div className="max-w-xs">
                      <input
                        type="number"
                        value={editedProfile.desiredSalary || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, desiredSalary: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="80000"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-2xl font-semibold">
                      {editedProfile.desiredSalary ? `$${editedProfile.desiredSalary.toLocaleString()}` : 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Certifications */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedProfile.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {cert}
                        {isEditing && (
                          <button
                            onClick={() => setEditedProfile(prev => ({
                              ...prev,
                              certifications: prev.certifications.filter(c => c !== cert)
                            }))}
                            className="text-blue-300 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="Add a certification"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setEditedProfile(prev => ({
                          ...prev,
                          certifications: [...prev.certifications, newCertification.trim()]
                        })), setNewCertification(''))}
                      />
                      <button
                        onClick={() => {
                          if (newCertification.trim() && !editedProfile.certifications.includes(newCertification.trim())) {
                            setEditedProfile(prev => ({
                              ...prev,
                              certifications: [...prev.certifications, newCertification.trim()]
                            }));
                            setNewCertification('');
                          }
                        }}
                        className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Languages */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedProfile.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {language}
                        {isEditing && (
                          <button
                            onClick={() => setEditedProfile(prev => ({
                              ...prev,
                              languages: prev.languages.filter(l => l !== language)
                            }))}
                            className="text-green-300 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        placeholder="Add a language"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setEditedProfile(prev => ({
                          ...prev,
                          languages: [...prev.languages, newLanguage.trim()]
                        })), setNewLanguage(''))}
                      />
                      <button
                        onClick={() => {
                          if (newLanguage.trim() && !editedProfile.languages.includes(newLanguage.trim())) {
                            setEditedProfile(prev => ({
                              ...prev,
                              languages: [...prev.languages, newLanguage.trim()]
                            }));
                            setNewLanguage('');
                          }
                        }}
                        className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Investor specific content */}
            {user.role === 'investor' && (
              <div className="space-y-6">
                {/* Investment Preferences */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Investment Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Investment Range</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.investmentRange}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, investmentRange: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                          placeholder="$10K - $100K"
                        />
                      ) : (
                        <p className="text-white">{editedProfile.investmentRange || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Sectors</label>
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.sectors.map((sector, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-sm"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Overview */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Portfolio Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-[#B8860B] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-gray-300 text-sm">Active Investments</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-[#B8860B] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">$0</p>
                      <p className="text-gray-300 text-sm">Total Invested</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-8 h-8 text-[#B8860B] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-gray-300 text-sm">Startups Tracked</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Profile Complete</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Member since 2024</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user.role === 'job_seeker' && (
                  <>
                    <button className="w-full bg-[#B8860B] text-white py-2 px-4 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center justify-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Browse Jobs</span>
                    </button>
                    <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Update Resume</span>
                    </button>
                  </>
                )}
                
                {user.role === 'startup' && (
                  <>
                    <button className="w-full bg-[#B8860B] text-white py-2 px-4 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center justify-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Post Job</span>
                    </button>
                    <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Edit Startup</span>
                    </button>
                  </>
                )}
                
                {user.role === 'investor' && (
                  <>
                    <button className="w-full bg-[#B8860B] text-white py-2 px-4 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center justify-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Browse Startups</span>
                    </button>
                    <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Set Preferences</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;