
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Check } from 'lucide-react';

interface ProfileProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
  featured: boolean;
}

interface ProfileCardProps {
  profile: ProfileProps;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [isFollowing, setIsFollowing] = React.useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${profile.featured ? 'border-timbl/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.role}</p>
              </div>
              
              <Button 
                size="sm" 
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "border-timbl text-timbl" : "bg-timbl"}
                onClick={toggleFollow}
              >
                {isFollowing ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm mt-2 line-clamp-2">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {profile.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {profile.featured && (
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
