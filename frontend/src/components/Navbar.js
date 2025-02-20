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

  const getLogoPath = () => {
    
    if (window.electron) {
      
      return './logo.jpg';  
    }
    
    return `${process.env.PUBLIC_URL}/logo.jpg`;
  };

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
                  src={getLogoPath()}
                  alt="Company Logo" 
                  className="h-16 w-16 object-contain"
                />
              </Link>
            </div>

            {/* Navigation Links - Only increased text size */}
            <nav className="flex items-center space-x-8">
              {user ? (
                <div className="flex items-center space-x-8">
                  <NavLink to="/addpart" className="text-xl">Add Part</NavLink>
                  <NavLink to="/userinput" className="text-xl">Evaluation</NavLink>
                  <NavLink to="/parts-management" className="text-xl">Parts Management</NavLink>
                  <NavLink to="/standard-alloy-management" className="text-xl">Alloy Management</NavLink>
                  <NavLink to="/element-management" className="text-xl">Element Management</NavLink>
                  
                  {/* Profile Menu - Increased text size */}
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-9 h-9 rounded-lg bg-[#163d64]/5 hover:bg-[#163d64]/10 border border-[#163d64]/10 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="text-lg font-medium text-[#163d64]">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-[#163d64]/10 shadow-lg">
                        <div className="p-3 border-b border-[#163d64]/10">
                          <p className="text-sm text-[#163d64]/60">Signed in as</p>
                          <p className="text-lg font-medium text-[#163d64] truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={handleClick}
                            className="w-full text-left px-3 py-2 text-lg text-[#163d64] hover:bg-[#163d64]/5 rounded-md transition-colors duration-300"
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
                  <NavLink to="/login" className="text-xl">Login</NavLink>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-[#fa4516] text-white text-xl font-medium rounded-lg hover:bg-[#fa4516]/90 transition-colors duration-300"
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

// NavLink component - Increased text size
const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-xl font-medium text-[#163d64]/70 hover:text-[#163d64] transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default Navbar;
