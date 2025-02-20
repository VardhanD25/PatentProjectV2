import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const getLogoPath = () => {
    if (window.electron) {
      return './logo.jpg';
    }
    return `${process.env.PUBLIC_URL}/logo.jpg`;
  };

  return (
    <footer className="relative z-10 bg-white border-t border-[#163d64]/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src={getLogoPath()} 
                alt="Company Logo" 
                className="h-16 w-16 object-contain"
              />
              <span className="text-xl font-medium text-[#163d64] group-hover:text-[#163d64]/80">
                Compactness Calculator
              </span>
            </Link>
            <p className="text-lg text-[#163d64]/70 leading-relaxed">
              Revolutionizing material engineering through advanced calculations and innovative solutions. 
              Making complex decisions simple.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl text-[#163d64] font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Calculator', 'Add Part'].map((item) => (
                <li key={item}>
                  <Link 
                    to={
                      item === 'Home' ? '/' : 
                      item === 'Calculator' ? '/userinput' : 
                      `/${item.toLowerCase().replace(' ', '')}`
                    }
                    className="text-lg text-[#163d64]/70 hover:text-[#fa4516] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl text-[#163d64] font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:contact@example.com"
                  className="text-lg text-[#163d64]/70 hover:text-[#fa4516] transition-colors duration-300"
                >
                  mangeshp@manshaprotech.com
                </a>
              </li>
              <li className="text-lg text-[#163d64]/70">
                A-11 Rajvihar, Balajinagar, Dhankawadi, Pune-411043
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#163d64]/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-lg text-[#163d64]/70">
              © {currentYear} Compactness Calculator. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link
                to="/contact-us"
                className="text-lg text-[#163d64]/70 hover:text-[#fa4516] transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;