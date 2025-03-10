
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Video, Mic, Radio, Settings, Upload, DollarSign, Link2 } from 'lucide-react';
import IntegratedStream from '@/components/IntegratedStream';

const Create = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('livestream');

  const handleStartStream = () => {
    toast({
      title: "Live stream started!",
      description: "Your audience can now join your stream.",
      variant: "default",
    });
  };

  const handleCreatePodcast = () => {
    toast({
      title: "Podcast created!",
      description: "Your podcast has been successfully created.",
      variant: "default",
    });
  };

  const handleCreateBroadcast = () => {
    toast({
      title: "Broadcast scheduled!",
      description: "Your broadcast has been scheduled for the selected time.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create Content</h1>
            <p className="text-gray-600 mb-8">Choose how you want to share your content with your audience</p>
            
            <Tabs defaultValue="livestream" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="livestream">
                  <Video className="h-4 w-4 mr-2" />
                  Live Streaming
                </TabsTrigger>
                <TabsTrigger value="integration">
                  <Link2 className="h-4 w-4 mr-2" />
                  External Integration
                </TabsTrigger>
                <TabsTrigger value="podcast">
                  <Mic className="h-4 w-4 mr-2" />
                  Podcasting
                </TabsTrigger>
                <TabsTrigger value="broadcast">
                  <Radio className="h-4 w-4 mr-2" />
                  Broadcasting
                </TabsTrigger>
              </TabsList>
              
              {/* Live Streaming Tab */}
              <TabsContent value="livestream">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Live Stream</CardTitle>
                    <CardDescription>
                      Share your content in real-time with your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stream-title">Stream Title</Label>
                      <Input id="stream-title" placeholder="Enter your stream title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stream-description">Description</Label>
                      <Textarea id="stream-description" placeholder="Describe your stream to your audience" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stream-quality">Streaming Quality</Label>
                        <Select defaultValue="high">
                          <SelectTrigger id="stream-quality">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (480p)</SelectItem>
                            <SelectItem value="medium">Medium (720p)</SelectItem>
                            <SelectItem value="high">High (1080p)</SelectItem>
                            <SelectItem value="ultra">Ultra HD (4K)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stream-visibility">Visibility</Label>
                        <Select defaultValue="public">
                          <SelectTrigger id="stream-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="followers">Followers Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stream-tags">Tags (comma separated)</Label>
                      <Input id="stream-tags" placeholder="e.g. music, talk show, education" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Stream Settings
                    </Button>
                    <Button onClick={handleStartStream} className="bg-timbl hover:bg-timbl-600">
                      <Video className="h-4 w-4 mr-2" />
                      Start Stream
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* External Integration Tab */}
              <TabsContent value="integration">
                <IntegratedStream />
              </TabsContent>
              
              {/* Podcasting Tab */}
              <TabsContent value="podcast">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Podcast</CardTitle>
                    <CardDescription>
                      Upload and share audio content with your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="podcast-title">Podcast Title</Label>
                      <Input id="podcast-title" placeholder="Enter your podcast title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="podcast-description">Description</Label>
                      <Textarea id="podcast-description" placeholder="Describe your podcast to your audience" />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Audio File</Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Drag and drop your audio file here, or click to browse</p>
                        <p className="text-xs text-gray-400 mb-4">MP3, WAV, or M4A formats (max 500MB)</p>
                        <Button variant="outline" size="sm">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="podcast-category">Category</Label>
                        <Select defaultValue="entertainment">
                          <SelectTrigger id="podcast-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="health">Health & Wellness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="podcast-language">Language</Label>
                        <Select defaultValue="english">
                          <SelectTrigger id="podcast-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="chinese">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Podcast Settings
                    </Button>
                    <Button onClick={handleCreatePodcast} className="bg-timbl hover:bg-timbl-600">
                      <Mic className="h-4 w-4 mr-2" />
                      Create Podcast
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Broadcasting Tab */}
              <TabsContent value="broadcast">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Broadcast</CardTitle>
                    <CardDescription>
                      Schedule and share broadcasts with your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="broadcast-title">Broadcast Title</Label>
                      <Input id="broadcast-title" placeholder="Enter your broadcast title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broadcast-description">Description</Label>
                      <Textarea id="broadcast-description" placeholder="Describe your broadcast to your audience" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="broadcast-date">Broadcast Date</Label>
                        <Input id="broadcast-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="broadcast-time">Broadcast Time</Label>
                        <Input id="broadcast-time" type="time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broadcast-type">Broadcast Type</Label>
                      <Select defaultValue="video">
                        <SelectTrigger id="broadcast-type">
                          <SelectValue placeholder="Select broadcast type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio Only</SelectItem>
                          <SelectItem value="screen">Screen Sharing</SelectItem>
                          <SelectItem value="mixed">Mixed Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broadcast-audience">Target Audience</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="broadcast-audience">
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="followers">Followers Only</SelectItem>
                          <SelectItem value="subscribers">Subscribers Only</SelectItem>
                          <SelectItem value="select">Select Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Broadcast Settings
                    </Button>
                    <Button onClick={handleCreateBroadcast} className="bg-timbl hover:bg-timbl-600">
                      <Radio className="h-4 w-4 mr-2" />
                      Schedule Broadcast
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Monetization Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold flex items-center mb-4">
                <DollarSign className="h-5 w-5 mr-2 text-timbl" />
                Monetization Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Offer premium content to subscribers for a monthly fee.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Advertisements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Generate revenue through targeted advertisements on your content.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsorships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Connect with brands for sponsored content and partnerships.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Create;
