
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Link2 } from 'lucide-react';

interface StreamEmbedProps {
  url: string;
  platform: string;
}

const StreamEmbed: React.FC<StreamEmbedProps> = ({ url, platform }) => {
  // Function to safely embed external content
  const renderStreamEmbed = () => {
    try {
      if (platform === 'youtube') {
        // Extract video ID from YouTube URL
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        const videoId = match && match[1];
        
        if (videoId) {
          return (
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md overflow-hidden"
            ></iframe>
          );
        }
      } else if (platform === 'facebook') {
        // Facebook embedded post
        return (
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&t=0`}
            width="100%"
            height="500"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="rounded-md overflow-hidden"
          ></iframe>
        );
      } else if (platform === 'twitch') {
        // Extract channel name from Twitch URL
        const twitchRegex = /(?:twitch\.tv\/)([a-zA-Z0-9_]+)/;
        const match = url.match(twitchRegex);
        const channel = match && match[1];
        
        if (channel) {
          return (
            <iframe
              src={`https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`}
              height="500"
              width="100%"
              allowFullScreen={true}
              className="rounded-md overflow-hidden"
            ></iframe>
          );
        }
      } else if (platform === 'custom') {
        // Generic iframe for custom embeds
        return (
          <iframe
            src={url}
            width="100%"
            height="500"
            className="rounded-md overflow-hidden"
            allowFullScreen
            allow="autoplay; encrypted-media"
          ></iframe>
        );
      }
      
      // Fallback for invalid URL or unrecognized platform
      return (
        <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-md">
          <div className="text-center p-5">
            <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stream not available</h3>
            <p className="text-gray-600">
              We couldn't embed this stream. Please check the URL and platform.
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering stream embed:', error);
      return (
        <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-md">
          <div className="text-center p-5">
            <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stream not available</h3>
            <p className="text-gray-600">
              We couldn't embed this stream. Please check the URL and platform.
            </p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="w-full">
      {renderStreamEmbed()}
    </div>
  );
};

const IntegratedStream: React.FC = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  
  const handleStart = () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a valid stream URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsStreaming(true);
    toast({
      title: "Stream integrated",
      description: "Your external stream has been successfully integrated.",
      variant: "default",
    });
  };
  
  const handleStop = () => {
    setIsStreaming(false);
    toast({
      title: "Stream ended",
      description: "Your external stream has been ended.",
      variant: "default",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-timbl" />
          Integrate External Stream
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isStreaming ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={platform} 
                onValueChange={setPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="custom">Custom URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stream-url">Stream URL</Label>
              <Input 
                id="stream-url" 
                placeholder={`Enter ${platform} stream URL`} 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                {platform === 'youtube' && "Example: https://www.youtube.com/watch?v=EXAMPLE"}
                {platform === 'facebook' && "Example: https://www.facebook.com/watch/?v=EXAMPLE"}
                {platform === 'twitch' && "Example: https://www.twitch.tv/CHANNEL"}
                {platform === 'custom' && "Enter the URL for your custom stream embed"}
              </p>
            </div>
            
            <Button 
              onClick={handleStart}
              className="w-full bg-timbl hover:bg-timbl-600"
            >
              Start Integration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <StreamEmbed url={url} platform={platform} />
            
            <div className="flex justify-end">
              <Button 
                variant="destructive"
                onClick={handleStop}
              >
                End Integration
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>
          Note: Integrated streams from external platforms like YouTube, Facebook, and Twitch are shown here but remain hosted on their original platforms.
        </p>
      </CardFooter>
    </Card>
  );
};

export default IntegratedStream;
