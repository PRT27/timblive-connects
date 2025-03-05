
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-timbl-700">
              TiMBLive
            </Link>
            <p className="text-gray-600 text-sm">
              Revolutionizing live streaming, podcasting, and broadcasting with interactive features.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-timbl hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-timbl hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-timbl hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-timbl hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-timbl hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links column 1 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Live Streaming
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Podcasting
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Broadcasting
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Interactive Tools
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Storage Solutions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Monetization
                </Link>
              </li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Links column 3 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-timbl transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 mt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TiMBLive. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="text-gray-500 hover:text-timbl text-sm">
                Privacy
              </Link>
              <Link to="#" className="text-gray-500 hover:text-timbl text-sm">
                Terms
              </Link>
              <Link to="#" className="text-gray-500 hover:text-timbl text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
