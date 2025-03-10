import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { UserPlus, Check, Link as LinkIcon, MapPin, Calendar, Mail } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  organization?: string;
  tags: string[];
  featured?: boolean;
}

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  createdAt: string;
  profileId: string;
}

const UserProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { followedProfiles, toggleFollowProfile } = useProfile();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch data from your API
        // For now, let's create a placeholder profile
        const mockProfile: ProfileData = {
          id: profileId || '1',
          name: 'TiMBLive Creator',
          role: 'Video Creator',
          bio: 'Creating amazing content on TiMBLive platform. Specializing in technology and future trends.',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
          coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
          organization: 'TiMBLive Studios',
          tags: ['Technology', 'Future', 'AI', 'Design'],
        };
        
        const mockVideos: VideoData[] = [
          {
            id: '1',
            title: 'The Future of Digital Technology',
            thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop',
            views: 12500,
            duration: '15:24',
            createdAt: '2023-10-15',
            profileId: profileId || '1',
          },
          {
            id: '2',
            title: 'How AI is Changing Our World',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop',
            views: 8700,
            duration: '12:18',
            createdAt: '2023-09-28',
            profileId: profileId || '1',
          },
          {
            id: '3',
            title: 'Future Tech Systems Overview',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop',
            views: 5300,
            duration: '08:42',
            createdAt: '2023-09-05',
            profileId: profileId || '1',
          },
        ];
        
        setProfile(mockProfile);
        setVideos(mockVideos);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [profileId]);
  
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1f]">
        <div className="animate-pulse text-[#0077FF]">Loading profile...</div>
      </div>
    );
  }
  
  const isFollowing = followedProfiles.includes(profile.id);
  
  const handleFollow = () => {
    toggleFollowProfile(profile.id);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${profile.name}` 
        : `You are now following ${profile.name}`,
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white">
      {/* Cover Image */}
      <div 
        className="w-full h-64 md:h-80 bg-cover bg-center relative"
        style={{ 
          backgroundImage: profile.coverImage 
            ? `url(${profile.coverImage})` 
            : 'url(/lovable-uploads/f8d29536-0a5b-4692-b13a-ba8e4d24e87b.png)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a1f]"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Info Card */}
          <div className="md:w-1/3">
            <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20 p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-[#0077FF] mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-[#151530] text-[#0077FF]">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                <p className="text-[#33c3f0] mb-3">{profile.role}</p>
                
                <Button 
                  onClick={handleFollow} 
                  className={isFollowing 
                    ? "bg-transparent border border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF]/10 mb-4 w-full" 
                    : "bg-[#0077FF] hover:bg-[#33c3f0] text-white mb-4 w-full"
                  }
                >
                  {isFollowing 
                    ? <><Check className="mr-2 h-4 w-4" /> Following</> 
                    : <><UserPlus className="mr-2 h-4 w-4" /> Follow</>
                  }
                </Button>
                
                <div className="w-full border-t border-[#0077FF]/30 pt-4 mt-2">
                  <p className="text-gray-300 mb-4">{profile.bio}</p>
                  
                  {profile.organization && (
                    <div className="flex items-center justify-center text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.organization}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined September 2023</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {profile.tags.map((tag) => (
                      <Badge key={tag} className="bg-[#151530] text-[#33c3f0] border border-[#0077FF]/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Content Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="bg-[#151530] border border-[#0077FF]/30 mb-6">
                <TabsTrigger value="videos" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="livestreams" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  Livestreams
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  About
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <VideoCard 
                      video={{
                        id: video.id,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        duration: video.duration,
                        views: video.views,
                        date: video.createdAt,
                        videoUrl: `https://www.youtube.com/embed/${video.id}`,
                        creator: {
                          id: profile.id,
                          name: profile.name,
                          avatar: profile.avatar
                        }
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="livestreams">
                <div className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No active livestreams at the moment.</p>
                  <Button className="mt-4 bg-[#0077FF] hover:bg-[#33c3f0] text-white">
                    Notify me when live
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="about">
                <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20 p-6">
                  <h2 className="text-xl font-bold mb-4">About {profile.name}</h2>
                  <p className="text-gray-300 mb-6">{profile.bio}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-5 w-5 mr-3 text-[#0077FF]" />
                      <span>contact@timblive.example.com</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <LinkIcon className="h-5 w-5 mr-3 text-[#0077FF]" />
                      <a href="#" className="hover:text-[#33c3f0]">timblive.example.com</a>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
