
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileHeader from '@/components/UserProfileHeader';
import ProfileEditor from '@/components/ProfileEditor';
import VideoCard from '@/components/VideoCard';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileType } from '@/types/profile';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { mainProfile, getUserProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  
  // Use the mainProfile as a fallback
  useEffect(() => {
    const loadProfile = async () => {
      // In a real implementation, we would fetch the profile based on username
      // For now, just use the mainProfile as a placeholder
      setProfile(mainProfile);
    };
    
    loadProfile();
  }, [username, mainProfile]);
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p>The user profile you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  const isOwnProfile = true; // In a real app, compare with the logged-in user's ID
  
  // Mock data for content
  const userContent = [
    {
      id: '1',
      title: 'Introduction to ARAN-VI Assistant',
      description: 'Learn about the ARAN-VI mobile application for visually impaired users',
      thumbnail: '/placeholder.svg',
      duration: '12:34',
      views: 1240,
      date: '2023-05-15',
      category: 'Technology',
      contentType: 'video',
      creator: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar
      },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Assistive Technologies Today',
      description: 'Discussing the latest innovations in assistive technologies',
      thumbnail: '/placeholder.svg',
      duration: '42:10',
      views: 856,
      date: '2023-06-02',
      category: 'Education',
      contentType: 'podcast',
      creator: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar
      },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '3',
      title: 'Live Q&A: Tech Solutions for Disabilities',
      description: 'Join our weekly discussion about tech solutions',
      thumbnail: '/placeholder.svg',
      duration: '58:20',
      views: 1532,
      date: '2023-06-10',
      category: 'Live',
      contentType: 'broadcast',
      creator: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar
      },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          {isEditing ? (
            <ProfileEditor 
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <UserProfileHeader 
              profile={profile}
              joinedDate="January 2023"
              followersCount={1250}
              isOwnProfile={isOwnProfile}
              onEditProfile={() => setIsEditing(true)}
            />
          )}
          
          <Tabs defaultValue="videos" className="mt-8">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex sm:inline-flex">
              <TabsTrigger value="videos" className="flex-1 sm:flex-initial">Videos</TabsTrigger>
              <TabsTrigger value="podcasts" className="flex-1 sm:flex-initial">Podcasts</TabsTrigger>
              <TabsTrigger value="broadcasts" className="flex-1 sm:flex-initial">Broadcasts</TabsTrigger>
              <TabsTrigger value="about" className="flex-1 sm:flex-initial">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userContent
                  .filter(content => content.contentType === 'video')
                  .map(video => (
                    <VideoCard
                      key={video.id}
                      video={{
                        id: video.id,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        duration: video.duration,
                        views: video.views,
                        date: video.date,
                        creator: video.creator,
                        videoUrl: video.videoUrl,
                        contentType: 'video',
                        category: video.category,
                        isLive: false
                      }}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="podcasts" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userContent
                  .filter(content => content.contentType === 'podcast')
                  .map(podcast => (
                    <VideoCard
                      key={podcast.id}
                      video={{
                        id: podcast.id,
                        title: podcast.title,
                        thumbnail: podcast.thumbnail,
                        duration: podcast.duration,
                        views: podcast.views,
                        date: podcast.date,
                        creator: podcast.creator,
                        videoUrl: podcast.videoUrl,
                        contentType: 'podcast',
                        category: podcast.category,
                        isLive: false
                      }}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="broadcasts" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userContent
                  .filter(content => content.contentType === 'broadcast')
                  .map(broadcast => (
                    <VideoCard
                      key={broadcast.id}
                      video={{
                        id: broadcast.id,
                        title: broadcast.title,
                        thumbnail: broadcast.thumbnail,
                        duration: broadcast.duration,
                        views: broadcast.views,
                        date: broadcast.date,
                        creator: broadcast.creator,
                        videoUrl: broadcast.videoUrl,
                        contentType: 'broadcast',
                        category: broadcast.category,
                        isLive: false
                      }}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About {profile.displayName || profile.name || profile.username}</h2>
                
                <div className="space-y-4">
                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-medium">Bio</h3>
                      <p className="text-gray-700 mt-1">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {profile.location && (
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 text-gray-700">{profile.location}</span>
                        </div>
                      )}
                      
                      {profile.website && (
                        <div>
                          <span className="text-gray-500">Website:</span>
                          <a 
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 hover:underline"
                          >
                            {profile.website}
                          </a>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-500">Joined:</span>
                        <span className="ml-2 text-gray-700">January 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
