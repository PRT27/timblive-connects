
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, LogOut, Video, Headphones, 
  Radio, MessageSquare, Users, Bell, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import VideoCard from '@/components/VideoCard';
import ProfileCard from '@/components/ProfileCard';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // Navigate to home page would happen here in a real app
  };

  // Main user profile
  const mainProfile = {
    id: "npthwala",
    name: "NPThwala The Innovator",
    role: "Director & Founder",
    organization: "Khanyasakhe Cleaning and Trading Enterprise & Assistive Tech Solutions Inc",
    bio: "Focused on accessible technology solutions for disabled people. Creating content about technology, education, and politics that impacts accessible technologies.",
    avatar: "/placeholder.svg",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    followers: 7845,
    following: 342,
    tags: ["Technology", "Education", "Politics", "Accessibility", "Coding"],
    joined: "January 2022"
  };

  // Demo profiles
  const demoProfiles = [
    {
      id: "tech-educator",
      name: "Dr. Maria Chen",
      role: "Technology Educator",
      bio: "Teaching the next generation about accessible technology and inclusive design.",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      tags: ["Education", "Technology", "Inclusive Design"],
      featured: true
    },
    {
      id: "policy-advisor",
      name: "James Wilson",
      role: "Policy Advisor",
      bio: "Working on policies to improve technology accessibility in public sectors.",
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      tags: ["Politics", "Policy", "Advocacy"],
      featured: false
    },
    {
      id: "tech-entrepreneur",
      name: "Sarah Johnson",
      role: "Tech Entrepreneur",
      bio: "Building businesses that prioritize accessibility and inclusion in technology.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: ["Business", "Entrepreneurship", "Technology"],
      featured: true
    },
    {
      id: "developer-advocate",
      name: "Michael Okonjo",
      role: "Developer Advocate",
      bio: "Teaching coding skills with a focus on accessible application development.",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      tags: ["Coding", "Development", "Advocacy"],
      featured: false
    }
  ];

  // Sample content for the dashboard
  const featuredVideos = [
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
  ];

  const demoVideos = [
    {
      id: "d1",
      title: "Teaching Accessibility in Schools",
      thumbnail: "https://i.ytimg.com/vi/GBwwkB6AZnE/maxresdefault.jpg",
      duration: "14:22",
      views: 12478,
      date: "5 days ago",
      creator: demoProfiles[0],
      videoUrl: "https://www.youtube.com/embed/GBwwkB6AZnE"
    },
    {
      id: "d2",
      title: "Policy Updates for Accessible Technology",
      thumbnail: "https://i.ytimg.com/vi/JquHSQUoaGI/maxresdefault.jpg",
      duration: "22:09",
      views: 8734,
      date: "2 weeks ago",
      creator: demoProfiles[1],
      videoUrl: "https://www.youtube.com/embed/JquHSQUoaGI"
    },
    {
      id: "d3",
      title: "Building an Accessible Tech Business",
      thumbnail: "https://i.ytimg.com/vi/McdyMG-lAJI/maxresdefault.jpg",
      duration: "31:55",
      views: 15293,
      date: "1 month ago",
      creator: demoProfiles[2],
      videoUrl: "https://www.youtube.com/embed/McdyMG-lAJI"
    },
    {
      id: "d4",
      title: "Introduction to Accessible App Development",
      thumbnail: "https://i.ytimg.com/vi/PQpSVHTgYiU/maxresdefault.jpg",
      duration: "25:18",
      views: 19832,
      date: "3 weeks ago",
      creator: demoProfiles[3],
      videoUrl: "https://www.youtube.com/embed/PQpSVHTgYiU"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-timbl">
              TiMBLive
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-800 hover:text-timbl">Home</Link>
              <Link to="/explore" className="text-gray-600 hover:text-timbl">Explore</Link>
              <Link to="/subscriptions" className="text-gray-600 hover:text-timbl">Subscriptions</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Input 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-timbl" 
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Bell size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={mainProfile.avatar} alt={mainProfile.name} />
                <AvatarFallback>NT</AvatarFallback>
              </Avatar>
              <span className="font-medium hidden md:inline">NPThwala</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-600">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={mainProfile.avatar} alt={mainProfile.name} />
                  <AvatarFallback>NT</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-center">{mainProfile.name}</h2>
                <p className="text-sm text-gray-500 text-center mt-1">{mainProfile.role}</p>
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <p className="font-semibold">{mainProfile.followers.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{mainProfile.following.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-1">
                <Link to="/dashboard" className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 text-timbl font-medium">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link to="/dashboard/content" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-timbl">
                  <Video size={18} />
                  <span>My Content</span>
                </Link>
                <Link to="/dashboard/live" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-timbl">
                  <Radio size={18} />
                  <span>Go Live</span>
                </Link>
                <Link to="/dashboard/analytics" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-timbl">
                  <Users size={18} />
                  <span>Analytics</span>
                </Link>
                <Link to="/dashboard/settings" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-timbl">
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Cover Image and Profile Info */}
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <div className="h-48 md:h-64 bg-gray-300 relative">
                <img 
                  src={mainProfile.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="relative px-6 pb-6 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white rounded-full">
                  <AvatarImage src={mainProfile.avatar} alt={mainProfile.name} />
                  <AvatarFallback className="text-2xl">NT</AvatarFallback>
                </Avatar>
                
                <div className="mt-4 md:flex md:items-end md:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{mainProfile.name}</h1>
                    <p className="text-gray-600">{mainProfile.role}</p>
                    <p className="text-gray-600 text-sm mt-1">{mainProfile.organization}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {mainProfile.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-timbl-100 text-timbl">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    <Button className="bg-timbl">Edit Profile</Button>
                    <Button variant="outline">Share</Button>
                  </div>
                </div>
                
                <p className="mt-6 text-gray-700">{mainProfile.bio}</p>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Joined:</span> {mainProfile.joined}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Content Tabs */}
            <Tabs defaultValue="videos" className="mb-8">
              <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex mb-6">
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos">
                <h2 className="text-2xl font-bold mb-6">My Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="live">
                <div className="bg-white rounded-xl p-8 text-center">
                  <Video className="h-12 w-12 mx-auto text-timbl mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start a Live Stream</h3>
                  <p className="text-gray-600 mb-6">Connect with your audience in real-time with TiMBLive's powerful streaming tools.</p>
                  <Button className="bg-timbl">Go Live Now</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="podcasts">
                <div className="bg-white rounded-xl p-8 text-center">
                  <Headphones className="h-12 w-12 mx-auto text-timbl mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Create a Podcast</h3>
                  <p className="text-gray-600 mb-6">Record and publish your podcast episodes with TiMBLive's podcast hosting service.</p>
                  <Button className="bg-timbl">Create Podcast</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="network">
                <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {demoProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Recommended Content */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
