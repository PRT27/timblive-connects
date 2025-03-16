
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, MapPin, Users } from 'lucide-react';
import { ProfileType } from '@/types/profile';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileHeaderProps {
  profile: ProfileType;
  joinedDate?: string; // Make joinedDate optional
  followersCount?: number; // Add followersCount as optional
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profile,
  joinedDate = 'January 2023', // Default value if not provided
  followersCount = 0, // Default value if not provided
  isOwnProfile = false,
  onEditProfile
}) => {
  const { toggleFollowProfile, followedProfiles } = useProfile();
  const { toast } = useToast();
  
  // Format date in a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isFollowing = profile.id ? followedProfiles.includes(profile.id) : false;
  
  const handleFollowToggle = () => {
    if (profile.id) {
      toggleFollowProfile(profile.id);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing 
          ? `You have unfollowed ${profile.displayName || profile.name || profile.username}` 
          : `You are now following ${profile.displayName || profile.name || profile.username}`,
        variant: "default",
      });
    }
  };

  return (
    <div className="relative mb-8">
      {/* Banner image */}
      <div className="h-48 w-full bg-gradient-to-r from-[#0a0a2e] to-[#0d0d4d] rounded-lg overflow-hidden">
        {(profile.bannerUrl || profile.coverImage) && (
          <img 
            src={profile.bannerUrl || profile.coverImage} 
            alt={`${profile.displayName || profile.name || profile.username}'s banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Profile information */}
      <div className="relative px-4 sm:px-6 -mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Avatar */}
          <Avatar className="h-32 w-32 rounded-lg border-4 border-white bg-white shadow-lg">
            <AvatarImage src={profile.avatarUrl || profile.avatar} />
            <AvatarFallback className="text-3xl">
              {(profile.displayName || profile.name || profile.username || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.displayName || profile.name || profile.username}</h1>
                <p className="text-gray-600">@{profile.username || profile.id.substring(0, 8)}</p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <Button onClick={onEditProfile} className="bg-timbl text-white hover:bg-timbl/90">
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing ? "border-timbl text-timbl" : "bg-timbl text-white hover:bg-timbl/90"}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              {profile.role && (
                <Badge variant="outline" className="bg-gray-100">
                  {profile.role}
                </Badge>
              )}
              
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>{followersCount} followers</span>
              </div>
              
              {profile.location && (
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
            
            {profile.email && (
              <div className="mt-2 flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-1" />
                <span>{profile.email}</span>
              </div>
            )}
            
            {profile.bio && (
              <p className="mt-4 text-gray-700">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
