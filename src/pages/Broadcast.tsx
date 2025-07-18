
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, Bell, MessageSquare, Heart, Share2, Clock } from 'lucide-react';

const Broadcast = () => {
  const { broadcastId } = useParams();
  const { toast } = useToast();
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  
  // Real broadcast data from database
  const [broadcasts, setBroadcasts] = useState([]);

  const fetchBroadcasts = async () => {
  try {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles!streams_user_id_fkey (
          username,
          full_name,
          avatar_url,
          role
        )
      `)
      .eq('stream_type', 'broadcast')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setBroadcasts(data || []);
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
  }
};

// Mock data as fallback for demo
const mockBroadcasts = [
  {
    id: 'np-thwala-demo',
    title: 'Tech Innovation & Accessibility Solutions',
    description: 'Join me for insights into creating innovative technology solutions with a focus on accessibility and assistive technology.',
    host: {
      id: 'npthwala',
      name: 'NP Thwala',
      role: 'Creator & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
    scheduledDate: 'May 8, 2025',
    scheduledTime: '15:00 - 16:30 SAST',
    tags: ['Assistive Technology', 'Accessibility', 'Innovation'],
    viewers: 230,
    likes: 87,
    comments: 32
  },
  {
    id: 'township-economy',
    title: 'Township Economy Simulator - Development Insights',
    description: 'Discover the behind-the-scenes development process of the Township Economy Simulator. Learn about the game mechanics and how they reflect real economic principles.',
    host: {
      id: 'npthwala',
      name: 'Nhlanhla Percy Thwala',
      role: 'Founder & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
    scheduledDate: 'May 15, 2025',
    scheduledTime: '14:00 - 15:30 SAST',
    tags: ['Gaming', 'Economy', 'Education'],
    viewers: 185,
    likes: 65,
    comments: 28
  }
];

  useEffect(() => {
    fetchBroadcasts();
  }, []);
  
  // Use mock data as fallback
  const displayBroadcasts = broadcasts.length > 0 ? broadcasts : mockBroadcasts;
  
  // Find the current broadcast
  const broadcast = displayBroadcasts.find(b => b.id === broadcastId);
  
  if (!broadcast) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Broadcast not found</h1>
          <p className="mb-8">The broadcast you're looking for doesn't exist or has been removed.</p>
          <Link to="/explore">
            <Button>Explore Other Content</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const isFollowing = followedProfiles.includes(broadcast.host.id);
  
  const handleFollowToggle = () => {
    toggleFollowProfile(broadcast.host.id);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${broadcast.host.name}` 
        : `You are now following ${broadcast.host.name}`,
      variant: "default",
    });
  };
  
  const handleToggleNotification = () => {
    setNotificationEnabled(!notificationEnabled);
    
    toast({
      title: notificationEnabled ? "Notifications disabled" : "Notifications enabled",
      description: notificationEnabled 
        ? `You will no longer receive notifications for this broadcast` 
        : `You will receive notifications before this broadcast starts`,
      variant: "default",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Shared",
      description: "Broadcast link copied to clipboard",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          {/* Broadcast Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Broadcast Cover Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={broadcast.coverImage} 
                  alt={broadcast.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Broadcast Info */}
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl font-bold mb-2">{broadcast.title}</h1>
              
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={broadcast.host.avatar} alt={broadcast.host.name} />
                  <AvatarFallback>{broadcast.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <Link to={`/profile/${broadcast.host.id}`} className="text-lg font-medium hover:text-timbl">
                    {broadcast.host.name}
                  </Link>
                  <p className="text-sm text-gray-600">{broadcast.host.role}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{broadcast.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{broadcast.scheduledDate}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{broadcast.scheduledTime}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{broadcast.viewers} interested</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {broadcast.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "border-timbl text-timbl" : "bg-timbl"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                
                <Button
                  variant={notificationEnabled ? "default" : "outline"}
                  className={notificationEnabled ? "bg-timbl" : "border-timbl text-timbl"}
                  onClick={handleToggleNotification}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {notificationEnabled ? 'Notifications On' : 'Get Notified'}
                </Button>
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  <TabsTrigger value="related">Related Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Broadcast Details</h3>
                      <p className="text-gray-700 mb-6">
                        {broadcast.description}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Host</h3>
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar>
                          <AvatarImage src={broadcast.host.avatar} alt={broadcast.host.name} />
                          <AvatarFallback>{broadcast.host.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/profile/${broadcast.host.id}`} className="font-medium hover:text-timbl">
                            {broadcast.host.name}
                          </Link>
                          <p className="text-sm text-gray-600">{broadcast.host.role}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-2">How to Join</h3>
                      <p className="text-gray-700 mb-4">
                        This broadcast will be available live on {broadcast.scheduledDate} at {broadcast.scheduledTime}. 
                        Make sure to follow the host and enable notifications to be reminded when the broadcast starts.
                      </p>
                      
                      <div className="flex gap-4">
                        <Button
                          variant={isFollowing ? "outline" : "default"}
                          className={isFollowing ? "border-timbl text-timbl" : "bg-timbl"}
                          onClick={handleFollowToggle}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                        
                        <Button
                          variant={notificationEnabled ? "default" : "outline"}
                          className={notificationEnabled ? "bg-timbl" : "border-timbl text-timbl"}
                          onClick={handleToggleNotification}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          {notificationEnabled ? 'Notifications On' : 'Get Notified'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="discussion" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Discussion</h3>
                        <Badge variant="outline" className="text-gray-600">
                          {broadcast.comments} Comments
                        </Badge>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">John Miller</div>
                              <div className="text-xs text-gray-500">Just now</div>
                            </div>
                          </div>
                          <p className="text-sm ml-10">
                            Looking forward to learning more about the ARAN-VI application! Will there be a Q&A session?
                          </p>
                          <div className="flex items-center gap-4 mt-2 ml-10">
                            <button className="text-xs text-gray-500 flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              Like
                            </button>
                            <button className="text-xs text-gray-500 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Reply
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">Sarah Williams</div>
                              <div className="text-xs text-gray-500">5 minutes ago</div>
                            </div>
                          </div>
                          <p className="text-sm ml-10">
                            This is exactly the kind of innovative technology we need. Can't wait to see how it works!
                          </p>
                          <div className="flex items-center gap-4 mt-2 ml-10">
                            <button className="text-xs text-gray-500 flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              Like
                            </button>
                            <button className="text-xs text-gray-500 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Input
                          placeholder="Add a comment..."
                          className="mb-2"
                        />
                        <Button size="sm">Post</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="related" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Related Broadcasts</h3>
                      <div className="space-y-4">
                        {broadcasts.filter(b => b.id !== broadcastId).map(b => (
                          <Link key={b.id} to={`/broadcast/${b.id}`}>
                            <div className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden">
                                <img 
                                  src={b.coverImage} 
                                  alt={b.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{b.title}</h4>
                                <p className="text-xs text-gray-600">{b.host.name}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{b.scheduledDate}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Calendar</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="text-center p-2 bg-timbl text-white rounded-t-lg">
                      May 2025
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm mt-2">
                      <div className="text-gray-500">S</div>
                      <div className="text-gray-500">M</div>
                      <div className="text-gray-500">T</div>
                      <div className="text-gray-500">W</div>
                      <div className="text-gray-500">T</div>
                      <div className="text-gray-500">F</div>
                      <div className="text-gray-500">S</div>
                      
                      {/* Example calendar - would be dynamic in real app */}
                      <div className="p-2 text-gray-400">27</div>
                      <div className="p-2 text-gray-400">28</div>
                      <div className="p-2 text-gray-400">29</div>
                      <div className="p-2 text-gray-400">30</div>
                      <div className="p-2">1</div>
                      <div className="p-2">2</div>
                      <div className="p-2">3</div>
                      <div className="p-2">4</div>
                      <div className="p-2">5</div>
                      <div className="p-2">6</div>
                      <div className="p-2">7</div>
                      <div className="p-2 bg-timbl text-white rounded-full">8</div>
                      <div className="p-2">9</div>
                      <div className="p-2">10</div>
                      <div className="p-2">11</div>
                      <div className="p-2">12</div>
                      <div className="p-2">13</div>
                      <div className="p-2">14</div>
                      <div className="p-2 bg-gray-200 rounded-full">15</div>
                      <div className="p-2">16</div>
                      <div className="p-2">17</div>
                      <div className="p-2">18</div>
                      <div className="p-2">19</div>
                      <div className="p-2">20</div>
                      <div className="p-2">21</div>
                      <div className="p-2">22</div>
                      <div className="p-2">23</div>
                      <div className="p-2">24</div>
                      <div className="p-2">25</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Upcoming Broadcasts</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">ARAN-VI: Live Demo & Q&A Session</h4>
                        <Badge variant="outline" className="text-xs">May 8</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">15:00 - 16:30 SAST</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Bell className="h-3 w-3 mr-2" />
                        Get Notified
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">Township Economy Simulator</h4>
                        <Badge variant="outline" className="text-xs">May 15</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">14:00 - 15:30 SAST</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Bell className="h-3 w-3 mr-2" />
                        Get Notified
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Broadcast;
