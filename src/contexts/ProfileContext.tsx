import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for demo profiles and the main profile
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
  demoProfiles: ProfileType[];
  featuredVideos: VideoType[];
  demoVideos: VideoType[];
  updateMainProfile: (updates: Partial<ProfileType>) => void;
  toggleFollowProfile: (profileId: string) => void;
  followedProfiles: string[];
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create a provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  // Main user profile - updated to match Percy's information
  const [mainProfile, setMainProfile] = useState<ProfileType>({
    id: "npthwala",
    name: "Nhlanhla Percy Thwala",
    role: "Founder & Developer",
    organization: "Assistive Tech Solutions Inc. & Khanyasakhe Cleaning and Trading Enterprise",
    bio: "I'm a 36-year-old entrepreneur and innovator passionate about leveraging technology to address societal challenges, focused on improving the lives of people with disabilities through accessible technology.",
    avatar: "/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    followers: 7845,
    following: 342,
    tags: ["Assistive Technology", "Accessibility", "Innovation", "Entrepreneurship", "Education"],
    joined: "January 2022"
  });

  // Demo profiles for featured creators - keeping only relevant ones and updating dates
  const [demoProfiles, setDemoProfiles] = useState<ProfileType[]>([
    {
      id: "sam-altman",
      name: "Sam Altman",
      role: "CEO of OpenAI",
      bio: "Leading innovation in artificial intelligence and the development of AI systems like GPT-4.",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      tags: ["AI", "Technology", "Innovation"],
      featured: true
    },
    {
      id: "mark-zuckerberg",
      name: "Mark Zuckerberg",
      role: "CEO of Meta",
      bio: "Working on advancing AI through the Llama 3.3 model and other Meta technologies.",
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      tags: ["Meta", "AI", "Technology"],
      featured: true
    }
  ]);

  // Sample content for the dashboard - featured videos with updated dates
  const [featuredVideos, setFeaturedVideos] = useState<VideoType[]>([
    {
      id: "v1",
      title: "ARAN-VI: Accessible Rural Assistive Network for Visual Impaired",
      thumbnail: "https://i.ytimg.com/vi/20SHvU2PKsM/maxresdefault.jpg",
      duration: "18:34",
      views: 24563,
      date: "May 5, 2025",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/20SHvU2PKsM"
    },
    {
      id: "v2",
      title: "Township Economy Simulator - Development Update",
      thumbnail: "https://i.ytimg.com/vi/PJl4iabBEz0/maxresdefault.jpg",
      duration: "22:17",
      views: 18962,
      date: "May 6, 2025",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/PJl4iabBEz0"
    },
    {
      id: "v3",
      title: "The Future of Assistive Technologies in Rural Areas",
      thumbnail: "https://i.ytimg.com/vi/vd1dLKLd5-4/maxresdefault.jpg",
      duration: "25:45",
      views: 35421,
      date: "May 7, 2025",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/vd1dLKLd5-4"
    }
  ]);

  // Demo videos from other creators with updated dates
  const [demoVideos, setDemoVideos] = useState<VideoType[]>([
    {
      id: "d1",
      title: "The Future of OpenAI and GPT-5",
      thumbnail: "https://i.ytimg.com/vi/GBwwkB6AZnE/maxresdefault.jpg",
      duration: "14:22",
      views: 125478,
      date: "May 3, 2025",
      creator: demoProfiles[0],
      videoUrl: "https://www.youtube.com/embed/GBwwkB6AZnE"
    },
    {
      id: "d2",
      title: "Introducing Llama 3.3: Open Source AI",
      thumbnail: "https://i.ytimg.com/vi/JquHSQUoaGI/maxresdefault.jpg",
      duration: "22:09",
      views: 87340,
      date: "May 2, 2025",
      creator: demoProfiles[1],
      videoUrl: "https://www.youtube.com/embed/JquHSQUoaGI"
    }
  ]);

  // Track followed profiles
  const [followedProfiles, setFollowedProfiles] = useState<string[]>([]);

  // Update the main profile
  const updateMainProfile = (updates: Partial<ProfileType>) => {
    setMainProfile(prev => ({ ...prev, ...updates }));
  };

  // Toggle following a profile
  const toggleFollowProfile = (profileId: string) => {
    setFollowedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        mainProfile, 
        demoProfiles, 
        featuredVideos, 
        demoVideos, 
        updateMainProfile,
        toggleFollowProfile,
        followedProfiles
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
