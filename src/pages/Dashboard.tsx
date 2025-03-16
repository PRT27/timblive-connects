import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import ProfileEditor from '@/components/ProfileEditor';
import InviteSystem from '@/components/InviteSystem';
import ProjectStatus from '@/components/ProjectStatus';
import StreamIntegration from '@/components/StreamIntegration';
import { Settings, Users, ChevronRight, Activity, VideoIcon, PlusCircle, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { mainProfile } = useProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    document.title = "Dashboard - TiMBLive";
  }, []);

  const handleProfileCancel = () => {
    toast({
      title: "Changes discarded",
      description: "Your profile changes have been discarded.",
    });
  };

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1f] text-white">
      <Navbar />
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/lovable-uploads/f8d29536-0a5b-4692-b13a-ba8e4d24e87b.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0a0a1f]/10 to-[#0a0a1f] backdrop-blur-sm"></div>
      </div>
      
      <main className="flex-1 py-24 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Manage your profile, content, and platform settings
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button asChild variant="outline" className="border-[#0077FF]/50 text-[#0077FF] hover:bg-[#0077FF]/20">
                <Link to="/explore">
                  Browse Content
                </Link>
              </Button>
              <Button asChild className="bg-[#0077FF] hover:bg-[#33c3f0] text-white">
                <Link to="/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Content
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Dashboard Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 rounded-lg overflow-hidden shadow-lg shadow-[#0077FF]/20 mb-6">
                <div className="p-5 border-b border-[#0077FF]/20">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-800 bg-cover bg-center border-2 border-[#0077FF]" 
                      style={{ backgroundImage: `url(${mainProfile.avatar})` }}>
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{mainProfile.name}</h2>
                      <p className="text-sm text-[#33c3f0]">{mainProfile.role}</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-[#0077FF]/20">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 text-left ${
                      activeTab === 'profile' 
                        ? 'bg-[#151530]/60 text-[#33c3f0]' 
                        : 'text-gray-300 hover:text-white hover:bg-[#151530]/40'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <Settings className={`h-5 w-5 mr-3 ${activeTab === 'profile' ? 'text-[#33c3f0]' : 'text-gray-500'}`} />
                    Profile Settings
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 text-left ${
                      activeTab === 'stream' 
                        ? 'bg-[#151530]/60 text-[#33c3f0]' 
                        : 'text-gray-300 hover:text-white hover:bg-[#151530]/40'
                    }`}
                    onClick={() => setActiveTab('stream')}
                  >
                    <MonitorPlay className={`h-5 w-5 mr-3 ${activeTab === 'stream' ? 'text-[#33c3f0]' : 'text-gray-500'}`} />
                    Stream Integration
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 text-left ${
                      activeTab === 'invites' 
                        ? 'bg-[#151530]/60 text-[#33c3f0]' 
                        : 'text-gray-300 hover:text-white hover:bg-[#151530]/40'
                    }`}
                    onClick={() => setActiveTab('invites')}
                  >
                    <Users className={`h-5 w-5 mr-3 ${activeTab === 'invites' ? 'text-[#33c3f0]' : 'text-gray-500'}`} />
                    Invite Friends
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 text-left ${
                      activeTab === 'status' 
                        ? 'bg-[#151530]/60 text-[#33c3f0]' 
                        : 'text-gray-300 hover:text-white hover:bg-[#151530]/40'
                    }`}
                    onClick={() => setActiveTab('status')}
                  >
                    <Activity className={`h-5 w-5 mr-3 ${activeTab === 'status' ? 'text-[#33c3f0]' : 'text-gray-500'}`} />
                    Project Status
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 rounded-lg p-5 shadow-lg shadow-[#0077FF]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">Platform Stats</h3>
                  <span className="text-xs text-[#33c3f0] bg-[#0077FF]/20 px-2 py-1 rounded-full">Beta</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Content Views</span>
                    <span className="text-white font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-white font-medium">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Interactions</span>
                    <span className="text-white font-medium">432</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-transparent border border-[#0077FF]/50 text-[#0077FF] hover:bg-[#0077FF]/10">
                  View Full Analytics
                </Button>
              </div>
            </div>

            {/* Right Column - Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && <ProfileEditor onCancel={handleProfileCancel} onSave={handleProfileSave} />}
              {activeTab === 'stream' && <StreamIntegration />}
              {activeTab === 'invites' && <InviteSystem />}
              {activeTab === 'status' && <ProjectStatus />}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
