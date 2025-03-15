
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Link as LinkIcon, MapPin, Calendar, Mail } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import UserProfileHeader from '@/components/UserProfileHeader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProfileType } from '@/types/profile';

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  createdAt: string;
  profileId: string;
  contentType: 'video' | 'podcast' | 'broadcast' | 'live' | 'news' | 'radio' | 'music';
  category?: string;
}

const UserProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { mainProfile } = useProfile();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch data from your API
        // For now, let's create a placeholder profile
        const mockProfile: ProfileType = {
          id: profileId || '1',
          name: 'Percy Thwala',
          role: 'Founder & Developer',
          bio: 'Creating innovative assistive technology solutions. Founder of TiMBLive and creator of ARAN-VI mobile applications for visually impaired users.',
          avatar: '/lovable-uploads/6f518798-3d69-4e70-863a-8f2642f09e4e.png',
          coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
          organization: 'Khanyasakhe Cleaning and Trading Enterprise',
          tags: ['Assistive Technology', 'Accessibility', 'Innovation', 'Mobile Apps'],
          followers: 87,
          following: 42
        };
        
        const mockVideos: VideoData[] = [
          {
            id: '1',
            title: 'ARAN-VI Mobile App Showcase',
            thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop',
            views: 12500,
            duration: '15:24',
            createdAt: '2023-10-15',
            profileId: profileId || '1',
            contentType: 'video',
            category: 'Technology'
          },
          {
            id: '2',
            title: 'How Assistive Technology is Changing Lives',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop',
            views: 8700,
            duration: '12:18',
            createdAt: '2023-09-28',
            profileId: profileId || '1',
            contentType: 'podcast',
            category: 'Accessibility'
          },
          {
            id: '3',
            title: 'Future of Assistive Technology',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop',
            views: 5300,
            duration: '08:42',
            createdAt: '2023-09-05',
            profileId: profileId || '1',
            contentType: 'broadcast',
            category: 'Innovation'
          },
          {
            id: '4',
            title: 'Latest News in Assistive Tech',
            thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&auto=format&fit=crop',
            views: 3200,
            duration: '10:15',
            createdAt: '2023-08-22',
            profileId: profileId || '1',
            contentType: 'news',
            category: 'News'
          },
          {
            id: '5',
            title: 'Music for Productivity',
            thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop',
            views: 4800,
            duration: '22:30',
            createdAt: '2023-07-15',
            profileId: profileId || '1',
            contentType: 'music',
            category: 'Music'
          },
          {
            id: '6',
            title: 'Radio Show: Tech Innovations',
            thumbnail: 'https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?w=500&auto=format&fit=crop',
            views: 2700,
            duration: '45:10',
            createdAt: '2023-06-30',
            profileId: profileId || '1',
            contentType: 'radio',
            category: 'Radio'
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
  
  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white">
      <Navbar />
      
      <UserProfileHeader profile={profile} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column (used by UserProfileHeader) */}
          <div className="md:w-1/3">
            {/* This space is intentionally left empty to align with UserProfileHeader */}
          </div>
          
          {/* Content Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-[#151530] border border-[#0077FF]/30 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  All Content
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="podcasts" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  Podcasts
                </TabsTrigger>
                <TabsTrigger value="broadcasts" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  Broadcasts
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
                  About
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <VideoCard 
                      key={video.id}
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
                        },
                        contentType: video.contentType,
                        isLive: false,
                        category: video.category
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos
                    .filter(video => video.contentType === 'video')
                    .map((video) => (
                      <VideoCard 
                        key={video.id}
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
                          },
                          contentType: 'video',
                          isLive: false,
                          category: video.category
                        }}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="podcasts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos
                    .filter(video => video.contentType === 'podcast')
                    .map((video) => (
                      <VideoCard 
                        key={video.id}
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
                          },
                          contentType: 'podcast',
                          isLive: false,
                          category: video.category
                        }}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="broadcasts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos
                    .filter(video => video.contentType === 'broadcast')
                    .map((video) => (
                      <VideoCard 
                        key={video.id}
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
                          },
                          contentType: 'broadcast',
                          isLive: false,
                          category: video.category
                        }}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="about">
                <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20 p-6">
                  <h2 className="text-xl font-bold mb-4">About {profile.name}</h2>
                  <p className="text-gray-300 mb-6">{profile.bio}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-5 w-5 mr-3 text-[#0077FF]" />
                      <span>aran.assistivetechsolutions@gmail.com</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-[#0077FF]" />
                      <span>111 KwaChibikulu Location, Lake Chrissies, Chrissiesmeer, Mpumalanga, 2332</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <LinkIcon className="h-5 w-5 mr-3 text-[#0077FF]" />
                      <span>Contact: +27 64 146 0361</span>
                    </div>
                    
                    <div className="border-t border-[#0077FF]/20 pt-4 mt-4">
                      <h3 className="font-medium mb-2">About TiMBLive</h3>
                      <p className="text-gray-300 mb-3">
                        TiMBLive is a sub-brand to TiMBSocial projects, products of Khanyasakhe Cleaning and 
                        Trading Enterprise (2018/016999/07). We focus on creating innovative streaming solutions 
                        with an emphasis on accessibility and assistive technology.
                      </p>
                      <p className="text-gray-300">
                        Company Contact: +27 76 725 5361
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
