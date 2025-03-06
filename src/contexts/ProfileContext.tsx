
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
  // Main user profile
  const [mainProfile, setMainProfile] = useState<ProfileType>({
    id: "npthwala",
    name: "NPThwala The Innovator",
    role: "Director & Founder",
    organization: "Khanyasakhe Cleaning and Trading Enterprise & Assistive Tech Solutions Inc",
    bio: "Focused on accessible technology solutions for disabled people. Creating content about technology, education, and politics that impacts accessible technologies.",
    avatar: "/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    followers: 7845,
    following: 342,
    tags: ["Technology", "Education", "Politics", "Accessibility", "Coding"],
    joined: "January 2022"
  });

  // Demo profiles for featured creators
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
    },
    {
      id: "thuso-mbedo",
      name: "Thuso Mbedo",
      role: "Podcaster & Influencer",
      bio: "Providing insightful discussions on tech, culture and innovation in Africa.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: ["Podcast", "Culture", "Africa"],
      featured: false
    },
    {
      id: "khutso-theledi",
      name: "Khutso Theledi",
      role: "Radio Personality",
      bio: "Metro FM host bringing innovative discussions on music, tech and culture.",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      tags: ["Radio", "Music", "Entertainment"],
      featured: false
    },
    {
      id: "tyla",
      name: "Tyla",
      role: "Grammy-Winning Artist",
      bio: "Grammy award-winning South African singer and songwriter pushing the boundaries of music.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: ["Music", "Performance", "Artist"],
      featured: true
    }
  ]);

  // Sample content for the dashboard - featured videos
  const [featuredVideos, setFeaturedVideos] = useState<VideoType[]>([
    {
      id: "v1",
      title: "Introduction to Accessible Web Design",
      thumbnail: "https://i.ytimg.com/vi/20SHvU2PKsM/maxresdefault.jpg",
      duration: "12:34",
      views: 24563,
      date: "2 days ago",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/20SHvU2PKsM"
    },
    {
      id: "v2",
      title: "Coding Tutorial: Building Screen Reader Friendly Apps",
      thumbnail: "https://i.ytimg.com/vi/PJl4iabBEz0/maxresdefault.jpg",
      duration: "28:17",
      views: 18962,
      date: "1 week ago",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/PJl4iabBEz0"
    },
    {
      id: "v3",
      title: "The Future of Assistive Technologies",
      thumbnail: "https://i.ytimg.com/vi/vd1dLKLd5-4/maxresdefault.jpg",
      duration: "18:45",
      views: 35421,
      date: "3 weeks ago",
      creator: mainProfile,
      videoUrl: "https://www.youtube.com/embed/vd1dLKLd5-4"
    }
  ]);

  // Demo videos from other creators
  const [demoVideos, setDemoVideos] = useState<VideoType[]>([
    {
      id: "d1",
      title: "The Future of OpenAI and GPT-5",
      thumbnail: "https://i.ytimg.com/vi/GBwwkB6AZnE/maxresdefault.jpg",
      duration: "14:22",
      views: 125478,
      date: "5 days ago",
      creator: demoProfiles[0],
      videoUrl: "https://www.youtube.com/embed/GBwwkB6AZnE"
    },
    {
      id: "d2",
      title: "Introducing Llama 3.3: Open Source AI",
      thumbnail: "https://i.ytimg.com/vi/JquHSQUoaGI/maxresdefault.jpg",
      duration: "22:09",
      views: 87340,
      date: "2 weeks ago",
      creator: demoProfiles[1],
      videoUrl: "https://www.youtube.com/embed/JquHSQUoaGI"
    },
    {
      id: "d3",
      title: "Podcast: Technology and Accessibility in Africa",
      thumbnail: "https://i.ytimg.com/vi/McdyMG-lAJI/maxresdefault.jpg",
      duration: "31:55",
      views: 45293,
      date: "1 month ago",
      creator: demoProfiles[2],
      videoUrl: "https://www.youtube.com/embed/McdyMG-lAJI"
    },
    {
      id: "d4",
      title: "Grammy Experience: Breaking Boundaries in Music",
      thumbnail: "https://i.ytimg.com/vi/PQpSVHTgYiU/maxresdefault.jpg",
      duration: "25:18",
      views: 198032,
      date: "3 weeks ago",
      creator: demoProfiles[4],
      videoUrl: "https://www.youtube.com/embed/PQpSVHTgYiU"
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
