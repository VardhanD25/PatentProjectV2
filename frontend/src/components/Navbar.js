// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleClick = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <header className="fixed w-full z-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-[#163d64]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div>
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
              >
                <img 
                  src="/logo.jpg" 
                  alt="Company Logo" 
                  className="h-16 w-16 object-contain"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              {user ? (
                <div className="flex items-center space-x-8">
                  <NavLink to="/addpart">Add Part</NavLink>
                  <NavLink to="/userinput">Evaluation</NavLink>
                  <NavLink to="/parts-management">Parts Management</NavLink>
                  <NavLink to="/standard-alloy-management">Alloy Management</NavLink>
                  <NavLink to="/element-management">Element Management</NavLink>
                  
                  {/* Profile Menu */}
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-9 h-9 rounded-lg bg-[#163d64]/5 hover:bg-[#163d64]/10 border border-[#163d64]/10 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-[#163d64]">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-[#163d64]/10 shadow-lg">
                        <div className="p-3 border-b border-[#163d64]/10">
                          <p className="text-xs text-[#163d64]/60">Signed in as</p>
                          <p className="text-sm font-medium text-[#163d64] truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={handleClick}
                            className="w-full text-left px-3 py-2 text-sm text-[#163d64] hover:bg-[#163d64]/5 rounded-md transition-colors duration-300"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink to="/login">Login</NavLink>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-[#fa4516] text-white font-medium rounded-lg hover:bg-[#fa4516]/90 transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

// NavLink component with updated styling
const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-[#163d64]/70 hover:text-[#163d64] transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default Navbar;
