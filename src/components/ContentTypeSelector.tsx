
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mic, Video, Radio, Tv, Music } from 'lucide-react';

interface ContentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
    >
      <Label
        htmlFor="video"
        className={`cursor-pointer ${value === 'video' ? 'ring-2 ring-[#0077FF]' : ''}`}
      >
        <Card className="h-full bg-[#151530]/60 border-[#0077FF]/30 hover:border-[#0077FF]/60 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <RadioGroupItem value="video" id="video" className="sr-only" />
            <Video className="h-8 w-8 mb-2 text-[#0077FF]" />
            <span className="text-white font-medium">Video</span>
            <span className="text-xs text-gray-400 mt-1">Upload or record video content</span>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="podcast"
        className={`cursor-pointer ${value === 'podcast' ? 'ring-2 ring-[#0077FF]' : ''}`}
      >
        <Card className="h-full bg-[#151530]/60 border-[#0077FF]/30 hover:border-[#0077FF]/60 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <RadioGroupItem value="podcast" id="podcast" className="sr-only" />
            <Mic className="h-8 w-8 mb-2 text-[#0077FF]" />
            <span className="text-white font-medium">Podcast</span>
            <span className="text-xs text-gray-400 mt-1">Audio-focused content</span>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="broadcast"
        className={`cursor-pointer ${value === 'broadcast' ? 'ring-2 ring-[#0077FF]' : ''}`}
      >
        <Card className="h-full bg-[#151530]/60 border-[#0077FF]/30 hover:border-[#0077FF]/60 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <RadioGroupItem value="broadcast" id="broadcast" className="sr-only" />
            <Radio className="h-8 w-8 mb-2 text-[#0077FF]" />
            <span className="text-white font-medium">Broadcast</span>
            <span className="text-xs text-gray-400 mt-1">Scheduled streaming</span>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="news"
        className={`cursor-pointer ${value === 'news' ? 'ring-2 ring-[#0077FF]' : ''}`}
      >
        <Card className="h-full bg-[#151530]/60 border-[#0077FF]/30 hover:border-[#0077FF]/60 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <RadioGroupItem value="news" id="news" className="sr-only" />
            <Tv className="h-8 w-8 mb-2 text-[#0077FF]" />
            <span className="text-white font-medium">News</span>
            <span className="text-xs text-gray-400 mt-1">News reports and updates</span>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="music"
        className={`cursor-pointer ${value === 'music' ? 'ring-2 ring-[#0077FF]' : ''}`}
      >
        <Card className="h-full bg-[#151530]/60 border-[#0077FF]/30 hover:border-[#0077FF]/60 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <RadioGroupItem value="music" id="music" className="sr-only" />
            <Music className="h-8 w-8 mb-2 text-[#0077FF]" />
            <span className="text-white font-medium">Music</span>
            <span className="text-xs text-gray-400 mt-1">Music shows and playlists</span>
          </CardContent>
        </Card>
      </Label>
    </RadioGroup>
  );
};

export default ContentTypeSelector;
