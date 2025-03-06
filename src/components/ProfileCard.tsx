
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';

// Update ProfileProps to support both ways of passing data
export interface ProfileProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
  featured?: boolean;
  organization?: string;
  profile?: {
    id: string;
    name: string;
    role: string;
    bio: string;
    avatar: string;
    tags: string[];
    featured?: boolean;
    organization?: string;
  };
}

const ProfileCard = (props: ProfileProps) => {
  const navigate = useNavigate();
  const { toggleFollowProfile, followedProfiles } = useProfile();
  
  // Use profile prop if provided, otherwise use individual props
  const profile = props.profile || props;
  const { id, name, role, bio, avatar, tags, featured, organization } = profile;
  
  const isFollowing = followedProfiles.includes(id);
  
  const handleProfileClick = () => {
    navigate(`/profile/${id}`);
  };
  
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowProfile(id);
  };

  return (
    <Card 
      className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={handleProfileClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{name}</h3>
              {featured && (
                <Badge variant="outline" className="bg-timbl-50 text-timbl-600 border-timbl-200">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{role}</p>
            {organization && (
              <p className="text-sm text-muted-foreground">{organization}</p>
            )}
          </div>
        </div>
        
        <p className="mt-3 text-sm line-clamp-2">{bio}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button 
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="mt-4 w-full"
          onClick={handleFollowClick}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
