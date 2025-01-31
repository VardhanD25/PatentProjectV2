import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-8 w-8 rounded-lg bg-slate-800/50 flex items-center justify-center border border-slate-700/50 group-hover:border-slate-600/50 transition-colors duration-300">
                <span className="text-lg font-bold text-slate-300 group-hover:text-slate-100">CC</span>
              </div>
              <span className="text-lg font-medium text-slate-300 group-hover:text-slate-100">
                Compactness Calculator
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revolutionizing material engineering through advanced calculations and innovative solutions. 
              Making complex decisions simple.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-slate-200 font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Calculator', 'Add Part'].map((item) => (
                <li key={item}>
                  <Link 
                    to={
                      item === 'Home' ? '/' : 
                      item === 'Calculator' ? '/userinput' : 
                      `/${item.toLowerCase().replace(' ', '')}`
                    }
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-slate-200 font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:contact@example.com"
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
                >
                  contact@example.com
                </a>
              </li>
              <li className="text-sm text-slate-400">
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © {currentYear} Compactness Calculator. All rights reserved.
            </div>
            
            {/* Legal Links */}
<div className="flex space-x-6">
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to="/privacy-policy"
      className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
    >
      Privacy Policy
    </Link>
  </motion.div>
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to="/terms-of-service"
      className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
    >
      Terms of Service
    </Link>
  </motion.div>
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to="/contact-us"
      className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
    >
      Contact
    </Link>
  </motion.div>
</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;