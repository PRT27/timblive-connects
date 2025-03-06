
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';

interface ProfileProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
  featured?: boolean; // Changed from required to optional
}

interface ProfileCardProps {
  profile: ProfileProps;
  variant?: 'default' | 'compact';
}

const ProfileCard = ({ profile, variant = 'default' }: ProfileCardProps) => {
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const { toast } = useToast();
  const isFollowing = followedProfiles.includes(profile.id);

  const handleFollow = () => {
    toggleFollowProfile(profile.id);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You have unfollowed ${profile.name}` 
        : `You are now following ${profile.name}`,
      variant: "default",
    });
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${profile.featured ? 'border-timbl/30' : ''}`}>
      <CardContent className={variant === 'compact' ? 'p-4' : 'p-6'}>
        <div className="flex gap-4">
          <Avatar className={variant === 'compact' ? 'h-12 w-12' : 'h-16 w-16'}>
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="group">
                <Link to={`/profile/${profile.id}`}>
                  <h3 className="font-medium group-hover:text-timbl transition-colors flex items-center">
                    {profile.name}
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">{profile.role}</p>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "border-timbl text-timbl" : "bg-timbl"}
                      onClick={handleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          {variant === 'default' ? 'Following' : ''}
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          {variant === 'default' ? 'Follow' : ''}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFollowing ? 'Unfollow' : 'Follow'} {profile.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className={`text-sm mt-2 ${variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2'}`}>{profile.bio}</p>
            
            {variant === 'default' && (
              <div className="flex flex-wrap gap-1 mt-3">
                {profile.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {profile.featured && variant === 'default' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Badge variant="outline" className="bg-timbl-50 text-timbl border-timbl/20 text-xs">
              Featured Creator
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
