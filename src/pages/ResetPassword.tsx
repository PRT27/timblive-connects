
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      await resetPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link",
        variant: "default",
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Reset failed",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1f] py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover" 
         style={{ backgroundImage: "url('/lovable-uploads/f8d29536-0a5b-4692-b13a-ba8e4d24e87b.png')" }}>
      <Card className="w-full max-w-md bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <Link to="/signin" className="text-[#0077FF] hover:text-[#33c3f0] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077FF]/20">
              <Lock className="h-4 w-4 text-[#0077FF]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0077FF]/20 mb-4">
                <Mail className="h-6 w-6 text-[#0077FF]" />
              </div>
              <h3 className="text-lg font-medium text-white">Check your email</h3>
              <p className="mt-2 text-sm text-gray-400">
                We've sent a password reset link to {email}
              </p>
              <Button 
                className="mt-5 w-full bg-[#0a0a1f] hover:bg-[#151530] border border-[#0077FF]/50 text-[#0077FF]" 
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Send another email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#151530]/60 border-[#0077FF]/30 text-white"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#0077FF] hover:bg-[#33c3f0] text-white"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/signin" className="font-medium text-[#0077FF] hover:text-[#33c3f0]">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
