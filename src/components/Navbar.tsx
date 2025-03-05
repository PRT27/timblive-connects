
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className={cn(
            'text-2xl font-bold transition-colors',
            isScrolled ? 'text-timbl-700' : 'text-white text-shadow-sm'
          )}
        >
          TiMBLive
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-timbl',
              isScrolled ? 'text-gray-700' : 'text-white/90'
            )}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-timbl',
              isScrolled ? 'text-gray-700' : 'text-white/90'
            )}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-timbl',
              isScrolled ? 'text-gray-700' : 'text-white/90'
            )}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-timbl',
              isScrolled ? 'text-gray-700' : 'text-white/90'
            )}
          >
            About
          </Link>
          <div className="flex space-x-3">
            <Link to="/signin">
              <Button 
                variant="outline" 
                className={cn(
                  'rounded-full px-5 transition-all',
                  isScrolled 
                    ? 'bg-white text-timbl border-timbl hover:bg-timbl-50' 
                    : 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                )}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button 
                className="rounded-full px-5 bg-timbl hover:bg-timbl-600 text-white"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in-down">
          <div className="container py-5 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-800 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-gray-800 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-800 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-gray-800 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full border-timbl text-timbl"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full rounded-full bg-timbl hover:bg-timbl-600 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
