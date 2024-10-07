import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Video, Upload, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Video className="mr-2" /> VideoLib
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="hover:text-blue-200 flex items-center">
                  <Upload className="mr-1" size={18} /> Upload
                </Link>
                <Link to="/profile" className="hover:text-blue-200 flex items-center">
                  <User className="mr-1" size={18} /> {user?.username}
                </Link>
                <button onClick={logout} className="hover:text-blue-200 flex items-center">
                  <LogOut className="mr-1" size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="hover:text-blue-200">Sign In</Link>
                <Link to="/signup" className="hover:text-blue-200">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;