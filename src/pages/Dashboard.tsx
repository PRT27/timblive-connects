
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '@/components/ProfileCard';
import VideoCard from '@/components/VideoCard';
import { PlusCircle, Video, Mic, Radio } from 'lucide-react';

const Dashboard = () => {
  const { mainProfile, demoProfiles, featuredVideos, demoVideos } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-content");

  const handleCreateClick = (contentType: string) => {
    navigate(`/${contentType.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your content and track your analytics</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/create')} className="bg-timbl hover:bg-timbl-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="my-content" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="my-content">My Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          {/* My Content Tab */}
          <TabsContent value="my-content" className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Content</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/create')}>
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVideos.map((video) => (
                  <VideoCard key={video.id} {...video} />
                ))}
              </div>

              {featuredVideos.length === 0 && (
                <div className="text-center py-12 border rounded-lg bg-white">
                  <p className="text-gray-500 mb-4">You haven't created any content yet</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCreateClick('livestream')}
                      className="flex items-center"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Create Livestream
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCreateClick('podcast')}
                      className="flex items-center"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Create Podcast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCreateClick('broadcast')}
                      className="flex items-center"
                    >
                      <Radio className="mr-2 h-4 w-4" />
                      Create Broadcast
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Drafts</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-gray-500">You don't have any drafts</p>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-gray-500 mb-2">Total Views</div>
                <div className="text-3xl font-bold">78.9K</div>
                <div className="text-sm text-green-600 mt-2">↑ 12% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-gray-500 mb-2">Watch Time</div>
                <div className="text-3xl font-bold">4.2K hours</div>
                <div className="text-sm text-green-600 mt-2">↑ 8% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-gray-500 mb-2">Subscribers</div>
                <div className="text-3xl font-bold">1.2K</div>
                <div className="text-sm text-green-600 mt-2">↑ 5% from last month</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-4">Audience Demographics</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Analytics charts will be displayed here
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-4">Content Performance</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Performance metrics will be displayed here
              </div>
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Featured Creators</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {demoProfiles.map((profile) => (
                  <ProfileCard key={profile.id} {...profile} />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Trending Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoVideos.map((video) => (
                  <VideoCard key={video.id} {...video} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
