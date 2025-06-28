
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Users, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface PromotionalProfile {
  id: string;
  full_name: string;
  username: string;
  bio: string;
  role: string;
  avatar_url: string;
  website: string;
  tags: string[];
  created_at: string;
}

interface PromotionalProfilesProps {
  showAssociateButton?: boolean;
  isOwnProfile?: boolean;
}

const PromotionalProfiles: React.FC<PromotionalProfilesProps> = ({ 
  showAssociateButton = false, 
  isOwnProfile = false 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [promotionalProfiles, setPromotionalProfiles] = useState<PromotionalProfile[]>([]);
  const [associatedProfiles, setAssociatedProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotionalProfiles();
    if (user && isOwnProfile) {
      fetchAssociatedProfiles();
    }
  }, [user, isOwnProfile]);

  const fetchPromotionalProfiles = async () => {
    try {
      // Since the database functions don't exist yet, use mock data
      const mockProfiles: PromotionalProfile[] = [
        {
          id: '1',
          full_name: 'Bantu Doll One',
          username: 'bantudoll1',
          bio: 'TikTok Live Streamer - Entertainment and lifestyle content',
          role: 'Promotional User',
          avatar_url: '/placeholder.svg',
          website: 'https://www.tiktok.com/@bantudoll1/live',
          tags: ['Entertainment', 'Lifestyle', 'TikTok'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          full_name: 'Future Bar',
          username: 'futurebae369',
          bio: 'TikTok Live Streamer - Future trends and lifestyle',
          role: 'Promotional User',
          avatar_url: '/placeholder.svg',
          website: 'https://www.tiktok.com/@futurebae369/live',
          tags: ['Trends', 'Lifestyle', 'TikTok'],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          full_name: 'Coco Vybes',
          username: 'theboujiehousewife',
          bio: 'TikTok Live Streamer - Lifestyle and home content',
          role: 'Promotional User',
          avatar_url: '/placeholder.svg',
          website: 'https://www.tiktok.com/@theboujiehousewife/live',
          tags: ['Lifestyle', 'Home', 'TikTok'],
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          full_name: 'Plois',
          username: 'plmakeupacademy',
          bio: 'TikTok Live Streamer - Makeup tutorials and beauty content',
          role: 'Promotional User',
          avatar_url: '/placeholder.svg',
          website: 'https://www.tiktok.com/@plmakeupacademy/live',
          tags: ['Beauty', 'Makeup', 'Education', 'TikTok'],
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          full_name: 'Kids Korner',
          username: '1ranta.and.a.dream',
          bio: 'TikTok Live Streamer - Kids content and family entertainment',
          role: 'Promotional User',
          avatar_url: '/placeholder.svg',
          website: 'https://www.tiktok.com/@1ranta.and.a.dream/live',
          tags: ['Kids', 'Family', 'Entertainment', 'TikTok'],
          created_at: new Date().toISOString()
        }
      ];

      setPromotionalProfiles(mockProfiles);
    } catch (error) {
      console.error('Error fetching promotional profiles:', error);
      setPromotionalProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociatedProfiles = async () => {
    if (!user) return;

    try {
      // Since the database functions don't exist yet, use mock data
      setAssociatedProfiles(['1', '3']); // Mock associated profiles
    } catch (error) {
      console.error('Error fetching associated profiles:', error);
    }
  };

  const associateProfile = async (profileId: string) => {
    if (!user) return;

    try {
      // Mock the association for now
      setAssociatedProfiles(prev => [...prev, profileId]);
      toast({
        title: "Success",
        description: "Promotional profile associated successfully.",
      });
    } catch (error) {
      console.error('Error associating profile:', error);
      toast({
        title: "Error",
        description: "Failed to associate promotional profile.",
        variant: "destructive",
      });
    }
  };

  const disassociateProfile = async (profileId: string) => {
    if (!user) return;

    try {
      // Mock the disassociation for now
      setAssociatedProfiles(prev => prev.filter(id => id !== profileId));
      toast({
        title: "Success",
        description: "Promotional profile removed successfully.",
      });
    } catch (error) {
      console.error('Error disassociating profile:', error);
      toast({
        title: "Error",
        description: "Failed to remove promotional profile.",
        variant: "destructive",
      });
    }
  };

  const getDisplayProfiles = () => {
    if (isOwnProfile && user) {
      return promotionalProfiles.filter(profile => 
        associatedProfiles.includes(profile.id)
      );
    }
    return promotionalProfiles;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const displayProfiles = getDisplayProfiles();

  if (displayProfiles.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">
          {isOwnProfile ? "No promotional profiles associated yet." : "No promotional profiles available."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback>
                    {profile.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                  <p className="text-sm text-gray-600">@{profile.username}</p>
                  <Badge variant="outline" className="mt-1">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{profile.bio}</p>
              
              <div className="flex flex-wrap gap-1">
                {profile.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  asChild 
                  className="w-full bg-[#0077FF] hover:bg-[#33c3f0] text-white"
                >
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Live
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                
                {showAssociateButton && user && (
                  <Button
                    variant={associatedProfiles.includes(profile.id) ? "destructive" : "outline"}
                    onClick={() => 
                      associatedProfiles.includes(profile.id)
                        ? disassociateProfile(profile.id)
                        : associateProfile(profile.id)
                    }
                    className="w-full"
                  >
                    {associatedProfiles.includes(profile.id) ? "Remove" : "Add to Profile"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromotionalProfiles;
