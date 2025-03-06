
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { Heart, MessageSquare, Share2, Gift, Users, Settings, MaximizeIcon, PictureInPicture } from 'lucide-react';

// Sample livestream data
const livestreams = [
  {
    id: 'openai-future',
    title: 'The Future of AI and OpenAI',
    description: 'Join me as I discuss the latest developments in AI and the future of OpenAI.',
    streamer: {
      id: 'sam-altman',
      name: 'Sam Altman',
      role: 'CEO, OpenAI',
      avatar: 'https://avatars.githubusercontent.com/u/3412640'
    },
    tags: ['AI', 'Technology', 'Future'],
    viewers: 1420,
    likes: 358,
    comments: 124
  },
  {
    id: 'meta-llama',
    title: 'Introducing Llama 3.3 - The Next Generation AI',
    description: 'Learn about our latest AI model and how it will transform the industry.',
    streamer: {
      id: 'mark-zuckerberg',
      name: 'Mark Zuckerberg',
      role: 'CEO, Meta',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg'
    },
    tags: ['AI', 'Meta', 'Technology'],
    viewers: 2150,
    likes: 542,
    comments: 198
  }
];

const LiveStream = () => {
  const { streamId } = useParams();
  const { toast } = useToast();
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const [chatMessage, setChatMessage] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Alex Chen', message: 'This is incredible! 🔥', time: '2m ago' },
    { id: 2, user: 'Sarah Johnson', message: 'Can you explain more about the new features?', time: '1m ago' },
    { id: 3, user: 'Michael Brown', message: 'Looking forward to trying this out!', time: 'Just now' }
  ]);
  
  // Find the current livestream
  const livestream = livestreams.find(stream => stream.id === streamId);
  
  if (!livestream) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Stream not found</h1>
          <p className="mb-8">The livestream you're looking for doesn't exist or has ended.</p>
          <Link to="/explore">
            <Button>Explore Other Content</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const isFollowing = followedProfiles.includes(livestream.streamer.id);
  
  const handleFollowToggle = () => {
    toggleFollowProfile(livestream.streamer.id);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${livestream.streamer.name}` 
        : `You are now following ${livestream.streamer.name}`,
      variant: "default",
    });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (chatMessage.trim()) {
      setComments([
        ...comments,
        { 
          id: comments.length + 1, 
          user: 'You', 
          message: chatMessage, 
          time: 'Just now' 
        }
      ]);
      
      setChatMessage('');
    }
  };
  
  const handleLike = () => {
    toast({
      title: "Liked",
      description: "You liked this livestream",
      variant: "default",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Shared",
      description: "Stream link copied to clipboard",
      variant: "default",
    });
  };
  
  const handleSendGift = () => {
    toast({
      title: "Gift Sent",
      description: "Your gift has been sent to the streamer",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content (Video and Info) */}
            <div className="lg:w-3/4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                {/* Placeholder for video */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <p className="text-lg font-medium">{livestream.title}</p>
                    <p className="text-sm text-gray-300">Live Stream</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-white space-x-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{livestream.viewers.toLocaleString()}</span>
                      </div>
                      <div className="h-4 w-px bg-white/20"></div>
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        <span>{livestream.likes.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-white">
                        <Settings className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white">
                        <PictureInPicture className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white">
                        <MaximizeIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stream Info */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{livestream.title}</h1>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={livestream.streamer.avatar} alt={livestream.streamer.name} />
                      <AvatarFallback>{livestream.streamer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <Link to={`/profile/${livestream.streamer.id}`} className="text-lg font-medium hover:text-timbl">
                        {livestream.streamer.name}
                      </Link>
                      <p className="text-sm text-gray-600">{livestream.streamer.role}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing ? "border-timbl text-timbl" : "bg-timbl"}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-4">{livestream.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {livestream.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Interaction Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Button variant="outline" className="flex items-center justify-center" onClick={handleLike}>
                  <Heart className="h-5 w-5 mr-2" />
                  Like
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={handleShare}>
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={handleSendGift}>
                  <Gift className="h-5 w-5 mr-2" />
                  Send Gift
                </Button>
              </div>
              
              {/* Tabs Section */}
              <Tabs defaultValue="about">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="related">Related Content</TabsTrigger>
                  <TabsTrigger value="schedule">Upcoming Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-2">About the Streamer</h3>
                      <p className="text-gray-700 mb-4">
                        {livestream.streamer.name} is a leading voice in the technology industry, sharing insights on the latest developments in AI and digital transformation.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Stream Schedule</h3>
                      <p className="text-gray-700 mb-4">
                        Catch {livestream.streamer.name} live every Tuesday and Thursday at 3:00 PM EST, discussing technology trends and answering audience questions.
                      </p>
                      
                      <Link to={`/profile/${livestream.streamer.id}`}>
                        <Button variant="outline">View Full Profile</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="related" className="pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Related Content</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {livestreams.filter(stream => stream.id !== streamId).map(stream => (
                          <Link key={stream.id} to={`/livestream/${stream.id}`}>
                            <div className="group rounded-lg overflow-hidden border hover:border-timbl transition-colors">
                              <div className="bg-gray-100 aspect-video relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-timbl/90 flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium group-hover:text-timbl transition-colors">{stream.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{stream.streamer.name}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule" className="pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Upcoming Streams</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Advanced AI Techniques</h4>
                            <Badge>Tomorrow</Badge>
                          </div>
                          <p className="text-sm text-gray-600">3:00 PM - 4:30 PM EST</p>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Q&A Session: Future of Technology</h4>
                            <Badge>Next Week</Badge>
                          </div>
                          <p className="text-sm text-gray-600">2:00 PM - 3:30 PM EST</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Chat Section */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg border h-[600px] flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Live Chat</h3>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">
                          {comment.user.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <Button type="submit" size="sm" className="bg-timbl">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveStream;
