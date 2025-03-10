
import React from 'react';
import { Play, Clock, Eye, Radio, Mic } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Creator {
  id: string;
  name: string;
  avatar: string;
}

export interface VideoProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  date: string;
  creator: Creator;
  videoUrl: string;
  contentType?: 'video' | 'podcast' | 'broadcast' | 'live';
  isLive?: boolean;
}

export interface VideoCardProps {
  video: VideoProps;
}

// Alternative prop types for backward compatibility
export interface LegacyVideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  timeAgo: string;
  profileName: string;
  profileAvatar: string;
}

const VideoCard = (props: VideoCardProps | LegacyVideoCardProps) => {
  const [showEmbed, setShowEmbed] = React.useState(false);
  
  // Determine if we're using the legacy props or the newer video object prop
  const isLegacyProps = 'id' in props;
  
  // Extract the video data based on the props format
  const videoData = isLegacyProps 
    ? {
        id: props.id,
        title: props.title,
        thumbnail: props.thumbnail,
        duration: props.duration,
        views: props.views,
        date: props.timeAgo,
        videoUrl: `https://www.youtube.com/embed/${props.id}`,
        creator: {
          id: '1', // default id for legacy props
          name: props.profileName,
          avatar: props.profileAvatar,
        },
        contentType: 'video' as const,
        isLive: false
      } 
    : props.video;

  // Get the content type icon
  const getContentTypeIcon = () => {
    switch (videoData.contentType) {
      case 'podcast':
        return <Mic className="h-5 w-5 text-timbl fill-current" />;
      case 'broadcast':
        return <Radio className="h-5 w-5 text-timbl fill-current" />;
      case 'live':
      case 'video':
      default:
        return <Play className="h-5 w-5 text-timbl fill-current ml-1" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {showEmbed ? (
          <div className="aspect-video">
            <iframe
              src={videoData.videoUrl}
              title={videoData.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div 
            className="aspect-video bg-gray-100 relative cursor-pointer"
            onClick={() => setShowEmbed(true)}
          >
            <img 
              src={videoData.thumbnail} 
              alt={videoData.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
              <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                {getContentTypeIcon()}
              </div>
            </div>
            
            {videoData.isLive ? (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">LIVE</Badge>
            ) : null}
            
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {videoData.duration}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-2 mb-2">{videoData.title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={videoData.creator.avatar} alt={videoData.creator.name} />
              <AvatarFallback>{videoData.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 truncate max-w-[120px]">{videoData.creator.name}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="h-3 w-3" />
            <span>{formatViews(videoData.views)}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>{videoData.date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format views
const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  } else {
    return views.toString();
  }
};

export default VideoCard;
