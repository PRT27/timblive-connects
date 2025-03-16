
import React, { useState, useRef, useEffect } from 'react';
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
import DeviceStreamSetup from '@/components/DeviceStreamSetup';
import { Heart, MessageSquare, Share2, Gift, Users, Settings, MaximizeIcon, PictureInPicture, Camera, MicOff, Mic, CameraOff, MoreVertical } from 'lucide-react';

// Sample livestream data - updated with Percy's content focus
const livestreams = [
  {
    id: 'aran-vi-showcase',
    title: 'ARAN-VI Mobile App Showcase',
    description: 'Join me for a comprehensive walkthrough of the ARAN-VI mobile application for visually impaired users. I\'ll be demonstrating its key features and discussing the technology behind it.',
    streamer: {
      id: 'npthwala',
      name: 'Nhlanhla Percy Thwala',
      role: 'Founder & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    tags: ['Assistive Technology', 'Accessibility', 'Innovation'],
    viewers: 1420,
    likes: 358,
    comments: 124
  },
  {
    id: 'tech-solutions',
    title: 'Innovative Tech Solutions for Disabilities',
    description: 'Exploring the latest technological innovations for improving accessibility and quality of life for people with disabilities.',
    streamer: {
      id: 'npthwala',
      name: 'Nhlanhla Percy Thwala',
      role: 'Founder & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    tags: ['Assistive Technology', 'Innovation', 'Accessibility'],
    viewers: 1865,
    likes: 472,
    comments: 183
  }
];

const LiveStream = () => {
  const { streamId } = useParams();
  const { toast } = useToast();
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const [chatMessage, setChatMessage] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Alex Chen', message: 'This is incredible technology! 🔥', time: '2m ago' },
    { id: 2, user: 'Sarah Johnson', message: 'Can you explain more about how ARAN-VI helps with navigation?', time: '1m ago' },
    { id: 3, user: 'Michael Brown', message: 'Looking forward to trying this app out!', time: 'Just now' }
  ]);
  
  // Camera/webcam functionality states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  
  // Find the current livestream
  const livestream = livestreams.find(stream => stream.id === streamId);
  
  useEffect(() => {
    // Get available cameras
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const cameras = devices.filter(device => device.kind === 'videoinput');
          setAvailableCameras(cameras);
          if (cameras.length > 0) {
            setSelectedCamera(cameras[0].deviceId);
          }
        })
        .catch(error => {
          console.error("Error enumerating devices:", error);
        });
    }
  }, []);
  
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
          audio: micEnabled
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraEnabled(true);
          toast({
            title: "Camera started",
            description: "Your camera is now active",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera error",
        description: "Could not access your camera",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
      toast({
        title: "Camera stopped",
        description: "Your camera is now off",
        variant: "default",
      });
    }
  };
  
  const toggleCamera = () => {
    if (cameraEnabled) {
      stopCamera();
    } else {
      startCamera();
    }
  };
  
  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
    }
    
    toast({
      title: micEnabled ? "Microphone muted" : "Microphone unmuted",
      description: micEnabled ? "Your microphone is now off" : "Your microphone is now on",
      variant: "default",
    });
  };
  
  const startStreaming = () => {
    if (!cameraEnabled) {
      startCamera().then(() => {
        setStreaming(true);
        toast({
          title: "Live streaming started",
          description: "Your audience can now see you",
          variant: "default",
        });
      });
    } else {
      setStreaming(true);
      toast({
        title: "Live streaming started",
        description: "Your audience can now see you",
        variant: "default",
      });
    }
  };
  
  const stopStreaming = () => {
    setStreaming(false);
    toast({
      title: "Live streaming stopped",
      description: "Your stream has ended",
      variant: "default",
    });
  };
  
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

  // Format date to show today's date
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

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
                {cameraEnabled ? (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play();
                      }
                    }}
                  ></video>
                ) : (
                  <DeviceStreamSetup 
                    streamId={streamId || 'default'} 
                    onStreamStart={() => {
                      setStreaming(true);
                      toast({
                        title: "Live Stream Started",
                        description: "Your audience can now see you",
                        variant: "default",
                      });
                    }}
                    onStreamEnd={() => {
                      setStreaming(false);
                      toast({
                        title: "Live Stream Ended",
                        description: "Your stream has ended",
                        variant: "default",
                      });
                    }}
                  />
                )}
                
                {/* Camera Controls - Only show when camera is enabled or streaming */}
                {(cameraEnabled || streaming) && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="bg-black/50 text-white border-none hover:bg-black/70"
                      onClick={toggleCamera}
                    >
                      {cameraEnabled ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="bg-black/50 text-white border-none hover:bg-black/70"
                      onClick={toggleMicrophone}
                    >
                      {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
                
                {/* Stream Controls - Only show when not streaming */}
                {!streaming && cameraEnabled && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={startStreaming}
                    >
                      Start Streaming
                    </Button>
                  </div>
                )}
                
                {/* Video Controls */}
                {cameraEnabled && (
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
                        {streaming && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={stopStreaming}
                          >
                            End Stream
                          </Button>
                        )}
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
                )}
              </div>
              
              {/* Stream Info */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold">{livestream.title}</h1>
                  <span className="text-sm text-gray-600">Live - {formattedDate}</span>
                </div>
                
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
                        {livestream.streamer.name} is an entrepreneur and innovator dedicated to creating assistive technologies that improve the lives of people with disabilities, particularly in rural areas.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Stream Schedule</h3>
                      <p className="text-gray-700 mb-4">
                        Catch {livestream.streamer.name} live every Wednesday and Friday at 3:00 PM SAST, discussing assistive technologies and answering audience questions.
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
                            <h4 className="font-medium">ARAN-VI App Updates & Features</h4>
                            <Badge>May 12, 2025</Badge>
                          </div>
                          <p className="text-sm text-gray-600">3:00 PM - 4:30 PM SAST</p>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Q&A Session: Assistive Technologies</h4>
                            <Badge>May 14, 2025</Badge>
                          </div>
                          <p className="text-sm text-gray-600">2:00 PM - 3:30 PM SAST</p>
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
