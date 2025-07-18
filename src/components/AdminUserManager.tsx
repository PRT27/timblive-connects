
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User, Settings, Mail } from 'lucide-react';

const AdminUserManager = () => {
  const [targetEmail, setTargetEmail] = useState('aran.assistivetechsolutions@gmail.com');
  const [newUsername, setNewUsername] = useState('NPThwala');
  const [newFullName, setNewFullName] = useState('NPThwala');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    if (!targetEmail) {
      toast({
        title: "Error",
        description: "Please enter the user's email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset sent",
        description: `Password reset email sent to ${targetEmail}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async () => {
    if (!targetEmail) {
      toast({
        title: "Error",
        description: "Please enter the user's email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        throw userError;
      }

      const targetUser = userData.users.find(user => user.email === targetEmail);
      
      if (!targetUser) {
        throw new Error('User not found');
      }

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: targetUser.id,
          username: newUsername,
          full_name: newFullName,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Profile updated",
        description: `Profile updated for ${targetEmail}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update user profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!targetEmail) {
      toast({
        title: "Error",
        description: "Please enter the user's email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Check user in auth
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        throw userError;
      }

      const targetUser = userData.users.find(user => user.email === targetEmail);
      
      if (!targetUser) {
        throw new Error('User not found in auth');
      }

      // Check profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const statusMessage = `
User Status:
- ID: ${targetUser.id}
- Email: ${targetUser.email}
- Email Confirmed: ${targetUser.email_confirmed_at ? 'Yes' : 'No'}
- Last Sign In: ${targetUser.last_sign_in_at || 'Never'}
- Profile Exists: ${profileData ? 'Yes' : 'No'}
- Username: ${profileData?.username || 'Not set'}
- Full Name: ${profileData?.full_name || 'Not set'}
      `;

      toast({
        title: "User Status",
        description: statusMessage,
        variant: "default",
      });

      console.log('User details:', targetUser);
      console.log('Profile details:', profileData);
    } catch (error: any) {
      console.error('Status check error:', error);
      toast({
        title: "Check failed",
        description: error.message || "Failed to check user status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts and resolve authentication issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={checkUserStatus}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Check Status
            </Button>

            <Button
              onClick={updateUserProfile}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Update Profile
            </Button>

            <Button
              onClick={handlePasswordReset}
              disabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Send Password Reset
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Processing...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions for NPThwala</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Send Password Reset" to send a reset email to aran.assistivetechsolutions@gmail.com</li>
            <li>Check the email inbox for the password reset link</li>
            <li>Click the reset link and set the new password to: <code className="bg-gray-100 px-2 py-1 rounded">#TiMBCEO1</code></li>
            <li>Return to the sign-in page and log in with:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Email: aran.assistivetechsolutions@gmail.com</li>
                <li>Password: #TiMBCEO1</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManager;
