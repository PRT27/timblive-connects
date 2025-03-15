
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { UserPlus, Check, MapPin, Calendar } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { ProfileType } from '@/types/profile';

interface UserProfileHeaderProps {
  profile: ProfileType;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ profile }) => {
  const { followedProfiles, toggleFollowProfile } = useProfile();
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
    <>
      {/* Cover Image */}
      <div 
        className="w-full h-64 md:h-80 bg-cover bg-center relative"
        style={{ 
          backgroundImage: profile.coverImage 
            ? `url(${profile.coverImage})` 
            : 'url(/lovable-uploads/f8d29536-0a5b-4692-b13a-ba8e4d24e87b.png)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a1f]"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Info Card */}
          <div className="md:w-1/3">
            <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20 p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-[#0077FF] mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-[#151530] text-[#0077FF]">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                <p className="text-[#33c3f0] mb-3">{profile.role}</p>
                
                <Button 
                  onClick={handleFollow} 
                  className={isFollowing 
                    ? "bg-transparent border border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF]/10 mb-4 w-full" 
                    : "bg-[#0077FF] hover:bg-[#33c3f0] text-white mb-4 w-full"
                  }
                >
                  {isFollowing 
                    ? <><Check className="mr-2 h-4 w-4" /> Following</> 
                    : <><UserPlus className="mr-2 h-4 w-4" /> Follow</>
                  }
                </Button>
                
                <div className="w-full border-t border-[#0077FF]/30 pt-4 mt-2">
                  <p className="text-gray-300 mb-4">{profile.bio}</p>
                  
                  {profile.organization && (
                    <div className="flex items-center justify-center text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.organization}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {profile.joined || 'September 2023'}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {profile.tags.map((tag) => (
                      <Badge key={tag} className="bg-[#151530] text-[#33c3f0] border border-[#0077FF]/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileHeader;
