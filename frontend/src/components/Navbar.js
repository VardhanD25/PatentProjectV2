// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="bg-slate-950/30 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-800/50 flex items-center justify-center border border-slate-700/50 group-hover:border-slate-600/50 transition-colors duration-300">
                  <span className="text-lg font-bold text-slate-300 group-hover:text-slate-100">CC</span>
                </div>
                <span className="text-lg font-medium text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                  Compactness Calculator
                </span>
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              {user ? (
                <div className="flex items-center space-x-8">
                  <NavLink to="/addpart">Add Part</NavLink>
                  <NavLink to="/userinput">Calculator</NavLink>
                  <NavLink to="/parts-management">Parts Management</NavLink>
                  <NavLink to="/standard-alloy-management">Alloy management</NavLink>
                  <NavLink to="/element-management">Element management</NavLink>
                  {/* Profile Menu */}
                  <div className="relative profile-menu">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:border-slate-600/50 transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-slate-300">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900/90 backdrop-blur-lg border border-slate-700/50 shadow-lg"
                        >
                          <div className="p-2 border-b border-slate-700/50">
                            <p className="text-xs text-slate-400">Signed in as</p>
                            <p className="text-sm font-medium text-slate-200 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="p-1">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleClick}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 rounded-md transition-all duration-300"
                            >
                              Sign out
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Signup</NavLink>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

// Simplified NavLink component with more subtle hover effect
const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default Navbar;
