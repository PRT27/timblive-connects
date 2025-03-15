import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

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

interface ProfileContextType {
  mainProfile: ProfileType;
  updateMainProfile: (updates: Partial<ProfileType>) => Promise<void>;
  toggleFollowProfile: (profileId: string) => Promise<void>;
  followedProfiles: string[];
  getUserProfile: (userId: string) => Promise<ProfileType | null>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mainProfile, setMainProfile] = useState<ProfileType>({
    id: "",
    name: "Percy Thwala",
    role: "Founder & Developer",
    bio: "Creating innovative tech solutions with a focus on accessibility and assistive technology.",
    avatar: "/lovable-uploads/6f518798-3d69-4e70-863a-8f2642f09e4e.png",
    tags: ["Assistive Technology", "Accessibility", "Innovation"],
    organization: "Khanyasakhe Cleaning and Trading Enterprise",
    followers: 87,
    following: 42,
    joined: "September 2023",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop",
  });
  const [followedProfiles, setFollowedProfiles] = useState<string[]>([]);

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

  const updateMainProfile = async (updates: Partial<ProfileType>): Promise<void> => {
    if (!user) return;
    
    try {
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

  const toggleFollowProfile = async (profileId: string): Promise<void> => {
    if (!user || profileId === user.id) return;
    
    const isFollowing = followedProfiles.includes(profileId);
    
    try {
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

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
