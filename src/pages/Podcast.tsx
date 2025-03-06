
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Download, 
  Heart, Share2, List, MessageSquare, Clock, Mic, MicOff, Save
} from 'lucide-react';

// Sample podcast data - updated with Percy's content
const podcasts = [
  {
    id: 'assistive-tech-talks',
    title: 'Assistive Technology Talks',
    description: 'Join me as we explore the world of assistive technologies and their impact on improving accessibility for people with disabilities.',
    host: {
      id: 'npthwala',
      name: 'Nhlanhla Percy Thwala',
      role: 'Founder & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    coverImage: 'https://images.unsplash.com/photo-1530654260709-4ae1a2ab9d2b',
    tags: ['Assistive Technology', 'Accessibility', 'Innovation'],
    episodes: [
      { 
        id: 'ep1', 
        title: 'Introduction to ARAN-VI', 
        duration: '38:22',
        date: 'May 5, 2025',
        description: 'An introduction to the Accessible Rural Assistive Network for Visual Impaired (ARAN-VI) mobile application and its features.'
      },
      { 
        id: 'ep2', 
        title: 'Accessibility Challenges in Rural Areas', 
        duration: '42:10',
        date: 'May 6, 2025',
        description: 'Discussing the unique accessibility challenges faced by individuals with disabilities in rural areas.'
      },
      { 
        id: 'ep3', 
        title: 'Future of Assistive Technologies', 
        duration: '45:35',
        date: 'May 7, 2025',
        description: 'Exploring emerging trends and innovations in assistive technologies and their potential impact.'
      }
    ],
    subscribers: 12500,
    likes: 4832,
    comments: 856
  },
  {
    id: 'township-economy',
    title: 'Township Economy Insights',
    description: 'Discussions about township economics, entrepreneurship, and the innovative Township Economy Simulator game.',
    host: {
      id: 'npthwala',
      name: 'Nhlanhla Percy Thwala',
      role: 'Founder & Developer',
      avatar: '/lovable-uploads/154e58ca-c0f8-48da-ae69-23b7cb16b25f.png'
    },
    coverImage: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2',
    tags: ['Economics', 'Township', 'Entrepreneurship'],
    episodes: [
      { 
        id: 'ep1', 
        title: 'Township Economy Simulator: Development Journey', 
        duration: '32:15',
        date: 'May 3, 2025',
        description: 'The story behind the development of the Township Economy Simulator game and its educational purposes.'
      },
      { 
        id: 'ep2', 
        title: 'Entrepreneurship in Townships', 
        duration: '38:40',
        date: 'May 4, 2025',
        description: 'Exploring the challenges and opportunities for entrepreneurs in South African townships.'
      }
    ],
    subscribers: 8700,
    likes: 3240,
    comments: 512
  }
];

const Podcast = () => {
  const { podcastId } = useParams();
  const { toast } = useToast();
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Microphone recording functionality
  const [isRecording, setIsRecording] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Find the current podcast
  const podcast = podcasts.find(p => p.id === podcastId);
  
  useEffect(() => {
    // Clean up timer on component unmount
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setMicEnabled(true);
      
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        setAudioChunks([...audioChunks, audioBlob]);
        
        // Create URL for the recorded audio
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start a timer to track recording duration
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Your microphone is now recording",
        variant: "default",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear the timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Recording stopped",
        description: `Recording saved (${formatTime(recordingTime)})`,
        variant: "default",
      });
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const saveRecording = () => {
    if (audioChunks.length > 0) {
      // Get the latest recording
      const latestRecording = audioChunks[audioChunks.length - 1];
      
      // Create download link
      const url = URL.createObjectURL(latestRecording);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = `recording-${Date.now()}.mp3`;
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Recording saved",
        description: "Your recording has been downloaded",
        variant: "default",
      });
    }
  };
  
  if (!podcast) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Podcast not found</h1>
          <p className="mb-8">The podcast you're looking for doesn't exist.</p>
          <Link to="/explore">
            <Button>Explore Other Content</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const isFollowing = followedProfiles.includes(podcast.host.id);
  
  const handleFollowToggle = () => {
    toggleFollowProfile(podcast.host.id);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${podcast.host.name}` 
        : `You are now following ${podcast.host.name}`,
      variant: "default",
    });
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: isPlaying 
        ? `Paused ${podcast.episodes[currentEpisode].title}` 
        : `Playing ${podcast.episodes[currentEpisode].title}`,
      variant: "default",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${podcast.episodes[currentEpisode].title}`,
      variant: "default",
    });
  };
  
  const handleLike = () => {
    toast({
      title: "Liked",
      description: "You liked this podcast",
      variant: "default",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Shared",
      description: "Podcast link copied to clipboard",
      variant: "default",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Parse the current episode duration (format: "MM:SS")
  const currentEpisodeDuration = podcast.episodes[currentEpisode].duration;
  const [minutes, seconds] = currentEpisodeDuration.split(':').map(Number);
  const totalDuration = minutes * 60 + seconds;

  // Get current date
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
          {/* Podcast Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Podcast Cover Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={podcast.coverImage} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Podcast Info */}
            <div className="md:w-2/3 lg:w-3/4">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{podcast.title}</h1>
                <span className="text-sm text-gray-600">{formattedDate}</span>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={podcast.host.avatar} alt={podcast.host.name} />
                  <AvatarFallback>{podcast.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <Link to={`/profile/${podcast.host.id}`} className="text-lg font-medium hover:text-timbl">
                    {podcast.host.name}
                  </Link>
                  <p className="text-sm text-gray-600">{podcast.host.role}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{podcast.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {podcast.tags.map((tag, index) => (
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
                
                <div className="flex items-center text-sm text-gray-600">
                  <List className="h-4 w-4 mr-1" />
                  <span>{podcast.episodes.length} Episodes</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{podcast.likes.toLocaleString()} Likes</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{podcast.comments.toLocaleString()} Comments</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio Player */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="md:w-1/4">
                <h3 className="font-medium">{podcast.episodes[currentEpisode].title}</h3>
                <p className="text-sm text-gray-600">{podcast.host.name}</p>
              </div>
              
              <div className="md:w-3/4 flex flex-col w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                  <span className="text-sm text-gray-600">{currentEpisodeDuration}</span>
                </div>
                
                <div className="w-full mb-4">
                  <Slider
                    value={[currentTime]}
                    max={totalDuration}
                    step={1}
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-700">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-10 w-10 bg-timbl hover:bg-timbl-600"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-700">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-gray-600" />
                      <div className="w-20">
                        <Slider defaultValue={[80]} max={100} step={1} />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <div className="hidden md:flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleLike}>
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Microphone Recording Controls */}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className="font-medium mr-4">Record Your Own Podcast</h4>
                  {isRecording && (
                    <div className="flex items-center">
                      <span className="animate-pulse bg-red-500 h-2 w-2 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">{formatTime(recordingTime)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  
                  {audioChunks.length > 0 && (
                    <Button variant="outline" size="sm" onClick={saveRecording}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Recording
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Hidden audio element for playback */}
              <audio ref={audioRef} controls className="hidden" />
              
              {audioChunks.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Latest Recording:</p>
                  <audio src={audioRef.current?.src} controls className="w-full" />
                </div>
              )}
            </div>
          </div>
          
          {/* Episode List and Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="episodes">
                <TabsList>
                  <TabsTrigger value="episodes">Episodes</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="episodes" className="pt-4">
                  <div className="space-y-4">
                    {podcast.episodes.map((episode, index) => (
                      <Card key={episode.id} className={index === currentEpisode ? "border-timbl" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Button 
                              variant={index === currentEpisode ? "default" : "outline"}
                              size="icon"
                              className={index === currentEpisode ? "bg-timbl" : ""}
                              onClick={() => {
                                setCurrentEpisode(index);
                                setIsPlaying(true);
                              }}
                            >
                              {index === currentEpisode && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <div className="flex-1">
                              <h3 className="font-medium">{episode.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{episode.date} • {episode.duration}</p>
                              <p className="text-sm">{episode.description}</p>
                            </div>
                            
                            <Button variant="ghost" size="icon" onClick={handleDownload}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="about" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">About this Podcast</h3>
                      <p className="text-gray-700 mb-4">
                        {podcast.description}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Host</h3>
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar>
                          <AvatarImage src={podcast.host.avatar} alt={podcast.host.name} />
                          <AvatarFallback>{podcast.host.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/profile/${podcast.host.id}`} className="font-medium hover:text-timbl">
                            {podcast.host.name}
                          </Link>
                          <p className="text-sm text-gray-600">{podcast.host.role}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-2">Release Schedule</h3>
                      <p className="text-gray-700">
                        New episodes are released every Monday and Wednesday at 9:00 AM SAST.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Listener Reviews</h3>
                        <Button variant="outline" size="sm">Write a Review</Button>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">John Miller</div>
                              <div className="text-xs text-gray-500">May 4, 2025</div>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {'★'.repeat(5)}
                          </div>
                          <p className="text-sm">
                            This podcast is amazing! I've learned so much about assistive technologies from listening.
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">Sarah Williams</div>
                              <div className="text-xs text-gray-500">May 3, 2025</div>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {'★'.repeat(4)}
                          </div>
                          <p className="text-sm">
                            Great insights and interviews. Would love to hear more episodes about rural accessibility challenges.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <h3 className="text-lg font-medium mb-4">You Might Also Like</h3>
              <div className="space-y-4">
                {podcasts.filter(p => p.id !== podcastId).map(p => (
                  <Link key={p.id} to={`/podcast/${p.id}`}>
                    <Card className="group hover:border-timbl transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={p.coverImage} 
                              alt={p.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-timbl transition-colors">{p.title}</h4>
                            <p className="text-sm text-gray-600">{p.host.name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{p.episodes.length} episodes</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              <h3 className="text-lg font-medium mb-4 mt-8">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-gray-700">Assistive Technology</Badge>
                <Badge variant="outline" className="text-gray-700">Accessibility</Badge>
                <Badge variant="outline" className="text-gray-700">Innovation</Badge>
                <Badge variant="outline" className="text-gray-700">Economics</Badge>
                <Badge variant="outline" className="text-gray-700">Township</Badge>
                <Badge variant="outline" className="text-gray-700">Entrepreneurship</Badge>
                <Badge variant="outline" className="text-gray-700">Education</Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Podcast;
