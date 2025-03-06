
import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Creator {
  id: string;
  name: string;
  avatar: string;
}

interface VideoProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  date: string;
  creator: Creator;
  videoUrl: string;
}

interface VideoCardProps {
  video: VideoProps;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [showEmbed, setShowEmbed] = React.useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {showEmbed ? (
          <div className="aspect-video">
            <iframe
              src={video.videoUrl}
              title={video.title}
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
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
              <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-5 w-5 text-timbl fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={video.creator.avatar} alt={video.creator.name} />
              <AvatarFallback>{video.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 truncate max-w-[120px]">{video.creator.name}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="h-3 w-3" />
            <span>{formatViews(video.views)}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>{video.date}</span>
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
