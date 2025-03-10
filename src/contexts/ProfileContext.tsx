
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Define types for profiles and content
export interface ProfileType {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
  featured?: boolean;
  organization?: string;
  followers?: number;
  following?: number;
  joined?: string;
  coverImage?: string;
}

export interface VideoType {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  date: string;
  creator: ProfileType;
  videoUrl: string;
}

// Create interface for the context values
interface ProfileContextType {
  mainProfile: ProfileType;
  updateMainProfile: (updates: Partial<ProfileType>) => Promise<void>;
  toggleFollowProfile: (profileId: string) => Promise<void>;
  followedProfiles: string[];
  getUserProfile: (userId: string) => Promise<ProfileType | null>;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create a provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mainProfile, setMainProfile] = useState<ProfileType>({
    id: "",
    name: "",
    role: "",
    bio: "",
    avatar: "",
    tags: [],
  });
  const [followedProfiles, setFollowedProfiles] = useState<string[]>([]);

  // Fetch the current user's profile
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setMainProfile({
            id: data.id,
            name: data.full_name || 'Anonymous User',
            role: data.role || 'Creator',
            bio: data.bio || '',
            avatar: data.avatar_url || '/placeholder.svg',
            tags: data.tags || [],
            organization: data.organization,
            followers: data.followers,
            following: data.following,
            joined: data.joined ? new Date(data.joined).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }) : 'January 2022',
            coverImage: data.cover_image,
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Get a user profile by ID
  const getUserProfile = async (userId: string): Promise<ProfileType | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          name: data.full_name || 'Anonymous User',
          role: data.role || 'Creator',
          bio: data.bio || '',
          avatar: data.avatar_url || '/placeholder.svg',
          tags: data.tags || [],
          organization: data.organization,
          followers: data.followers,
          following: data.following,
          joined: data.joined ? new Date(data.joined).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }) : undefined,
          coverImage: data.cover_image,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  };

  // Update the main profile
  const updateMainProfile = async (updates: Partial<ProfileType>): Promise<void> => {
    if (!user) return;
    
    try {
      // Convert from our frontend model to DB model
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.bio) dbUpdates.bio = updates.bio;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
      if (updates.tags) dbUpdates.tags = updates.tags;
      if (updates.organization) dbUpdates.organization = updates.organization;
      if (updates.coverImage) dbUpdates.cover_image = updates.coverImage;
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Failed to update profile",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Update local state
      setMainProfile(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Toggle following a profile
  const toggleFollowProfile = async (profileId: string): Promise<void> => {
    if (!user || profileId === user.id) return;
    
    const isFollowing = followedProfiles.includes(profileId);
    
    try {
      // TODO: In a real app, you would implement the follow/unfollow logic in the database
      // For now, we'll just update the local state
      setFollowedProfiles(prev => 
        isFollowing 
          ? prev.filter(id => id !== profileId) 
          : [...prev, profileId]
      );
      
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing 
          ? `You have unfollowed this user` 
          : `You are now following this user`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        mainProfile, 
        updateMainProfile,
        toggleFollowProfile,
        followedProfiles,
        getUserProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
