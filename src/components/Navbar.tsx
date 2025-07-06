
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Search, PlusCircle, User, Shield, LogOut, Home } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1f]/95 backdrop-blur-xl border-b border-[#0077FF]/20 shadow-lg shadow-[#0077FF]/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0077FF] to-[#33c3f0] rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TiMBLive</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-[#33c3f0] bg-[#0077FF]/20' 
                  : 'text-gray-300 hover:text-white hover:bg-[#151530]/60'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/explore" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/explore') 
                  ? 'text-[#33c3f0] bg-[#0077FF]/20' 
                  : 'text-gray-300 hover:text-white hover:bg-[#151530]/60'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/create" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive('/create') 
                      ? 'text-[#33c3f0] bg-[#0077FF]/20' 
                      : 'text-gray-300 hover:text-white hover:bg-[#151530]/60'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create</span>
                </Link>
                
                <Link 
                  to="/protection" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive('/protection') 
                      ? 'text-[#33c3f0] bg-[#0077FF]/20' 
                      : 'text-gray-300 hover:text-white hover:bg-[#151530]/60'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Protection</span>
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-[#151530]/60"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className="text-gray-300 hover:text-white hover:bg-[#151530]/60"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-[#151530]/60"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm"
                    className="bg-[#0077FF] hover:bg-[#33c3f0] text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
