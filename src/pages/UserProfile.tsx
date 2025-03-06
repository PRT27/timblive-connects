
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useProfile, ProfileType } from '@/contexts/ProfileContext';
import VideoCard from '@/components/VideoCard';
import ProfileCard from '@/components/ProfileCard';
import { 
  CalendarDays, Users, Clock, CheckCheck,
  Share2, Flag, Settings, ArrowLeft
} from 'lucide-react';

const UserProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { mainProfile, demoProfiles, featuredVideos, demoVideos, toggleFollowProfile, followedProfiles } = useProfile();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [userVideos, setUserVideos] = useState(featuredVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");
  
  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      let foundProfile: ProfileType | undefined;
      
      if (profileId === mainProfile.id) {
        foundProfile = mainProfile;
      } else {
        foundProfile = demoProfiles.find(p => p.id === profileId);
      }
      
      if (foundProfile) {
        setProfile(foundProfile);
        
        // Set videos based on profile
        if (foundProfile.id === mainProfile.id) {
          setUserVideos(featuredVideos);
        } else {
          setUserVideos(demoVideos.filter(v => v.creator.id === foundProfile?.id));
        }
      }
      
      setIsLoading(false);
    }, 500);
  }, [profileId, mainProfile, demoProfiles, featuredVideos, demoVideos]);
  
  const isCurrentUser = profile?.id === mainProfile.id;
  const isFollowing = profile ? followedProfiles.includes(profile.id) : false;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-timbl rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-timbl hover:bg-timbl-600"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Profile header with cover image */}
      <div className="bg-white border-b">
        <div 
          className="h-48 bg-gray-200 bg-cover bg-center"
          style={{ 
            backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : 'url(https://images.unsplash.com/photo-1603366445787-09714680cbf1)'
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-end">
            <div className="translate-y-1/2 bg-white p-1 rounded-full">
              <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pt-16 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.featured && (
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Featured Creator
                  </div>
                )}
              </div>
              <p className="text-gray-600">{profile.role}</p>
              {profile.organization && (
                <p className="text-gray-600">{profile.organization}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              {isCurrentUser ? (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => toggleFollowProfile(profile.id)}
                    className={isFollowing ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-timbl hover:bg-timbl-600"}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Profile stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center text-gray-700">
              <Users className="mr-2 h-4 w-4" />
              <span className="font-medium">{profile.followers || 0}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="mr-2 h-4 w-4" />
              <span className="font-medium">{profile.following || 0}</span>
              <span className="text-gray-600 ml-1">Following</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="text-gray-600">Joined {profile.joined || 'January 2023'}</span>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-6 max-w-3xl">
            <p className="text-gray-800">{profile.bio}</p>
          </div>
          
          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.tags.map((tag, index) => (
              <div key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="videos" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
            
            {userVideos.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-gray-500">No videos available</p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-4">About {profile.name}</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {profile.bio}
              </p>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Details</h4>
                <div className="space-y-2">
                  {profile.organization && (
                    <div className="flex">
                      <span className="w-32 text-gray-500">Organization:</span>
                      <span>{profile.organization}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="w-32 text-gray-500">Joined:</span>
                    <span>{profile.joined || 'January 2023'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-4">{profile.name}'s Channels</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Live Streaming</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Real-time videos and interactive sessions
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/livestream')}
                  >
                    Visit Channel
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Podcasts</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Audio episodes and discussions
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/podcast')}
                  >
                    Visit Channel
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
