
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
import { Settings, Users, ChevronRight, Calendar, VideoIcon, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { mainProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    document.title = "Dashboard - TiMBLive";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your profile, content, and platform settings
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button asChild variant="outline">
                <Link to="/explore">
                  Browse Content
                </Link>
              </Button>
              <Button asChild className="bg-timbl hover:bg-timbl-600">
                <Link to="/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Content
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Dashboard Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-200 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${mainProfile.avatar})` }}>
                    </div>
                    <div>
                      <h2 className="font-semibold">{mainProfile.name}</h2>
                      <p className="text-sm text-gray-600">{mainProfile.role}</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 ${activeTab === 'profile' ? 'bg-gray-50' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <Settings className="h-5 w-5 mr-3 text-gray-500" />
                    Profile Settings
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 ${activeTab === 'invites' ? 'bg-gray-50' : ''}`}
                    onClick={() => setActiveTab('invites')}
                  >
                    <Users className="h-5 w-5 mr-3 text-gray-500" />
                    Invite Friends
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-5 px-5 ${activeTab === 'status' ? 'bg-gray-50' : ''}`}
                    onClick={() => setActiveTab('status')}
                  >
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    Project Status
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Content Area */}
            <div className="lg:col-span-2">
              {activeTab === 'profile' && <ProfileEditor />}
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
