
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation happens in the signIn function
    } catch (error) {
      setIsLoading(false);
      // Error handling happens in the signIn function
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Back button */}
      <div className="container pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-timbl transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-gray-600">Sign in to your TiMBLive account</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-medium text-timbl hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-timbl hover:bg-timbl-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account?</span>{" "}
                <Link to="/signup" className="font-medium text-timbl hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image/Decorative */}
        <div className="hidden md:block md:w-1/2 bg-timbl-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-timbl-700 to-timbl-500" />
          
          {/* Decorative circles */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-timbl-400 opacity-20 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-timbl-300 opacity-20 blur-3xl" />
          
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center space-y-6">
              <h3 className="text-2xl font-bold">Revolutionize Your Content Creation</h3>
              <p className="text-white/80">
                Join thousands of creators who are using TiMBLive to stream, podcast, and broadcast their content to the world.
              </p>
              
              <div className="pt-6">
                <div className="flex -space-x-2 overflow-hidden justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i}
                      className={cn(
                        "inline-block h-12 w-12 rounded-full border-2 border-white",
                        "bg-timbl-300"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-white/90">
                  Join over 10,000+ content creators
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
