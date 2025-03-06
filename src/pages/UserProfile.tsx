
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, MessageSquare, Bell, BellOff, 
  Heart, Video, Radio, Headphones, Users, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import VideoCard from '@/components/VideoCard';
import ProfileCard from '@/components/ProfileCard';
import { useProfile, ProfileType, VideoType } from '@/contexts/ProfileContext';

const UserProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mainProfile, demoProfiles, demoVideos, followedProfiles, toggleFollowProfile } = useProfile();
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const [userVideos, setUserVideos] = useState<VideoType[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Find the profile based on the URL parameter
    if (profileId === mainProfile.id) {
      setUserProfile(mainProfile);
      navigate('/dashboard');
      return;
    }
    
    const profile = demoProfiles.find(p => p.id === profileId);
    if (profile) {
      setUserProfile(profile);
      
      // Get videos from this creator
      const videos = demoVideos.filter(v => v.creator.id === profileId);
      setUserVideos(videos);
      
      // Check if following
      setIsFollowing(followedProfiles.includes(profileId));
    } else {
      // Profile not found
      toast({
        title: "Profile not found",
        description: "The requested profile doesn't exist or has been removed.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [profileId, mainProfile, demoProfiles, demoVideos, followedProfiles, navigate, toast]);

  const handleToggleFollow = () => {
    if (userProfile) {
      toggleFollowProfile(userProfile.id);
      setIsFollowing(!isFollowing);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing 
          ? `You have unfollowed ${userProfile.name}` 
          : `You are now following ${userProfile.name}`,
        variant: "default",
      });
    }
  };

  const handleToggleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed",
      description: isSubscribed 
        ? "You'll no longer receive notifications for new content" 
        : "You'll be notified when new content is published",
      variant: "default",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Profile link has been copied to your clipboard",
      variant: "default",
    });
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">{userProfile.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          {/* Cover image */}
          <div className="h-48 bg-gray-200 relative">
            {userProfile.coverImage ? (
              <img 
                src={userProfile.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475"} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-timbl-100 to-timbl-300"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          
          {/* Profile info */}
          <div className="relative px-6 pb-6 -mt-16">
            <Avatar className="h-32 w-32 border-4 border-white rounded-full">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4 md:flex md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-gray-600">{userProfile.role}</p>
                {userProfile.organization && (
                  <p className="text-gray-600 text-sm mt-1">{userProfile.organization}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {userProfile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-timbl-100 text-timbl">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button 
                  className={isFollowing ? "border-timbl bg-white text-timbl hover:bg-gray-50" : "bg-timbl"}
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300"
                  onClick={handleToggleSubscribe}
                >
                  {isSubscribed ? <BellOff size={18} className="mr-2" /> : <Bell size={18} className="mr-2" />}
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-gray-300"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
            
            <p className="mt-6 text-gray-700">{userProfile.bio}</p>
            
            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-1 text-gray-600">
                <Users size={18} />
                <span className="text-sm">{userProfile.followers || 0} followers</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Heart size={18} />
                <span className="text-sm">{Math.floor(Math.random() * 500) + 100} likes</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Video size={18} />
                <span className="text-sm">{userVideos.length} videos</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="mb-8">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            {userVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                <p className="text-gray-600">This creator hasn't uploaded any videos yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="live">
            <div className="bg-white rounded-xl p-8 text-center">
              <Radio className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Not live right now</h3>
              <p className="text-gray-600 mb-6">{userProfile.name} is not streaming at the moment.</p>
              <Button 
                variant="outline" 
                className="border-timbl text-timbl"
                onClick={() => setIsSubscribed(true)}
              >
                <Bell size={18} className="mr-2" />
                Get notified when live
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="podcasts">
            <div className="bg-white rounded-xl p-8 text-center">
              <Headphones className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No podcasts yet</h3>
              <p className="text-gray-600">{userProfile.name} hasn't uploaded any podcasts yet.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="playlists">
            <div className="bg-white rounded-xl p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-gray-600">{userProfile.name} hasn't created any playlists yet.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">About {userProfile.name}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-gray-700">{userProfile.bio}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userProfile.role}</dd>
                    </div>
                    {userProfile.organization && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Organization</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userProfile.organization}</dd>
                      </div>
                    )}
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Joined</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userProfile.joined || "2022"}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Content focus</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userProfile.tags.join(", ")}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Connect</h4>
                  <div className="flex gap-3">
                    <Button className="bg-timbl">
                      <MessageSquare size={18} className="mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline">
                      <Share2 size={18} className="mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Similar Creators */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Similar Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProfiles
              .filter(p => p.id !== profileId)
              .slice(0, 3)
              .map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
