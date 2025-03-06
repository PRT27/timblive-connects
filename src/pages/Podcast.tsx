
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Download, 
  Heart, Share2, List, MessageSquare, Clock 
} from 'lucide-react';

// Sample podcast data
const podcasts = [
  {
    id: 'entertainment-spotlight',
    title: 'Entertainment Industry Spotlight',
    description: 'Join me as we discuss the latest trends in the entertainment industry and share stories from behind the scenes.',
    host: {
      id: 'thuso-mbedo',
      name: 'Thuso Mbedo',
      role: 'Actress & Podcaster',
      avatar: 'https://images.mubicdn.net/images/cast_member/842214/cache-590465-1602840566/image-w856.jpg'
    },
    coverImage: 'https://images.unsplash.com/photo-1530654260709-4ae1a2ab9d2b',
    tags: ['Entertainment', 'Acting', 'Behind the Scenes'],
    episodes: [
      { 
        id: 'ep1', 
        title: 'Breaking into the Industry', 
        duration: '48:22',
        date: 'May 15, 2023',
        description: 'Tips and stories about breaking into the entertainment industry and landing your first roles.'
      },
      { 
        id: 'ep2', 
        title: 'Working with Directors', 
        duration: '52:10',
        date: 'May 22, 2023',
        description: 'How to build strong relationships with directors and make the most of your time on set.'
      },
      { 
        id: 'ep3', 
        title: 'Navigating Fame', 
        duration: '45:35',
        date: 'May 29, 2023',
        description: 'Strategies for managing public attention and maintaining your authenticity in the spotlight.'
      }
    ],
    subscribers: 12500,
    likes: 4832,
    comments: 856
  },
  {
    id: 'radio-insights',
    title: 'Radio Insights with Khutso',
    description: 'Behind the scenes of radio broadcasting with insights on music, culture, and entertainment.',
    host: {
      id: 'khutso-theledi',
      name: 'Khutso Theledi',
      role: 'Radio Host',
      avatar: 'https://i0.wp.com/www.sabc.co.za/sabc/wp-content/uploads/2023/05/unnamed-3.jpg'
    },
    coverImage: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2',
    tags: ['Radio', 'Music', 'Broadcasting'],
    episodes: [
      { 
        id: 'ep1', 
        title: 'The Art of Radio Hosting', 
        duration: '42:15',
        date: 'June 5, 2023',
        description: 'The skills and techniques that make a successful radio host in today\'s digital age.'
      },
      { 
        id: 'ep2', 
        title: 'Music Curation for Radio', 
        duration: '38:40',
        date: 'June 12, 2023',
        description: 'How to select and program music that resonates with your audience and builds your station\'s brand.'
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
  
  // Find the current podcast
  const podcast = podcasts.find(p => p.id === podcastId);
  
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
              <h1 className="text-3xl font-bold mb-2">{podcast.title}</h1>
              
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
                        New episodes are released every Monday at 9:00 AM EST.
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
                              <div className="text-xs text-gray-500">June 12, 2023</div>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {'★'.repeat(5)}
                          </div>
                          <p className="text-sm">
                            This podcast is amazing! I've learned so much about the entertainment industry from listening.
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">Sarah Williams</div>
                              <div className="text-xs text-gray-500">May 28, 2023</div>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {'★'.repeat(4)}
                          </div>
                          <p className="text-sm">
                            Great insights and interviews. Would love to hear more episodes about breaking into the industry.
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
                <Badge variant="outline" className="text-gray-700">Entertainment</Badge>
                <Badge variant="outline" className="text-gray-700">Acting</Badge>
                <Badge variant="outline" className="text-gray-700">Culture</Badge>
                <Badge variant="outline" className="text-gray-700">Industry</Badge>
                <Badge variant="outline" className="text-gray-700">Music</Badge>
                <Badge variant="outline" className="text-gray-700">Film</Badge>
                <Badge variant="outline" className="text-gray-700">Television</Badge>
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
