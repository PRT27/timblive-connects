
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeviceStreamSetup from '@/components/DeviceStreamSetup';
import StreamIntegration from '@/components/StreamIntegration';
import StreamManager from '@/components/StreamManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Globe, Settings, Broadcast } from 'lucide-react';

const Create = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Create & Stream</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start your live stream, podcast, or broadcast with our professional streaming tools. 
              Connect with your audience in real-time.
            </p>
          </div>

          <Tabs defaultValue="stream" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stream" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Device Stream
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Broadcast className="h-4 w-4" />
                Stream Manager
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stream" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Device Streaming Setup
                  </CardTitle>
                  <CardDescription>
                    Set up your camera and microphone to start streaming from your device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeviceStreamSetup 
                    onStreamStart={(streamId) => {
                      console.log('Stream started with ID:', streamId);
                    }}
                    onStreamEnd={() => {
                      console.log('Stream ended');
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <StreamManager />
            </TabsContent>

            <TabsContent value="integration" className="space-y-6">
              <StreamIntegration />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stream Settings</CardTitle>
                  <CardDescription>
                    Configure your streaming preferences and quality settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Stream settings configuration coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Create;
