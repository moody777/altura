import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Building, 
  Briefcase, 
  TrendingUp, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  Crown
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      // You could add a toast notification here
    } finally {
      setSigningOut(false);
    }
  };

  const navItems = [
    { path: '/', label: 'Explore', icon: Home },
    ...(user?.role === 'startup' ? [{ path: '/my-startup', label: 'My Startup', icon: Building }] : []),
    ...(user?.role === 'job_seeker' ? [{ path: '/my-jobs', label: 'My Jobs', icon: Briefcase }] : []),
    ...(user?.role === 'investor' ? [{ path: '/my-investments', label: 'My Investments', icon: TrendingUp }] : []),
    ...(user ? [{ path: '/connections', label: 'Connections', icon: MessageCircle }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#B8860B] rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Altura</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-[#B8860B] text-white'
                      : 'text-gray-300 hover:text-[#B8860B] hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/profile')
                        ? 'bg-[#B8860B] text-white'
                        : 'text-gray-300 hover:text-[#B8860B] hover:bg-gray-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user.name}</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut || loading}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">
                      {signingOut ? 'Signing Out...' : 'Sign Out'}
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg text-sm font-medium hover:bg-[#A67C00] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-[#B8860B] text-white'
                      : 'text-gray-300 hover:text-[#B8860B] hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {user && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/profile')
                        ? 'bg-[#B8860B] text-white'
                        : 'text-gray-300 hover:text-[#B8860B] hover:bg-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    disabled={signingOut || loading}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;