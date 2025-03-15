
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface StreamShareLinkProps {
  streamId: string;
  streamType?: 'live' | 'podcast' | 'broadcast' | 'video';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const StreamShareLink: React.FC<StreamShareLinkProps> = ({ 
  streamId, 
  streamType = 'live',
  variant = 'outline',
  size = 'default'
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/${streamType}/${streamId}`;
  const embedCode = `<iframe src="${shareUrl}?embed=true" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: `The ${type} has been copied to your clipboard.`,
      variant: "default",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this {streamType}</DialogTitle>
          <DialogDescription>
            Share the link with others or embed it on your website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Share link</h4>
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => handleCopy(shareUrl, "link")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Embed code</h4>
            <div className="flex items-center gap-2">
              <Input
                value={embedCode}
                readOnly
                className="flex-1"
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => handleCopy(embedCode, "embed code")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="default"
            onClick={() => {
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            }}
            className="w-full sm:w-auto bg-[#1877F2] hover:bg-[#1877F2]/90"
          >
            Share to Facebook
          </Button>
          
          <Button
            variant="default"
            onClick={() => {
              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
            }}
            className="w-full sm:w-auto bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
          >
            Share to Twitter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StreamShareLink;
